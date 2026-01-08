# 🚀 Quick Start Guide

## For First-Time Setup

### 1. Install Node.js
If you don't have Node.js installed:
- Visit https://nodejs.org/
- Download and install the LTS version (v16+)
- Verify installation: `node --version` and `npm --version`

### 2. Install Dependencies
```bash
cd "Portfolio Site"
npm install
```

This will install all required security packages.

### 3. Set Up Environment Variables

Copy the example file:
```bash
# Windows PowerShell
copy .env.example .env

# macOS/Linux
cp .env.example .env
```

The default `.env` is already configured for development. For production, edit `.env`:

```env
NODE_ENV=production
PORT=3000
ALLOWED_ORIGINS=https://yourdomain.com
```

### 4. Start the Server

**Development mode (with auto-reload):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

### 5. Open in Browser
Navigate to: **http://localhost:3000**

You should see:
```
╔═══════════════════════════════════════════════╗
║   🔒 SECURE PORTFOLIO API SERVER             ║
║                                               ║
║   Port: 3000                                  ║
║   Environment: development                    ║
║   Security: ✓ Enabled                        ║
║   Rate Limiting: ✓ Active                    ║
║   Input Validation: ✓ Active                 ║
║                                               ║
║   Server is running securely!                ║
╔═══════════════════════════════════════════════╝
```

---

## Testing the API

### Test Health Check
```bash
curl http://localhost:3000/api/health
```

Expected response:
```json
{
  "status": "success",
  "message": "API is running",
  "timestamp": "2026-01-06T..."
}
```

### Test GitHub API
```bash
curl http://localhost:3000/api/github/contributions?username=codeREDxbt
```

### Test Rate Limiting
```bash
# Make 101 requests quickly (should get rate limited)
for i in {1..101}; do 
  curl -s http://localhost:3000/api/health
done
```

You should see a 429 error after 100 requests.

---

## Common Issues

### "Cannot find module 'express'"
**Solution:** Run `npm install`

### "Port 3000 is already in use"
**Solution:** 
- Change PORT in `.env` to another port (e.g., 3001)
- Or stop the process using port 3000

### "CORS error in browser"
**Solution:** 
- Add your domain to `ALLOWED_ORIGINS` in `.env`
- Make sure to restart the server after changing `.env`

### API endpoints return 404
**Solution:**
- Make sure the server is running
- Check that you're accessing `/api/` endpoints (e.g., `/api/health`)
- Verify no typos in the endpoint URL

---

## Next Steps

1. **Read Security Documentation**
   - Open [SECURITY.md](SECURITY.md) for detailed security features

2. **Configure Production Settings**
   - Update `.env` with your actual API keys
   - Set up HTTPS with a reverse proxy (Nginx/Apache)
   - Configure your domain in ALLOWED_ORIGINS

3. **Monitor Your Application**
   - Check server logs for errors
   - Monitor rate limit violations
   - Track API usage

4. **Deploy**
   - Push to your hosting service (Heroku, DigitalOcean, AWS, etc.)
   - Set environment variables in your hosting platform
   - Enable HTTPS/SSL certificates

---

## Development Tips

### Auto-reload on Changes
Using `npm run dev` (nodemon) will automatically restart the server when you edit:
- `server.js`
- `.env`
- Any JavaScript files

### Debugging
Add this to your code to see detailed logs:
```javascript
console.log('Debug:', variable);
```

Or use Node.js debugger:
```bash
node --inspect server.js
```

### Testing Different Environments
```bash
# Test as production
NODE_ENV=production npm start

# Test as development
NODE_ENV=development npm start
```

---

## Useful Commands

```bash
# Install dependencies
npm install

# Start server (production)
npm start

# Start with auto-reload (development)
npm run dev

# Check for security vulnerabilities
npm audit

# Fix vulnerabilities automatically
npm audit fix

# Update all packages
npm update

# Check outdated packages
npm outdated
```

---

## Need Help?

- 📖 **Security details:** See [SECURITY.md](SECURITY.md)
- 📋 **Full documentation:** See [README.md](README.md)
- 🐛 **Found a bug?** Check server logs in console
- 🔐 **Security issue?** Contact privately

---

**Happy coding! 🎉**
