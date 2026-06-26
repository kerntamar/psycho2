import { readFileSync } from 'node:fs';
import { sourceInventory, formulas, sampleQuestion } from '../src/data.js';

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const html = readFileSync('index.html', 'utf8');
const app = readFileSync('src/app.js', 'utf8');

assert(html.includes('lang="he"'), 'index.html must declare Hebrew language');
assert(html.includes('dir="rtl"'), 'index.html must declare RTL direction');
assert(app.includes('שאלה זו נוצרה על ידי AI'), 'AI-generated questions must include a clear disclaimer');
assert(sourceInventory.length >= 5, 'source inventory should include initial Campus IL sources');
assert(sourceInventory.every((source) => source.url.includes('campus.gov.il')), 'all source URLs must be Campus IL URLs');
assert(formulas.every((formula) => formula.sourceTitle && formula.page), 'formulas need source metadata placeholders');
assert(sampleQuestion.sourceType === 'official', 'demo official question should be marked official');

console.log('כל הבדיקות עברו בהצלחה');
