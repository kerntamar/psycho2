import { existsSync, readFileSync } from 'node:fs';
import { sourceInventory, formulas, sampleQuestion } from '../src/data.js';

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const html = readFileSync('index.html', 'utf8');
const app = readFileSync('src/app.js', 'utf8');
const pagesWorkflow = readFileSync('.github/workflows/deploy-pages.yml', 'utf8');

assert(html.includes('lang="he"'), 'index.html must declare Hebrew language');
assert(html.includes('dir="rtl"'), 'index.html must declare RTL direction');
assert(app.includes('שאלה זו נוצרה על ידי AI'), 'AI-generated questions must include a clear disclaimer');
assert(sourceInventory.length >= 5, 'source inventory should include initial Campus IL sources');
assert(sourceInventory.every((source) => source.url.includes('campus.gov.il')), 'all source URLs must be Campus IL URLs');
assert(formulas.every((formula) => formula.sourceTitle && formula.page), 'formulas need source metadata placeholders');
assert(sampleQuestion.sourceType === 'official', 'demo official question should be marked official');
assert(existsSync('.github/workflows/deploy-pages.yml'), 'GitHub Pages deployment workflow must exist');
assert(existsSync('.nojekyll'), 'GitHub Pages should bypass Jekyll processing');
assert(pagesWorkflow.includes('actions/deploy-pages@v4'), 'workflow must deploy with GitHub Pages action');
assert(pagesWorkflow.includes('branches: [main]'), 'workflow must deploy pushes to main');

console.log('כל הבדיקות עברו בהצלחה');
