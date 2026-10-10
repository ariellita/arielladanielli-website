// הסאב דומיין trends.arielladanielli.com מגיש את דף הנחיתה של מגמות 2027.
// רץ רק על "/" ועל "/api/*" (ראו _routes.json), כדי ששאר האתר יישאר סטטי.
const LANDING_HOST = 'trends.arielladanielli.com';
const LANDING_PATH = '/landing-trends-2027';

export async function onRequest({ request, env, next }) {
  try {
    const url = new URL(request.url);
    if (url.hostname === LANDING_HOST && url.pathname === '/') {
      return env.ASSETS.fetch(new Request(new URL(LANDING_PATH, url), request));
    }
  } catch (err) {
    // כל תקלה כאן לא אמורה להפיל את דף הבית
  }
  return next();
}
