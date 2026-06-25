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

    const prompt = `אתה מנהל קריאייטיב בכיר בסוכנות פרסום מובילה. התפקיד שלך: לייצר רעיונות לשיתופי פעולה עבור מותגי תנובה — רעיונות שמנהלי שיווק בכירים ישמחו לראות.

━━━━━━━━━━━━━━━━━
הקלט
━━━━━━━━━━━━━━━━━
מותג תנובה: ${brand}
${productLine}
מטרת המהלך: ${goalsLine}
קהל יעד: ${audience}
מה ייחשב להצלחה: ${success}

━━━━━━━━━━━━━━━━━
9 תבניות שת"פ — כל רעיון על תבנית אחרת
━━━━━━━━━━━━━━━━━
1. פלטפורמה לשת"פ — מנגנון קבוע לשיתופי פעולה חוזרים
2. הרחבה של מוצר — מוצר קיים שמקבל גרסה חדשה דרך IP / עולם תוכן של מותג אחר
3. מוצרים משלימים — שני מותגים שמתחברים סביב אותו רגע שימוש
4. מוצר חדש — שני מותגים יוצרים מוצר שלישי שלא היה קיים
5. סינרגיה — כל מותג נותן לשני קהל חדש או משמעות חדשה
6. פלטפורמת מדיה — שת"פ שחי בתוך אפליקציה או חוויה דיגיטלית
7. אירוע חד-פעמי שחוזר — קולאב שהופך לריטואל עונתי
8. החלפות — מותג אחד מאמץ את השם, השפה, או הקטגוריה של מותג אחר
9. הפרעה — חיבור מפתיע ולא צפוי ששובר ציפייה

━━━━━━━━━━━━━━━━━
כללי ברזל
━━━━━━━━━━━━━━━━━
• החזר בדיוק 3 רעיונות שונים לחלוטין זה מזה — תבנית שונה, שותף שונה, זירה שונה, מנגנון שונה
• אל תחזור על אותו שותף, אותו סקטור, או אותו מנגנון בין הרעיונות
• שותפים: מותגים ישראלים מוכרים או מותגים גלובליים שפועלים בישראל — חופשי לבחור כל שותף שמתאים לרעיון
• כל שם רעיון — עברי, קצר, קולע — ללא אנגלית מיותרת
• אל תכלול: מסע צרכן, ניתוח אסטרטגי, אנלוגיות עולמיות, "מה משיגים", "קריטריונים"

━━━━━━━━━━━━━━━━━
איך לכתוב את הרעיון — זה הכי חשוב
━━━━━━━━━━━━━━━━━
כתוב כמו מנהל קריאייטיב שמציג ללקוח בישיבה. לא בולטים קטועים — סיפור שזורם.
בחלק "הרעיון" כתוב 4-6 משפטים שמציירים את המהלך בשלמותו: מה הרעיון, מה קורה בפועל, איך זה נראה, מה חווים. פסקה אחת קוהרנטית שקורא אותה ומיד מבין ומרגיש את הרעיון. שפה חיה, קלילה, שיווקית — לא יבשה.

━━━━━━━━━━━━━━━━━
פורמט — חזור עליו שלוש פעמים
━━━━━━━━━━━━━━━━━

## חלופה א׳

**שם הרעיון:** [שם עברי קצר וקולע]

**התבנית:** [העתק בדיוק את שם התבנית מהרשימה למעלה — לדוגמה: "מוצר חדש" או "הפרעה" וכו']

**למה זו התבנית:** [משפט אחד — מה הלוגיקה]

**הרעיון:**
[פסקה אחת, 4-6 משפטים שזורמים. מצייר את המהלך בשלמותו — מה הרעיון, מה קורה, איך זה נראה, מה ה-wow. קולח, חי, קונקרטי]

**למה זה מעניין:**
[2 משפטים — מה לא צפוי, מה מייצר שיחה]

**שותפים אפשריים:**
1. [שם מותג] — [משפט אחד: למה דווקא הם]
2. [שם מותג] — [משפט אחד: למה דווקא הם]

**צעד נוסף:** [משפט אחד — הרחבה אפשרית]

---

[חזור על אותו מבנה לחלופה ב׳ וג׳]

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
        max_tokens: 3000,
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
