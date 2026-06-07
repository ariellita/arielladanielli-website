/**
 * Cloudflare Pages Function
 * URL: arielladanielli.com/api/webhook
 * מקבל webhook מ-Grow (Morning) כשתשלום הושלם
 * ויוצר קבלה אוטומטית בחשבונית ירוקה
 */
export async function onRequestPost(context) {
  const { request, env } = context;

  try {
    const body = await request.json();

    // תמיכה בפורמטים שונים של Grow webhook
    const data = body.data || body.order || body;
    const customer = data.customer || data.client || data.contact || {};

    const customerName  = customer.name  || data.name  || data.fullName || 'לקוח';
    const customerEmail = customer.email || data.email || '';
    const customerPhone = customer.phone || data.phone || '';
    const amount        = parseFloat(data.total || data.amount || data.price || data.sum || 0);
    const orderId       = data.id || data.orderId || '';

    // שלב 1 — קבלת JWT מחשבונית ירוקה
    const tokenRes = await fetch('https://api.greeninvoice.co.il/api/v1/account/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id:     env.GI_KEY_ID,
        secret: env.GI_SECRET
      })
    });

    if (!tokenRes.ok) {
      console.error('GI auth failed:', await tokenRes.text());
      return new Response('Auth failed', { status: 500 });
    }

    const { token } = await tokenRes.json();

    // שלב 2 — יצירת קבלה (סוג 320)
    const today = new Date().toISOString().split('T')[0].replace(/-/g, '/');

    const docBody = {
      description: 'סדנת מיתוג אישי בעידן ה-AI',
      type:        320,   // קבלה
      lang:        'he',
      currency:    'ILS',
      vatType:     1,     // כולל מע"מ
      date:        today,
      dueDate:     today,
      client: {
        name: customerName,
        ...(customerEmail && { emails: [customerEmail] }),
        ...(customerPhone && { phone: customerPhone }),
        add: true
      },
      income: [{
        description: 'סדנת מיתוג אישי בעידן ה-AI | 22.6.2026',
        quantity:    1,
        price:       amount,
        vatType:     1
      }],
      remarks: [
        orderId ? `מס' הזמנה: ${orderId}` : '',
        '',
        '📅 להוספת הסדנה ליומן Google Calendar:',
        'https://calendar.google.com/calendar/render?action=TEMPLATE&text=%D7%95%D7%95%D7%91%D7%99%D7%A0%D7%A8+%D7%9E%D7%99%D7%AA%D7%95%D7%92+%D7%90%D7%99%D7%A9%D7%99+%D7%A2%D7%9D+%D7%91%D7%99%D7%A0%D7%94+%D7%9E%D7%9C%D7%90%D7%9B%D7%95%D7%AA%D7%99%D7%AA&dates=20260622T070000Z%2F20260622T090000Z&details=%D7%A1%D7%93%D7%A0%D7%AA+%D7%9E%D7%99%D7%AA%D7%95%D7%92+%D7%90%D7%99%D7%A9%D7%99+%D7%91%D7%A2%D7%99%D7%93%D7%9F+%D7%94-AI&location=Zoom',
        '',
        'לסדנה: יום שני 22.6.2026 | 10:00-12:00 | Zoom'
      ].filter(Boolean).join('\n'),
      signed:      true,
      sendByEmail: !!customerEmail
    };

    const docRes = await fetch('https://api.greeninvoice.co.il/api/v1/documents', {
      method: 'POST',
      headers: {
        'Content-Type':  'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(docBody)
    });

    const docData = await docRes.json();

    if (!docRes.ok) {
      console.error('GI doc error:', JSON.stringify(docData));
      return new Response('Doc creation failed', { status: 500 });
    }

    console.log(`✅ קבלה נוצרה: ${docData.id} ללקוח: ${customerName}`);

    return new Response(JSON.stringify({ ok: true, receiptId: docData.id }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (err) {
    console.error('Webhook error:', err.message);
    return new Response('Server error', { status: 500 });
  }
}
