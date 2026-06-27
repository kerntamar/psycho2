import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const artifactBranch = process.env.ARTIFACT_BRANCH || 'campus-il-extraction-artifacts';
const rawBase = `https://raw.githubusercontent.com/kerntamar/psycho2/${artifactBranch}`;
const outDir = 'data/official';
const reviewStatus = 'auto_extracted_needs_review';
const domains = ['אנגלית', 'חשיבה כמותית', 'חשיבה מילולית', 'מטלת כתיבה'];
const parserPatterns = {
  solutionTitle: [
    'פתרונות',
    'פתרון',
    'תשובות',
    'פתרונות סימולציה',
    'פתרונות מלאים',
    'solutions',
    'answer key'
  ],
  correctAnswerHeader: [
    'תשובה (4) נכונה',
    'תשובה )4( נכונה',
    'תשובה ) (4 נכונה',
    'התשובה הנכונה היא (4)',
    'התשובה הנכונה היא 4'
  ]
};

function classifyDomain(text) {
  if (/אנגלית|english|sentence|restatement|vocabulary/i.test(text)) return 'אנגלית';
  if (/כמותית|אלגברה|גאומטר|משווא|אחוז|יחס|מספר|x\s*[=+\-*/^]|\d+\s*[+\-*/=]/i.test(text)) return 'חשיבה כמותית';
  if (/מילולית|אנלוגיות|הבנה והסקה|טקסט|פסקה|טענה/i.test(text)) return 'חשיבה מילולית';
  if (/כתיבה|חיבור|מטלת/i.test(text)) return 'מטלת כתיבה';
  return 'כללי';
}

function titleOf(item) {
  const explicitTitle = item.title || item.name || item.fileName || item.filename;
  if (explicitTitle) return cleanText(explicitTitle);
  const urlFileName = item.url?.split('/').pop()?.split('?')[0];
  if (urlFileName) {
    try {
      return cleanText(decodeURIComponent(urlFileName).replace(/\.pdf$/i, '').replace(/[_-]+/g, ' '));
    } catch {
      return cleanText(urlFileName.replace(/\.pdf$/i, '').replace(/[_-]+/g, ' '));
    }
  }
  return item.id;
}

