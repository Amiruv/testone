// ─── STRM Proxy — Cloudflare Worker ───────────────────────────────────────
// Deploy at: https://workers.cloudflare.com (free, no credit card)
// This worker fetches your M3U URL server-side, bypassing CORS entirely.

export default {
  async fetch(request) {
    const url = new URL(request.url);

    // CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders() });
    }

    const target = url.searchParams.get('url');
    if (!target) {
      return new Response('Missing ?url= parameter', { status: 400, headers: corsHeaders() });
    }

    try {
      const res = await fetch(target, {
        headers: {
          // Forward a neutral User-Agent so the IPTV server doesn't block us
          'User-Agent': 'Mozilla/5.0 (compatible; STRM/1.0)',
          'Accept': '*/*',
        },
        redirect: 'follow',
      });

      // Stream the response straight through
      return new Response(res.body, {
        status: res.status,
        headers: {
          ...corsHeaders(),
          'Content-Type': res.headers.get('Content-Type') || 'application/octet-stream',
          'Cache-Control': 'no-cache',
        },
      });
    } catch (err) {
      return new Response('Fetch failed: ' + err.message, { status: 502, headers: corsHeaders() });
    }
  }
};

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': '*',
  };
}
