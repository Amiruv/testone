addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  const url = new URL(request.url)

  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders() })
  }

  const target = url.searchParams.get('url')
  if (!target) {
    return new Response('Missing ?url= parameter', { status: 400, headers: corsHeaders() })
  }

  try {
    const response = await fetch(target, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Linux; Android 10) AppleWebKit/537.36 Chrome/120 Mobile Safari/537.36',
        'Accept': '*/*',
        'Accept-Language': 'en-US,en;q=0.9',
      },
      redirect: 'follow',
    })

    const headers = corsHeaders()
    headers['Content-Type'] = response.headers.get('Content-Type') || 'application/octet-stream'
    headers['Cache-Control'] = 'no-cache'

    return new Response(response.body, {
      status: response.status,
      headers: headers,
    })
  } catch (err) {
    return new Response('Proxy error: ' + err.message, { status: 502, headers: corsHeaders() })
  }
}

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS',
    'Access-Control-Allow-Headers': '*',
  }
}
