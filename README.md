# codeRED | Portfolio Site

A modern, interactive portfolio website showcasing Web3 and fullstack development projects with advanced animations, theming, and user engagement features.

## 🔒 Security Features

**This portfolio has been hardened with comprehensive security measures following OWASP best practices:**

- ✅ **Rate Limiting**: IP-based protection on all API endpoints with graceful 429 responses
- ✅ **Input Validation**: Schema-based validation, type checking, length limits, and sanitization
- ✅ **Secure API Key Handling**: Environment variables, no hardcoded keys, API proxy pattern
- ✅ **XSS Prevention**: Client and server-side input sanitization
- ✅ **NoSQL Injection Protection**: Sanitized queries and parameterization
- ✅ **Security Headers**: Helmet.js with CSP, HSTS, and XSS protection
- ✅ **CORS Protection**: Configurable allowed origins
- ✅ **DoS Prevention**: Request size limits and timeouts

**[📖 Read the complete security documentation →](SECURITY.md)**

---

## Description
This portfolio showcases projects and skills as a Web3 x Fullstack Developer. Built with semantic HTML5, CSS3, vanilla JavaScript, and a secure Node.js/Express backend for API management.

## Key Features

### 🎨 Theme & Design
- **Dark/Light Mode Toggle**: Complete theme switching with persistent localStorage, including sound effects on toggle
- **Animated Starfield Background**: Three-layer CSS star animation for depth
- **Particle System**: Canvas-based interactive particle effects with mouse repulsion
- **Glassmorphism UI**: Frosted glass effects with backdrop blur throughout the interface
- **Cursor Trail Effect**: Custom animated cursor trail following mouse movement
- **Parallax Effects**: 3D tilt effect on hero card responding to mouse position

### 🚀 Hero Section
- **NPX Command Card**: Copy-to-clipboard NPX command with visual feedback
- **Profile Card**: Verified badge, email link, and professional information
- **Dynamic Status Badges**: 
  - "Currently Building" badge showing active project (GigChain)
  - Spotify integration badge (Not Playing status)
  - Dismissible badges with smooth animations
- **Social Media Integration**: Direct links to Twitter/X with custom card icon

### 📊 GitHub Activity
- **Live Contribution Graph**: Fetches real GitHub activity data via API
- **Interactive Heatmap**: 52-week contribution visualization with hover tooltips
- **Fallback System**: Graceful degradation with random data if API limit reached
- **Activity Counter**: Displays total contributions (1,332+ contributions)

### 💼 Projects Showcase
- **Horizontal Scroll Gallery**: Drag-to-scroll project cards with infinite loop
- **Project Cards**: 4 featured blockchain/Web3 projects:
  - **GigChain**: Decentralized freelancing platform (Solidity, React, Web3, Ethereum)
  - **MediChainAi**: AI-powered medical records on blockchain (Python, AI/ML, Blockchain, React)
  - **Blockademia.live**: Web3 educational platform (Solidity, React, Node.js, Web3)
  - **Aptos LMS**: No-code learning management system (Move, Aptos, React, TypeScript)
- **Interactive Previews**: Mock search/URL inputs on each card
- **Technology Icons**: Visual tech stack indicators with tooltips

### 🛠️ Tech Stack Section
- **Interactive Tech Icons**: 13+ technology logos with hover effects:
  - Languages: JavaScript, TypeScript, Python, Solidity, Move
  - Frameworks: React, Node.js, Express, Web3.js
  - Tools: Ethereum, Git, VS Code, Figma
  - Web: HTML5, CSS3
- **SVG Graphics**: Crisp, scalable vector icons with gradient fills
- **External Links**: Direct navigation to official documentation

### 📅 Calendar Booking System
- **Custom Cal.com Integration**: Full-featured booking interface
- **Month Navigation**: Browse through months with arrow controls
- **Date Selection**: Interactive calendar grid with visual selected state
- **Time Slots**: 15-minute intervals from 17:00 to 19:45
- **Meeting Details**: 
  - Duration indicator (15m)
  - Platform badge (Discord)
  - Timezone display (Asia/Kolkata)
- **Email Notification**: Automatic mailto link generation with booking details
- **Modal Interface**: Overlay with close button and backdrop click dismissal

### 📧 Contact Section
- **Call-to-Action Buttons**:
  - Book a Call (Cal.com integration)
  - Resume download link
- **Social Links**: Twitter, LinkedIn, GitHub with icons
- **Inspirational Quote**: Custom blockquote styling
- **Visitor Counter**: 
  - Real-time visitor tracking via CountAPI
  - Persistent localStorage fallback
  - Animated number display (36,761+ visitors)

### 🎯 Navigation & UX
- **Icon-Based Navigation**: Minimal navbar with SVG icons
  - Home, Projects, Stack, Email
  - Social media quick links (GitHub, LinkedIn, Twitter/X)
  - Theme toggle button
- **Smooth Scrolling**: Anchor link navigation with easing
- **Scroll Animations**: Intersection Observer for fade-in effects
- **Back to Top Button**: Footer button with smooth scroll
- **Console Easter Egg**: Custom console art with contact information

