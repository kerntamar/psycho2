import { sourceInventory, formulas, englishOutline, topicPlan, aiPracticeBank, sampleQuestion } from './data.js';

const state = { answered: false, aiQuestion: null, practiceIndex: 0, selectedPdfId: sourceInventory[0].id };
const aiLabel = 'שאלה זו נוצרה על ידי AI ואינה שאלה רשמית ממבחני המרכז הארצי או Campus IL';

function sourceBadge(type) {
  return type === 'official' ? 'שאלה רשמית ממקור Campus IL' : aiLabel;
}

function generateAiPracticeQuestion(base) {
  const next = aiPracticeBank[state.practiceIndex % aiPracticeBank.length];
  state.practiceIndex += 1;
  return { ...next, relatedOfficialQuestionId: base.id };
}

function renderSources() {
  return sourceInventory.map((source) => `<tr><td>${source.title}</td><td>${source.type}</td><td>${source.includes.join('، ')}</td><td>${source.usage}</td><td>${source.pageCount || 'לא ידוע'}</td><td><a href="${source.url}" target="_blank" rel="noreferrer">פתיחה</a></td></tr>`).join('');
}

function renderFormulas() {
  return formulas.map((item) => `<article class="card"><span class="tag">${item.topic}</span><h3>${item.name}</h3><p class="formula">${item.formula}</p><p>${item.explanation}</p><p class="example">דוגמה: ${item.example}</p><small>מקור: ${item.sourceTitle}, עמוד: ${item.page} · ${item.reviewStatus}</small></article>`).join('');
}


function renderPdfLibrary() {
  const selected = sourceInventory.find((source) => source.id === state.selectedPdfId) || sourceInventory[0];
  const buttons = sourceInventory.map((source) => `<button class="pdf-tab ${source.id === selected.id ? 'active' : ''}" data-pdf="${source.id}">${source.title}</button>`).join('');
  return `<div class="card"><p>כאן ניתן לפתוח את קובצי ה־PDF הרשמיים של Campus IL ישירות מתוך האתר. הקבצים אינם מועתקים לאתר; הם נטענים מהמקור הרשמי.</p><div class="pdf-tabs">${buttons}</div><div class="pdf-frame-wrap"><iframe title="${selected.title}" src="${selected.url}"></iframe></div><p class="source">מקור: ${selected.title} · ${selected.pageCount} עמודים · <a href="${selected.url}" target="_blank" rel="noreferrer">פתיחה בלשונית חדשה</a></p></div>`;
}

function renderQuestion(question) {
  const choices = question.choices.map((choice, index) => `<button class="choice" data-choice="${index}">${choice}</button>`).join('');
  const officialSource = question.sourceType === 'official' ? `<p class="source">מקור: ${question.source.title}, עמוד: ${question.source.page}</p>` : `<p class="source danger">${aiLabel}</p>`;
  return `<section class="question card"><span class="tag ${question.sourceType === 'ai' ? 'ai' : ''}">${sourceBadge(question.sourceType)}</span><h3>${question.domain} · ${question.topic}</h3><p>${question.text}</p><div class="choices">${choices}</div><div id="feedback"></div>${officialSource}<button id="aiGenerate" class="secondary">צור שאלה דומה בעזרת AI</button></section>`;
}

function render() {
  document.getElementById('app').innerHTML = `
  <header class="hero"><div><h1>פסיכומטרי קמפוס</h1><p>אפליקציית הכנה בעברית RTL המבוססת על קובצי PDF של Campus IL, עם הפרדה מלאה בין תוכן מקור רשמי לבין תרגול שנוצר על ידי AI.</p><div class="stats"><span>${sourceInventory.length} מקורות PDF</span><span>${formulas.length} נוסחאות</span><span>${englishOutline[1].items.length} נושאי אנגלית</span><span>${aiPracticeBank.length} שאלות AI מסומנות</span></div></div><nav><a href="#pdfs">קובצי PDF</a><a href="#plan">תכנית לימוד</a><a href="#practice">תרגול</a><a href="#formulas">דף נוסחאות</a><a href="#english">אנגלית</a><a href="#sources">מקורות</a><a href="#dashboard">התקדמות</a></nav></header>
  <main>
    <section class="grid"><article class="card"><h2>כלל מקור רשמי</h2><p>שאלות, הסברים, מבנה מבחן ודף נוסחאות רשמיים יוצגו רק עם קישור PDF, שם מקור ועמוד.</p></article><article class="card"><h2>תוכן לימוד זמין</h2><p>האפליקציה כוללת עכשיו נוסחאות, דוגמאות, מפת נושאי אנגלית, תכנית לימוד ושאלות AI מסומנות לתרגול.</p></article><article class="card"><h2>עברית מלאה</h2><p>כל הממשק, הניווט, ההודעות והדוחות מוגדרים בעברית ובכיוון RTL.</p></article></section>
    <section id="pdfs"><h2>ספריית PDF רשמית</h2>${renderPdfLibrary()}</section>
    <section id="plan"><h2>תכנית לימוד לפי נושא</h2><div class="grid">${topicPlan.map((topic) => `<article class="card"><span class="tag">${topic.domain}</span><h3>${topic.title}</h3><ul>${topic.tasks.map((task) => `<li>${task}</li>`).join('')}</ul></article>`).join('')}</div></section>
    <section id="practice"><h2>מצב תרגול</h2><div id="questionHost">${renderQuestion(state.aiQuestion || sampleQuestion)}</div></section>
    <section id="formulas"><h2>דף נוסחאות</h2><input id="formulaSearch" placeholder="חיפוש נוסחה או נושא"><div id="formulaList" class="grid">${renderFormulas()}</div></section>
    <section id="english"><h2>מפת לימוד אנגלית</h2><div class="grid">${englishOutline.map((section) => `<article class="card"><span class="tag">עמוד ${section.page}</span><h3>${section.title}</h3><p>${section.items.join('، ')}</p></article>`).join('')}</div></section>
    <section id="dashboard"><h2>לוח התקדמות</h2><div class="card"><p>כאן יוצגו דיוק לפי תחום, זמן ממוצע לשאלה, טעויות חוזרות והפרדה בין שאלות Campus IL לשאלות AI.</p><ul><li>חשיבה כמותית: ממתין לנתונים</li><li>חשיבה מילולית: ממתין לנתונים</li><li>אנגלית: ממתין לנתונים</li></ul></div></section>
    <section id="sources"><h2>מלאי מקורות ראשוני</h2><table><thead><tr><th>כותרת</th><th>סוג</th><th>כולל</th><th>שימוש באפליקציה</th><th>עמודים</th><th>קישור</th></tr></thead><tbody>${renderSources()}</tbody></table></section>
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
  document.querySelectorAll('[data-pdf]').forEach((button) => button.addEventListener('click', () => { state.selectedPdfId = button.dataset.pdf; render(); }));
  document.getElementById('aiGenerate').addEventListener('click', () => { state.aiQuestion = generateAiPracticeQuestion(sampleQuestion); render(); });
  document.getElementById('formulaSearch').addEventListener('input', (event) => {
    const term = event.target.value.trim();
    const filtered = formulas.filter((item) => `${item.name} ${item.topic} ${item.formula}`.includes(term));
    document.getElementById('formulaList').innerHTML = filtered.map((item) => `<article class="card"><span class="tag">${item.topic}</span><h3>${item.name}</h3><p class="formula">${item.formula}</p><p>${item.explanation}</p><p class="example">דוגמה: ${item.example}</p><small>מקור: ${item.sourceTitle}, עמוד: ${item.page} · ${item.reviewStatus}</small></article>`).join('');
  });
}

render();
