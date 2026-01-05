# codeRED | Portfolio Site

A modern, interactive portfolio website showcasing Web3 and fullstack development projects with advanced animations, theming, and user engagement features.

## Description
This portfolio showcases projects and skills as a Web3 x Fullstack Developer. Built with semantic HTML5, CSS3, and vanilla JavaScript, it features a sophisticated dark theme with glassmorphism design, animated backgrounds, and extensive interactivity.

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
- **HTML5**: Semantic markup with accessibility features
- **CSS3**: 
  - CSS Grid & Flexbox layouts
  - CSS Custom Properties (variables)
  - Keyframe animations
  - Backdrop filters for glassmorphism
- **JavaScript (ES6+)**:
  - Classes for component architecture
  - Async/await for API calls
  - Event delegation
  - Local Storage API
  - Canvas API for particle effects
- **External APIs**:
  - GitHub API for contribution data
  - CountAPI for visitor tracking
  - Google Fonts (Inter family)

## How to View
1. Clone the repository
2. Open `index.html` in any modern web browser (Chrome, Edge, Firefox, Safari)
3. No build process or dependencies required - runs entirely in the browser
4. For best experience, use a desktop browser with JavaScript enabled

## Project Structure
```
Portfolio Site/
├── index.html          # Main HTML structure
├── style.css          # Complete styling (1978 lines)
├── script.js          # All functionality (873 lines)
├── codeRED logo.png   # Profile avatar
├── resume.pdf         # Resume download
└── README.md          # This file
```

## Browser Compatibility
- Chrome/Edge: ✅ Full support
- Firefox: ✅ Full support
- Safari: ✅ Full support
- Mobile browsers: ✅ Optimized for touch

## Future Enhancements
- Real-time Spotify integration
- Blog section with articles
- Project case studies with detailed pages
- Animated page transitions
- Multi-language support
