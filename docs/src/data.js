export const sourceInventory = [
  { id: 'quant-summary', title: 'הפסיכומטרי של המדינה - דפי סיכום חשיבה כמותית', url: 'https://courses.campus.gov.il/assets/courseware/v1/1cc54b2362123fe3bbeed5f5673e8134/asset-v1%3AMSE%2BGOV_PsychometryHe%2B2018_1%2Btype%40asset%2Bblock/%D7%94%D7%A4%D7%A1%D7%99%D7%9B%D7%95%D7%9E%D7%98%D7%A8%D7%99_%D7%A9%D7%9C_%D7%94%D7%9E%D7%93%D7%99%D7%A0%D7%94_-_%D7%93%D7%A4%D7%99_%D7%A1%D7%99%D7%9B%D7%95%D7%9D_%D7%97%D7%A9%D7%99%D7%91%D7%94_%D7%9B%D7%9E%D7%95%D7%AA%D7%99%D7%AA.pdf', type: 'PDF', pageCount: 46, includes: ['נוסחאות', 'כללים', 'חשיבה כמותית'], usage: 'דף נוסחאות ומאגר כללים ללימוד ולחיפוש' },
  { id: 'english-foundations', title: 'ספר מכרז יסודות אנגלית', url: 'https://courses.campus.gov.il/assets/courseware/v1/8656116ac97b91529cd7333ceb2eb0e5/asset-v1%3AMSE%2BGOV_PsychometryHe%2B2018_1%2Btype%40asset%2Bblock/03_%D7%A1%D7%A4%D7%A8_%D7%9E%D7%9B%D7%A8%D7%96_%D7%99%D7%A1%D7%95%D7%93%D7%95%D7%AA_%D7%90%D7%A0%D7%92%D7%9C%D7%99%D7%AA.pdf', type: 'PDF', pageCount: 234, includes: ['אנגלית', 'הסברים', 'תרגול'], usage: 'מקור רשמי לחומרי אנגלית' },
  { id: 'simulation-1-solutions', title: 'פתרונות סימולציה 1', url: 'https://courses.campus.gov.il/assets/courseware/v1/8c40c27fc38f5abf86398ada0ca048d2/asset-v1%3AMSE%2BGOV_PsychometryHe%2B2018_1%2Btype%40asset%2Bblock/%D7%A4%D7%AA%D7%A8%D7%95%D7%A0%D7%95%D7%AA_%D7%A1%D7%99%D7%9E%D7%95%D7%9C%D7%A6%D7%99%D7%94_1.pdf', type: 'PDF', pageCount: 87, includes: ['פתרונות', 'הסברים', 'סימולציה'], usage: 'מקור להסברים ולבדיקת תשובות' },
  { id: 'simulation-2-solutions', title: 'פתרונות סימולציה 2', url: 'https://courses.campus.gov.il/assets/courseware/v1/4724121ef378bc05bb49eaa25bda93e0/asset-v1%3AMSE%2BGOV_PsychometryHe%2B2018_1%2Btype%40asset%2Bblock/%D7%A4%D7%AA%D7%A8%D7%95%D7%A0%D7%95%D7%AA_%D7%A1%D7%99%D7%9E%D7%95%D7%9C%D7%A6%D7%99%D7%94_2.pdf', type: 'PDF', pageCount: 76, includes: ['פתרונות', 'הסברים', 'סימולציה'], usage: 'מקור נוסף להסברים ולבדיקת תשובות' }
];