### ⚡ Performance & Optimization
- **Debounced Events**: Optimized resize and scroll handlers
- **RequestAnimationFrame**: Smooth animations using browser optimization
- **Lazy Loading**: Progressive content loading with Intersection Observer
- **Local Storage**: Theme and visitor preferences persistence
- **Responsive Images**: Optimized assets for different screen sizes

## Responsive Design
The site is fully responsive across all devices:

- **Desktop (> 1024px)**: Full layout with side-by-side content sections
- **Tablet (768px - 1024px)**: Adjusted grid layouts and spacing
- **Mobile (< 768px)**: 
  - Stacked vertical layout
  - Single-column tech stack
  - Touch-optimized interactions
  - Simplified navigation

## Technologies Used
- **Frontend**:
  - HTML5: Semantic markup with accessibility features
  - CSS3: Grid, Flexbox, Custom Properties, Keyframe animations, Backdrop filters
  - JavaScript (ES6+): Classes, Async/await, Event delegation, Canvas API
  
- **Backend (Secure API Server)**:
  - Node.js & Express: RESTful API server
  - Helmet: Security headers (CSP, HSTS, XSS protection)
  - express-rate-limit: IP-based rate limiting
  - express-validator: Input validation and sanitization
  - express-mongo-sanitize: NoSQL injection prevention
  - node-cache: Response caching
  - CORS: Cross-origin resource sharing control
  - dotenv: Environment variable management
  
- **External APIs**:
  - GitHub API for contribution data (proxied through backend)
  - CountAPI for visitor tracking (proxied through backend)
  - Google Fonts (Inter family)

## 🚀 How to Run

### Quick Start (Static Frontend Only)
1. Clone the repository
2. Open `index.html` in any modern web browser
3. Note: API features will not work without the backend server

### Full Setup (With Secure Backend)

**Prerequisites:**
- Node.js 16+ and npm installed
- Git

**Installation:**

```bash
# 1. Clone the repository
git clone <repository-url>
cd "Portfolio Site"

# 2. Install dependencies
npm install

# 3. Configure environment variables
cp .env.example .env
# Edit .env and add your configuration

# 4. Start the server
npm start

# For development with auto-reload:
npm run dev
```

**Access the site:**
- Open browser to `http://localhost:3000`
- All API endpoints available at `http://localhost:3000/api/`

**Environment Configuration:**
Edit `.env` file with your settings:
```env
NODE_ENV=production
PORT=3000
ALLOWED_ORIGINS=http://localhost:3000,https://yourdomain.com
COUNT_API_URL=https://api.countapi.xyz/hit/your-namespace/your-key
```

See [SECURITY.md](SECURITY.md) for detailed setup instructions and security configuration.

## 📁 Project Structure
```
Portfolio Site/
├── index.html              # Main HTML structure
├── style.css              # Complete styling (2716 lines)
├── script.js              # Frontend functionality with security utils
├── server.js              # Secure Express.js API server
├── package.json           # Node.js dependencies
├── .env.example           # Environment variables template
├── .env                   # Your configuration (git-ignored)
├── .gitignore            # Git ignore rules (includes .env)
├── SECURITY.md           # Comprehensive security documentation
├── README.md             # This file
├── codeRED logo.png      # Profile avatar
└── resume.pdf            # Resume download
```

## 🔐 API Endpoints

All endpoints are prefixed with `/api/` and include rate limiting:

- `GET /api/health` - Health check
- `GET /api/github/contributions?username=<username>` - GitHub contributions (30/hour)
- `POST /api/visitor/increment` - Visitor counter (10/5min)
- `POST /api/contact` - Contact form (5/hour)
- `POST /api/booking` - Calendar booking (5/hour)

See [SECURITY.md](SECURITY.md) for complete API documentation and security details.

## Browser Compatibility
- Chrome/Edge: ✅ Full support
- Firefox: ✅ Full support
- Safari: ✅ Full support
- Mobile browsers: ✅ Optimized for touch

## 🧪 Testing Security

Test rate limiting:
```bash
# Should block after 100 requests in 15 minutes
for i in {1..150}; do curl http://localhost:3000/api/health; done
```

Test input validation:
```bash
# Should reject invalid inputs with 400 error
curl -X POST http://localhost:3000/api/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"<script>alert(1)</script>","email":"bad","message":"x"}'
```

See [SECURITY.md](SECURITY.md) for comprehensive testing guide.

## 📝 Security Best Practices

1. **Never commit `.env` file** - Contains sensitive API keys
2. **Rotate API keys regularly** - Every 90 days recommended
3. **Monitor rate limits** - Check logs for suspicious activity
4. **Keep dependencies updated** - Run `npm audit` regularly
5. **Use HTTPS in production** - Configure SSL/TLS certificates
6. **Set NODE_ENV=production** - For production deployments

## Future Enhancements
- Real-time Spotify integration
- Blog section with articles
- Project case studies with detailed pages
- Animated page transitions
- Multi-language support
- Enhanced analytics dashboard
- Two-factor authentication for admin features

## 🤝 Contributing

When contributing:
- Ensure all new endpoints have rate limiting
- Validate and sanitize all user inputs
- Never commit API keys or secrets
- Update security documentation
- Test security features

## 📞 Support

For general questions: See documentation
For security issues: Contact privately (don't publicly disclose)

## 📄 License

MIT License - See LICENSE file for details

---

**Built with security in mind by codeRED** 🔒
