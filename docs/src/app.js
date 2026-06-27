import { sourceInventory, formulas, englishOutline, topicPlan, aiPracticeBank, officialQuestions, sampleQuestion } from './data.js';
import { officialContentIndex } from './officialData.js';
import { isArtifactSolutionSource, splitArtifactSolutions } from './artifactParser.js';

const aiLabel = 'שאלה זו נוצרה על ידי AI ואינה שאלה רשמית ממבחני המרכז הארצי או Campus IL';
const storeKey = 'psycho2-state-v1';
const state = JSON.parse(localStorage.getItem(storeKey) || '{}');
Object.assign(state, { selectedPdfId: state.selectedPdfId || sourceInventory[0].id, practiceIndex: state.practiceIndex || 0, officialIndex: state.officialIndex || 0, currentQuestion: state.currentQuestion || sampleQuestion, attempts: state.attempts || [], bookmarks: state.bookmarks || [], artifactExplanations: state.artifactExplanations || [], artifactStatus: state.artifactStatus || 'idle' });
if (state.currentQuestion.text?.includes('שאלת הדגמה')) { state.currentQuestion = sampleQuestion; save(); }

function save() { localStorage.setItem(storeKey, JSON.stringify(state)); }
function sourceBadge(type) { return type === 'official' ? 'שאלה רשמית ממקור Campus IL' : aiLabel; }
function nextAiQuestion() { const q = aiPracticeBank[state.practiceIndex % aiPracticeBank.length]; state.practiceIndex += 1; state.currentQuestion = q; save(); render(); }
function nextOfficialQuestion() { const q = officialQuestions[state.officialIndex % officialQuestions.length]; state.officialIndex += 1; state.currentQuestion = q; save(); render(); }
function resetProgress() { state.attempts = []; state.currentQuestion = sampleQuestion; save(); render(); }
function toggleBookmark(id) { state.bookmarks = state.bookmarks.includes(id) ? state.bookmarks.filter((x) => x !== id) : [...state.bookmarks, id]; save(); render(); }

const artifactBranch = 'campus-il-extraction-artifacts';
const artifactBase = `https://raw.githubusercontent.com/kerntamar/psycho2/${artifactBranch}`;

async function loadArtifactExplanations() {
  if (state.artifactStatus === 'loaded' || state.artifactStatus === 'loading') return;
  state.artifactStatus = 'loading';
  save();
  render();
  try {
    const metadata = await fetch(`${artifactBase}/data/extracted/pdfs/metadata.json`).then((response) => response.json());
    const solutionSources = metadata.filter(isArtifactSolutionSource).slice(0, 6);
    const batches = await Promise.all(solutionSources.map(async (source) => {
      const text = await fetch(`${artifactBase}/data/extracted/pages/${source.id}.txt`).then((response) => response.text());
      return splitArtifactSolutions(text, source).slice(0, 80);
    }));
    state.artifactExplanations = batches.flat().slice(0, 300);
    state.artifactStatus = 'loaded';
  } catch (error) {
    state.artifactStatus = `error: ${error.message}`;
  }
  save();
  render();
}

function renderArtifactExplanations() {
  if (state.artifactStatus === 'idle') return '<div class="card"><p>אפשר להשתמש בחילוץ הקיים שכבר פורסם לענף artifacts, בלי להריץ שוב Bulk ingest.</p><button id="loadArtifacts">טען הסברים מהחילוץ הקיים</button></div>';
  if (state.artifactStatus === 'loading') return '<div class="card"><p>טוען הסברים רשמיים מהחילוץ הקיים...</p></div>';
  if (state.artifactStatus.startsWith('error')) return `<div class="card"><p class="bad">טעינת ההסברים נכשלה: ${state.artifactStatus}</p><button id="loadArtifacts">נסה שוב</button></div>`;
  const cards = state.artifactExplanations.slice(0, 24).map((item) => `<article class="card"><span class="tag">${item.reviewStatus}</span><h3>${item.sourceTitle} · שאלה ${item.questionNumber}</h3><p>תשובה נכונה: ${item.correctAnswer}</p><p>${item.explanation}</p><small>מקור: ${item.sourceUrl}</small></article>`).join('');
  return `<div class="card"><p>${state.artifactExplanations.length} הסברים נטענו ישירות מענף ${artifactBranch}, בלי להריץ workflow נוסף.</p></div><div class="grid">${cards}</div>`;
}

function renderSources() {
  return sourceInventory.map((source) => `<tr><td>${source.title}</td><td>${source.type}</td><td>${source.includes.join('، ')}</td><td>${source.usage}</td><td>${source.pageCount}</td><td><a href="${source.url}" target="_blank" rel="noreferrer">פתיחה</a></td></tr>`).join('');
}

