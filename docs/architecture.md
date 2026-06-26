# ארכיטקטורה מוצעת

האפליקציה נבנתה כשלד סטטי בעברית RTL, כדי להתחיל במהירות ולשמור על הפרדה ברורה בין תוכן מקור רשמי לבין תוכן AI.

## עקרונות

- תוכן רשמי נשמר רק אם הגיע מקובץ PDF של Campus IL.
- כל פריט רשמי חייב לכלול URL, כותרת PDF, עמוד ומזהה שאלה או פרק כשאפשר.
- שאלות AI נשמרות בטבלה/אוסף נפרד ומסומנות בממשק כלא רשמיות.
- הממשק כולו בעברית ובכיוון RTL.

## סכמת נתונים עתידית

```sql
CREATE TABLE pdf_sources (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  content_type TEXT NOT NULL,
  discovered_at TEXT NOT NULL
);

CREATE TABLE pdf_pages (
  id TEXT PRIMARY KEY,
  pdf_id TEXT NOT NULL REFERENCES pdf_sources(id),
  page_number INTEGER NOT NULL,
  extracted_text TEXT NOT NULL
);

CREATE TABLE official_questions (
  id TEXT PRIMARY KEY,
  pdf_id TEXT NOT NULL REFERENCES pdf_sources(id),
  page_number INTEGER NOT NULL,
  question_number TEXT,
  domain TEXT NOT NULL,
  topic TEXT,
  difficulty TEXT,
  body TEXT NOT NULL
);

CREATE TABLE answer_choices (
  id TEXT PRIMARY KEY,
  question_id TEXT NOT NULL,
  question_kind TEXT NOT NULL CHECK (question_kind IN ('official','ai')),
  choice_index INTEGER NOT NULL,
  body TEXT NOT NULL,
  is_correct BOOLEAN
);

CREATE TABLE official_explanations (
  id TEXT PRIMARY KEY,
  question_id TEXT NOT NULL REFERENCES official_questions(id),
  pdf_id TEXT NOT NULL REFERENCES pdf_sources(id),
  page_number INTEGER NOT NULL,
  body TEXT NOT NULL
);

CREATE TABLE formula_entries (
  id TEXT PRIMARY KEY,
  pdf_id TEXT NOT NULL REFERENCES pdf_sources(id),
  page_number INTEGER NOT NULL,
  topic TEXT NOT NULL,
  name TEXT NOT NULL,
  formula TEXT NOT NULL,
  explanation TEXT
);

CREATE TABLE ai_questions (
  id TEXT PRIMARY KEY,
  related_official_question_id TEXT REFERENCES official_questions(id),
  domain TEXT NOT NULL,
  topic TEXT,
  difficulty TEXT,
  body TEXT NOT NULL,
  explanation TEXT NOT NULL,
  ai_disclaimer TEXT NOT NULL
);

CREATE TABLE attempts (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  question_id TEXT NOT NULL,
  question_kind TEXT NOT NULL CHECK (question_kind IN ('official','ai')),
  selected_choice_index INTEGER,
  is_correct BOOLEAN,
  elapsed_ms INTEGER,
  created_at TEXT NOT NULL
);
```

## שלבי המשך

1. להוסיף סורק PDF שמוריד רק קבצים מהדומיין `courses.campus.gov.il`.
2. לחלץ טקסט, עמודים ותמונות לפי הצורך.
3. לבנות מסך ניהול בעברית לאישור ידני של שאלות, תשובות ונוסחאות שלא זוהו בוודאות.
4. להוסיף מסד נתונים ו־API לשמירת ניסיונות, סטטיסטיקות ותוכן AI.
