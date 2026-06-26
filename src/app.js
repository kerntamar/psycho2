import { sourceInventory, formulas, sampleQuestion } from './data.js';

const state = { answered: false, aiQuestion: null };
const aiLabel = 'שאלה זו נוצרה על ידי AI ואינה שאלה רשמית ממבחני המרכז הארצי או Campus IL';

function sourceBadge(type) {
  return type === 'official' ? 'שאלה רשמית ממקור Campus IL' : aiLabel;
}

function generateAiPracticeQuestion(base) {
  return {
    id: `ai-${Date.now()}`,
    sourceType: 'ai',
    domain: base.domain,
    topic: base.topic,
    difficulty: base.difficulty,
    text: `שאלת AI לתרגול נוסף בנושא ${base.topic}: מחיר מוצר עלה ב־20% ואז ירד ב־20%. מה נכון לגבי המחיר הסופי?`,
    choices: ['שווה למחיר המקורי', 'נמוך מהמחיר המקורי', 'גבוה מהמחיר המקורי', 'אי אפשר לדעת'],
    correctIndex: 1,
    explanation: 'לאחר עלייה וירידה באותו אחוז מתקבל 1.2 × 0.8 = 0.96, כלומר המחיר נמוך ב־4% מהמקור.',
    relatedOfficialQuestionId: base.id
  };
}

function renderSources() {
  return sourceInventory.map((source) => `<tr><td>${source.title}</td><td>${source.type}</td><td>${source.includes.join('، ')}</td><td>${source.usage}</td><td><a href="${source.url}" target="_blank" rel="noreferrer">פתיחה</a></td></tr>`).join('');
}

function renderFormulas() {
  return formulas.map((item) => `<article class="card"><span class="tag">${item.topic}</span><h3>${item.name}</h3><p class="formula">${item.formula}</p><p>${item.explanation}</p><small>מקור: ${item.sourceTitle}, עמוד: ${item.page}</small></article>`).join('');
}

function renderQuestion(question) {
  const choices = question.choices.map((choice, index) => `<button class="choice" data-choice="${index}">${choice}</button>`).join('');
  const officialSource = question.sourceType === 'official' ? `<p class="source">מקור: ${question.source.title}, עמוד: ${question.source.page}</p>` : `<p class="source danger">${aiLabel}</p>`;
  return `<section class="question card"><span class="tag ${question.sourceType === 'ai' ? 'ai' : ''}">${sourceBadge(question.sourceType)}</span><h3>${question.domain} · ${question.topic}</h3><p>${question.text}</p><div class="choices">${choices}</div><div id="feedback"></div>${officialSource}<button id="aiGenerate" class="secondary">צור שאלה דומה בעזרת AI</button></section>`;
}

function render() {
  document.getElementById('app').innerHTML = `
  <header class="hero"><div><h1>פסיכומטרי קמפוס</h1><p>אפליקציית הכנה בעברית RTL המבוססת על קובצי PDF של Campus IL, עם הפרדה מלאה בין תוכן מקור רשמי לבין תרגול שנוצר על ידי AI.</p></div><nav><a href="#practice">תרגול</a><a href="#formulas">דף נוסחאות</a><a href="#sources">מקורות</a><a href="#dashboard">התקדמות</a></nav></header>
  <main>
    <section class="grid"><article class="card"><h2>כלל מקור רשמי</h2><p>שאלות, הסברים, מבנה מבחן ודף נוסחאות רשמיים יוצגו רק עם קישור PDF, שם מקור ועמוד.</p></article><article class="card"><h2>תרגול AI מסומן</h2><p>בכל שאלה ניתן ליצור שאלה דומה, אך היא תסומן במפורש כתוכן AI שאינו רשמי.</p></article><article class="card"><h2>עברית מלאה</h2><p>כל הממשק, הניווט, ההודעות והדוחות מוגדרים בעברית ובכיוון RTL.</p></article></section>
    <section id="practice"><h2>מצב תרגול</h2><div id="questionHost">${renderQuestion(state.aiQuestion || sampleQuestion)}</div></section>
    <section id="formulas"><h2>דף נוסחאות</h2><input id="formulaSearch" placeholder="חיפוש נוסחה או נושא"><div id="formulaList" class="grid">${renderFormulas()}</div></section>
    <section id="dashboard"><h2>לוח התקדמות</h2><div class="card"><p>כאן יוצגו דיוק לפי תחום, זמן ממוצע לשאלה, טעויות חוזרות והפרדה בין שאלות Campus IL לשאלות AI.</p><ul><li>חשיבה כמותית: ממתין לנתונים</li><li>חשיבה מילולית: ממתין לנתונים</li><li>אנגלית: ממתין לנתונים</li></ul></div></section>
    <section id="sources"><h2>מלאי מקורות ראשוני</h2><table><thead><tr><th>כותרת</th><th>סוג</th><th>כולל</th><th>שימוש באפליקציה</th><th>קישור</th></tr></thead><tbody>${renderSources()}</tbody></table></section>
  </main>`;
  bindEvents();
}

function bindEvents() {
  document.querySelectorAll('[data-choice]').forEach((button) => button.addEventListener('click', () => {
    const question = state.aiQuestion || sampleQuestion;
    const selected = Number(button.dataset.choice);
    const ok = selected === question.correctIndex;
    document.getElementById('feedback').innerHTML = `<div class="feedback ${ok ? 'ok' : 'bad'}">${ok ? 'נכון' : 'לא נכון'} · ${question.explanation}</div>`;
  }));
  document.getElementById('aiGenerate').addEventListener('click', () => { state.aiQuestion = generateAiPracticeQuestion(sampleQuestion); render(); });
  document.getElementById('formulaSearch').addEventListener('input', (event) => {
    const term = event.target.value.trim();
    const filtered = formulas.filter((item) => `${item.name} ${item.topic} ${item.formula}`.includes(term));
    document.getElementById('formulaList').innerHTML = filtered.map((item) => `<article class="card"><span class="tag">${item.topic}</span><h3>${item.name}</h3><p class="formula">${item.formula}</p><p>${item.explanation}</p><small>מקור: ${item.sourceTitle}, עמוד: ${item.page}</small></article>`).join('');
  });
}

render();
