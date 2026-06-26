export const sourceInventory = [
  { id: 'quant-summary', title: 'הפסיכומטרי של המדינה - דפי סיכום חשיבה כמותית', url: 'https://courses.campus.gov.il/assets/courseware/v1/1cc54b2362123fe3bbeed5f5673e8134/asset-v1%3AMSE%2BGOV_PsychometryHe%2B2018_1%2Btype%40asset%2Bblock/%D7%94%D7%A4%D7%A1%D7%99%D7%9B%D7%95%D7%9E%D7%98%D7%A8%D7%99_%D7%A9%D7%9C_%D7%94%D7%9E%D7%93%D7%99%D7%A0%D7%94_-_%D7%93%D7%A4%D7%99_%D7%A1%D7%99%D7%9B%D7%95%D7%9D_%D7%97%D7%A9%D7%99%D7%91%D7%94_%D7%9B%D7%9E%D7%95%D7%AA%D7%99%D7%AA.pdf', type: 'PDF', pageCount: 46, includes: ['נוסחאות', 'כללים', 'חשיבה כמותית'], usage: 'דף נוסחאות ומאגר כללים ללימוד ולחיפוש' },
  { id: 'english-foundations', title: 'ספר מכרז יסודות אנגלית', url: 'https://courses.campus.gov.il/assets/courseware/v1/8656116ac97b91529cd7333ceb2eb0e5/asset-v1%3AMSE%2BGOV_PsychometryHe%2B2018_1%2Btype%40asset%2Bblock/03_%D7%A1%D7%A4%D7%A8_%D7%9E%D7%9B%D7%A8%D7%96_%D7%99%D7%A1%D7%95%D7%93%D7%95%D7%AA_%D7%90%D7%A0%D7%92%D7%9C%D7%99%D7%AA.pdf', type: 'PDF', pageCount: 234, includes: ['אנגלית', 'הסברים', 'תרגול'], usage: 'מקור רשמי לחומרי אנגלית' },
  { id: 'simulation-1-solutions', title: 'פתרונות סימולציה 1', url: 'https://courses.campus.gov.il/assets/courseware/v1/8c40c27fc38f5abf86398ada0ca048d2/asset-v1%3AMSE%2BGOV_PsychometryHe%2B2018_1%2Btype%40asset%2Bblock/%D7%A4%D7%AA%D7%A8%D7%95%D7%A0%D7%95%D7%AA_%D7%A1%D7%99%D7%9E%D7%95%D7%9C%D7%A6%D7%99%D7%94_1.pdf', type: 'PDF', pageCount: 87, includes: ['פתרונות', 'הסברים', 'סימולציה'], usage: 'מקור להסברי פתרונות ולבדיקת תשובות' },
  { id: 'simulation-2-solutions', title: 'פתרונות סימולציה 2', url: 'https://courses.campus.gov.il/assets/courseware/v1/4724121ef378bc05bb49eaa25bda93e0/asset-v1%3AMSE%2BGOV_PsychometryHe%2B2018_1%2Btype%40asset%2Bblock/%D7%A4%D7%AA%D7%A8%D7%95%D7%A0%D7%95%D7%AA_%D7%A1%D7%99%D7%9E%D7%95%D7%9C%D7%A6%D7%99%D7%94_2.pdf', type: 'PDF', pageCount: 76, includes: ['פתרונות', 'הסברים', 'סימולציה'], usage: 'מקור נוסף להסברי פתרונות' }
];

export const formulas = [
  { id: 'formula-percent-part', name: 'אחוז מתוך כמות', topic: 'אחוזים', formula: 'חלק = שלם × אחוז / 100', explanation: 'נוסחה בסיסית לחישוב חלק יחסי מתוך שלם.', sourceTitle: 'הפסיכומטרי של המדינה - דפי סיכום חשיבה כמותית', page: 'לא חולץ אוטומטית', reviewStatus: 'דורש בדיקת עמוד PDF' },
  { id: 'formula-average', name: 'ממוצע', topic: 'ממוצעים', formula: 'ממוצע = סכום האיברים / מספר האיברים', explanation: 'נוסחת יסוד למציאת ממוצע חשבוני.', sourceTitle: 'הפסיכומטרי של המדינה - דפי סיכום חשיבה כמותית', page: 'לא חולץ אוטומטית', reviewStatus: 'דורש בדיקת עמוד PDF' },
  { id: 'formula-distance-speed-time', name: 'דרך, מהירות וזמן', topic: 'בעיות תנועה', formula: 'דרך = מהירות × זמן', explanation: 'קשר בסיסי בין דרך, מהירות וזמן.', sourceTitle: 'הפסיכומטרי של המדינה - דפי סיכום חשיבה כמותית', page: 'לא חולץ אוטומטית', reviewStatus: 'דורש בדיקת עמוד PDF' }
];

export const englishOutline = [
  { page: 3, title: 'מבנה ספר יסודות אנגלית', items: ['אוצר מילים בסיסי', 'דקדוק והגייה', 'מקראה'] },
  { page: 5, title: 'נושאי יסודות אנגלית', items: ['מילות שאלה', 'כינויי גוף', 'מילים מבלבלות', 'פעלים מורכבים', 'ביטויים', 'מילות קישור', 'חלקי דיבר', 'כללי הגייה', 'מבנה משפט', 'סדר המילים במשפט', 'שלילה', 'סביל', 'מבני השוואה', 'ביטויים תיאוריים', 'קטעי קריאה'] }
];

export const sampleQuestion = {
  id: 'official-demo-001', sourceType: 'official', domain: 'חשיבה כמותית', topic: 'אחוזים', difficulty: 'בינוני',
  text: 'שאלת הדגמה למבנה המערכת בלבד. יש לייבא שאלות רשמיות מקובצי PDF של Campus IL לפני שימוש לימודי.',
  choices: ['תשובה 1', 'תשובה 2', 'תשובה 3', 'תשובה 4'], correctIndex: 1,
  source: { title: 'הפסיכומטרי של המדינה - דפי סיכום חשיבה כמותית', page: 'לא חולץ אוטומטית', url: sourceInventory[0].url },
  explanation: 'הסבר רשמי יוצג רק לאחר חילוץ מקובץ PDF מקור.'
};
