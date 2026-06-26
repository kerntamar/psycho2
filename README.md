# פסיכומטרי קמפוס

שלד אפליקציה בעברית RTL להכנה לפסיכומטרי, עם כלל מקור קשיח: תוכן רשמי נשען רק על קובצי PDF של `courses.campus.gov.il`.

## הפעלה

```bash
python3 -m http.server 4173
```

פתחו בדפדפן: `http://localhost:4173`.

## בדיקות

```bash
npm test
```

## מה כלול כרגע

- ממשק עברי RTL.
- מלאי מקורות ראשוני מ־Campus IL.
- אזור דף נוסחאות עם חיפוש.
- מצב תרגול דמו שמדגיש שאין להשתמש בשאלה רשמית לפני חילוץ PDF.
- כפתור יצירת שאלה דומה בעזרת AI עם סימון ברור שהתוכן אינו רשמי.
- מסמך ארכיטקטורה וסכמת נתונים עתידית.

## ייבוא PDFים

נוסף תהליך ייבוא ראשוני לקובצי PDF רשמיים של Campus IL:

```bash
npm run fetch:pdfs
npm run extract:pdfs
```

הסקריפט הראשון מוריד רק כתובות מהדומיין `courses.campus.gov.il` ושומר קבצים ב־`.cache/pdfs`, שאינו נכנס ל־git. הסקריפט השני מחלץ טקסט אם מותקן הכלי `pdftotext`. פירוט מלא נמצא ב־`docs/pdf-ingestion.md`.

## פריסה ל־GitHub Pages

הפרויקט כולל workflow בשם `Deploy static app to GitHub Pages` שמפרסם את האתר הסטטי בכל push לענף `main`.

כדי למנוע 404 אחרי מיזוג ל־GitHub:

1. היכנסו ל־GitHub → `Settings` → `Pages`.
2. תחת `Build and deployment`, בחרו `Source: GitHub Actions`.
3. ודאו שהענף הראשי נקרא `main`.
4. דחפו שינוי ל־`main` או הפעילו ידנית את ה־workflow מתוך לשונית `Actions`.
5. לאחר שה־workflow מסתיים, פתחו את כתובת ה־Pages שמופיעה בסיכום הריצה.

אם עדיין מתקבל 404, בדקו שה־workflow הסתיים בהצלחה ושכתובת האתר כוללת את שם המאגר כאשר מדובר ב־Project Pages, לדוגמה: `https://USER.github.io/REPO/`.
