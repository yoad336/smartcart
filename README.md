# SMARTCART · Frontend (מודול 6)

פרויקט React + Vite שמתרגם את העיצוב ממודול 5 ל־Frontend עובד ומתפקד.
כל הנתונים הם **נתוני דמה (Dummy)** — אין חיבור ל־Backend בשלב זה.

> SMARTCART — אפליקציה שמרכזת נתוני מחירים, משווה ביניהם ומרכיבה סל קניות אופטימלי
> וזול בהתאם למיקום ולהעדפות המשתמש.

---

## הרצה מקומית

צריך **Node.js 18+** ו־npm.

```bash
npm install
npm run dev
```

פותחים את הכתובת שמודפסת (כברירת מחדל http://localhost:5173).

פקודות נוספות: `npm run build` (בנייה לפרודקשן), `npm run preview` (תצוגה מקדימה של הבנייה).

---

## מבנה התיקיות

```
smartcart-frontend/
├── DESIGN.md                 # מערכת העיצוב (ממודול 5)
├── COMPONENT-BREAKDOWN.md    # חלק 1 + חלק 2 של המשימה (טבלאות)
├── index.html
├── package.json
├── vite.config.js
└── src/
    ├── main.jsx              # נקודת כניסה: Router + CartProvider
    ├── App.jsx               # ניווט (Routing) + פריסה משותפת
    ├── styles/
    │   └── globals.css       # מערכת העיצוב כ־CSS Variables
    ├── data/
    │   ├── dummyData.js      # מוצרים, רשתות, מחירים, רשימות (דמה)
    │   └── compare.js        # חישוב השוואת מחירים (Frontend בלבד)
    ├── context/
    │   └── CartContext.jsx   # ניהול הרשימה בין העמודים (בזיכרון)
    ├── components/
    │   ├── Navbar/Navbar.jsx     # רכיב משותף (Shared)
    │   ├── Footer/Footer.jsx     # רכיב משותף (Shared)
    │   ├── Button/Button.jsx         # רכיב לשימוש חוזר
    │   ├── ProductCard/ProductCard.jsx
    │   ├── StoreCard/StoreCard.jsx
    │   └── ListCard/ListCard.jsx
    └── pages/
        ├── HomePage.jsx       # /
        ├── CreateListPage.jsx # /create
        ├── ComparePage.jsx    # /compare
        ├── ResultPage.jsx     # /result
        └── SavedListsPage.jsx # /saved
```

---

## העלאה ל־GitHub (ההגשה)

המשימה מבקשת **קישור ל־GitHub Repository**. כך מעלים:

1. צרו Repository חדש וריק ב־https://github.com (בלי README אוטומטי).
2. בטרמינל, בתוך תיקיית הפרויקט:

```bash
git init
git add .
git commit -m "SMARTCART frontend - module 6"
git branch -M main
git remote add origin https://github.com/USERNAME/REPO.git
git push -u origin main
```

(החליפו את `USERNAME/REPO` בכתובת ה־Repository שלכם.)

3. העתיקו את כתובת ה־Repository והדביקו אותה בחלק 3 של המשימה.

> טיפ: תיקיית `node_modules` כבר מוחרגת ב־`.gitignore` ולא תועלה — זה תקין.

---

## עמידה בצ׳קליסט המשימה

- ✅ האפליקציה רצה בדפדפן ללא שגיאות (`npm run dev`)
- ✅ העמודים תואמים לעיצוב ממודול 5 (אותה מערכת עיצוב)
- ✅ מערכת העיצוב מיושמת דרך **CSS Variables** ב־`globals.css`
- ✅ אין ערכי צבע קשיחים ברכיבים — הכל דרך משתנים
- ✅ הרכיבים מפורקים לתיקיות נפרדות
- ✅ `Navbar` ו־`Footer` משותפים לכל העמודים
- ✅ ניווט עובד בין כל העמודים (ללא טעינה מחדש), וה־URL מתעדכן
- ✅ עיצוב רספונסיבי — נראה טוב גם ברוחב 375px (מובייל)
- ✅ `DESIGN.md` בתיקיית השורש
- ✅ טבלאות פירוק הרכיבים (חלק 1) וטבלת הניווט (חלק 2) — ב־`COMPONENT-BREAKDOWN.md`
- ✅ כל הנתונים דמה — אין חיבור ל־Backend

---

## מה הלאה (מודול 7 — Data Design)

בכל עמוד מוצג כרגע תוכן דמה. במודול הבא נשאל "איזה מידע אמיתי מוצג כאן?" —
והתשובות יגדירו בדיוק מה ה־Database יצטרך לאחסן.
