import { sourceInventory, formulas, englishOutline, topicPlan, aiPracticeBank, officialQuestions, sampleQuestion } from './data.js';
import { officialContentIndex as bundledOfficialContentIndex, OFFICIAL_CATALOG_URL, OFFICIAL_EXPLANATIONS_PREVIEW_URL, OFFICIAL_FORMULA_CANDIDATES_URL, OFFICIAL_REVIEW_STATUS } from './officialData.js';

const aiLabel = 'שאלה זו נוצרה על ידי AI ואינה שאלה רשמית ממבחני המרכז הארצי או Campus IL';
const storeKey = 'psycho2-state-v1';
const state = JSON.parse(localStorage.getItem(storeKey) || '{}');
let officialContentIndex = bundledOfficialContentIndex;
let officialExplanations = [];
let officialFormulaCandidates = [];
let officialArtifactError = '';
Object.assign(state, { selectedPdfId: state.selectedPdfId || sourceInventory[0].id, practiceIndex: state.practiceIndex || 0, officialIndex: state.officialIndex || 0, currentQuestion: state.currentQuestion || sampleQuestion, attempts: state.attempts || [], bookmarks: state.bookmarks || [], officialFilters: state.officialFilters || { domain: '', sourceTitle: '', reviewStatus: '' } });
if (state.currentQuestion.text?.includes('שאלת הדגמה')) { state.currentQuestion = sampleQuestion; save(); }


function escapeHtml(value = '') {
  return String(value).replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
}

function normalizeRecordStatus(record) {
  return record.reviewStatus || record.status || OFFICIAL_REVIEW_STATUS;
}

function sourceTitleFor(record) {
  return record.sourcePdfTitle || record.sourceTitle || record.pdfTitle || record.title || record.sourcePdfId || 'מקור PDF לא צוין';
}

function questionNumberFor(record) {
  return record.questionNumber || record.question || record.questionId || record.id || 'לא צוין';
}

function explanationTextFor(record) {
  return record.explanationText || record.explanation || record.text || record.rawText || 'הסבר לא זוהה בתצוגה המקדימה.';
}

function correctAnswerFor(record) {
  return record.correctAnswer || record.answer || record.correctChoice || record.correctIndex || 'לא צוין';
}

function uniqueOptions(items, getValue) {
  return [...new Set(items.map(getValue).filter(Boolean))].sort((a, b) => String(a).localeCompare(String(b), 'he'));
}

function save() { localStorage.setItem(storeKey, JSON.stringify(state)); }
function sourceBadge(type) { return type === 'official' ? 'שאלה רשמית ממקור Campus IL' : aiLabel; }
function nextAiQuestion() { const q = aiPracticeBank[state.practiceIndex % aiPracticeBank.length]; state.practiceIndex += 1; state.currentQuestion = q; save(); render(); }
function nextOfficialQuestion() { const q = officialQuestions[state.officialIndex % officialQuestions.length]; state.officialIndex += 1; state.currentQuestion = q; save(); render(); }
function resetProgress() { state.attempts = []; state.currentQuestion = sampleQuestion; save(); render(); }
function toggleBookmark(id) { state.bookmarks = state.bookmarks.includes(id) ? state.bookmarks.filter((x) => x !== id) : [...state.bookmarks, id]; save(); render(); }

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

function officialStatsMarkup() {
  return `<span>${officialContentIndex.pdfCount} קובצי PDF רשמיים</span><span>${officialContentIndex.solutionPdfCount || 0} קובצי פתרונות</span><span>${officialContentIndex.parsedExplanationCount || 0} הסברים נותחו</span><span>${officialContentIndex.formulaCandidateCount || 0} מועמדי נוסחאות</span>`;
}

async function fetchOfficialJson(url) {
  const response = await fetch(url, { cache: 'no-store' });
  if (!response.ok) throw new Error(`${url} fetch failed: ${response.status}`);
  return response.json();
}

