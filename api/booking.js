// Simple in-memory rate limiter
const rateLimits = new Map();
const RATE_LIMIT_WINDOW = 3600000; // 1 hour
const RATE_LIMIT_MAX = 5;

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

// SECURITY: Input validation
function validateBooking(data) {
  const errors = [];
  
  if (!data.name || typeof data.name !== 'string') {
    errors.push({ field: 'name', message: 'Name is required' });
  } else {
    const name = data.name.trim();
    if (name.length < 2 || name.length > 100) {
      errors.push({ field: 'name', message: 'Name must be 2-100 characters' });
    }
  }
  
  if (!data.email || typeof data.email !== 'string') {
    errors.push({ field: 'email', message: 'Email is required' });
  } else {
    const email = data.email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) {
      errors.push({ field: 'email', message: 'Invalid email address' });
    }
  }
  
  if (!data.date) {
    errors.push({ field: 'date', message: 'Date is required' });
  } else {
    const bookingDate = new Date(data.date);
    const now = new Date();
    
    if (isNaN(bookingDate.getTime())) {
      errors.push({ field: 'date', message: 'Invalid date format' });
    } else if (bookingDate < now) {
      errors.push({ field: 'date', message: 'Cannot book dates in the past' });
    }
  }
  
  if (!data.time || typeof data.time !== 'string') {
    errors.push({ field: 'time', message: 'Time is required' });
  } else if (!/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(data.time)) {
    errors.push({ field: 'time', message: 'Invalid time format (HH:MM)' });
  }
  
  return errors;
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
        message: 'Too many booking submissions. Please try again in an hour.',
        retryAfter: new Date(rateCheck.resetTime).toISOString()
      });
    }
    
    const data = req.body;
    
    const errors = validateBooking(data);
    if (errors.length > 0) {
      return res.status(400).json({
        status: 'error',
        statusCode: 400,
        message: 'Validation failed',
        errors
      });
    }
    
    const bookingDate = new Date(data.date);
    
    console.log('Booking Submission:', {
      name: data.name.trim(),
      email: data.email.trim().toLowerCase(),
      date: bookingDate.toISOString(),
      time: data.time,
      timestamp: new Date().toISOString(),
      ip
    });
    
    
    res.status(200).json({
      status: 'success',
      message: 'Booking confirmed! You will receive a confirmation email shortly.',
      booking: {
        date: bookingDate.toISOString().split('T')[0],
        time: data.time
      }
    });
    
  } catch (error) {
    console.error('Booking Error:', error.message);
    
    res.status(500).json({
      status: 'error',
      statusCode: 500,
      message: 'Failed to process booking. Please try again later.'
    });
  }
}

