/**
 * Cloudflare Pages Function
 * URL: arielladanielli.com/api/tnuva-campaign
 * מקבל נתוני שאלון ומחזיר המלצת קמפיין מ-Claude
 */
export async function onRequestPost(context) {
  const { request, env } = context;

  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json; charset=utf-8',
  };

  try {
    const { brand, product, goal, audience, success } = await request.json();

    if (!brand || !goal || !audience || !success) {
      return new Response(JSON.stringify({ error: 'חסרים שדות חובה' }), {
        status: 400, headers: corsHeaders,
      });
    }

    const productLine = product ? `מוצר / טעם ספציפי: ${product}` : 'ברמת המותג הכללי (לא מוצר ספציפי)';
    const goalsLine   = Array.isArray(goal) ? goal.join(', ') : goal;

    const prompt = `אתה מחולל רעיונות קריאייטיב לשיתופי פעולה עבור תנובה ומותגי הבית שלה. השתמש בכל נתוני המשתמש כדי לדייק את הרעיונות.

━━━━━━━━━━━━━━━━━
הקלט
━━━━━━━━━━━━━━━━━
מותג תנובה: ${brand}
${productLine}
מטרת המהלך: ${goalsLine}
קהל יעד: ${audience}
מה ההצלחה נראית: ${success}

━━━━━━━━━━━━━━━━━
9 תבניות שת"פ — כל רעיון חייב לשבת על תבנית אחרת
━━━━━━━━━━━━━━━━━
1. פלטפורמה לשת"פ — מנגנון קבוע לשיתופי פעולה חוזרים
2. הרחבה של מוצר — מוצר קיים שמקבל גרסה חדשה דרך IP / עולם תוכן של מותג אחר
3. מוצרים משלימים — שני מותגים שמתחברים סביב אותו רגע שימוש
4. מוצר חדש — שני מותגים יוצרים מוצר שלישי שלא היה קיים בלי החיבור
5. סינרגיה — כל מותג נותן לשני קהל חדש או משמעות חדשה
6. פלטפורמת מדיה — שת"פ שחי בתוך אפליקציה, פלטפורמה, או חוויה דיגיטלית
7. אירוע חד-פעמי שחוזר — קולאב שנראה מוגבל אבל הופך לריטואל עונתי
8. החלפות — מותג אחד מאמץ את השם, השפה, או הקטגוריה של מותג אחר
9. הפרעה — חיבור מפתיע ולא צפוי ששובר כל ציפייה

━━━━━━━━━━━━━━━━━
כללים
━━━━━━━━━━━━━━━━━
• החזר בדיוק 3 רעיונות — לא פחות, לא יותר
• כל רעיון על תבנית שונה — שונה גם בתבנית, בשותף, בזירה ובמנגנון הקריאייטיבי
• השותפים — מותגים / חברות ישראלים מוכרים ואמינים
• רעיונות יצירתיים, מפתיעים, לא גנריים — לא "קמפיין משותף"
• אל תכלול: מסע צרכן, ניתוח אסטרטגי, מספרים לא מבוססים, אנלוגיות עולמיות ארוכות
• שמות הרעיונות — עבריים, קצרים, קולעים — ללא אנגלית מיותרת
• הכל בעברית טבעית ושיווקית

━━━━━━━━━━━━━━━━━
פורמט לכל רעיון — חזור עליו בדיוק שלוש פעמים
━━━━━━━━━━━━━━━━━

## חלופה א׳

**שם הרעיון:** [שם עברי קצר וקולע]

**התבנית:** [שם אחת מ-9 התבניות]

**למה זו התבנית:** [משפט אחד — מה הלוגיקה של הקטגוריה הזו]

**הרעיון:**
[3-4 משפטים קונקרטיים. מה קורה בפועל, מה הצרכן רואה, מה ה-wow moment. ספציפי וחד]

**למה זה מעניין:**
[2 משפטים — מה לא צפוי / מה שובר ציפייה / מה מייצר שיחה]

**שותף אפשרי:** [שם מותג / חברה ישראלית] — [שורה אחת: למה דווקא הוא]

**צעד נוסף:** [רעיון אחד קצר להרחבה]

---

[חזור על אותו מבנה עבור חלופה ב׳ וחלופה ג׳]

---

💡 **להחלפת תבנית:** ציין "החלף חלופה [א׳/ב׳/ג׳] לתבנית [שם התבנית]" ואייצר רעיון חדש לחלוטין.`;

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-opus-4-8',
        max_tokens: 1500,
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error('Anthropic error:', err);
      return new Response(JSON.stringify({ error: 'שגיאה בחיבור לסוכן AI' }), {
        status: 502, headers: corsHeaders,
      });
    }

    const data = await response.json();
    const recommendation = data.content?.[0]?.text || '';

    return new Response(JSON.stringify({ recommendation }), {
      status: 200, headers: corsHeaders,
    });

  } catch (err) {
    console.error('Function error:', err.message);
    return new Response(JSON.stringify({ error: 'שגיאה פנימית' }), {
      status: 500, headers: corsHeaders,
    });
  }
}

export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