const sourceTitle = 'הפסיכומטרי של המדינה - דפי סיכום חשיבה כמותית';
export const formulas = [
  { id: 'percent-part', name: 'אחוז מתוך כמות', topic: 'אחוזים', formula: 'חלק = שלם × אחוז / 100', explanation: 'מחשבים את החלק היחסי מתוך הכמות השלמה.', example: '30% מתוך 80 הם 24.', sourceTitle, page: 'לא חולץ אוטומטית', reviewStatus: 'דורש בדיקת עמוד PDF' },
  { id: 'percent-change', name: 'שינוי באחוזים', topic: 'אחוזים', formula: 'ערך חדש = ערך מקורי × (100 ± אחוז השינוי) / 100', explanation: 'שימושי בעלייה או ירידה באחוזים.', example: 'אחרי עלייה של 20%: כופלים ב־1.2.', sourceTitle, page: 'לא חולץ אוטומטית', reviewStatus: 'דורש בדיקת עמוד PDF' },
  { id: 'average', name: 'ממוצע', topic: 'ממוצעים', formula: 'ממוצע = סכום האיברים / מספר האיברים', explanation: 'אפשר גם למצוא סכום באמצעות ממוצע × מספר איברים.', example: 'ממוצע 5 מספרים הוא 7, לכן סכומם 35.', sourceTitle, page: 'לא חולץ אוטומטית', reviewStatus: 'דורש בדיקת עמוד PDF' },
  { id: 'ratio', name: 'יחס', topic: 'יחסים', formula: 'אם היחס a:b, החלקים הם ax ו־bx', explanation: 'מייצגים את הגורם המשותף באמצעות x.', example: 'יחס 2:3 וסכום 20 נותנים 2x+3x=20.', sourceTitle, page: 'לא חולץ אוטומטית', reviewStatus: 'דורש בדיקת עמוד PDF' },
  { id: 'speed', name: 'דרך, מהירות וזמן', topic: 'בעיות תנועה', formula: 'דרך = מהירות × זמן', explanation: 'אפשר לבודד כל אחד משלושת הגדלים לפי הצורך.', example: 'מהירות 60 קמ״ש במשך 2 שעות = 120 ק״מ.', sourceTitle, page: 'לא חולץ אוטומטית', reviewStatus: 'דורש בדיקת עמוד PDF' },
  { id: 'work', name: 'הספק', topic: 'בעיות הספק', formula: 'עבודה = הספק × זמן', explanation: 'כאשר כמה גורמים עובדים יחד, מחברים הספקים.', example: 'אם עובד מסיים ב־4 שעות, ההספק שלו הוא 1/4 עבודה לשעה.', sourceTitle, page: 'לא חולץ אוטומטית', reviewStatus: 'דורש בדיקת עמוד PDF' },
  { id: 'rectangle-area', name: 'שטח מלבן', topic: 'גיאומטריה', formula: 'שטח = אורך × רוחב', explanation: 'נוסחת בסיס לשאלות שטחים.', example: 'מלבן 4×7 הוא בעל שטח 28.', sourceTitle, page: 'לא חולץ אוטומטית', reviewStatus: 'דורש בדיקת עמוד PDF' },
  { id: 'triangle-area', name: 'שטח משולש', topic: 'גיאומטריה', formula: 'שטח = צלע × גובה לצלע / 2', explanation: 'הגובה חייב להיות מאונך לצלע שאליה הוא יורד.', example: 'בסיס 10 וגובה 6 נותנים שטח 30.', sourceTitle, page: 'לא חולץ אוטומטית', reviewStatus: 'דורש בדיקת עמוד PDF' },
  { id: 'circle-area', name: 'שטח מעגל', topic: 'גיאומטריה', formula: 'שטח = πr²', explanation: 'r הוא רדיוס המעגל.', example: 'ברדיוס 3, השטח הוא 9π.', sourceTitle, page: 'לא חולץ אוטומטית', reviewStatus: 'דורש בדיקת עמוד PDF' },
  { id: 'circle-circumference', name: 'היקף מעגל', topic: 'גיאומטריה', formula: 'היקף = 2πr', explanation: 'אפשר להשתמש גם בנוסחה πd כאשר d הוא הקוטר.', example: 'ברדיוס 5, ההיקף הוא 10π.', sourceTitle, page: 'לא חולץ אוטומטית', reviewStatus: 'דורש בדיקת עמוד PDF' },
  { id: 'pythagoras', name: 'משפט פיתגורס', topic: 'גיאומטריה', formula: 'a² + b² = c²', explanation: 'במשולש ישר־זווית, c היא היתר.', example: 'צלעות 3 ו־4 נותנות יתר 5.', sourceTitle, page: 'לא חולץ אוטומטית', reviewStatus: 'דורש בדיקת עמוד PDF' },
  { id: 'probability', name: 'הסתברות בסיסית', topic: 'הסתברות', formula: 'הסתברות = מספר תוצאות רצויות / מספר כל התוצאות האפשריות', explanation: 'כאשר כל התוצאות שוות סיכוי.', example: 'בקובייה הוגנת, ההסתברות לקבל 6 היא 1/6.', sourceTitle, page: 'לא חולץ אוטומטית', reviewStatus: 'דורש בדיקת עמוד PDF' }
];

