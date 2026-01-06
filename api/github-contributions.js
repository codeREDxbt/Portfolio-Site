// Vercel Serverless Function - GitHub Contributions
// SECURITY: Rate limiting, input validation, caching

const cache = new Map();
const CACHE_TTL = 3600000; // 1 hour

// Simple in-memory rate limiter
const rateLimits = new Map();
const RATE_LIMIT_WINDOW = 3600000; // 1 hour
const RATE_LIMIT_MAX = 30; // 30 requests per hour

function checkRateLimit(ip) {
  const now = Date.now();
  const userLimits = rateLimits.get(ip) || { count: 0, resetTime: now + RATE_LIMIT_WINDOW };
  
  // Reset if window expired
  if (now > userLimits.resetTime) {
    userLimits.count = 0;
    userLimits.resetTime = now + RATE_LIMIT_WINDOW;
  }
  
  userLimits.count++;
  rateLimits.set(ip, userLimits);
  
  return {
    allowed: userLimits.count <= RATE_LIMIT_MAX,
    remaining: Math.max(0, RATE_LIMIT_MAX - userLimits.count),
    resetTime: userLimits.resetTime
  };
}

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

module.exports = async (req, res) => {
  // SECURITY: Set security headers
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  
  // CORS headers
  const allowedOrigins = ['https://coderedxbt.vercel.app', 'http://localhost:3000'];
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  if (req.method !== 'GET') {
    return res.status(405).json({ 
      status: 'error',
      message: 'Method not allowed' 
    });
  }
  
  try {
    // SECURITY: Rate limiting
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || 'unknown';
    const rateCheck = checkRateLimit(ip);
    
    res.setHeader('RateLimit-Limit', RATE_LIMIT_MAX);
    res.setHeader('RateLimit-Remaining', rateCheck.remaining);
    res.setHeader('RateLimit-Reset', new Date(rateCheck.resetTime).toISOString());
    
    if (!rateCheck.allowed) {
      return res.status(429).json({
        status: 'error',
        statusCode: 429,
        message: 'GitHub API rate limit exceeded. Please try again in an hour.',
        retryAfter: new Date(rateCheck.resetTime).toISOString()
      });
    }
    
    // SECURITY: Validate input
    const username = req.query.username || 'codeREDxbt';
    const validation = validateUsername(username);
    
    if (!validation.valid) {
      return res.status(400).json({
        status: 'error',
        statusCode: 400,
        message: validation.error
      });
    }
    
    const cleanUsername = validation.username;
    
    // Check cache
    const cacheKey = `github_${cleanUsername}`;
    const cached = cache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      return res.status(200).json({
        status: 'success',
        data: cached.data,
        cached: true
      });
    }
    
    // Fetch from GitHub API
    const response = await fetch(
      `https://github-contributions-api.jogruber.de/v4/${cleanUsername}?y=last`,
      {
        headers: {
          'User-Agent': 'Portfolio-Site-Secure/1.0'
        }
      }
    );
    
    if (!response.ok) {
      throw new Error(`GitHub API returned ${response.status}`);
    }
    
    const data = await response.json();
    
    if (!data || !data.contributions) {
      throw new Error('Invalid response from GitHub API');
    }
    
    // Cache the result
    cache.set(cacheKey, {
      data,
      timestamp: Date.now()
    });
    
    res.status(200).json({
      status: 'success',
      data,
      cached: false
    });
    
  } catch (error) {
    console.error('GitHub API Error:', error.message);
    
    res.status(500).json({
      status: 'error',
      statusCode: 500,
      message: 'Failed to fetch GitHub contributions',
      fallback: true
    });
  }
};