function cleanText(text) {
  return text
    .replace(/[\u200e\u200f\u202a-\u202e\u2066-\u2069]/g, '')
    .replace(/\f/g, '\n')
    .replace(/[ \t\v\u00a0]+/g, ' ')
    .replace(/ *\r?\n */g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function parseCorrectAnswerHeader(lineOrText) {
  const text = cleanText(lineOrText);
  const header = text.match(
    /(?:תשובה\s*(?:\(\s*([1-4])\s*\)|\)\s*([1-4])\s*\(|\)\s*\(\s*([1-4])|([1-4]))\s*נכונה|התשובה\s*הנכונה\s*היא\s*(?:\(\s*([1-4])\s*\)|([1-4])))/u
  );
  if (!header) return null;
  return header.slice(1).find(Boolean) || null;
}

function isSolutionTitle(title) {
  return /פתרונות(?:\s+סימולציה|\s+מלאים)?|פתרון|תשובות|solutions?|answer\s*key/i.test(cleanText(title));
}

function answerHeaderRegex() {
  return /(?:תשובה\D{0,30}([1-4])\D{0,30}נכונה|התשובה\s+הנכונה\s+היא\D{0,30}([1-4]))/g;
}

function parseExplanations(pdf, text) {
  const normalizedText = cleanText(text);
  const answerHeaderPattern = String.raw`(?:תשובה\s*(?:\(\s*[1-4]\s*\)|\)\s*[1-4]\s*\(|\)\s*\(\s*[1-4]|[1-4])\s*נכונה|התשובה\s*הנכונה\s*היא\s*(?:\(\s*[1-4]\s*\)|[1-4]))`;
  const matches = [...normalizedText.matchAll(new RegExp(`(?:^|\\n)\\s*(${answerHeaderPattern})([\\s\\S]*?)(?=\\n\\s*${answerHeaderPattern}|$)`, 'gu'))];
  return matches.map((match, index) => {
    const body = match[2].replace(/\s+/g, ' ').trim();
    return {
      id: `${pdf.id}-explanation-${String(index + 1).padStart(3, '0')}`,
      sourceId: pdf.id,
      sourceTitle: titleOf(pdf),
      sourceUrl: pdf.url,
      answer: parseCorrectAnswerHeader(match[1]),
      domain: classifyDomain(`${titleOf(pdf)} ${body}`),
      explanation: body.slice(0, 1200),
      reviewStatus
    };
  });
}

function extractSectionHeadings(text = '') {
  const normalized = cleanText(text);
  return [...normalized.matchAll(/פרק\s*[:\-]?\s*(\d+)\s*[:\-]?\s*([^\n]{2,80})/g)]
    .map((match) => ({ sectionNumber: Number(match[1]), title: match[2].replace(/[.·]+/g, '').trim() }))
    .filter((item, index, arr) => item.title && arr.findIndex((other) => other.sectionNumber === item.sectionNumber && other.title === item.title) === index)
    .slice(0, 12);
}

function parseFormulaCandidates(pdf, text) {
  const normalizedText = cleanText(text);
  const lines = normalizedText.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  return lines.filter((line) => /(?:=|≈|≤|≥|\bpi\b|π|√|\^|\d+\s*[+\-*/]\s*\d+)/i.test(line))
    .slice(0, 40)
    .map((line, index) => ({
      id: `${pdf.id}-formula-${String(index + 1).padStart(3, '0')}`,
      sourceId: pdf.id,
      sourceTitle: titleOf(pdf),
      sourceUrl: pdf.url,
      domain: classifyDomain(`${titleOf(pdf)} ${line}`) === 'כללי' ? 'חשיבה כמותית' : classifyDomain(`${titleOf(pdf)} ${line}`),
      text: line.slice(0, 300),
      reviewStatus
    }));
}

function buildDiagnostics({ inspectedPdfCount, solutionTitleSamples, solutionPdfSnippets, failures }) {
  return {
    inspectedPdfCount,
    solutionTitleCandidateCount: solutionTitleSamples.length,
    solutionTitleSamples: solutionTitleSamples.slice(0, 20),
    parserPatterns,
    failedParserPattern: 'correctAnswerHeader',
    sampleSnippets: solutionPdfSnippets.slice(0, 8),
    failures
  };
}

async function main() {
  const metadata = JSON.parse(await readFile(metadataPath, 'utf8'));
  const catalogRecords = [];
  const explanations = [];
  const formulaCandidates = [];
  const domainCounts = Object.fromEntries([...domains, 'כללי'].map((domain) => [domain, 0]));
  let extractedTextCount = 0;
  let solutionPdfCount = 0;
  const solutionPdfSnippets = [];
  const solutionTitleSamples = [];
  const failures = [];

  for (const source of metadata) {
    try {
      const text = await readTextForPdf(source.id);
      if (isSolutionTitle(source.title)) {
        if (diagnostics.sampleSnippets.length < 5) {
          diagnostics.sampleSnippets.push({ id: source.id, title: source.title, snippet: sampleSnippet(text) });
        }
        const blocks = splitSolutionBlocks(text);
        solutionIndex.push({
          id: source.id,
          title: source.title,
          url: source.url,
          sha256: source.sha256,
          bytes: source.bytes,
          domain: classifyDomain(source.title, text.slice(0, 3000)),
          sectionHeadings: extractSectionHeadings(text),
          explanationCount: blocks.length,
          reviewStatus: 'auto_extracted_needs_review'
        });
        explanations.push(...blocks.map((block) => ({
          id: `${source.id}-q-${String(block.questionNumber).padStart(3, '0')}`,
          sourceId: source.id,
          sourceTitle: source.title,
          sourceUrl: source.url,
          domain: classifyDomain(source.title, block.explanation),
          questionNumber: block.questionNumber,
          correctAnswer: block.correctAnswer,
          explanation: block.explanation,
          truncated: block.truncated,
          reviewStatus: 'auto_extracted_needs_review'
        })));
      }
      formulaCandidates.push(...extractFormulaCandidates(text, source));
    } catch (error) {
      console.warn(error.message);
    }
    const domain = classifyDomain(`${title} ${text.slice(0, 1000)}`);
    domainCounts[domain] += 1;
    const isSolution = isSolutionTitle(title);
    if (isSolution) {
      solutionPdfCount += 1;
      solutionTitleSamples.push({ id: pdf.id, title, url: pdf.url });
      if (text) {
        solutionPdfSnippets.push({
          id: pdf.id,
          title,
          url: pdf.url,
          snippet: cleanText(text).slice(0, 1000)
        });
      } else {
        failures.push({ id: pdf.id, title, url: pdf.url, reason: 'missing extracted text' });
      }
      const parsed = parseExplanations(pdf, text);
      if (text && parsed.length === 0) {
        failures.push({ id: pdf.id, title, url: pdf.url, reason: 'no answer/explanation headers matched' });
      }
      explanations.push(...parsed);
    }
    formulaCandidates.push(...parseFormulaCandidates(pdf, text));
    catalogRecords.push({
      id: pdf.id,
      sourceId: pdf.id,
      title,
      sourceTitle: title,
      url: pdf.url,
      sourceUrl: pdf.url,
      domain,
      hasExtractedText: Boolean(text),
      isSolution,
      reviewStatus
    });
  }

  const catalog = {
    generatedAt: new Date().toISOString(),
    artifactBranch,
    pdfCount: metadata.length,
    extractedTextCount: metadata.length - failures.length,
    solutionPdfCount: solutionCandidates.length,
    parsedSolutionPdfCount: solutionIndex.length,
    parsedExplanationCount: explanations.length,
    formulaCandidateCount: formulaCandidates.length,
    domainCounts,
    diagnostics: buildDiagnostics({
      inspectedPdfCount: metadata.length,
      solutionTitleSamples,
      solutionPdfSnippets,
      failures
    }),
    records: catalogRecords
  };

  await writeFile(`${outDir}/catalog.json`, `${JSON.stringify(catalog, null, 2)}\n`);
  await writeFile(`${outDir}/solution-index.json`, `${JSON.stringify(solutionIndex, null, 2)}\n`);
  await writeFile(`${outDir}/explanations-preview.json`, `${JSON.stringify(explanations, null, 2)}\n`);
  await writeFile(`${outDir}/formula-candidates.json`, `${JSON.stringify(formulaCandidates, null, 2)}\n`);
  if (solutionPdfCount > 0 && explanations.length === 0) {
    throw new Error(`Found ${solutionPdfCount} solution PDFs but parsed no explanations; parser pattern failed: ${catalog.diagnostics.failedParserPattern}`);
  }
  console.log(`Parsed ${explanations.length} explanations and ${formulaCandidates.length} formula candidates`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}

export { cleanText, isSolutionTitle, parseCorrectAnswerHeader, parseExplanations, parseFormulaCandidates };
