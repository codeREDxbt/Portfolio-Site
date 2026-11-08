const cache = new Map();
const CACHE_TTL = 300000; // 5 minutes

// Simple in-memory rate limiter
const rateLimits = new Map();
const RATE_LIMIT_WINDOW = 300000; // 5 minutes
const RATE_LIMIT_MAX = 10;

function checkRateLimit(ip) {
  const now = Date.now();
  const userLimits = rateLimits.get(ip) || { count: 0, resetTime: now + RATE_LIMIT_WINDOW };
  
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

export default async function handler(req, res) {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  
  const allowedOrigins = ['https://coderedxbt.vercel.app', 'http://localhost:3000'];
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      status: 'error',
      message: 'Method not allowed' 
    });
  }
  
  try {
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || 'unknown';
    const rateCheck = checkRateLimit(ip);
    
    res.setHeader('RateLimit-Limit', RATE_LIMIT_MAX);
    res.setHeader('RateLimit-Remaining', rateCheck.remaining);
    res.setHeader('RateLimit-Reset', new Date(rateCheck.resetTime).toISOString());
    
    if (!rateCheck.allowed) {
      return res.status(429).json({
        status: 'error',
        statusCode: 429,
        message: 'Visitor counter rate limit exceeded. Please try again later.',
        retryAfter: new Date(rateCheck.resetTime).toISOString()
      });
    }
    
    const cacheKey = 'visitor_count';
    const cached = cache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      return res.status(200).json({
        status: 'success',
        count: cached.count,
        cached: true
      });
    }
    
    const countApiUrl = process.env.COUNT_API_URL || 'https://api.countapi.xyz/hit/codeREDxbt-portfolio/visitors';
    
    const response = await fetch(countApiUrl);
    const data = await response.json();
    
    if (data && data.value) {
          cache.set(cacheKey, {
        count: data.value,
        timestamp: Date.now()
      });
      
      return res.status(200).json({
        status: 'success',
        count: data.value,
        cached: false
      });
    }
    
    throw new Error('Invalid response from CountAPI');
    
  } catch (error) {
    console.error('Visitor Counter Error:', error.message);
    
    const fallbackCount = 36761 + Math.floor(Math.random() * 100);
    
    res.status(200).json({
      status: 'success',
      count: fallbackCount,
      fallback: true
    });
  }
}