export const englishOutline = [
  { page: 3, title: 'מבנה ספר יסודות אנגלית', items: ['אוצר מילים בסיסי', 'דקדוק והגייה', 'מקראה'] },
  { page: 5, title: 'נושאי יסודות אנגלית', items: ['מילות שאלה', 'כינויי גוף', 'מילים מבלבלות', 'פעלים מורכבים', 'ביטויים', 'מילות קישור', 'חלקי דיבר', 'כללי הגייה', 'מבנה משפט', 'סדר המילים במשפט', 'שלילה', 'סביל', 'מבני השוואה', 'ביטויים תיאוריים', 'קטעי קריאה'] }
];

export const topicPlan = [
  { domain: 'חשיבה כמותית', title: 'אחוזים ויחסים', tasks: ['חזרה על נוסחאות אחוזים', 'תרגול שינוי באחוזים', 'פתרון שאלות יחס באמצעות x'] },
  { domain: 'חשיבה כמותית', title: 'גיאומטריה', tasks: ['זיהוי נוסחה מתאימה', 'שרטוט נתונים חסרים', 'בדיקת יחידות והיקפים'] },
  { domain: 'אנגלית', title: 'יסודות אנגלית', tasks: ['מילות שאלה וכינויי גוף', 'מילות קישור', 'מבנה משפט וקטעי קריאה'] },
  { domain: 'סימולציה', title: 'חזרה מפתרונות', tasks: ['בדיקת תשובות מול פתרונות', 'סימון טעויות חוזרות', 'חזרה על נושאים חלשים'] }
];

export const aiPracticeBank = [
  { id: 'ai-percent-1', sourceType: 'ai', domain: 'חשיבה כמותית', topic: 'אחוזים', difficulty: 'קל', text: 'שאלת AI: מחיר מוצר הוא 200 ש״ח. לאחר הנחה של 15%, מה המחיר החדש?', choices: ['170', '175', '185', '190'], correctIndex: 0, explanation: '15% מתוך 200 הם 30, ולכן המחיר החדש הוא 170. שאלה זו נוצרה על ידי AI ואינה רשמית.' },
  { id: 'ai-geometry-1', sourceType: 'ai', domain: 'חשיבה כמותית', topic: 'גיאומטריה', difficulty: 'בינוני', text: 'שאלת AI: שטח משולש הוא 24 ובסיסו 8. מה גובהו לבסיס?', choices: ['3', '4', '6', '8'], correctIndex: 2, explanation: '24 = 8×h/2 ולכן h=6. שאלה זו נוצרה על ידי AI ואינה רשמית.' },
  { id: 'ai-average-1', sourceType: 'ai', domain: 'חשיבה כמותית', topic: 'ממוצעים', difficulty: 'קל', text: 'שאלת AI: ממוצע של 4 מספרים הוא 9. מה סכומם?', choices: ['13', '18', '36', '45'], correctIndex: 2, explanation: 'סכום = ממוצע × מספר איברים = 9×4 = 36. שאלה זו נוצרה על ידי AI ואינה רשמית.' }
];


