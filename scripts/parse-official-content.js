import { existsSync } from 'node:fs';
import { mkdir, readFile, writeFile } from 'node:fs/promises';

const artifactBranch = process.env.ARTIFACT_BRANCH || 'campus-il-extraction-artifacts';
const rawBase = `https://raw.githubusercontent.com/kerntamar/psycho2/${artifactBranch}`;
const outDir = 'data/official';
const maxExplanationChars = Number(process.env.MAX_EXPLANATION_CHARS || 1200);
const bidiControls = /[\u200e\u200f\u202a-\u202e\u2066-\u2069]/g;

export function cleanText(text) {
  return String(text || '')
    .replace(bidiControls, '')
    .replace(/\f/g, '\n')
    .replace(/[\u00a0\t]+/g, ' ')
    .replace(/[ ]{2,}/g, ' ')
    .replace(/ *\n */g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

export function isSolutionTitle(title = '') {
  return /פתרונות|פתרון|solutions?|answer key/i.test(title);
}

export function classifyDomain(title = '', block = '') {
  const haystack = `${title} ${block}`;
  if (/אנגלית|Sentence|Restatement|Reading|Vocabulary/i.test(haystack)) return 'אנגלית';
  if (/כמותית|אלגברה|גיאומטר|תרשים|בעיות|אחוז|תנועה|הספק/.test(haystack)) return 'חשיבה כמותית';
  if (/מילולית|אנלוגיות|הבנה והסקה|השלמת משפטים/.test(haystack)) return 'חשיבה מילולית';
  if (/כתיבה|חיבור/.test(haystack)) return 'מטלת כתיבה';
  return 'כללי';
}

export function parseCorrectAnswerHeader(text = '') {
  const normalized = cleanText(text);
  const patterns = [
    /תשובה\D{0,30}([1-4])\D{0,30}נכונה/,
    /התשובה\s+הנכונה\s+היא\D{0,30}([1-4])/
  ];
  for (const pattern of patterns) {
    const match = normalized.match(pattern);
    if (match) return Number(match[1]);
  }
  return null;
}

function answerHeaderRegex() {
  return /(?:תשובה\D{0,30}([1-4])\D{0,30}נכונה|התשובה\s+הנכונה\s+היא\D{0,30}([1-4]))/g;
}

export function splitSolutionBlocks(text = '') {
  const normalized = cleanText(text);
  const matches = [...normalized.matchAll(answerHeaderRegex())];
  return matches.map((match, index) => {
    const start = match.index;
    const end = index + 1 < matches.length ? matches[index + 1].index : normalized.length;
    const raw = normalized.slice(start, end).trim();
    return {
      questionNumber: index + 1,
      correctAnswer: Number(match[1] || match[2]),
      explanation: raw.slice(0, maxExplanationChars),
      truncated: raw.length > maxExplanationChars
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

function extractFormulaCandidates(text = '', source) {
  const formulaSource = /נוסחאות|דפי סיכום|חשיבה כמותית|אלגברה|גיאומטר|טבלאות/.test(source.title);
  if (!formulaSource) return [];
  return cleanText(text).split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .filter((line) => /[=+−\-×*/^²π√]|שטח|היקף|נפח|ממוצע|אחוז|הסתברות|מהירות|זמן|דרך|יחס/.test(line))
    .slice(0, 120)
    .map((line, index) => ({
      id: `${source.id}-formula-${String(index + 1).padStart(3, '0')}`,
      sourceId: source.id,
      sourceTitle: source.title,
      sourceUrl: source.url,
      text: line.slice(0, 260),
      reviewStatus: 'auto_extracted_needs_review'
    }));
}

async function readJson(path) {
  return JSON.parse(await readFile(path, 'utf8'));
}

async function readTextForPdf(id) {
  const localPath = `data/extracted/pages/${id}.txt`;
  if (existsSync(localPath)) return readFile(localPath, 'utf8');
  const response = await fetch(`${rawBase}/${localPath}`);
  if (!response.ok) throw new Error(`Could not load ${localPath}: ${response.status}`);
  return response.text();
}

function sampleSnippet(text = '') {
  return cleanText(text).slice(0, 500);
}

export async function buildOfficialArtifacts() {
  const metadata = await readJson('data/extracted/pdfs/metadata.json');
  await mkdir(outDir, { recursive: true });

  const solutionCandidates = metadata.filter((source) => isSolutionTitle(source.title));
  const solutionIndex = [];
  const explanations = [];
  const formulaCandidates = [];
  const failures = [];
  const diagnostics = {
    inspectedPdfCount: metadata.length,
    solutionTitleCandidateCount: solutionCandidates.length,
    solutionTitleSamples: solutionCandidates.slice(0, 10).map((source) => source.title),
    parserPatterns: [
      'תשובה ... 1-4 ... נכונה',
      'התשובה הנכונה היא ... 1-4'
    ],
    sampleSnippets: []
  };

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
      failures.push({ id: source.id, title: source.title, message: error.message });
    }
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
    reviewStatus: 'auto_extracted_needs_review',
    diagnostics,
    failures
  };

  await writeFile(`${outDir}/catalog.json`, `${JSON.stringify(catalog, null, 2)}\n`);
  await writeFile(`${outDir}/solution-index.json`, `${JSON.stringify(solutionIndex, null, 2)}\n`);
  await writeFile(`${outDir}/explanations-preview.json`, `${JSON.stringify(explanations, null, 2)}\n`);
  await writeFile(`${outDir}/formula-candidates.json`, `${JSON.stringify(formulaCandidates, null, 2)}\n`);
  console.log(`Parsed ${catalog.parsedExplanationCount} explanations from ${catalog.parsedSolutionPdfCount} solution PDFs; found ${catalog.formulaCandidateCount} formula candidates.`);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  buildOfficialArtifacts().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}
