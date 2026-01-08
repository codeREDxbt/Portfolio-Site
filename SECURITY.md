# 🔒 Security Implementation Guide

## Overview
This portfolio site has been hardened with comprehensive security measures following OWASP best practices. This document outlines all security features and setup instructions.

---

## 🛡️ Security Features Implemented

### 1. Rate Limiting

**✓ IP-Based Rate Limiting**
- General API: 100 requests per 15 minutes per IP
- GitHub API: 30 requests per hour per IP
- Visitor Counter: 10 requests per 5 minutes per IP
- Contact Form: 5 submissions per hour per IP
- Booking Form: 5 submissions per hour per IP

**✓ Graceful 429 Responses**
All rate limit responses include:
- Clear error messages
- Retry-After headers
- User-friendly feedback
- No service disruption

### 2. Input Validation & Sanitization

**✓ Server-Side Validation**
- Schema-based validation using express-validator
- Type checking for all inputs
- Length limits enforced
- Unexpected fields rejected
- Special character sanitization

**✓ Client-Side Validation**
- Pre-validation before API calls
- XSS prevention (HTML tag removal)
- Email format validation
- Spam content detection
- Character escaping

**Validation Rules:**
```javascript
// Name: 2-100 characters, letters/spaces/hyphens only
// Email: Valid email format, max 254 characters
// Message: 10-5000 characters, sanitized
// Subject: Max 200 characters, sanitized
// Date: ISO8601 format, future dates only
// Time: HH:MM format validation
```

### 3. Secure API Key Handling

**✓ Environment Variables**
- All API keys stored in `.env` file
- `.env` added to `.gitignore`
- `.env.example` provided as template
- No hardcoded credentials in code
- Client-side API exposure eliminated

**✓ API Proxy Pattern**
- All external API calls routed through backend
- Client never directly accesses third-party APIs
- API keys never exposed to browser
- Centralized API management

**✓ Key Rotation**
- Documented rotation schedule in `.env.example`
- Recommended: Rotate keys every 90 days
- Track rotation dates in comments

### 4. Additional Security Layers

**✓ HTTP Security Headers (Helmet.js)**
- Content Security Policy (CSP)
- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff
- X-XSS-Protection: enabled
- HSTS with preload
- Referrer Policy

**✓ CORS Protection**
- Configurable allowed origins
- Credentials support controlled
- Pre-flight request handling

**✓ NoSQL Injection Prevention**
- mongo-sanitize middleware
- Input sanitization
- Query parameterization

**✓ DoS Protection**
- Request body size limits (10kb)
- Connection timeouts
- Request rate limiting
- Resource usage monitoring

**✓ Error Handling**
- No sensitive info in error messages
- Generic error responses in production
- Detailed logging for debugging
- 404/500 error handlers

---

## 📦 Installation & Setup

### Prerequisites
- Node.js 16+ and npm
- Git

### Step 1: Install Dependencies

```bash
npm install
```

This installs:
- `express` - Web server framework
- `helmet` - Security headers
- `cors` - CORS handling
- `express-rate-limit` - Rate limiting
- `express-validator` - Input validation
- `express-mongo-sanitize` - NoSQL injection prevention
- `dotenv` - Environment variable management
- `joi` - Schema validation
- `node-cache` - Response caching
- `axios` - HTTP client

### Step 2: Configure Environment Variables

1. Copy the example environment file:
```bash
cp .env.example .env
```

2. Edit `.env` and add your configuration:
```env
NODE_ENV=production
PORT=3000
ALLOWED_ORIGINS=https://yourdomain.com
COUNT_API_URL=https://api.countapi.xyz/hit/your-namespace/your-key
```

3. For GitHub API (optional, for higher rate limits):
   - Go to https://github.com/settings/tokens
   - Generate new token with `public_repo` scope
   - Add to `.env`: `GITHUB_TOKEN=your_token_here`

4. For email service (if implementing contact form emails):
   - Choose a service (SendGrid, AWS SES, Mailgun)
   - Get API key from provider
   - Add to `.env`: `EMAIL_SERVICE_API_KEY=your_key_here`

### Step 3: Start the Server

**Development mode:**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

Server will start on `http://localhost:3000` (or configured PORT)

---

## 🔐 Security Best Practices

### For Development

1. **Never commit `.env` file**
   - Always in `.gitignore`
   - Use `.env.example` for documentation
   - Different values for dev/prod

2. **Test rate limiting**
   ```bash
   # Test rate limit
   for i in {1..150}; do curl http://localhost:3000/api/health; done
   ```

3. **Validate input sanitization**
   ```bash
   # Test XSS prevention
   curl -X POST http://localhost:3000/api/contact \
     -H "Content-Type: application/json" \
     -d '{"name":"<script>alert(1)</script>","email":"test@test.com","message":"Test message"}'
   ```

### For Production Deployment

1. **Set NODE_ENV to production**
   ```bash
   export NODE_ENV=production
   ```

