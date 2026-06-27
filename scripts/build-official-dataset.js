import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';

function cleanLine(line) {
  return line.replace(/[\u202A-\u202E\u200E\u200F]/g, '').replace(/\s+/g, ' ').trim();
}

function interesting(line) {
  if (!line || line.length < 3 || line.length > 90) return false;
  if (/^[\d\-–—. ()]+$/.test(line)) return false;
  if (/זכויות|אין להעתיק|השימוש בכל מידע|עמוד/.test(line)) return false;
  return /[א-תA-Za-z]/.test(line);
}

function classify(title) {
  if (/אנגלית|English/i.test(title)) return 'אנגלית';
  if (/מילולי|עברית|חיבור/.test(title)) return 'חשיבה מילולית';
  if (/אלגברה|בעיות|גיאומטריה|תרשים|כמותית|נוסחאות/.test(title)) return 'חשיבה כמותית';
  if (/סימולציה|פתרונות/.test(title)) return 'סימולציה';
  return 'כללי';
}

async function main() {
  const manifest = JSON.parse(await readFile('data/sources/all-campus-il-pdfs.json', 'utf8'));
  const metadata = JSON.parse(await readFile('data/extracted/pdfs/metadata.json', 'utf8'));
  const metaById = new Map(metadata.map((item) => [item.id, item]));
  const records = [];

  for (const source of manifest.pdfs) {
    const txtPath = `data/extracted/pages/${source.id}.txt`;
    const jsonPath = `data/extracted/pages/${source.id}.json`;
    const hasText = existsSync(txtPath);
    const text = hasText ? await readFile(txtPath, 'utf8') : '';
    const lines = text.split(/\r?\n/).map(cleanLine).filter(interesting);
    const unique = [];
    for (const line of lines) {
      if (!unique.includes(line)) unique.push(line);
      if (unique.length >= 18) break;
    }
    records.push({
      id: source.id,
      title: source.title,
      url: source.url,
      domain: classify(source.title),
      bytes: metaById.get(source.id)?.bytes || null,
      sha256: metaById.get(source.id)?.sha256 || null,
      textPath: hasText ? txtPath : null,
      extractionMetaPath: existsSync(jsonPath) ? jsonPath : null,
      extractedCharacters: text.length,
      extractedLines: lines.length,
      previewHeadings: unique
    });
  }

  const summary = {
    generatedAt: new Date().toISOString(),
    sourcePage: manifest.sourcePage,
    pdfCount: manifest.count,
    extractedTextCount: records.filter((r) => r.textPath).length,
    domains: Object.fromEntries([...new Set(records.map((r) => r.domain))].sort().map((domain) => [domain, records.filter((r) => r.domain === domain).length])),
    records
  };

  await mkdir('data/official', { recursive: true });
  await writeFile('data/official/content-index.json', `${JSON.stringify(summary, null, 2)}\n`);
  await writeFile('src/officialData.js', `export const officialContentIndex = ${JSON.stringify(summary, null, 2)};\n`);
  console.log(`Built official content index for ${summary.pdfCount} PDFs`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