function formulaCard(item) {
  const marked = state.bookmarks.includes(item.id);
  return `<article class="card"><span class="tag">${item.topic}</span><h3>${item.name}</h3><p class="formula">${item.formula}</p><p>${item.explanation}</p><p class="example">דוגמה: ${item.example}</p><small>מקור: ${item.sourceTitle}, עמוד: ${item.page} · ${item.reviewStatus}</small><br><button class="secondary mini" data-bookmark="${item.id}">${marked ? 'הסר מסימניות' : 'שמור נוסחה'}</button></article>`;
}

function renderFormulas(list = formulas) { return list.map(formulaCard).join(''); }

function renderPdfLibrary() {
  const selected = sourceInventory.find((source) => source.id === state.selectedPdfId) || sourceInventory[0];
  const buttons = sourceInventory.map((source) => `<button class="pdf-tab ${source.id === selected.id ? 'active' : ''}" data-pdf="${source.id}">${source.title}</button>`).join('');
  return `<div class="card"><p>קובצי ה־PDF הרשמיים נטענים ישירות מ־Campus IL. הם אינם מועתקים למאגר.</p><div class="pdf-tabs">${buttons}</div><div class="pdf-frame-wrap"><iframe title="${selected.title}" src="${selected.url}"></iframe></div><p class="source">מקור: ${selected.title} · ${selected.pageCount} עמודים · <a href="${selected.url}" target="_blank" rel="noreferrer">פתיחה בלשונית חדשה</a></p></div>`;
}

function renderQuestion(question) {
  const choices = question.choices.map((choice, index) => `<button class="choice" data-choice="${index}">${choice}</button>`).join('');
  const src = question.sourceType === 'official' ? `<p class="source">מקור: ${question.source.title}, עמוד: ${question.source.page}, שורות: ${question.source.lines || 'לא צוין'}</p>` : `<p class="source danger">${aiLabel}</p>`;
  return `<section class="question card"><span class="tag ${question.sourceType === 'ai' ? 'ai' : ''}">${sourceBadge(question.sourceType)}</span><h3>${question.domain} · ${question.topic} · ${question.difficulty}</h3><p>${question.text}</p><div class="choices">${choices}</div><div id="feedback"></div>${src}<button id="nextOfficial" class="secondary">שאלה רשמית הבאה</button> <button id="aiGenerate" class="secondary">צור שאלה דומה בעזרת AI</button></section>`;
}

function dashboardStats() {
  const total = state.attempts.length;
  const correct = state.attempts.filter((a) => a.correct).length;
  const pct = total ? Math.round((correct / total) * 100) : 0;
  const weak = state.attempts.filter((a) => !a.correct).map((a) => a.topic);
  return { total, correct, pct, weak: [...new Set(weak)].slice(0, 5) };
}

function renderReview() {
  const misses = state.attempts.filter((a) => !a.correct);
  if (!misses.length) return '<div class="card"><p>אין טעויות להצגה כרגע. אחרי תרגול, הטעויות יופיעו כאן לחזרה.</p></div>';
  return misses.map((m) => `<article class="card"><span class="tag ai">${m.sourceType === 'ai' ? 'AI' : 'Campus IL'}</span><h3>${m.topic}</h3><p>${m.text}</p><p class="bad feedback">התשובה שסומנה: ${m.selectedText}</p><p>${m.explanation}</p></article>`).join('');
}