2. **Use strong secrets**
   ```bash
   # Generate random secret
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

3. **Configure HTTPS**
   - Use reverse proxy (Nginx, Apache)
   - Enable SSL/TLS certificates
   - Force HTTPS redirects

4. **Set up monitoring**
   - Log failed requests
   - Monitor rate limit hits
   - Track API usage
   - Set up alerts

5. **Regular security updates**
   ```bash
   # Check for vulnerabilities
   npm audit
   
   # Fix vulnerabilities
   npm audit fix
   ```

6. **API key rotation**
   - Rotate keys every 90 days
   - Update `.env` file
   - Test thoroughly
   - Document rotation date

---

## 🎯 API Endpoints

All endpoints are prefixed with `/api/`

### Health Check
```
GET /api/health
```
Returns API status and timestamp.

### GitHub Contributions
```
GET /api/github/contributions?username=codeREDxbt
```
- **Rate Limit:** 30 requests/hour per IP
- **Caching:** 1 hour
- **Validation:** Username format checked
- **Returns:** Contribution data or fallback

### Visitor Counter
```
POST /api/visitor/increment
```
- **Rate Limit:** 10 requests/5min per IP
- **Caching:** 5 minutes
- **Returns:** Current visitor count

### Contact Form
```
POST /api/contact
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "message": "Hello!",
  "subject": "Inquiry"
}
```
- **Rate Limit:** 5 submissions/hour per IP
- **Validation:** All fields validated and sanitized
- **Spam Detection:** Checks for spam patterns

### Booking
```
POST /api/booking
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "date": "2026-01-15T00:00:00.000Z",
  "time": "14:30"
}
```
- **Rate Limit:** 5 bookings/hour per IP
- **Validation:** Date must be in future
- **Format:** Time in HH:MM format

---

## 🚨 Rate Limit Response Format

When rate limit is exceeded:

```json
{
  "status": "error",
  "statusCode": 429,
  "message": "Too many requests. Please try again later.",
  "retryAfter": "2026-01-06T15:30:00.000Z"
}
```

Headers included:
- `RateLimit-Limit`: Max requests allowed
- `RateLimit-Remaining`: Requests remaining
- `RateLimit-Reset`: When limit resets (timestamp)

---

## ❌ Error Response Format

All errors follow consistent format:

```json
{
  "status": "error",
  "statusCode": 400,
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email address"
    }
  ]
}
```

---

## 🧪 Testing Security

### Test Rate Limiting
```bash
# Test general rate limit (should block after 100 requests)
for i in {1..150}; do 
  curl -s http://localhost:3000/api/health | jq '.message'
done
```

### Test Input Validation
```bash
# Test XSS prevention
curl -X POST http://localhost:3000/api/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"<script>alert(XSS)</script>","email":"bad","message":"x"}'

# Expected: 400 error with validation messages
```

### Test Spam Detection
```bash
curl -X POST http://localhost:3000/api/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@test.com","message":"Buy viagra now <script>alert(1)</script>"}'

# Expected: 400 error - "Message contains prohibited content"
```

---

## 📊 Monitoring & Logging

The server logs important security events:

- Rate limit violations
- Validation failures
- API errors
- Spam detection
- Failed requests

Example log output:
```
GitHub API Error: Request failed with status 429
Contact Form Submission: {name, email, timestamp, ip}
Rate limit exceeded: /api/github/contributions from 192.168.1.1
```

---

## 🔄 Key Rotation Schedule

| Key/Secret | Rotation Frequency | Last Rotated | Next Due |
|------------|-------------------|--------------|----------|
| GitHub Token | 90 days | [Date] | [Date] |
| Email API Key | 90 days | [Date] | [Date] |
| Session Secret | 180 days | [Date] | [Date] |

**Rotation Process:**
1. Generate new key/token from provider
2. Update `.env` file with new value
3. Restart server
4. Test all functionality
5. Revoke old key/token
6. Document rotation date

---

## 🆘 Troubleshooting

### Rate Limit Issues
- **Problem:** Users hitting rate limits too often
- **Solution:** Adjust limits in `server.js` or cache responses longer

### CORS Errors
- **Problem:** Frontend can't connect to backend
- **Solution:** Add your domain to `ALLOWED_ORIGINS` in `.env`

### Validation Errors
- **Problem:** Valid inputs being rejected
- **Solution:** Check validation rules in `server.js` and adjust if needed

### API Timeouts
- **Problem:** External APIs not responding
- **Solution:** Increase timeout values or implement better fallbacks

---

## 📚 Additional Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Express Security Best Practices](https://expressjs.com/en/advanced/best-practice-security.html)
- [Helmet.js Documentation](https://helmetjs.github.io/)
- [Node.js Security Checklist](https://github.com/goldbergyoni/nodebestpractices#6-security-best-practices)

---

## 🤝 Contributing

When contributing, ensure:
- All new endpoints have rate limiting
- All user inputs are validated
- No API keys in code
- Security tests pass
- Documentation updated

---

## 📝 License

MIT License - See LICENSE file for details

---

## 👨‍💻 Support

For security issues, please contact: [Your secure contact method]

**DO NOT** publicly disclose security vulnerabilities.
