import { existsSync, readFileSync } from 'node:fs';
import { sourceInventory, formulas, englishOutline, aiPracticeBank, officialQuestions, sampleQuestion } from '../src/data.js';
import { officialContentIndex, OFFICIAL_REVIEW_STATUS } from '../src/officialData.js';
import { cleanText, isSolutionTitle, parseCorrectAnswerHeader, parseExplanations } from '../scripts/parse-official-content.js';

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const html = readFileSync('index.html', 'utf8');
const notFoundHtml = readFileSync('404.html', 'utf8');
const app = readFileSync('src/app.js', 'utf8');
const pagesWorkflow = readFileSync('.github/workflows/deploy-pages.yml', 'utf8');
const bulkIngestWorkflow = readFileSync('.github/workflows/bulk-ingest-campus-pdfs.yml', 'utf8');
const discoverScript = readFileSync('scripts/discover-pdfs.js', 'utf8');
const parserScript = readFileSync('scripts/parse-official-content.js', 'utf8');
const docsHtml = readFileSync('docs/index.html', 'utf8');
const docsApp = readFileSync('docs/src/app.js', 'utf8');
const sourceManifest = JSON.parse(readFileSync('data/sources/campus-il-pdfs.json', 'utf8'));
const pdfMetadata = JSON.parse(readFileSync('data/extracted/pdfs/metadata.json', 'utf8'));
const extractedFormulas = JSON.parse(readFileSync('data/extracted/formulas/quant-summary-formulas.json', 'utf8'));
const officialIndex = JSON.parse(readFileSync('data/official/content-index.json', 'utf8'));

