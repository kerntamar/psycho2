import { existsSync, readFileSync } from 'node:fs';
import { sourceInventory, formulas, englishOutline, sampleQuestion } from '../src/data.js';

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const html = readFileSync('index.html', 'utf8');
const app = readFileSync('src/app.js', 'utf8');
const pagesWorkflow = readFileSync('.github/workflows/deploy-pages.yml', 'utf8');
const sourceManifest = JSON.parse(readFileSync('data/sources/campus-il-pdfs.json', 'utf8'));
const pdfMetadata = JSON.parse(readFileSync('data/extracted/pdfs/metadata.json', 'utf8'));
const extractedFormulas = JSON.parse(readFileSync('data/extracted/formulas/quant-summary-formulas.json', 'utf8'));

assert(html.includes('lang="he"'), 'index.html must declare Hebrew language');
assert(html.includes('dir="rtl"'), 'index.html must declare RTL direction');
assert(app.includes('שאלה זו נוצרה על ידי AI'), 'AI-generated questions must include a clear disclaimer');
assert(sourceInventory.length >= 4, 'source inventory should include initial Campus IL PDF sources');
assert(sourceInventory.every((source) => source.url.includes('courses.campus.gov.il') && source.type === 'PDF'), 'all source URLs must be Campus IL PDFs');
assert(sourceInventory.every((source) => Number.isInteger(source.pageCount) && source.pageCount > 0), 'app sources need extracted page counts');
assert(formulas.every((formula) => formula.sourceTitle && formula.page && formula.reviewStatus), 'formulas need source metadata and review status');
assert(englishOutline.length > 0 && englishOutline.every((section) => section.page && section.items.length), 'English outline must include page-backed items');
assert(sampleQuestion.sourceType === 'official', 'demo official question should be marked official');
assert(existsSync('.github/workflows/deploy-pages.yml'), 'GitHub Pages deployment workflow must exist');
assert(existsSync('.nojekyll'), 'GitHub Pages should bypass Jekyll processing');
assert(pagesWorkflow.includes('actions/deploy-pages@v4'), 'workflow must deploy with GitHub Pages action');
assert(pagesWorkflow.includes('branches: [main]'), 'workflow must deploy pushes to main');
assert(sourceManifest.every((source) => source.url.startsWith('https://courses.campus.gov.il/') && source.url.includes('.pdf')), 'manifest must contain only Campus IL PDFs');
assert(pdfMetadata.every((source) => source.pageCount > 0 && source.extractionStatus === 'cataloged'), 'PDF metadata must include cataloged page counts');
assert(extractedFormulas.every((formula) => formula.sourceId === 'quant-summary' && formula.reviewStatus), 'extracted formulas must remain tied to source and review state');

console.log('כל הבדיקות עברו בהצלחה');