async function loadOfficialArtifacts() {
  try {
    const [catalog, explanations, formulaCandidates] = await Promise.all([
      fetchOfficialJson(OFFICIAL_CATALOG_URL),
      fetchOfficialJson(OFFICIAL_EXPLANATIONS_PREVIEW_URL),
      fetchOfficialJson(OFFICIAL_FORMULA_CANDIDATES_URL)
    ]);
    officialContentIndex = { ...bundledOfficialContentIndex, ...catalog };
    officialExplanations = Array.isArray(explanations) ? explanations : explanations.records || [];
    officialFormulaCandidates = Array.isArray(formulaCandidates) ? formulaCandidates : formulaCandidates.records || [];
    officialArtifactError = '';
    render();
  } catch (error) {
    officialArtifactError = 'לא הצלחנו לטעון כרגע את ארטיפקטי Campus IL הרשמיים. האפליקציה ממשיכה לפעול עם תקציר מקומי ותרגול AI מסומן בנפרד.';
    console.warn('Using bundled official catalog fallback from campus-il-extraction-artifacts summary', error);
    render();
  }
}

function artifactStatusMarkup() {
  return officialArtifactError ? `<div class="card warning"><strong>טעינת תוכן רשמי</strong><p>${officialArtifactError}</p></div>` : `<div class="card success"><strong>תוכן רשמי נטען דינמית</strong><p>הנתונים נטענים מ־${OFFICIAL_EXPLANATIONS_PREVIEW_URL} ומ־${OFFICIAL_FORMULA_CANDIDATES_URL}. כל רשומה אוטומטית מסומנת כ־${OFFICIAL_REVIEW_STATUS} עד בדיקה אנושית.</p></div>`;
}

function renderSelect(id, label, values, selected) {
  return `<label>${label}<select id="${id}"><option value="">הכול</option>${values.map((value) => `<option value="${escapeHtml(value)}" ${value === selected ? 'selected' : ''}>${escapeHtml(value)}</option>`).join('')}</select></label>`;
}

function renderOfficialExplanationsBrowser() {
  const filters = state.officialFilters;
  const records = officialExplanations.map((record) => ({ ...record, reviewStatus: normalizeRecordStatus(record) }));
  const filtered = records.filter((record) => (!filters.domain || record.domain === filters.domain) && (!filters.sourceTitle || sourceTitleFor(record) === filters.sourceTitle) && (!filters.reviewStatus || record.reviewStatus === filters.reviewStatus));
  const domains = uniqueOptions(records, (record) => record.domain || 'כללי');
  const sources = uniqueOptions(records, sourceTitleFor);
  const statuses = uniqueOptions(records, (record) => record.reviewStatus);
  const empty = records.length ? 'אין רשומות שתואמות לסינון הנוכחי.' : 'עדיין אין רשומות הסבר זמינות בארטיפקט התצוגה המקדימה.';
  return `<section id="official-explanations"><h2>דפדפן הסברים רשמיים שחולצו אוטומטית</h2><p class="source">תוכן Campus IL רשמי שחולץ אוטומטית ומסומן לבדיקת איכות: ${OFFICIAL_REVIEW_STATUS}.</p><div class="filters">${renderSelect('officialDomainFilter', 'תחום', domains, filters.domain)}${renderSelect('officialSourceFilter', 'מקור PDF', sources, filters.sourceTitle)}${renderSelect('officialStatusFilter', 'סטטוס סקירה', statuses, filters.reviewStatus)}</div><div class="grid">${filtered.length ? filtered.slice(0, 60).map((record) => `<article class="card official-card"><span class="tag">${escapeHtml(record.domain || 'כללי')}</span><h3>${escapeHtml(sourceTitleFor(record))}</h3><p><strong>מספר שאלה:</strong> ${escapeHtml(questionNumberFor(record))}</p><p><strong>תשובה נכונה:</strong> ${escapeHtml(correctAnswerFor(record))}</p><p>${escapeHtml(explanationTextFor(record))}</p><small>סטטוס סקירה: ${escapeHtml(record.reviewStatus)}</small></article>`).join('') : `<article class="card"><p>${empty}</p></article>`}</div></section>`;
}

