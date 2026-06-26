import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';

const artifactBranch = 'campus-il-extraction-artifacts';
const rawBase = `https://raw.githubusercontent.com/kerntamar/psycho2/${artifactBranch}/data/extracted/pages`;
const metadataPath = 'data/extracted/pdfs/metadata.json';
const outDir = 'data/official';
const reviewStatus = 'auto_extracted_needs_review';
const domains = ['אנגלית', 'חשיבה כמותית', 'חשיבה מילולית', 'מטלת כתיבה'];

function classifyDomain(text) {
  if (/אנגלית|english|sentence|restatement|vocabulary/i.test(text)) return 'אנגלית';
  if (/כמותית|אלגברה|גאומטר|משווא|אחוז|יחס|מספר|x\s*[=+\-*/^]|\d+\s*[+\-*/=]/i.test(text)) return 'חשיבה כמותית';
  if (/מילולית|אנלוגיות|הבנה והסקה|טקסט|פסקה|טענה/i.test(text)) return 'חשיבה מילולית';
  if (/כתיבה|חיבור|מטלת/i.test(text)) return 'מטלת כתיבה';
  return 'כללי';
}

function titleOf(item) {
  return item.title || item.name || item.fileName || item.filename || item.id;
}

async function readText(pdf) {
  const localPath = `data/extracted/pages/${pdf.id}.txt`;
  if (existsSync(localPath)) return readFile(localPath, 'utf8');
  const res = await fetch(`${rawBase}/${pdf.id}.txt`);
  if (!res.ok) throw new Error(`Missing extracted text for ${pdf.id}: ${res.status} ${res.statusText}`);
  return res.text();
}

function parseExplanations(pdf, text) {
  const matches = [...text.matchAll(/(?:^|\n)\s*(?:תשובה\s*\(?([1-4])\)?\s*נכונה|התשובה\s*הנכונה\s*היא\s*\(?([1-4])\)?)([\s\S]*?)(?=\n\s*(?:תשובה\s*\(?[1-4]\)?\s*נכונה|התשובה\s*הנכונה\s*היא\s*\(?[1-4]\)?)|$)/g)];
  return matches.map((match, index) => {
    const body = match[3].replace(/\s+/g, ' ').trim();
    return {
      id: `${pdf.id}-explanation-${String(index + 1).padStart(3, '0')}`,
      sourceId: pdf.id,
      sourceTitle: titleOf(pdf),
      answer: match[1] || match[2],
      domain: classifyDomain(`${titleOf(pdf)} ${body}`),
      explanation: body.slice(0, 1200),
      reviewStatus
    };
  }).filter((item) => item.explanation.length > 20);
}

function parseFormulaCandidates(pdf, text) {
  if (classifyDomain(`${titleOf(pdf)} ${text.slice(0, 2000)}`) !== 'חשיבה כמותית') return [];
  const lines = text.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  return lines.filter((line) => /(?:=|≈|≤|≥|\bpi\b|π|√|\^|\d+\s*[+\-*/]\s*\d+)/i.test(line))
    .slice(0, 40)
    .map((line, index) => ({
      id: `${pdf.id}-formula-${String(index + 1).padStart(3, '0')}`,
      sourceId: pdf.id,
      sourceTitle: titleOf(pdf),
      domain: 'חשיבה כמותית',
      text: line.slice(0, 300),
      reviewStatus
    }));
}

async function main() {
  const metadata = JSON.parse(await readFile(metadataPath, 'utf8'));
  const catalogRecords = [];
  const explanations = [];
  const formulaCandidates = [];
  const domainCounts = Object.fromEntries([...domains, 'כללי'].map((domain) => [domain, 0]));
  let extractedTextCount = 0;
  let solutionPdfCount = 0;

  for (const pdf of metadata) {
    const title = titleOf(pdf);
    let text = '';
    try {
      text = await readText(pdf);
      extractedTextCount += 1;
    } catch (error) {
      console.warn(error.message);
    }
    const domain = classifyDomain(`${title} ${text.slice(0, 1000)}`);
    domainCounts[domain] += 1;
    const isSolution = /פתרונות|תשובות|\bSol_/i.test(title);
    if (isSolution) {
      solutionPdfCount += 1;
      explanations.push(...parseExplanations(pdf, text));
    }
    formulaCandidates.push(...parseFormulaCandidates(pdf, text));
    catalogRecords.push({ id: pdf.id, title, url: pdf.url, domain, hasExtractedText: Boolean(text), isSolution, reviewStatus });
  }

  if (solutionPdfCount > 0 && explanations.length === 0) {
    throw new Error(`Found ${solutionPdfCount} solution PDFs but parsed no explanations`);
  }

  const catalog = {
    artifactBranch,
    pdfCount: metadata.length,
    extractedTextCount,
    solutionPdfCount,
    parsedExplanationCount: explanations.length,
    formulaCandidateCount: formulaCandidates.length,
    domainCounts,
    records: catalogRecords
  };

  await mkdir(outDir, { recursive: true });
  await writeFile(`${outDir}/catalog.json`, `${JSON.stringify(catalog, null, 2)}\n`);
  await writeFile(`${outDir}/solution-index.json`, `${JSON.stringify(explanations, null, 2)}\n`);
  await writeFile(`${outDir}/explanations-preview.json`, `${JSON.stringify(explanations.slice(0, 50), null, 2)}\n`);
  await writeFile(`${outDir}/formula-candidates.json`, `${JSON.stringify(formulaCandidates, null, 2)}\n`);
  console.log(`Parsed ${explanations.length} explanations and ${formulaCandidates.length} formula candidates`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