function render() {
  const stats = dashboardStats();
  document.getElementById('app').innerHTML = `
  <header class="hero"><div><h1>פסיכומטרי קמפוס</h1><p>אפליקציית הכנה בעברית RTL המבוססת על קובצי PDF של Campus IL, עם הפרדה מלאה בין תוכן מקור רשמי לבין תרגול שנוצר על ידי AI.</p><div class="stats"><span>${officialContentIndex.pdfCount} קובצי PDF רשמיים</span><span>${formulas.length} נוסחאות</span><span>${englishOutline[1].items.length} נושאי אנגלית</span><span>${stats.pct}% דיוק</span></div></div><nav><a href="#pdfs">קובצי PDF</a><a href="#plan">תכנית לימוד</a><a href="#practice">תרגול</a><a href="#artifact-explanations">הסברים רשמיים</a><a href="#formulas">דף נוסחאות</a><a href="#review">טעויות</a><a href="#sources">מקורות</a></nav></header>
  <main>
    <section class="grid"><article class="card"><h2>כלל מקור רשמי</h2><p>תוכן רשמי מוצג רק עם מקור PDF. שאלות AI מסומנות בנפרד.</p></article><article class="card"><h2>מצב האפליקציה</h2><p>כוללת ספריית PDF, דף נוסחאות, תרגול AI מסומן, חזרה על טעויות, סטטיסטיקה ותכנית לימוד.</p></article><article class="card"><h2>התקדמות</h2><p>${stats.total} ניסיונות · ${stats.correct} נכונות · ${stats.pct}% דיוק</p><button class="secondary mini" id="resetProgress">איפוס התקדמות</button></article></section>
    <section id="pdfs"><h2>ספריית PDF רשמית</h2>${renderPdfLibrary()}</section>
    <section id="official-index"><h2>אינדקס תוכן מכל ה־PDFים</h2><div class="grid">${officialContentIndex.records.slice(0, 24).map((item) => `<article class="card"><span class="tag">${item.domain}</span><h3>${item.title}</h3><p>${item.extractedLines} שורות טקסט חולצו · ${item.extractedCharacters} תווים</p><small>${item.previewHeadings.slice(0, 3).join(' · ')}</small></article>`).join('')}</div></section>
    <section id="plan"><h2>תכנית לימוד לפי נושא</h2><div class="grid">${topicPlan.map((topic) => `<article class="card"><span class="tag">${topic.domain}</span><h3>${topic.title}</h3><ul>${topic.tasks.map((task) => `<li>${task}</li>`).join('')}</ul></article>`).join('')}</div></section>
    <section id="practice"><h2>מצב תרגול</h2>${renderQuestion(state.currentQuestion)}</section>
    <section id="artifact-explanations"><h2>הסברים רשמיים מהחילוץ הקיים</h2>${renderArtifactExplanations()}</section>
    <section id="formulas"><h2>דף נוסחאות</h2><input id="formulaSearch" placeholder="חיפוש נוסחה או נושא"><div id="formulaList" class="grid">${renderFormulas()}</div></section>
    <section id="english"><h2>מפת לימוד אנגלית</h2><div class="grid">${englishOutline.map((section) => `<article class="card"><span class="tag">עמוד ${section.page}</span><h3>${section.title}</h3><p>${section.items.join('، ')}</p></article>`).join('')}</div></section>
    <section id="review"><h2>חזרה על טעויות</h2>${renderReview()}</section>
    <section id="dashboard"><h2>לוח התקדמות</h2><div class="card"><p>נושאים חלשים: ${stats.weak.length ? stats.weak.join('، ') : 'אין עדיין מספיק נתונים'}</p><p>נוסחאות שמורות: ${state.bookmarks.length}</p></div></section>
    <section id="sources"><h2>מקורות</h2><table><thead><tr><th>כותרת</th><th>סוג</th><th>כולל</th><th>שימוש</th><th>עמודים</th><th>קישור</th></tr></thead><tbody>${renderSources()}</tbody></table></section>
  </main>`;
  bindEvents();
}

function bindEvents() {
  document.querySelectorAll('[data-choice]').forEach((button) => button.addEventListener('click', () => {
    const q = state.currentQuestion;
    const selected = Number(button.dataset.choice);
    const correct = selected === q.correctIndex;
    state.attempts.push({ id: q.id, text: q.text, topic: q.topic, sourceType: q.sourceType, selectedText: q.choices[selected], correct, explanation: q.explanation, at: new Date().toISOString() });
    save();
    document.getElementById('feedback').innerHTML = `<div class="feedback ${correct ? 'ok' : 'bad'}">${correct ? 'נכון' : 'לא נכון'} · ${q.explanation}</div>`;
  }));
  document.querySelectorAll('[data-pdf]').forEach((button) => button.addEventListener('click', () => { state.selectedPdfId = button.dataset.pdf; save(); render(); }));
  document.querySelectorAll('[data-bookmark]').forEach((button) => button.addEventListener('click', () => toggleBookmark(button.dataset.bookmark)));
  document.getElementById('nextOfficial').addEventListener('click', nextOfficialQuestion);
  document.getElementById('aiGenerate').addEventListener('click', nextAiQuestion);
  document.getElementById('resetProgress').addEventListener('click', resetProgress);
  document.getElementById('loadArtifacts')?.addEventListener('click', () => { state.artifactStatus = 'idle'; loadArtifactExplanations(); });
  document.getElementById('formulaSearch').addEventListener('input', (event) => {
    const term = event.target.value.trim();
    const filtered = formulas.filter((item) => `${item.name} ${item.topic} ${item.formula} ${item.explanation}`.includes(term));
    document.getElementById('formulaList').innerHTML = renderFormulas(filtered);
    document.querySelectorAll('[data-bookmark]').forEach((button) => button.addEventListener('click', () => toggleBookmark(button.dataset.bookmark)));
  });
}

render();
