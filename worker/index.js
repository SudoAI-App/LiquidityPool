// Edge entry for liquiditypools.app. Static assets are still served by the
// Workers assets binding; this script only runs first so it can:
//   1. 301 plain-HTTP requests for the production host to HTTPS
//      (http://liquiditypools.app/ used to answer 200, splitting crawl and
//      analytics across two protocols), and
//   2. add an HSTS header to HTTPS responses so browsers stop trying HTTP.
// Local hosts (wrangler dev) are left on HTTP.

const PRODUCTION_HOSTS = new Set(['liquiditypools.app', 'www.liquiditypools.app']);
const HSTS = 'max-age=31536000';

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const production = PRODUCTION_HOSTS.has(url.hostname);
    // On Workers, request.url carries the visitor's scheme, so no forwarded-proto header is needed.
    if (production && url.protocol === 'http:') {
      url.protocol = 'https:';
      return Response.redirect(url.toString(), 301);
    }

    const response = await env.ASSETS.fetch(request);
    if (!production) return response;

    const secured = new Response(response.body, response);
    secured.headers.set('Strict-Transport-Security', HSTS);
    return secured;
  }
};
