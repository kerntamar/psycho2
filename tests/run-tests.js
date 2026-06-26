import { existsSync, readFileSync } from 'node:fs';
import { sourceInventory, formulas, englishOutline, aiPracticeBank, sampleQuestion } from '../src/data.js';

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const html = readFileSync('index.html', 'utf8');
const notFoundHtml = readFileSync('404.html', 'utf8');
const app = readFileSync('src/app.js', 'utf8');
const pagesWorkflow = readFileSync('.github/workflows/deploy-pages.yml', 'utf8');
const docsHtml = readFileSync('docs/index.html', 'utf8');
const docsApp = readFileSync('docs/src/app.js', 'utf8');
const sourceManifest = JSON.parse(readFileSync('data/sources/campus-il-pdfs.json', 'utf8'));
const pdfMetadata = JSON.parse(readFileSync('data/extracted/pdfs/metadata.json', 'utf8'));
const extractedFormulas = JSON.parse(readFileSync('data/extracted/formulas/quant-summary-formulas.json', 'utf8'));

assert(html.includes('lang="he"'), 'index.html must declare Hebrew language');
assert(html.includes('dir="rtl"'), 'index.html must declare RTL direction');
assert(notFoundHtml.includes('src/app.js'), '404.html must load the app for GitHub Pages fallback routes');
assert(docsHtml.includes('src/app.js'), 'docs/index.html must support branch-based GitHub Pages from /docs');
assert(docsApp.includes('שאלה זו נוצרה על ידי AI'), 'docs app mirror must include the AI disclaimer');
assert(app.includes('שאלה זו נוצרה על ידי AI'), 'AI-generated questions must include a clear disclaimer');
assert(app.includes('ספריית PDF רשמית'), 'app must expose the official PDF library');
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
assert(sampleQuestion.sourceType === 'official', 'demo official question should be marked official');
assert(existsSync('.github/workflows/deploy-pages.yml'), 'GitHub Pages deployment workflow must exist');
assert(existsSync('.nojekyll'), 'GitHub Pages should bypass Jekyll processing');
assert(pagesWorkflow.includes('path: _site'), 'workflow must upload an explicit _site artifact');
assert(pagesWorkflow.includes('cp index.html 404.html .nojekyll _site/'), 'workflow must copy root HTML files into _site');
assert(pagesWorkflow.includes('actions/deploy-pages@v4'), 'workflow must deploy with GitHub Pages action');
assert(pagesWorkflow.includes('branches: [main]'), 'workflow must deploy pushes to main');
assert(sourceManifest.every((source) => source.url.startsWith('https://courses.campus.gov.il/') && source.url.includes('.pdf')), 'manifest must contain only Campus IL PDFs');
assert(pdfMetadata.every((source) => source.pageCount > 0 && source.extractionStatus === 'cataloged'), 'PDF metadata must include cataloged page counts');
assert(extractedFormulas.every((formula) => formula.sourceId === 'quant-summary' && formula.reviewStatus), 'extracted formulas must remain tied to source and review state');

console.log('כל הבדיקות עברו בהצלחה');
