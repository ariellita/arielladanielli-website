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
3. מוצרים משלימים — שני מותגים שמתחברים סביב אותו רגע שימוש (למשל: כושר + אוכל אחרי אימון)
4. מוצר חדש — שני מותגים יוצרים מוצר שלישי שלא היה קיים בלי החיבור ביניהם
5. סינרגיה — שני מותגים חזקים נפגשים כך שכל אחד נותן לשני קהל חדש או משמעות חדשה
6. פלטפורמת מדיה — שיתוף פעולה שחי בתוך אפליקציה / פלטפורמה / חוויה דיגיטלית
7. אירוע חד-פעמי שחוזר — קולאב שנראה מוגבל אבל הופך לריטואל עונתי / שנתי
8. החלפות — מותג אחד מאמץ את השם, השפה או הקטגוריה של מותג אחר
9. הפרעה — חיבור מפתיע ולא צפוי שיוצר תשומת לב כי הוא שובר ציפייה

━━━━━━━━━━━━━━━━━
כללי ברזל
━━━━━━━━━━━━━━━━━
• 3 חלופות — כל אחת קטגוריה אחרת משהו מהרשימה למעלה
• לפחות חלופה אחת חייבת להיות בין-ענפית לחלוטין — שותף שאינו מענף המזון
• כל השותפים המוצעים חייבים להיות חברות / מותגים ישראלים מוכרים (עדיפות לחברות מ-Dun's 100 Israel 2025)
• לא לייצר שת"פ בנאלי (חברת בישול + מזון = לא מספיק מעניין)
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
מה קורה בפועל: [4-6 משפטים מפורטים. תאר: מה הצרכן רואה / קונה / חווה, איך זה נראה פיזית, איפה זה קיים, מה ה-wow moment. תהיה קונקרטי — שמות, פורמטים, מקומות]

**מסע הצרכן:** [2-3 משפטים — מה קורה מהרגע שהצרכן פוגש את השת"פ ועד לרכישה / חוויה / שיתוף]

**אנלוגיה עולמית:** [שת"פ בין-לאומי מוכר שעשה משהו דומה — שם + מה הם עשו, בשורה אחת]

---

**שותפים אפשריים:**
1. [שם חברה ישראלית] — [למה היא ספציפית מתאימה: קהל, ערכים, תשתית, תזמון]
2. [שם חברה ישראלית] — [למה היא ספציפית מתאימה]

---

**מה משיגים:**
- תנובה / המותג: [מה תנובה מרוויחה — קהל, נוכחות, תפיסה]
- השותף: [מה השותף מרוויח]
- הצרכן: [מה הצרכן מרוויח / חווה / מספר לחברים]

---

**איך זה עומד בקריטריונים:**
- ✅ לא בנאלי כי: [הסבר ספציפי]
- ✅ יוצר שיחה כי: [מה ה-trigger שיגרום לאנשים לדבר]
- ✅ יש בו היגיון פנימי כי: [למה שני הצדדים שייכים ביחד]

---

**מה נדרש:**
- מוצרי / לוגיסטי: [מה צריך לבנות / לייצר / לתאם]
- שיווקי / תקשורתי: [איך מעבירים לעולם — ערוצים, אקטיבציה]
- זמן וסדר גודל: [ציר זמן, סדר גודל מינימלי לפיילוט, קנה מידה מלא]

---

[חזור על אותו מבנה לחלופה ב׳ וחלופה ג׳]

היה ספציפי, מפתיע ומעשי. אין גנריות.`;

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