assert(html.includes('lang="he"'), 'index.html must declare Hebrew language');
assert(html.includes('dir="rtl"'), 'index.html must declare RTL direction');
assert(notFoundHtml.includes('src/app.js'), '404.html must load the app for GitHub Pages fallback routes');
assert(docsHtml.includes('src/app.js'), 'docs/index.html must support branch-based GitHub Pages from /docs');
assert(docsApp.includes('שאלה זו נוצרה על ידי AI'), 'docs app mirror must include the AI disclaimer');
assert(app.includes('שאלה זו נוצרה על ידי AI'), 'AI-generated questions must include a clear disclaimer');
assert(app.includes('ספריית PDF רשמית'), 'app must expose the official PDF library');
assert(app.includes('אינדקס תוכן מכל ה־PDFים'), 'app must expose the all-PDF content index');
assert(app.includes('<iframe'), 'app must embed selected official PDFs for reading');
assert(app.includes('חזרה על טעויות'), 'app must include review mode');
assert(app.includes('localStorage'), 'app must persist user progress locally');
assert(app.includes('איפוס התקדמות'), 'app must include dashboard progress controls');
assert(sourceInventory.length >= 4, 'source inventory should include initial Campus IL PDF sources');
assert(sourceInventory.every((source) => source.url.includes('courses.campus.gov.il') && source.type === 'PDF'), 'all source URLs must be Campus IL PDFs');
assert(sourceInventory.every((source) => Number.isInteger(source.pageCount) && source.pageCount > 0), 'app sources need extracted page counts');
assert(formulas.length >= 12, 'formula sheet should contain meaningful study content, not just placeholders');
assert(formulas.every((formula) => formula.sourceTitle && formula.page && formula.reviewStatus && formula.example), 'formulas need source metadata, review status, and examples');
assert(englishOutline.length > 0 && englishOutline.every((section) => section.page && section.items.length), 'English outline must include page-backed items');
assert(aiPracticeBank.length >= 3, 'AI practice bank should include labeled practice questions');
assert(officialQuestions.length >= 17, 'app must include extracted official Campus IL questions from multiple PDFs');
assert(new Set(officialQuestions.map((q) => q.source.title)).has('פתרונות סימולציה קמפוס 2'), 'official questions must include content from Simulation 2 solutions');
assert(officialQuestions.every((q) => q.sourceType === 'official' && q.source && q.source.url.includes('courses.campus.gov.il') && q.explanation), 'official questions need Campus IL source metadata and explanations');
assert(!sampleQuestion.text.includes('שאלת הדגמה'), 'default practice question must no longer be a skeleton/demo prompt');
assert(existsSync('scripts/parse-official-content.js'), 'parser script must exist');
assert(packageJson.scripts['parse:official'] === 'node scripts/parse-official-content.js', 'npm parse:official script must run parser');
assert(parserScript.includes('explanations-preview.json'), 'parser must write explanations preview output');
assert(parserScript.includes('formula-candidates.json'), 'parser must write formula candidates output');
assert(isSolutionTitle('פתרונות סימולציה 1'), 'parser must recognize simulation solution titles');
assert(parseCorrectAnswerHeader('תשובה (4) נכונה') === '4', 'parser must parse parenthesized answer header format');
assert(parseCorrectAnswerHeader('תשובה )4( נכונה') === '4', 'parser must parse reversed parenthesis answer header format');
assert(parseCorrectAnswerHeader('תשובה ) (3 נכונה') === '3', 'parser must parse spaced RTL answer header format');
assert(parseCorrectAnswerHeader('התשובה הנכונה היא (2)') === '2', 'parser must parse full correct answer phrase');
assert(parseCorrectAnswerHeader('\u202bתשובה \u200f) (4 נכונה\u202c') === '4', 'parser must remove bidi marks before answer parsing');
assert(!/[\u200e\u200f\u202a-\u202e\u2066-\u2069]/.test(cleanText('\u202bתשובה (3) נכונה\u202c')), 'cleanText must remove bidi control characters');
assert(parseExplanations(
  { id: 'sample', title: 'פתרונות סימולציה 1', url: 'https://example.test/sample.pdf' },
  'תשובה (4) נכונה\nהסבר ראשון עם מספיק מילים לבדיקה.\nתשובה )4( נכונה\nהסבר שני עם מספיק מילים לבדיקה.'
).length === 2, 'parser must split multiple explanation blocks');
assert(parserScript.includes('auto_extracted_needs_review'), 'parser must mark generated records for review');
assert(app.includes('OFFICIAL_REVIEW_STATUS') && OFFICIAL_REVIEW_STATUS === 'auto_extracted_needs_review', 'official artifact data must be labeled auto_extracted_needs_review');
assert(parserScript.includes('campus-il-extraction-artifacts'), 'parser must fall back to the artifact branch for missing local text');
assert(parserScript.includes('Found ${solutionPdfCount} solution PDFs but parsed no explanations'), 'parser must fail loudly when solution PDFs parse no explanations');
assert(bulkIngestWorkflow.includes('npm run discover:pdfs'), 'bulk workflow must discover all PDFs');
assert(bulkIngestWorkflow.includes('npm run fetch:pdfs -- data/sources/all-campus-il-pdfs.json'), 'bulk workflow must fetch discovered PDFs');
assert(bulkIngestWorkflow.includes('npm run extract:pdfs'), 'bulk workflow must extract PDFs');
assert(bulkIngestWorkflow.includes('npm run parse:official'), 'bulk workflow must parse official artifacts');
assert(bulkIngestWorkflow.includes('npm run build:docs'), 'bulk workflow must build docs after parsing');
assert(bulkIngestWorkflow.includes('data/official/**'), 'bulk workflow must upload parsed official artifacts');
assert(bulkIngestWorkflow.includes('docs/data/official/**'), 'bulk workflow must publish compact docs official artifacts');
assert(bulkIngestWorkflow.includes('campus-il-extraction-artifacts'), 'full artifacts must remain on campus-il-extraction-artifacts');
assert(!bulkIngestWorkflow.includes('docs/data/extracted/**'), 'bulk workflow must not duplicate raw extraction under docs/data');
assert(buildDocsScript.includes("rm('docs/data/extracted'"), 'docs build must remove raw docs extraction artifacts');
assert(!buildDocsScript.includes("cp('data', 'docs/data'"), 'docs build must not copy all raw data into docs/data');
assert(officialContentIndex.pdfCount === 109 && officialContentIndex.extractedTextCount === 109, 'bundled official summary must stay compact but count all PDFs');
assert(officialContentIndex.artifactBranch === 'campus-il-extraction-artifacts', 'bundled official summary must reference artifact branch');
assert(catalog.pdfCount === 109 && catalog.extractedTextCount === 109, 'compact catalog must include expected official counts');
assert(!existsSync('docs/data/extracted'), 'docs/data must not contain raw extracted PDF artifacts');
for (const artifactPath of ['data/official/explanations-preview.json', 'data/official/formula-candidates.json', 'data/official/solution-index.json']) {
  const bytes = readFileSync(artifactPath).byteLength;
  assert(bytes < 250_000, `${artifactPath} must stay compact so huge generated artifacts are not committed to main`);
}


console.log('כל הבדיקות עברו בהצלחה');
