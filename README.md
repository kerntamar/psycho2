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

אם עדיין מתקבל 404:

- האפשרות המומלצת: ודאו שב־`Settings` → `Pages` מוגדר `Source: GitHub Actions`, ולא `Deploy from a branch`, ואז ודאו שה־workflow `Deploy static app to GitHub Pages` רץ בהצלחה אחרי המיזוג ל־`main`.
- אם אתם מעדיפים `Deploy from a branch`, בחרו `Branch: main` ו־`Folder: /docs`. המאגר כולל עכשיו עותק סטטי מלא גם תחת `docs/`, כדי שגם מצב פריסה זה יעבוד בלי טרמינל.
- פתחו את ה־URL שמופיע בשדה `github-pages` בסוף ריצת ה־workflow או את כתובת Pages שמופיעה ב־`Settings` → `Pages`.
- כאשר מדובר ב־Project Pages, הכתובת חייבת לכלול את שם המאגר, לדוגמה: `https://USER.github.io/REPO/`.
- נוסף גם `404.html` שמריץ את אותה אפליקציה, כדי שקישורים פנימיים או URL שגוי בתוך האתר לא יציגו דף ריק.
