# 🚀 Deployment Checklist

Use this checklist when deploying your secure portfolio site to production.

---

## Pre-Deployment

### Security Configuration

- [ ] **Environment Variables Set**
  - [ ] `NODE_ENV=production` configured
  - [ ] `PORT` set correctly
  - [ ] `ALLOWED_ORIGINS` updated with your domain(s)
  - [ ] API keys added (GitHub, CountAPI, Email service)
  - [ ] Session secrets generated (use crypto.randomBytes)

- [ ] **Sensitive Files Protected**
  - [ ] `.env` file NOT in git repository (check: `git status`)
  - [ ] `.gitignore` includes `.env`
  - [ ] No API keys in source code
  - [ ] No passwords or secrets committed

- [ ] **Dependencies Updated**
  - [ ] Run `npm update`
  - [ ] Run `npm audit`
  - [ ] Fix any vulnerabilities: `npm audit fix`
  - [ ] No critical or high severity issues

### Code Review

- [ ] **Security Features Tested**
  - [ ] Rate limiting working (test with curl loop)
  - [ ] Input validation rejecting bad data
  - [ ] XSS prevention working (test script tags)
  - [ ] Error messages don't leak sensitive info
  - [ ] CORS configured correctly

- [ ] **Functionality Verified**
  - [ ] GitHub API endpoint working
  - [ ] Visitor counter incrementing
  - [ ] Contact form submitting
  - [ ] Booking form working
  - [ ] All frontend features functional

---

## Server Setup

### SSL/TLS Configuration

