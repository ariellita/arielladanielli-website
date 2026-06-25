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
    const { brand, product, goal, audience, success, collabTypes } = await request.json();

    if (!brand || !goal || !audience || !success) {
      return new Response(JSON.stringify({ error: 'חסרים שדות חובה' }), {
        status: 400, headers: corsHeaders,
      });
    }

    const productLine   = product ? `מוצר / טעם ספציפי: ${product}` : 'ברמת המותג הכללי (לא מוצר ספציפי)';
    const goalsLine     = Array.isArray(goal) ? goal.join(', ') : goal;
    const collabLine    = (collabTypes && collabTypes.length)
      ? `סוגי שת"פ מועדפים: ${collabTypes.join(', ')}`
      : 'סוג שת"פ: לא נבחר — בחר בחופשיות מתוך 9 התבניות';

    const prompt = `אתה אחד מאנשי הקריאייטיב הגדולים בעולם. עבדת בסוכנויות כמו Droga5 ו-Wieden+Kennedy. זכית ב-Grand Prix בקאן. אתה יודע שרוב הרעיונות לשיתופי פעולה הם גנריים ומשעממים — ואתה מסרב לעשות אותם.

המשימה שלך: לייצר 3 רעיונות לשיתוף פעולה עבור ${brand} של תנובה שיגרמו לאנשים לעצור ולהגיד "וואו, איך לא חשבו על זה קודם."

━━━━━━━━━━━━━━━━━
נתוני הבריף
━━━━━━━━━━━━━━━━━
מותג: ${brand}
${productLine}
מטרה: ${goalsLine}
קהל: ${audience}
הצלחה תיראה כך: ${success}
${collabLine}

━━━━━━━━━━━━━━━━━
9 תבניות שת"פ
━━━━━━━━━━━━━━━━━
1. פלטפורמה לשת"פ — מנגנון קבוע לשיתופי פעולה חוזרים
2. הרחבה של מוצר — מוצר קיים שמקבל גרסה חדשה דרך עולם תוכן של מותג אחר
3. מוצרים משלימים — שני מותגים שמתחברים סביב אותו רגע שימוש
4. מוצר חדש — שני מותגים יוצרים מוצר שלישי שלא היה קיים
5. סינרגיה — כל מותג נותן לשני קהל חדש או משמעות חדשה
6. פלטפורמת מדיה — שת"פ שחי בתוך אפליקציה או חוויה דיגיטלית
7. אירוע שחוזר — קולאב שהופך לריטואל עונתי
8. החלפות — מותג אחד מאמץ את השפה או הקטגוריה של מותג אחר
9. הפרעה — חיבור מפתיע שבוקע מהרעש בגלל שאף אחד לא ציפה לו

━━━━━━━━━━━━━━━━━
מה מפריד בין רעיון טוב לרעיון גנרי
━━━━━━━━━━━━━━━━━

רעיון גנרי: "שני מותגים עם אותו קהל יעשו קמפיין ביחד."
רעיון טוב: חיבור שיש בו מתח. משהו לא צפוי. אמת אנושית שמחברת בין שני הדברים בצורה שגורמת לאנשים לומר "נכון!" ברגע שהם שומעים אותו.

שאל את עצמך לפני כל רעיון:
— מה האמת האנושית שמחברת בין שני המותגים האלה? לא "הם מוכרים לאותו אדם" — אלא מה ברגע האמיתי של חיי האדם הזה מחבר ביניהם?
— אם אקרא את זה בעיתון — האם זה יגרום לי לעצור?
— האם זה יכול היה לקרות בין כל שני מותגים אחרים? אם כן — הרעיון לא מיוחד מספיק.

━━━━━━━━━━━━━━━━━
כללים
━━━━━━━━━━━━━━━━━
• 3 רעיונות — כל אחד על תבנית שונה, שותף שונה, זירה שונה
• אם נבחרו תבניות ספציפיות — השתמש בהן
• שותפים: מכל סקטור שבא לך — תרבות, אופנה, מוסיקה, בנקאות, ספרים, ספורט, אוכל, טכנולוגיה, כל דבר — רק שיהיה נכון לרעיון
• שמות רעיונות — עבריים, קצרים, קולעים
• אסור לכלול: מסע צרכן, "מה משיגים", קריטריונים
• כתוב בעברית פשוטה. מילות לועזית שיש להן תרגום עברי — תרגם. שמות מותגים — השאר.

━━━━━━━━━━━━━━━━━
סגנון הכתיבה
━━━━━━━━━━━━━━━━━
כתוב כמו שאתה מציג ברגע הגדול לפני לקוח. לא פירוט לוגיסטי — רגש ורעיון. בחלק "הרעיון" — פסקה שזורמת, חיה, ספציפית. אנשים שקוראים אותה מרגישים את הרעיון לפני שהם מנתחים אותו.

━━━━━━━━━━━━━━━━━
פורמט — שלוש פעמים
━━━━━━━━━━━━━━━━━

## חלופה א׳

**שם הרעיון:** [שם עברי קצר, זוכר]

**התבנית:** [שם מדויק מהרשימה]

**למה זו התבנית:** [משפט אחד]

**הרעיון:**
[פסקה אחת. 4-6 משפטים שזורמים. מה קורה בפועל, מה הרגע שבו אנשים עוצרים, למה זה מרגיש בלתי נמנע ברגע שרואים אותו. חי, ספציפי, מרגש.]

**למה זה מעניין:**
[2 משפטים — מה האמת האנושית שעומדת מאחוריו, ומה גורם לאנשים לדבר עליו]

**שותפים אפשריים:**
1. [מותג] — [למה דווקא הם, משפט אחד]
2. [מותג] — [למה דווקא הם, משפט אחד]

**צעד נוסף:** [משפט אחד]

---

[חזור על אותו מבנה לחלופה ב׳ וג׳]

---

💡 **להחלפת תבנית:** ציין "החלף חלופה [א׳/ב׳/ג׳] לתבנית [שם]" ואייצר רעיון חדש לחלוטין.`;

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
