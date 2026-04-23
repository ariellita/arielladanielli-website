# הוראות העלאה ל-GitHub

## 3 קבצים נוצרו בשבילך:

1. **index.html** - עמוד הבית שלך
2. **sitemap.xml** - מפת האתר ל-Google
3. **robots.txt** - הוראות לחיפוש מנועות

## השלב הבא - העלה ל-GitHub

**אפשרות 1: דרך GitHub Web UI (הקלה ביותר)**

1. היכנסי ל: https://github.com/ariellita/arielladanielli-website
2. לחץ "Add file" → "Create new file"
3. העתק את התוכן של כל קובץ ל-GitHub

**אפשרות 2: דרך GitHub Desktop**

1. Clone את ה-repo
2. העתק את 3 הקבצים לתיקייה
3. Commit ו-Push

**אפשרות 3: דרך GitHub CLI**

```bash
cd /path/to/arielladanielli-website
git add .
git commit -m "Add index.html, sitemap.xml, robots.txt"
git push origin main
```

## לאחר ההעלאה:

1. חזור ל-Cloudflare Pages
2. בחר את ה-repo (arielladanielli-website)
3. Cloudflare תדפלוי אוטומטית

## קבצים שהוכנו:

### index.html
- עמוד בודד (Single Page App)
- כל הקטעים: הרצאות, סדנאות, ייעוץ, אודות, צור קשר
- GA4 integrated
- RTL עברית

### sitemap.xml
- מפת אתר ל-Google
- עמוד ראשי בלבד

### robots.txt
- הוראות למנועות חיפוש
- קישור לסיטמפ