- [ ] **HTTPS Enabled**
  - [ ] SSL certificate obtained (Let's Encrypt recommended)
  - [ ] Certificate installed and configured
  - [ ] HTTP to HTTPS redirect enabled
  - [ ] Certificate auto-renewal set up

### Reverse Proxy (Nginx/Apache)

- [ ] **Proxy Configured**
  - [ ] Nginx/Apache installed
  - [ ] Proxy pass to Node.js app configured
  - [ ] Proxy headers set correctly (X-Forwarded-For, etc.)
  - [ ] Static files served efficiently
  - [ ] Gzip compression enabled

Example Nginx config:
```nginx
server {
    listen 80;
    server_name yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com;

    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### Process Management

- [ ] **PM2 or Systemd Configured**
  - [ ] Auto-restart on crash enabled
  - [ ] Auto-start on server reboot enabled
  - [ ] Log rotation configured
  - [ ] Max memory limits set

Using PM2:
```bash
npm install -g pm2
pm2 start server.js --name portfolio
pm2 startup
pm2 save
```

---

## Monitoring & Logging

### Logging Setup

- [ ] **Application Logs**
  - [ ] Log directory created and writable
  - [ ] Winston or similar logger configured
  - [ ] Log rotation enabled
  - [ ] Error logs separate from access logs

- [ ] **Security Logs**
  - [ ] Rate limit violations logged
  - [ ] Failed validation attempts logged
  - [ ] API errors logged
  - [ ] Suspicious activity alerts set up

### Monitoring

- [ ] **Uptime Monitoring**
  - [ ] Uptime monitoring service configured (UptimeRobot, Pingdom, etc.)
  - [ ] Email/SMS alerts enabled
  - [ ] Health check endpoint monitored

- [ ] **Performance Monitoring**
  - [ ] Response time tracking
  - [ ] Error rate monitoring
  - [ ] API usage statistics
  - [ ] Resource usage (CPU, memory) tracked

---

## Security Hardening

### Server Security

- [ ] **Firewall Configured**
  - [ ] Only necessary ports open (80, 443, SSH)
  - [ ] SSH port changed from default 22
  - [ ] SSH key authentication only (no passwords)
  - [ ] Fail2ban installed and configured

- [ ] **System Updates**
  - [ ] Operating system fully updated
  - [ ] Automatic security updates enabled
  - [ ] Node.js on supported LTS version

### Application Security

- [ ] **Security Headers Verified**
  - [ ] Test at securityheaders.com
  - [ ] All A+ ratings achieved
  - [ ] CSP properly configured
  - [ ] HSTS enabled with preload

- [ ] **API Security**
  - [ ] All endpoints have rate limiting
  - [ ] All inputs validated server-side
  - [ ] No debug endpoints in production
  - [ ] API keys rotated from development

---

## Performance Optimization

- [ ] **Caching**
  - [ ] Redis or node-cache configured
  - [ ] Cache headers set for static assets
  - [ ] API responses cached where appropriate
  - [ ] CDN configured for static assets (optional)

- [ ] **Database** (if applicable)
  - [ ] Database indexes created
  - [ ] Connection pooling configured
  - [ ] Query optimization done
  - [ ] Backups automated

---

## DNS & Domain

- [ ] **DNS Records**
  - [ ] A record pointing to server IP
  - [ ] AAAA record for IPv6 (if available)
  - [ ] WWW subdomain configured
  - [ ] DNS propagation verified

- [ ] **Domain Security**
  - [ ] Domain registrar 2FA enabled
  - [ ] Domain auto-renewal enabled
  - [ ] Domain privacy protection enabled
  - [ ] DNSSEC enabled (optional)

---

## Testing

### Pre-Launch Tests

- [ ] **Functionality Tests**
  - [ ] All pages load correctly
  - [ ] All forms submit successfully
  - [ ] All API endpoints respond correctly
  - [ ] Mobile responsiveness verified
  - [ ] Cross-browser testing done

- [ ] **Security Tests**
  ```bash
  # Rate limiting
  for i in {1..101}; do curl https://yourdomain.com/api/health; done
  
  # Input validation
  curl -X POST https://yourdomain.com/api/contact \
    -H "Content-Type: application/json" \
    -d '{"name":"<script>alert(1)</script>","email":"bad","message":"x"}'
  
  # HTTPS
  curl -I https://yourdomain.com
  
  # Security headers
  curl -I https://yourdomain.com | grep -i "x-"
  ```

- [ ] **Performance Tests**
  - [ ] Load time under 3 seconds
  - [ ] Lighthouse score > 90
  - [ ] PageSpeed Insights score > 90
  - [ ] Load testing done (Artillery, k6, etc.)

### Security Scanning

- [ ] **Automated Scans**
  - [ ] OWASP ZAP scan completed
  - [ ] Nikto scan completed
  - [ ] SSL Labs test: A+ rating
  - [ ] Security Headers test: A+ rating
  - [ ] No critical vulnerabilities found

---

## Documentation

- [ ] **Internal Documentation**
  - [ ] Deployment procedures documented
  - [ ] Emergency contacts listed
  - [ ] Rollback procedures documented
  - [ ] Server access details secured

- [ ] **User Documentation**
  - [ ] README.md updated with production URLs
  - [ ] API documentation published
  - [ ] Contact information updated
  - [ ] Terms of service and privacy policy (if needed)

---

## Backup & Recovery

- [ ] **Backup Strategy**
  - [ ] Automated backups configured
  - [ ] Backup location secure and redundant
  - [ ] Backup restoration tested
  - [ ] Database backups (if applicable)
  - [ ] Code repository backed up

- [ ] **Disaster Recovery Plan**
  - [ ] Recovery procedures documented
  - [ ] RTO (Recovery Time Objective) defined
  - [ ] RPO (Recovery Point Objective) defined
  - [ ] Team contact list updated

---

## Post-Deployment

### Immediate Actions

- [ ] **Verify Deployment**
  - [ ] Site accessible at production URL
  - [ ] All features working correctly
  - [ ] No console errors in browser
  - [ ] Server logs show no errors
  - [ ] Analytics tracking working (if configured)

- [ ] **Monitor First 24 Hours**
  - [ ] Check server resources (CPU, memory, disk)
  - [ ] Review logs for errors or warnings
  - [ ] Monitor response times
  - [ ] Check for failed requests
  - [ ] Verify rate limiting not blocking legitimate users

### First Week

- [ ] **Performance Review**
  - [ ] Analyze traffic patterns
  - [ ] Review API usage statistics
  - [ ] Check error rates
  - [ ] Optimize based on metrics

- [ ] **Security Review**
  - [ ] Review security logs
  - [ ] Check for unusual activity
  - [ ] Verify rate limits are appropriate
  - [ ] Update documentation with findings

---

## Ongoing Maintenance

### Weekly

- [ ] Review server logs for errors
- [ ] Check disk space and resource usage
- [ ] Monitor uptime and response times
- [ ] Review security logs

### Monthly

- [ ] Update dependencies: `npm update`
- [ ] Run security audit: `npm audit`
- [ ] Review and rotate logs
- [ ] Check SSL certificate expiry
- [ ] Backup verification test

### Quarterly

- [ ] **API Key Rotation**
  - [ ] Generate new API keys
  - [ ] Update .env file
  - [ ] Test thoroughly
  - [ ] Revoke old keys
  - [ ] Document rotation date

- [ ] Full security review
- [ ] Performance optimization review
- [ ] Update emergency procedures
- [ ] Disaster recovery drill

---

## Emergency Contacts

Document these for your team:

- **Hosting Provider Support:** [Phone/Email]
- **DNS Provider Support:** [Phone/Email]
- **Development Team Lead:** [Contact]
- **System Administrator:** [Contact]
- **Security Contact:** [Contact]

---

## Rollback Procedure

If something goes wrong:

1. **Immediate Actions**
   ```bash
   # Stop the application
   pm2 stop portfolio
   
   # Or revert to previous version
   git checkout <previous-commit-hash>
   npm install
   pm2 restart portfolio
   ```

2. **Investigate**
   - Check logs: `pm2 logs portfolio`
   - Review recent changes
   - Test in staging environment

3. **Document Incident**
   - What went wrong
   - When it happened
   - How it was fixed
   - Lessons learned

---

## Success Criteria

Your deployment is successful when:

- ✅ Site is accessible via HTTPS
- ✅ All security tests pass
- ✅ No critical errors in logs
- ✅ Performance metrics met
- ✅ Monitoring and alerts working
- ✅ Backup and recovery tested
- ✅ Team trained and documentation complete

---

## 🎉 Launch!

Once all items are checked:

1. Announce the launch
2. Monitor closely for first 24-48 hours
3. Gather user feedback
4. Plan iterative improvements

**Congratulations on your secure deployment!** 🚀🔒

---

**Last Updated:** [Add date when you complete deployment]
**Deployed By:** [Your name]
**Production URL:** [Your domain]
