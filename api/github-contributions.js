// Input validation
function validateUsername(username) {
  if (!username || typeof username !== 'string') {
    return { valid: false, error: 'Username is required' };
  }

  const cleaned = username.trim();

  if (cleaned.length < 1 || cleaned.length > 39) {
    return { valid: false, error: 'Username must be 1-39 characters' };
  }

  if (!/^[a-zA-Z0-9-]+$/.test(cleaned)) {
    return { valid: false, error: 'Username can only contain letters, numbers, and hyphens' };
  }

  return { valid: true, username: cleaned };
}

export default async function handler(req, res) {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');

  // Allow all origins that belong to this portfolio
  const allowedOrigins = [
    'https://coderedxbt.dev',
    'https://www.coderedxbt.dev',
    'https://coderedxbt.vercel.app',
    'http://localhost:3000',
    'http://127.0.0.1:3000',
  ];
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({
      status: 'error',
      message: 'Method not allowed',
    });
  }

  try {
    const username = req.query.username || 'codeREDxbt';
    const validation = validateUsername(username);

    if (!validation.valid) {
      return res.status(400).json({
        status: 'error',
        statusCode: 400,
        message: validation.error,
      });
    }

    const cleanUsername = validation.username;

    const response = await fetch(
      `https://github-contributions-api.jogruber.de/v4/${cleanUsername}?y=last`,
      {
        headers: {
          'User-Agent': 'Portfolio-Site/1.0',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`GitHub API returned ${response.status}`);
    }

    const data = await response.json();

    if (!data || !data.contributions) {
      throw new Error('Invalid response from GitHub API');
    }

    // Cache at Vercel CDN edge for 1 hour, allow stale for 30 minutes while revalidating
    // This means visitors always get fresh data with zero latency hit
    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=1800');

    res.status(200).json({
      status: 'success',
      data,
      cached: false,
    });
  } catch (error) {
    console.error('GitHub API Error:', error.message);

    res.status(500).json({
      status: 'error',
      statusCode: 500,
      message: 'Failed to fetch GitHub contributions',
      fallback: true,
    });
  }
}
