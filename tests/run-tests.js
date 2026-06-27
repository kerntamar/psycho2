import { existsSync, readFileSync } from 'node:fs';
import { sourceInventory, formulas, englishOutline, aiPracticeBank, officialQuestions, sampleQuestion } from '../src/data.js';
import { officialContentIndex, OFFICIAL_REVIEW_STATUS } from '../src/officialData.js';
import { cleanText, isSolutionTitle, parseCorrectAnswerHeader, parseExplanations } from '../scripts/parse-official-content.js';

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const html = readFileSync('index.html', 'utf8');
const app = readFileSync('src/app.js', 'utf8');
const docsApp = readFileSync('docs/src/app.js', 'utf8');
const buildDocsScript = readFileSync('scripts/build-docs.js', 'utf8');
const parserScript = readFileSync('scripts/parse-official-content.js', 'utf8');
const bulkIngestWorkflow = readFileSync('.github/workflows/bulk-ingest-campus-pdfs.yml', 'utf8');
const packageJson = JSON.parse(readFileSync('package.json', 'utf8'));
const catalog = JSON.parse(readFileSync('data/official/catalog.json', 'utf8'));

assert(html.includes('lang="he"'), 'index.html must declare Hebrew language');
assert(html.includes('dir="rtl"'), 'index.html must declare RTL direction');
assert(docsApp.includes('שאלה זו נוצרה על ידי AI'), 'docs app mirror must include the AI disclaimer');
assert(app.includes('שאלה זו נוצרה על ידי AI'), 'AI-generated questions must include a clear disclaimer');
assert(app.includes('OFFICIAL_CATALOG_URL'), 'app must include logic to load parsed official catalog artifacts');
assert(app.includes('OFFICIAL_EXPLANATIONS_PREVIEW_URL'), 'app must fetch explanations-preview.json from official artifacts');
assert(app.includes('OFFICIAL_FORMULA_CANDIDATES_URL'), 'app must fetch formula-candidates.json from official artifacts');
assert(app.includes('campus-il-extraction-artifacts'), 'app must load full artifacts from the stable artifact branch');
assert(app.includes('Using bundled official catalog fallback'), 'app must keep working with a bundled fallback summary');
assert(app.includes('לא הצלחנו לטעון כרגע את ארטיפקטי Campus IL הרשמיים'), 'app must show a clear Hebrew fallback message when artifacts fail to load');
assert(app.includes('דפדפן הסברים רשמיים'), 'app must render an official explanations browser');
assert(app.includes('מועמדי נוסחאות'), 'app must render official formula candidates separately');
assert(app.includes('parsedExplanationCount'), 'app must display parsed explanation stats when available');
assert(sourceInventory.every((source) => source.url.includes('courses.campus.gov.il') && source.type === 'PDF'), 'all source URLs must be Campus IL PDFs');
assert(formulas.length >= 12, 'formula sheet should contain meaningful study content');
assert(englishOutline.length > 0 && englishOutline.every((section) => section.page && section.items.length), 'English outline must include page-backed items');
assert(aiPracticeBank.length >= 3, 'AI practice bank should include labeled practice questions');
assert(app.includes('שאלות AI מסומנות בנפרד') && app.includes("sourceType === 'ai'"), 'AI content must remain clearly labeled and separated from official Campus IL content');
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
