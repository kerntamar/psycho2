export const sourceInventory = [
  { title: 'קבצים להורדה | קורס הפסיכומטרי של המדינה', url: 'https://courses.campus.gov.il/courses/course-v1%3AMSE%2BGOV_PsychometryHe%2B2018_1/c360bdbb470643c5aaa5e5aa96bc5c8e/', type: 'עמוד אינדקס', includes: ['דפי סיכום', 'מילונים', 'דפי עזר', 'קישורים לקובצי PDF'], usage: 'נקודת כניסה לאיתור קובצי PDF רשמיים של Campus IL' },
  { title: 'דפי סיכום חשיבה כמותית', url: 'https://courses.campus.gov.il/assets/courseware/v1/1cc54b2362123fe3bbeed5f5673e8134/asset-v1%3AMSE%2BGOV_PsychometryHe%2B2018_1%2Btype%40asset%2Bblock/%D7%94%D7%A4%D7%A1%D7%99%D7%9B%D7%95%D7%9E%D7%98%D7%A8%D7%99_%D7%A9%D7%9C_%D7%94%D7%9E%D7%93%D7%99%D7%A0%D7%94_-_%D7%93%D7%A4%D7%99_%D7%A1%D7%99%D7%9B%D7%95%D7%9D_%D7%97%D7%A9%D7%99%D7%91%D7%94_%D7%9B%D7%9E%D7%95%D7%AA%D7%99%D7%AA.pdf', type: 'PDF', includes: ['נוסחאות', 'כללים', 'חשיבה כמותית'], usage: 'דף נוסחאות ומאגר כללים ללימוד ולחיפוש' },
  { title: 'יסודות אנגלית', url: 'https://courses.campus.gov.il/assets/courseware/v1/8656116ac97b91529cd7333ceb2eb0e5/asset-v1%3AMSE%2BGOV_PsychometryHe%2B2018_1%2Btype%40asset%2Bblock/03_%D7%A1%D7%A4%D7%A8_%D7%9E%D7%9B%D7%A8%D7%96_%D7%99%D7%A1%D7%95%D7%93%D7%95%D7%AA_%D7%90%D7%A0%D7%92%D7%9C%D7%99%D7%AA.pdf', type: 'PDF', includes: ['אנגלית', 'הסברים', 'תרגול'], usage: 'מקור רשמי לחומרי אנגלית' },
  { title: 'פתרונות - סימולציה קמפוס 1', url: 'https://courses.campus.gov.il/assets/courseware/v1/8c40c27fc38f5abf86398ada0ca048d2/asset-v1%3AMSE%2BGOV_PsychometryHe%2B2018_1%2Btype%40asset%2Bblock/%D7%A4%D7%AA%D7%A8%D7%95%D7%A0%D7%95%D7%AA_%D7%A1%D7%99%D7%9E%D7%95%D7%9C%D7%A6%D7%99%D7%94_1.pdf', type: 'PDF', includes: ['פתרונות', 'הסברים', 'סימולציה'], usage: 'מקור להסברי פתרונות ולבדיקת תשובות' },
  { title: 'פתרונות - סימולציה קמפוס 2', url: 'https://courses.campus.gov.il/assets/courseware/v1/4724121ef378bc05bb49eaa25bda93e0/asset-v1%3AMSE%2BGOV_PsychometryHe%2B2018_1%2Btype%40asset%2Bblock/%D7%A4%D7%AA%D7%A8%D7%95%D7%A0%D7%95%D7%AA_%D7%A1%D7%99%D7%9E%D7%95%D7%9C%D7%A6%D7%99%D7%94_2.pdf', type: 'PDF', includes: ['פתרונות', 'הסברים', 'סימולציה'], usage: 'מקור נוסף להסברי פתרונות' }
];

export const formulas = [
  { name: 'אחוז מתוך כמות', topic: 'אחוזים', formula: 'חלק = שלם × אחוז / 100', explanation: 'משמש למציאת ערך חלקי מתוך שלם לפי אחוז נתון.', sourceTitle: 'דפי סיכום חשיבה כמותית', page: 'לא סווג עדיין' },
  { name: 'ממוצע', topic: 'ממוצעים', formula: 'ממוצע = סכום האיברים / מספר האיברים', explanation: 'כלי בסיסי בשאלות ממוצעים והשוואות.', sourceTitle: 'דפי סיכום חשיבה כמותית', page: 'לא סווג עדיין' },
  { name: 'דרך, מהירות וזמן', topic: 'בעיות תנועה', formula: 'דרך = מהירות × זמן', explanation: 'נוסחת יסוד לפתרון בעיות תנועה.', sourceTitle: 'דפי סיכום חשיבה כמותית', page: 'לא סווג עדיין' }
];

export const sampleQuestion = {
  id: 'official-demo-001', sourceType: 'official', domain: 'חשיבה כמותית', topic: 'אחוזים', difficulty: 'בינוני',
  text: 'שאלת הדגמה למבנה המערכת בלבד. יש לייבא שאלות רשמיות מקובצי PDF של Campus IL לפני שימוש לימודי.',
  choices: ['תשובה 1', 'תשובה 2', 'תשובה 3', 'תשובה 4'], correctIndex: 1,
  source: { title: 'דפי סיכום חשיבה כמותית', page: 'לא סווג עדיין', url: sourceInventory[1].url },
  explanation: 'הסבר רשמי יוצג רק לאחר חילוץ מקובץ PDF מקור.'
};