export const officialQuestions = [
  {
    id: 'campus1-verbal-1', sourceType: 'official', domain: 'חשיבה מילולית', topic: 'אנלוגיות', difficulty: 'קל',
    text: 'ארון בגדים : בגד — איזו תשובה מבטאת יחס דומה?',
    choices: ['תבנית : עוגה', 'מלון : חדר', 'גינה : פרח', 'חניון : מכונית'], correctIndex: 3,
    explanation: 'ארון בגדים נועד לאחסון בגדים; באופן דומה, חניון נועד לאחסון מכוניות.',
    source: { title: 'פתרונות סימולציה קמפוס 1', url: sourceInventory[2].url, page: 9, lines: '47-52' }
  },
  {
    id: 'campus1-verbal-2', sourceType: 'official', domain: 'חשיבה מילולית', topic: 'אנלוגיות', difficulty: 'קל',
    text: 'להתערטל : עירום — איזו תשובה מבטאת יחס דומה?',
    choices: ['להתעמר : סובל', 'להתעבר : עוּבּר', 'להתגלות : עלום', 'להתבסם : שתוי'], correctIndex: 3,
    explanation: 'להתערטל פירושו להפוך לעירום; להתבסם פירושו להפוך לשתוי.',
    source: { title: 'פתרונות סימולציה קמפוס 1', url: sourceInventory[2].url, page: 9, lines: '53-58' }
  },
  {
    id: 'campus1-verbal-3', sourceType: 'official', domain: 'חשיבה מילולית', topic: 'אנלוגיות', difficulty: 'קל',
    text: 'נבוב : תוכן — איזו תשובה מבטאת יחס דומה?',
    choices: ['זול : מחיר', 'חף מפשע : אשמה', 'שובה לב : סלידה', 'מרווה : צימאון'], correctIndex: 1,
    explanation: 'נבוב הוא חסר תוכן; חף מפשע הוא חסר אשמה.',
    source: { title: 'פתרונות סימולציה קמפוס 1', url: sourceInventory[2].url, page: 9, lines: '59-64' }
  },
  {
    id: 'campus1-verbal-4', sourceType: 'official', domain: 'חשיבה מילולית', topic: 'אנלוגיות', difficulty: 'קל',
    text: 'לקלף : קליפה — איזו תשובה מבטאת יחס דומה?',
    choices: ['לאבק : אבק', 'להשריש : שורש', 'לסייד : סיד', 'למחוק : מחק'], correctIndex: 0,
    explanation: 'לקלף הוא להסיר קליפה ממשהו; לאבק הוא להסיר אבק ממשהו.',
    source: { title: 'פתרונות סימולציה קמפוס 1', url: sourceInventory[2].url, page: 9, lines: '65-70' }
  },
  {
    id: 'campus1-verbal-5', sourceType: 'official', domain: 'חשיבה מילולית', topic: 'אנלוגיות', difficulty: 'בינוני',
    text: 'נשמר : נוטר — איזו תשובה מבטאת יחס דומה?',
    choices: ['נקרא : כותב', 'נתמך : סועד', 'נזקק : תורם', 'נטווה : אורג'], correctIndex: 1,
    explanation: 'נשמר הוא מי שמישהו נוטר/שומר עליו; נתמך הוא מי שמישהו סועד/תומך בו.',
    source: { title: 'פתרונות סימולציה קמפוס 1', url: sourceInventory[2].url, page: 10, lines: '71-76' }
  },
  {
    id: 'campus1-verbal-6', sourceType: 'official', domain: 'חשיבה מילולית', topic: 'אנלוגיות', difficulty: 'בינוני',
    text: 'תחינה : ליבו נכמר — איזו תשובה מבטאת יחס דומה?',
    choices: ['פשרה : נאבק', 'תזכורת : נזכר', 'צידוק : הצטדק', 'תשלום : התמקח'], correctIndex: 1,
    explanation: 'מטרת תחינה היא לגרום למישהו שייכמר ליבו; מטרת תזכורת היא לגרום למישהו להיזכר.',
    source: { title: 'פתרונות סימולציה קמפוס 1', url: sourceInventory[2].url, page: 10, lines: '77-82' }
  },
  {
    id: 'campus1-verbal-10', sourceType: 'official', domain: 'חשיבה מילולית', topic: 'הבנה והסקה', difficulty: 'בינוני',
    text: 'באנלוגיית האקווריום: אם נפח האקווריום גדל אך הצפיפות נשארה זהה, איזו מסקנה מתאימה?',
    choices: ['מספר הדגים עלה וגודל האקווריום נותר קבוע', 'האקווריום גדל ומספר הדגים נותר קבוע', 'האקווריום גדל וגם מספר הדגים גדל', 'מספר הדגים חדל להשפיע על הצפיפות'], correctIndex: 2,
    explanation: 'כדי שצפיפות תישאר קבועה כאשר הנפח גדל, גם כמות החומר/מספר הדגים צריכה לגדול.',
    source: { title: 'פתרונות סימולציה קמפוס 1', url: sourceInventory[2].url, page: 12, lines: '164-180' }
  }

  ,{
    id: 'campus2-english-1', sourceType: 'official', domain: 'אנגלית', topic: 'Sentence Completion', difficulty: 'קל',
    text: 'In Mexico, the eastern Pacific green turtle is valued not only for its meat but also for its medicinal properties. Which answer completes the meaning?',
    choices: ['because of', 'except for', 'in addition to', 'but also for'], correctIndex: 3,
    explanation: 'המשפט מציג מבנה של not only ... but also, ולכן ההשלמה המתאימה היא but also for.',
    source: { title: 'פתרונות סימולציה קמפוס 2', url: sourceInventory[3].url, page: 9, lines: '63-68' }
  },
  {
    id: 'campus2-english-2', sourceType: 'official', domain: 'אנגלית', topic: 'Sentence Completion', difficulty: 'קל',
    text: 'Scientists can only ___ how life first began. Which word best completes the sentence?',
    choices: ['combine', 'speculate', 'remove', 'rotate'], correctIndex: 1,
    explanation: 'המשמעות המתאימה היא “לשער”; מדענים יכולים רק לשער כיצד החיים החלו.',
    source: { title: 'פתרונות סימולציה קמפוס 2', url: sourceInventory[3].url, page: 9, lines: '69-74' }
  },
  {
    id: 'campus2-english-3', sourceType: 'official', domain: 'אנגלית', topic: 'Vocabulary', difficulty: 'קל',
    text: 'The CN Tower in Toronto is a landmark visible from far away. What is the meaning of “landmark” here?',
    choices: ['external', 'inventory', 'material', 'a notable place/point'], correctIndex: 3,
    explanation: 'בהקשר זה landmark פירושו נקודת ציון או מקום בולט.',
    source: { title: 'פתרונות סימולציה קמפוס 2', url: sourceInventory[3].url, page: 10, lines: '75-80' }
  },
  {
    id: 'campus2-english-4', sourceType: 'official', domain: 'אנגלית', topic: 'Vocabulary', difficulty: 'קל',
    text: 'In ancient Rome, a desultor was a circus performer who leaped from one galloping horse to another. What does “leaped” mean?',
    choices: ['jumped', 'flame', 'schadenfreude', 'pose'], correctIndex: 0,
    explanation: 'המילה leaped פירושה זינק או קפץ.',
    source: { title: 'פתרונות סימולציה קמפוס 2', url: sourceInventory[3].url, page: 10, lines: '81-86' }
  },
  {
    id: 'campus2-english-5', sourceType: 'official', domain: 'אנגלית', topic: 'Vocabulary', difficulty: 'קל',
    text: 'During World War I, Agatha Christie worked as a nurse and tended the sick and wounded. What does “tended” mean?',
    choices: ['preferred', 'declared', 'admitted', 'cared for'], correctIndex: 3,
    explanation: 'בהקשר של אחות וחולים, tended פירושו טיפלה או השגיחה.',
    source: { title: 'פתרונות סימולציה קמפוס 2', url: sourceInventory[3].url, page: 10, lines: '87-93' }
  },
  {
    id: 'campus2-english-6', sourceType: 'official', domain: 'אנגלית', topic: 'Vocabulary', difficulty: 'קל',
    text: 'The Angora goat is bred mainly for its long, silky wool. What does “bred” mean?',
    choices: ['raised', 'swept', 'bound', 'shrunk'], correctIndex: 0,
    explanation: 'bred היא צורת עבר/סביל של breed, כלומר גודל או הורבע.',
    source: { title: 'פתרונות סימולציה קמפוס 2', url: sourceInventory[3].url, page: 10, lines: '94-99' }
  },
  {
    id: 'campus2-english-7', sourceType: 'official', domain: 'אנגלית', topic: 'Vocabulary', difficulty: 'בינוני',
    text: 'The number of sightings of the great white shark — once considered elusive — has grown. What does “elusive” mean?',
    choices: ['bitter', 'hard to find', 'profitable', 'inferior'], correctIndex: 1,
    explanation: 'elusive פירושו חמקמק או קשה לאיתור.',
    source: { title: 'פתרונות סימולציה קמפוס 2', url: sourceInventory[3].url, page: 10, lines: '100-105' }
  },
  {
    id: 'campus2-english-8', sourceType: 'official', domain: 'אנגלית', topic: 'Vocabulary', difficulty: 'בינוני',
    text: 'Large deposits of diamonds were found in the Atlantic Ocean off southwest Africa. What does “deposits” mean?',
    choices: ['hedges', 'conflicts', 'equations', 'layers/resources'], correctIndex: 3,
    explanation: 'deposits בהקשר גאולוגי הם מרבצים או שכבות של חומר.',
    source: { title: 'פתרונות סימולציה קמפוס 2', url: sourceInventory[3].url, page: 11, lines: '106-111' }
  },
  {
    id: 'campus2-english-11', sourceType: 'official', domain: 'אנגלית', topic: 'Restatements', difficulty: 'בינוני',
    text: 'Road accidents involving young drivers increase in direct proportion to the number of passengers in the car. Which restatement is closest?',
    choices: ['Accidents increase with driver age', 'Young drivers are safer alone', 'More passengers with a young driver means greater accident risk', 'Passengers are injured more often if the driver is young'], correctIndex: 2,
    explanation: 'המשפט המקורי קושר בין מספר הנוסעים ברכב לבין הסיכוי לתאונה אצל נהגים צעירים.',
    source: { title: 'פתרונות סימולציה קמפוס 2', url: sourceInventory[3].url, page: 12, lines: '137-148' }
  },
  {
    id: 'campus2-english-12', sourceType: 'official', domain: 'אנגלית', topic: 'Restatements', difficulty: 'בינוני',
    text: 'Americans tend to overestimate the role of individualism in their country’s economic past. Which restatement is closest?',
    choices: ['Individualism was central despite what Americans think', 'Americans valued it more in the past than today', 'Americans think it no longer exists', 'Americans think individualism had a bigger role than it really had'], correctIndex: 3,
    explanation: 'overestimate פירושו להעריך יתר על המידה; לכן התשובה הנכונה משמרת את רעיון ההגזמה בהערכת התפקיד.',
    source: { title: 'פתרונות סימולציה קמפוס 2', url: sourceInventory[3].url, page: 12, lines: '149-161' }
  }
];

export const sampleQuestion = officialQuestions[0];

export const legacySampleQuestion = {
  id: 'official-demo-001', sourceType: 'official', domain: 'חשיבה כמותית', topic: 'אחוזים', difficulty: 'בינוני',
  text: 'שאלת הדגמה למבנה המערכת בלבד. יש לייבא שאלות רשמיות מקובצי PDF של Campus IL לפני שימוש לימודי.',
  choices: ['תשובה 1', 'תשובה 2', 'תשובה 3', 'תשובה 4'], correctIndex: 1,
  source: { title: sourceTitle, page: 'לא חולץ אוטומטית', url: sourceInventory[0].url },
  explanation: 'הסבר רשמי יוצג רק לאחר חילוץ מקובץ PDF מקור.'
};
