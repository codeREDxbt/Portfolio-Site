// Vercel Serverless Function - Contact Form
// SECURITY: Rate limiting, input validation, spam detection

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
function validateContactForm(data) {
  const errors = [];
  
  // Name validation
  if (!data.name || typeof data.name !== 'string') {
    errors.push({ field: 'name', message: 'Name is required' });
  } else {
    const name = data.name.trim();
    if (name.length < 2 || name.length > 100) {
      errors.push({ field: 'name', message: 'Name must be 2-100 characters' });
    }
    if (!/^[a-zA-Z\s\-']+$/.test(name)) {
      errors.push({ field: 'name', message: 'Name contains invalid characters' });
    }
  }
  
  // Email validation
  if (!data.email || typeof data.email !== 'string') {
    errors.push({ field: 'email', message: 'Email is required' });
  } else {
    const email = data.email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) {
      errors.push({ field: 'email', message: 'Invalid email address' });
    }
  }
  
  // Message validation
  if (!data.message || typeof data.message !== 'string') {
    errors.push({ field: 'message', message: 'Message is required' });
  } else {
    const message = data.message.trim();
    if (message.length < 10 || message.length > 5000) {
      errors.push({ field: 'message', message: 'Message must be 10-5000 characters' });
    }
  }
  
  // Subject validation (optional)
  if (data.subject && typeof data.subject === 'string') {
    if (data.subject.length > 200) {
      errors.push({ field: 'subject', message: 'Subject is too long (max 200 characters)' });
    }
  }
  
  return errors;
}

// SECURITY: Spam detection
function containsSpam(text) {
  const spamPatterns = [
    /viagra|cialis|casino|lottery|winner/gi,
    /<script|javascript:|onclick|onerror/gi,
  ];
  
  return spamPatterns.some(pattern => pattern.test(text));
}

// SECURITY: Sanitize input
function sanitizeInput(input) {
  if (typeof input !== 'string') return '';
  
  // Remove HTML tags
  let sanitized = input.replace(/<[^>]*>/g, '');
  
  // Escape special characters
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;',
  };
  
  sanitized = sanitized.replace(/[&<>"'/]/g, (char) => map[char]);
  
  return sanitized.trim();
}

export default async function handler(req, res) {
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
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // Handle preflight
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
        message: 'Too many contact form submissions. Please try again in an hour.',
        retryAfter: new Date(rateCheck.resetTime).toISOString()
      });
    }
    
    // Parse body
    const data = req.body;
    
    // SECURITY: Validate inputs
    const errors = validateContactForm(data);
    if (errors.length > 0) {
      return res.status(400).json({
        status: 'error',
        statusCode: 400,
        message: 'Validation failed',
        errors
      });
    }
    
    // SECURITY: Check for spam
    const message = data.message || '';
    const subject = data.subject || '';
    
    if (containsSpam(message) || containsSpam(subject)) {
      return res.status(400).json({
        status: 'error',
        statusCode: 400,
        message: 'Message contains prohibited content'
      });
    }
    
    // SECURITY: Sanitize inputs
    const sanitizedData = {
      name: sanitizeInput(data.name),
      email: data.email.trim().toLowerCase(),
      message: sanitizeInput(data.message),
      subject: sanitizeInput(data.subject || 'Contact Form Submission')
    };
    
    // Log submission (in production, send email via service like SendGrid)
    console.log('Contact Form Submission:', {
      name: sanitizedData.name,
      email: sanitizedData.email,
      subject: sanitizedData.subject,
      messagePreview: sanitizedData.message.substring(0, 100),
      timestamp: new Date().toISOString(),
      ip
    });
    
    // TODO: Integrate with email service
    // Example: await sendEmail(sanitizedData);
    
    res.status(200).json({
      status: 'success',
      message: 'Your message has been received. We will get back to you soon!'
    });
    
  } catch (error) {
    console.error('Contact Form Error:', error.message);
    
    res.status(500).json({
      status: 'error',
      statusCode: 500,
      message: 'Failed to process contact form. Please try again later.'
    });
  }
}
