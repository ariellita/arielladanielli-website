const http = require('http');
const fs   = require('fs');
const path = require('path');

const PORT = process.env.PORT || 8484;
const ROOT = __dirname;
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY || '';

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css':  'text/css',
  '.js':   'application/javascript',
  '.png':  'image/png',
  '.jpg':  'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg':  'image/svg+xml',
  '.ico':  'image/x-icon',
  '.webp': 'image/webp',
  '.mp4':  'video/mp4',
};

/* ── Tnuva campaign API (local mirror of Cloudflare Function) ── */
async function handleTnuvaCampaign(req, res) {
  const cors = {
    'Access-Control-Allow-Origin':  '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json; charset=utf-8',
  };

  if (req.method === 'OPTIONS') {
    res.writeHead(204, cors); res.end(); return;
  }

  let body = '';
  req.on('data', chunk => body += chunk);
  req.on('end', async () => {
    try {
      const { brand, product, goal, audience, success } = JSON.parse(body);
      const productLine = product || 'ברמת המותג הכללי';
      const goalsLine   = Array.isArray(goal) ? goal.join(', ') : goal;

      const prompt = `אתה מומחה בין-לאומי בשיתופי פעולה בין מותגים (brand collaborations) עם עומק בשוק הישראלי.
תפקידך: לייצר 3 חלופות שת"פ מקוריות ומעשיות עבור מותג תנובה, בהתאם לקלט שהתקבל.

━━━━━━━━━━━━━━━━━
קלט
━━━━━━━━━━━━━━━━━
מותג תנובה: ${brand}
מוצר ספציפי: ${productLine}
מטרת המהלך: ${goalsLine}
קהל יעד: ${audience}
מה ההצלחה נראית: ${success}

━━━━━━━━━━━━━━━━━
9 קטגוריות שת"פ — כל חלופה חייבת לייצג קטגוריה שונה
━━━━━━━━━━━━━━━━━
1. פלטפורמה לשת"פ — מותג שבונה לעצמו מנגנון קבוע לשיתופי פעולה חוזרים (לא חד-פעמי)
2. הרחבה של מוצר — מוצר קיים שמקבל גרסה חדשה דרך עולם תוכן / IP של מותג אחר
3. מוצרים משלימים — שני מותגים שמתחברים סביב אותו רגע שימוש
4. מוצר חדש — שני מותגים יוצרים מוצר שלישי שלא היה קיים בלי החיבור ביניהם
5. סינרגיה — שני מותגים חזקים נפגשים כך שכל אחד נותן לשני קהל חדש או משמעות חדשה
6. פלטפורמת מדיה — שיתוף פעולה שחי בתוך אפליקציה / פלטפורמה / חוויה דיגיטלית
7. אירוע חד-פעמי שחוזר — קולאב שנראה מוגבל אבל הופך לריטואל עונתי / שנתי
8. החלפות — מותג אחד מאמץ את השם, השפה או הקטגוריה של מותג אחר
9. הפרעה — חיבור מפתיע ולא צפוי שיוצר תשומת לב כי הוא שובר ציפייה

━━━━━━━━━━━━━━━━━
כללי ברזל
━━━━━━━━━━━━━━━━━
• 3 חלופות — כל אחת קטגוריה אחרת מהרשימה למעלה
• לפחות חלופה אחת חייבת להיות בין-ענפית לחלוטין — שותף שאינו מענף המזון
• כל השותפים המוצעים חייבים להיות חברות / מותגים ישראלים מוכרים (עדיפות לחברות מ-Dun's 100 Israel 2025)
• לא לייצר שת"פ בנאלי
• כל רעיון חייב לכלול מוצר / חוויה / אירוע קונקרטי — לא רק "נעשה קמפיין ביחד"

━━━━━━━━━━━━━━━━━
פורמט הפלט — חזור בדיוק על המבנה הזה לכל חלופה
━━━━━━━━━━━━━━━━━

## חלופה א׳

**התבנית:** [שם אחד מתוך 9 הקטגוריות]
**מה התבנית אומרת:** [משפט אחד — מה הלוגיקה של הקטגוריה הזו]

---

**הרעיון:**
שם המהלך: [שם קצר, קליט, בעברית]
מה קורה בפועל: [4-6 משפטים מפורטים. תאר: מה הצרכן רואה / קונה / חווה, איך זה נראה פיזית, איפה זה קיים (חנות / אפליקציה / אירוע), מה ה-wow moment. תהיה קונקרטי — שמות, פורמטים, מקומות]

**מסע הצרכן:** [2-3 משפטים — מה קורה מהרגע שהצרכן פוגש את השת"פ ועד לרכישה / חוויה / שיתוף]

**אנלוגיה עולמית:** [שת"פ בין-לאומי מוכר שעשה משהו דומה — שם + מה הם עשו, בשורה אחת]

---

**שותפים אפשריים:**
1. [שם חברה ישראלית] — [למה היא ספציפית מתאימה: קהל, ערכים, תשתית, תזמון]
2. [שם חברה ישראלית] — [למה היא ספציפית מתאימה]

---

**מה משיגים:**
- תנובה / המותג: [מה תנובה מרוויחה — קהל, נוכחות, תפיסה]
- השותף: [מה השותף מרוויח — ממה הוא שמח]
- הצרכן: [מה הצרכן מרוויח / חווה / מספר לחברים]

---

**איך זה עומד בקריטריונים:**
- ✅ לא בנאלי כי: [הסבר ספציפי]
- ✅ יוצר שיחה כי: [מה ה-trigger שיגרום לאנשים לדבר על זה]
- ✅ יש בו היגיון פנימי כי: [למה שני הצדדים שייכים ביחד]

---

**מה נדרש:**
- מוצרי / לוגיסטי: [מה צריך לבנות / לייצר / לתאם]
- שיווקי / תקשורתי: [איך מעבירים את זה לעולם — ערוצים, אקטיבציה]
- זמן וסדר גודל: [ציר זמן, סדר גודל מינימלי לפיילוט, קנה מידה מלא]

---

[חזור על אותו מבנה לחלופה ב׳ וחלופה ג׳. הפרד בין חלופות עם שורת --- בלבד]

היה ספציפי, מפתיע ומעשי. אין גנריות. כל שת"פ צריך להרגיש כמו "איך לא חשבו על זה קודם".`;

      if (!ANTHROPIC_API_KEY) {
        res.writeHead(503, cors);
        res.end(JSON.stringify({ error: 'ANTHROPIC_API_KEY לא מוגדר — הפעל את השרת עם ANTHROPIC_API_KEY=... node serve-preview.js' }));
        return;
      }

      const apiRes = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type':    'application/json',
          'x-api-key':       ANTHROPIC_API_KEY,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model:      'claude-opus-4-8',
          max_tokens: 2000,
          messages:   [{ role: 'user', content: prompt }],
        }),
      });

      const data = await apiRes.json();
      const recommendation = data.content?.[0]?.text || '';

      res.writeHead(200, cors);
      res.end(JSON.stringify({ recommendation }));

    } catch (err) {
      console.error('API error:', err.message);
      res.writeHead(500, cors);
      res.end(JSON.stringify({ error: err.message }));
    }
  });
}

http.createServer((req, res) => {
  const urlPath = req.url.split('?')[0];

  if (urlPath === '/api/tnuva-campaign') {
    handleTnuvaCampaign(req, res); return;
  }

  let filePath = path.join(ROOT, urlPath === '/' ? '/index.html' : urlPath);
  if (!filePath.startsWith(ROOT)) { res.writeHead(403); res.end(); return; }
  const ext = path.extname(filePath).toLowerCase();
  fs.readFile(filePath, (err, data) => {
    if (err) { res.writeHead(404); res.end(`Not found: ${urlPath}`); return; }
    res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
    res.end(data);
  });
}).listen(PORT, () => console.log(`Serving on http://localhost:${PORT}`));