function renderOfficialFormulaCandidates() {
  const records = officialFormulaCandidates.map((record) => ({ ...record, reviewStatus: normalizeRecordStatus(record) }));
  return `<section id="official-formulas"><h2>מועמדי נוסחאות וכללים רשמיים שחולצו</h2><p class="source">מופרד מדף הנוסחאות הלימודי ומסומן כטעון בדיקה.</p><div class="grid">${records.length ? records.slice(0, 60).map((record) => `<article class="card"><span class="tag">${escapeHtml(record.domain || record.topic || 'נוסחה/כלל')}</span><p class="formula">${escapeHtml(record.formula || record.rule || record.text || record.candidateText || 'טקסט מועמד לא זמין')}</p><p>מקור PDF: ${escapeHtml(sourceTitleFor(record))}</p><small>סטטוס סקירה: ${escapeHtml(record.reviewStatus)}</small></article>`).join('') : `<article class="card"><p>עדיין אין מועמדי נוסחאות בארטיפקט התצוגה המקדימה.</p></article>`}</div></section>`;
}

function render() {
  const stats = dashboardStats();
  document.getElementById('app').innerHTML = `
  <header class="hero"><div><h1>פסיכומטרי קמפוס</h1><p>אפליקציית הכנה בעברית RTL המבוססת על קובצי PDF של Campus IL, עם הפרדה מלאה בין תוכן מקור רשמי לבין תרגול שנוצר על ידי AI.</p><div class="stats">${officialStatsMarkup()}<span>${stats.pct}% דיוק</span></div></div><nav><a href="#pdfs">קובצי PDF</a><a href="#plan">תכנית לימוד</a><a href="#practice">תרגול</a><a href="#formulas">דף נוסחאות</a><a href="#review">טעויות</a><a href="#sources">מקורות</a></nav></header>
  <main>
    <section class="grid"><article class="card"><h2>כלל מקור רשמי</h2><p>תוכן רשמי מוצג רק עם מקור PDF. שאלות AI מסומנות בנפרד.</p></article><article class="card"><h2>מצב האפליקציה</h2><p>כוללת ספריית PDF, דף נוסחאות, תרגול AI מסומן, חזרה על טעויות, סטטיסטיקה ותכנית לימוד.</p></article><article class="card"><h2>התקדמות</h2><p>${stats.total} ניסיונות · ${stats.correct} נכונות · ${stats.pct}% דיוק</p><button class="secondary mini" id="resetProgress">איפוס התקדמות</button></article></section>
    ${artifactStatusMarkup()}
    <section id="pdfs"><h2>ספריית PDF רשמית</h2>${renderPdfLibrary()}</section>
    <section id="official-index"><h2>אינדקס תוכן מכל ה־PDFים</h2><div class="grid">${officialContentIndex.records.slice(0, 24).map((item) => `<article class="card"><span class="tag">${item.domain}</span><h3>${item.title}</h3><p>סטטוס סקירה: ${item.reviewStatus || 'לא צוין'} · מקור ענף: ${officialContentIndex.artifactBranch}</p></article>`).join('')}</div></section>
    ${renderOfficialExplanationsBrowser()}
    ${renderOfficialFormulaCandidates()}
    <section id="plan"><h2>תכנית לימוד לפי נושא</h2><div class="grid">${topicPlan.map((topic) => `<article class="card"><span class="tag">${topic.domain}</span><h3>${topic.title}</h3><ul>${topic.tasks.map((task) => `<li>${task}</li>`).join('')}</ul></article>`).join('')}</div></section>
    <section id="practice"><h2>מצב תרגול</h2>${renderQuestion(state.currentQuestion)}</section>
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
  ['officialDomainFilter', 'officialSourceFilter', 'officialStatusFilter'].forEach((id) => document.getElementById(id)?.addEventListener('change', (event) => {
    const key = id === 'officialDomainFilter' ? 'domain' : id === 'officialSourceFilter' ? 'sourceTitle' : 'reviewStatus';
    state.officialFilters[key] = event.target.value;
    save();
    render();
  }));
  document.getElementById('formulaSearch').addEventListener('input', (event) => {
    const term = event.target.value.trim();
    const filtered = formulas.filter((item) => `${item.name} ${item.topic} ${item.formula} ${item.explanation}`.includes(term));
    document.getElementById('formulaList').innerHTML = renderFormulas(filtered);
    document.querySelectorAll('[data-bookmark]').forEach((button) => button.addEventListener('click', () => toggleBookmark(button.dataset.bookmark)));
  });
}

render();
loadOfficialArtifacts();
