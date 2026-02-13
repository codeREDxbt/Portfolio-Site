function sanitizeInput(input) {
  if (typeof input !== 'string') return '';
  let sanitized = input.replace(/<[^>]*>/g, '');
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

function isValidEmail(email) {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email) && email.length <= 254;
}

function isValidLength(str, min, max) {
  const length = str.trim().length;
  return length >= min && length <= max;
}

function containsSpam(text) {
  const spamPatterns = [
    /viagra|cialis|casino|lottery/gi,
    /<script|javascript:|onclick|onerror/gi,
  ];

  return spamPatterns.some(pattern => pattern.test(text));
}

async function submitContactForm(name, email, message, subject = '') {
  try {
    if (!isValidLength(name, 2, 100)) {
      throw new Error('Name must be between 2 and 100 characters');
    }

    if (!isValidEmail(email)) {
      throw new Error('Please enter a valid email address');
    }

    if (!isValidLength(message, 10, 5000)) {
      throw new Error('Message must be between 10 and 5000 characters');
    }

    if (subject && !isValidLength(subject, 0, 200)) {
      throw new Error('Subject is too long (max 200 characters)');
    }

    if (containsSpam(message) || containsSpam(subject)) {
      throw new Error('Message contains prohibited content');
    }

    const sanitizedData = {
      name: sanitizeInput(name),
      email: email.trim().toLowerCase(),
      message: sanitizeInput(message),
      subject: sanitizeInput(subject)
    };

    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(sanitizedData)
    });

    const result = await response.json();

    if (response.status === 429) {
      return {
        success: false,
        message: result.message || 'Too many requests. Please try again later.'
      };
    }

    if (response.status === 400) {
      return {
        success: false,
        message: result.message || 'Invalid input. Please check your data.'
      };
    }

    if (result.status === 'success') {
      return {
        success: true,
        message: result.message
      };
    }

    throw new Error(result.message || 'Failed to send message');

  } catch (error) {
    console.error('Contact form error:', error);
    return {
      success: false,
      message: error.message || 'Failed to send message. Please try again later.'
    };
  }
}

function initThemeToggle() {
  const themeToggle = document.getElementById('themeToggle');

  const clickSound = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTGH0fPTgjMGHm7A7+OZRAE');
  clickSound.volume = 0.3;

  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'light') {
    document.body.classList.add('light-mode');
  }

  if (!themeToggle) return;

  themeToggle.addEventListener('click', () => {
    clickSound.currentTime = 0;
    clickSound.play().catch(e => console.log('Audio play failed:', e));

    document.body.classList.toggle('light-mode');

    if (document.body.classList.contains('light-mode')) {
      localStorage.setItem('theme', 'light');
    } else {
      localStorage.setItem('theme', 'dark');
    }
  });
}

let currentMonth = 0; // January 2026
let currentYear = 2026;
let selectedDay = 6;

function openCalendar() {
  const calendarBooking = document.getElementById('calendarBooking');
  if (calendarBooking) {
    calendarBooking.classList.add('active');
    generateCalendar();
    generateTimeslots();
  }
}

function closeCalendar() {
  const calendarBooking = document.getElementById('calendarBooking');
  if (calendarBooking) {
    calendarBooking.classList.remove('active');
  }
}

function changeMonth(direction) {
  currentMonth += direction;
  if (currentMonth > 11) {
    currentMonth = 0;
    currentYear++;
  } else if (currentMonth < 0) {
    currentMonth = 11;
    currentYear--;
  }
  generateCalendar();
}

function generateCalendar() {
  const calendarDays = document.getElementById('calendarDays');
  if (!calendarDays) return;

  calendarDays.innerHTML = '';

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];

  const monthDisplay = document.querySelector('.calendar-month');
  if (monthDisplay) {
    monthDisplay.innerHTML = `${monthNames[currentMonth]} <span>${currentYear}</span>`;
  }

  const firstDay = new Date(currentYear, currentMonth, 1).getDay();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  for (let i = 0; i < firstDay; i++) {
    const emptyDay = document.createElement('div');
    emptyDay.className = 'calendar-day disabled';
    calendarDays.appendChild(emptyDay);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const dayEl = document.createElement('div');
    dayEl.className = 'calendar-day';
    dayEl.textContent = day;

    if (day === selectedDay && currentMonth === 0 && currentYear === 2026) {
      dayEl.classList.add('selected');
    }

    dayEl.addEventListener('click', () => {
      document.querySelectorAll('.calendar-day').forEach(d => d.classList.remove('selected'));
      dayEl.classList.add('selected');
      selectedDay = day;
      generateTimeslots();
    });

    calendarDays.appendChild(dayEl);
  }
}

function generateTimeslots() {
  const timeslotsList = document.getElementById('timeslotsList');
  if (!timeslotsList) return;

  timeslotsList.innerHTML = '';

  const times = [
    '17:00', '17:15', '17:30', '17:45',
    '18:00', '18:15', '18:30', '18:45',
    '19:00', '19:15', '19:30', '19:45'
  ];

  times.forEach(time => {
    const slot = document.createElement('div');
    slot.className = 'timeslot';
    slot.textContent = time;
    slot.addEventListener('click', () => {
      confirmBooking(time);
    });
    timeslotsList.appendChild(slot);
  });
}

function confirmBooking(time) {
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];

  const date = `${monthNames[currentMonth]} ${selectedDay}, ${currentYear}`;
  const name = prompt('Please enter your name:');
  if (!name || name.trim().length < 2) {
    alert('Please enter a valid name');
    return;
  }

  const email = prompt('Please enter your email:');
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    alert('Please enter a valid email address');
    return;
  }

  const bookingDate = new Date(currentYear, currentMonth, selectedDay);

  fetch('/api/booking', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      date: bookingDate.toISOString(),
      time: time
    })
  })
    .then(async response => {
      const result = await response.json();

      if (response.status === 429) {
        alert(`âš ï¸ ${result.message}`);
        return;
      }

      if (response.status === 400) {
        alert(`âš ï¸ ${result.message}`);
        return;
      }

      if (result.status === 'success') {
        alert(`âœ“ ${result.message}`);
        closeCalendar();
      } else {
        throw new Error(result.message);
      }
    })
    .catch(error => {
      console.error('Booking error:', error);
      alert('Failed to process booking. Please try again later.');
    });
}

// ==========================================
// GITHUB CONTRIBUTION GRAPH - SECURE API CALL
// ==========================================
async function generateGitHubGraph() {
  const graph = document.getElementById('contributionGraph');
  const contributionCountEl = document.querySelector('.contribution-count');
  if (!graph) return;

  const username = 'codeREDxbt';

  try {
    const response = await fetch(`/api/github-contributions?username=${encodeURIComponent(username)}`);

    if (response.status === 429) {
      const errorData = await response.json();
      console.log('Rate limit reached:', errorData.message);
      generateFallbackGraph(graph, username);
      return;
    }

    const result = await response.json();

    if (result.status !== 'success') {
      throw new Error(result.message || 'Failed to fetch data');
    }

    const data = result.data;

    const contributionMap = {};
    let totalContributions = 0;

    if (data && data.contributions) {
      data.contributions.forEach(contribution => {
        const dateStr = contribution.date;
        const count = contribution.count;
        contributionMap[dateStr] = count;
        totalContributions += count;
      });
    }

    if (contributionCountEl && totalContributions > 0) {
      contributionCountEl.textContent = `${totalContributions.toLocaleString()} contributions in the last year on GitHub`;
    }

    const weeks = 52;
    const daysPerWeek = 7;
    const now = new Date();
    const oneYearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
    let cellIndex = 0;

    for (let week = 0; week < weeks; week++) {
      for (let day = 0; day < daysPerWeek; day++) {
        const cell = document.createElement('a');
        cell.className = 'graph-cell';
        cell.href = `https://github.com/${username}`;
        cell.target = '_blank';
        cell.rel = 'noopener noreferrer';
        cell.style.cursor = 'pointer';

        const cellDate = new Date(oneYearAgo.getTime() + (cellIndex * 24 * 60 * 60 * 1000));
        const dateStr = cellDate.toISOString().split('T')[0];

        const contributions = contributionMap[dateStr] || 0;
        let level = 0;
        if (contributions > 0) level = 1;
        if (contributions > 3) level = 2;
        if (contributions > 6) level = 3;
        if (contributions > 10) level = 4;

        cell.classList.add(`level-${level}`);

        const text = contributions > 0 ? `${contributions} contributions` : 'No contributions';
        cell.title = `${text} on ${dateStr}`;

        graph.appendChild(cell);
        cellIndex++;
      }
    }
  } catch (error) {
    console.error('GitHub API Error:', error.message);

    generateFallbackGraph(graph, username);
  }
}

// Helper function to generate fallback graph
function generateFallbackGraph(graph, username) {
  const weeks = 52;
  const daysPerWeek = 7;

  for (let week = 0; week < weeks; week++) {
    for (let day = 0; day < daysPerWeek; day++) {
      const cell = document.createElement('a');
      cell.className = 'graph-cell';
      cell.href = `https://github.com/${username}`;
      cell.target = '_blank';
      cell.rel = 'noopener noreferrer';
      cell.style.cursor = 'pointer';

      const level = Math.floor(Math.random() * 5);
      const adjustedLevel = level < 3 ? Math.floor(Math.random() * 3) : level;

      cell.classList.add(`level-${adjustedLevel}`);
      cell.title = `${adjustedLevel * 5} contributions`;

      graph.appendChild(cell);
    }
  }
}

class ParticleSystem {
  constructor() {
    this.canvas = document.createElement('canvas');
    this.canvas.id = 'particles';
    this.canvas.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 1;
    `;
    document.body.insertBefore(this.canvas, document.body.firstChild);

    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.mouse = { x: 0, y: 0 };
    this.connectionDistance = 100;

    this.resize();
    this.init();
    this.animate();

    window.addEventListener('resize', () => this.resize());
    window.addEventListener('mousemove', (e) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
    });
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  init() {
    this.particles = [];
    const particleCount = Math.floor((this.canvas.width * this.canvas.height) / 15000);

    for (let i = 0; i < particleCount; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        radius: Math.random() * 2 + 1,
        opacity: Math.random() * 0.5 + 0.2
      });
    }
  }

  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.particles.forEach((particle, i) => {
      particle.x += particle.vx;
      particle.y += particle.vy;

      const dx = this.mouse.x - particle.x;
      const dy = this.mouse.y - particle.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < 150) {
        const force = (150 - distance) / 150;
        particle.x -= dx * force * 0.02;
        particle.y -= dy * force * 0.02;
      }

      if (particle.x < 0 || particle.x > this.canvas.width) particle.vx *= -1;
      if (particle.y < 0 || particle.y > this.canvas.height) particle.vy *= -1;

      this.ctx.beginPath();
      this.ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
      const isLightMode = document.body.classList.contains('light-mode');
      this.ctx.fillStyle = isLightMode
        ? `rgba(0, 0, 0, ${particle.opacity})`
        : `rgba(255, 255, 255, ${particle.opacity})`;
      this.ctx.fill();
    });

    requestAnimationFrame(() => this.animate());
  }
}

function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
}

function initHeaderScroll() {
  let lastScroll = 0;
  const header = document.querySelector('.site-header');
  const navbar = document.querySelector('.navbar');

  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (header) {
      if (currentScroll > 100) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }

      if (currentScroll > lastScroll && currentScroll > 200) {
        header.style.transform = 'translateY(-100%)';
      } else {
        header.style.transform = 'translateY(0)';
      }
    }

    if (navbar) {
      if (currentScroll > lastScroll && currentScroll > 150) {
        navbar.classList.add('navbar-hidden');
      } else {
        navbar.classList.remove('navbar-hidden');
      }
    }

    lastScroll = currentScroll;
  });
}

function initCopyButton() {
  const copyBtn = document.querySelector('.npx-copy');
  if (!copyBtn) return;

  copyBtn.addEventListener('click', async () => {
    const code = document.querySelector('.npx-code').textContent;

    try {
      await navigator.clipboard.writeText(code);

      copyBtn.textContent = 'âœ“';
      copyBtn.style.color = '#10b981';

      setTimeout(() => {
        copyBtn.textContent = 'ðŸ“‹';
        copyBtn.style.color = '';
      }, 2000);
    } catch (err) {
      console.error('Failed to copy:', err);

      const textarea = document.createElement('textarea');
      textarea.value = code;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();

      try {
        document.execCommand('copy');
        copyBtn.textContent = 'âœ“';
        copyBtn.style.color = '#10b981';
        setTimeout(() => {
          copyBtn.textContent = 'ðŸ“‹';
          copyBtn.style.color = '';
        }, 2000);
      } catch (err) {
        console.error('Fallback copy failed:', err);
      }

      document.body.removeChild(textarea);
    }
  });
}

function initProfileAvatar() {
  const profileAvatar = document.querySelector('.profile-avatar');
  if (!profileAvatar) return;

  profileAvatar.addEventListener('click', () => {
    profileAvatar.style.animation = 'none';
    setTimeout(() => {
      profileAvatar.style.animation = '';
    }, 10);

    const ripple = document.createElement('div');
    ripple.style.cssText = `
      position: absolute;
      width: 140px;
      height: 140px;
      border-radius: 12px;
      border: 2px solid rgba(255, 255, 255, 0.6);
      top: ${profileAvatar.offsetTop - 10}px;
      left: ${profileAvatar.offsetLeft - 10}px;
      pointer-events: none;
      animation: ripple 0.6s ease-out;
    `;

    profileAvatar.parentElement.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  });
}

function initScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, observerOptions);
  document.querySelectorAll('.project-item, .stack-badge, .github-placeholder').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
  });
}

// ==========================================
// PROJECTS DATA & RENDERING
// ==========================================
const projects = [
  {
    name: 'PayTrack',
    tagline: 'Employee salary tracking, simplified.',
    subtitle: 'Attendance, overtime & payroll manager.',
    placeholder: 'Search employees...',
    icon: '💰',
    previewImage: './preview-paytrack.png',
    description: 'Employee salary tracker for managing attendance, overtime, and payroll with a clean, modern dashboard.',
    techStack: [
      { class: 'devicon-react-original', title: 'React' },
      { class: 'devicon-vitejs-plain', title: 'Vite' },
      { class: 'devicon-firebase-plain', title: 'Firebase' },
      { class: 'devicon-tailwindcss-original', title: 'Tailwind CSS' }
    ],
    liveUrl: 'https://paytrackx.vercel.app',
    repoUrl: 'https://github.com/codeREDxbt/PayTrack'
  },
  {
    name: 'MediChainAI',
    tagline: 'AI-powered healthcare, on-chain.',
    subtitle: 'Decentralized medical records & diagnostics.',
    placeholder: 'Search patient records...',
    icon: '🏥',
    description: 'AI-powered healthcare platform combining blockchain security with intelligent diagnostics for decentralized medical record management.',
    techStack: [
      { class: 'devicon-nextjs-plain', title: 'Next.js' },
      { class: 'devicon-typescript-plain', title: 'TypeScript' },
      { class: 'devicon-postgresql-plain', title: 'PostgreSQL' },
      { class: 'devicon-tailwindcss-original', title: 'Tailwind CSS' }
    ],
    liveUrl: '',
    repoUrl: 'https://github.com/codeREDxbt/Ryze-Ai'
  },
  {
    name: 'Ryze AI',
    tagline: 'Stop wasting ad budget, start scaling profits.',
    subtitle: 'AI-powered ad management platform.',
    placeholder: 'Analyze campaign performance...',
    icon: '📊',
    previewImage: './preview-ryze.png',
    description: 'AI-powered ad management platform that monitors campaigns 24/7, finds wasted spend, and optimizes performance automatically.',
    techStack: [
      { class: 'devicon-nextjs-plain', title: 'Next.js' },
      { class: 'devicon-tensorflow-original', title: 'AI/ML' },
      { class: 'devicon-typescript-plain', title: 'TypeScript' },
      { class: 'devicon-graphql-plain', title: 'Analytics' }
    ],
    liveUrl: 'https://ryze-ai-codered.vercel.app',
    repoUrl: 'https://github.com/codeREDxbt/Ryze-Ai'
  },
  {
    name: 'Blockademia.live',
    tagline: 'Learn Web3, earn certifications.',
    subtitle: 'Blockchain-based educational platform.',
    placeholder: 'Search courses...',
    icon: '🎓',
    previewImage: './preview-blockademia.png',
    description: 'Blockchain-based educational platform for Web3 learning, empowering users with decentralized knowledge and certifications.',
    techStack: [
      { class: 'devicon-solidity-plain', title: 'Solidity' },
      { class: 'devicon-react-original', title: 'React' },
      { class: 'devicon-nodejs-plain', title: 'Node.js' },
      { class: 'devicon-web3js-plain', title: 'Web3' }
    ],
    liveUrl: 'https://blockademia.live',
    repoUrl: 'https://github.com/codeREDxbt/blockademia-platform'
  },
  {
    name: 'Aptos LMS',
    tagline: 'No-code LMS on Aptos blockchain.',
    subtitle: 'Easy course creation with Move smart contracts.',
    placeholder: 'Create your course...',
    icon: '📚',
    previewImage: './preview-aptos.png',
    description: 'A no-code LMS dApp built on the Aptos blockchain, facilitating easy course creation and management with Move smart contracts.',
    techStack: [
      { text: 'M', title: 'Move' },
      { text: 'A', title: 'Aptos' },
      { class: 'devicon-react-original', title: 'React' },
      { class: 'devicon-typescript-plain', title: 'TypeScript' }
    ],
    liveUrl: 'https://no-code-lm-sbuilder-with-aptos-paym.vercel.app',
    repoUrl: 'https://github.com/codeREDxbt/NoCodeLMSbuilder-withAptosPayments'
  }
];

function buildCardHTML(project) {
  const techIconsHTML = project.techStack.map(tech => {
    if (tech.class) {
      return `<i class="${tech.class} tech-icon" title="${tech.title}"></i>`;
    }
    return `<span class="tech-icon" title="${tech.title}">${tech.text}</span>`;
  }).join('');

  // Always show both buttons; disable if no URL
  const liveClass = project.liveUrl ? 'card-link-btn card-link-primary' : 'card-link-btn card-link-primary card-link-disabled';
  const repoClass = project.repoUrl ? 'card-link-btn card-link-secondary' : 'card-link-btn card-link-secondary card-link-disabled';

  const liveBtn = project.liveUrl
    ? `<a href="${project.liveUrl}" target="_blank" rel="noreferrer noopener" class="${liveClass}" aria-label="View ${project.name} live site">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
        Live
      </a>`
    : `<span class="${liveClass}" aria-label="${project.name} is not live yet">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
        Live
      </span>`;

  const repoBtn = project.repoUrl
    ? `<a href="${project.repoUrl}" target="_blank" rel="noreferrer noopener" class="${repoClass}" aria-label="View ${project.name} source code on GitHub">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z"/></svg>
        Repo
      </a>`
    : `<span class="${repoClass}" aria-label="${project.name} repo is not public">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z"/></svg>
        Repo
      </span>`;

  const previewHTML = project.previewImage
    ? `<div class="card-preview card-preview--image">
        <img src="${project.previewImage}" alt="${project.name} preview" class="preview-img" loading="lazy" />
      </div>`
    : `<div class="card-preview">
        <div class="preview-content">
          <h3 class="preview-title">${project.tagline}</h3>
          <p class="preview-subtitle">${project.subtitle}</p>
          <div class="search-demo">
            <input type="text" placeholder="${project.placeholder}" readonly />
            <span class="search-icon">${project.icon}</span>
          </div>
        </div>
      </div>`;

  return `
    <article class="project-card">
      ${previewHTML}
      <div class="card-content">
        <h3 class="card-title">${project.name}</h3>
        <p class="card-description">${project.description}</p>
        <div class="card-tech">
          <span class="tech-label">TECHNOLOGIES</span>
          <div class="tech-icons">${techIconsHTML}</div>
        </div>
        <div class="card-links">
          ${liveBtn}
          ${repoBtn}
        </div>
      </div>
    </article>
  `;
}

function renderProjects() {
  const container = document.getElementById('projectsScroll');
  if (!container) return;

  // Build original cards
  const cardsHTML = projects.map(p => buildCardHTML(p)).join('');
  // Duplicate for infinite scroll effect
  container.innerHTML = cardsHTML + cardsHTML;
}

// ==========================================
// PROJECT CARDS SCROLL & NAVIGATION
// ==========================================
function initProjectsScroll() {
  const projectsScroll = document.querySelector('.projects-scroll');
  if (!projectsScroll) return;

  const cardWidth = 440; // card min-width + gap
  let autoScrollInterval = null;
  let isPaused = false;

  // --- JS-based auto-scroll ---
  function startAutoScroll() {
    if (autoScrollInterval) return;
    autoScrollInterval = setInterval(() => {
      if (isPaused) return;
      projectsScroll.scrollLeft += 1;
      // Loop back when reaching the duplicate set
      const halfScroll = projectsScroll.scrollWidth / 2;
      if (projectsScroll.scrollLeft >= halfScroll) {
        projectsScroll.scrollLeft = 0;
      }
    }, 20);
  }

  function stopAutoScroll() {
    clearInterval(autoScrollInterval);
    autoScrollInterval = null;
  }

  function pauseAutoScroll(durationMs) {
    isPaused = true;
    clearTimeout(projectsScroll._resumeTimer);
    projectsScroll._resumeTimer = setTimeout(() => {
      isPaused = false;
    }, durationMs || 3000);
  }

  // Pause on hover
  projectsScroll.addEventListener('mouseenter', () => { isPaused = true; });
  projectsScroll.addEventListener('mouseleave', () => {
    if (!isDown) isPaused = false;
  });

  // Start auto-scroll on load
  startAutoScroll();

  // --- Drag-to-scroll ---
  let isDown = false;
  let startX;
  let scrollLeft;

  projectsScroll.addEventListener('mousedown', (e) => {
    isDown = true;
    isPaused = true;
    projectsScroll.style.cursor = 'grabbing';
    startX = e.pageX - projectsScroll.offsetLeft;
    scrollLeft = projectsScroll.scrollLeft;
  });

  projectsScroll.addEventListener('mouseleave', () => {
    if (isDown) {
      isDown = false;
      projectsScroll.style.cursor = 'grab';
    }
  });

  projectsScroll.addEventListener('mouseup', () => {
    isDown = false;
    projectsScroll.style.cursor = 'grab';
  });

  projectsScroll.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - projectsScroll.offsetLeft;
    const walk = (x - startX) * 2;
    projectsScroll.scrollLeft = scrollLeft - walk;
  });

  // --- Navigation buttons ---
  const prevBtn = document.querySelector('.projects-nav-prev');
  const nextBtn = document.querySelector('.projects-nav-next');

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      pauseAutoScroll(3000);
      projectsScroll.scrollBy({ left: -cardWidth, behavior: 'smooth' });
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      pauseAutoScroll(3000);
      projectsScroll.scrollBy({ left: cardWidth, behavior: 'smooth' });
    });
  }
}

class CursorTrail {
  constructor() {
    this.trail = [];
    this.maxTrail = 20;

    document.addEventListener('mousemove', (e) => {
      this.addTrail(e.clientX, e.clientY);
    });
  }

  addTrail(x, y) {
    const dot = document.createElement('div');
    dot.className = 'cursor-trail';
    dot.style.cssText = `
      position: fixed;
      left: ${x}px;
      top: ${y}px;
      width: 10px;
      height: 10px;
      background: radial-gradient(circle, rgba(255, 255, 255, 0.9), transparent);
      border-radius: 50%;
      pointer-events: none;
      z-index: 6;
      transition: opacity 0.5s ease, transform 0.5s ease;
    `;
    document.body.appendChild(dot);

    this.trail.push(dot);

    if (this.trail.length > this.maxTrail) {
      const removed = this.trail.shift();
      removed.remove();
    }

    setTimeout(() => {
      dot.style.opacity = '0';
      dot.style.transform = 'scale(0)';
    }, 50);

    setTimeout(() => {
      dot.remove();
    }, 550);
  }
}

function initParallax() {
  const heroCard = document.querySelector('.hero-card');
  if (!heroCard) return;

  let targetX = 0;
  let targetY = 0;
  let currentX = 0;
  let currentY = 0;

  const onMouseMove = (e) => {
    targetX = (e.clientX / window.innerWidth - 0.5) * 20;
    targetY = (e.clientY / window.innerHeight - 0.5) * 20;
  };

  const animate = () => {
    currentX += (targetX - currentX) * 0.08;
    currentY += (targetY - currentY) * 0.08;

    heroCard.style.transform = `perspective(1000px) rotateY(${currentX}deg) rotateX(${-currentY}deg)`;
    requestAnimationFrame(animate);
  };

  document.addEventListener('mousemove', onMouseMove);

  document.addEventListener('mouseleave', () => {
    targetX = 0;
    targetY = 0;
  });

  animate();
}

function initStatusBadges() {
  const badges = document.querySelectorAll('.status-badge');
  badges.forEach((badge, index) => {
    badge.style.animationDelay = `${0.2 + index * 0.1}s`;
  });
}

// ==========================================
// TYPING EFFECT (OPTIONAL FOR BIO)
// ==========================================
function typeWriter(element, text, speed = 50) {
  let i = 0;
  element.textContent = '';

  function type() {
    if (i < text.length) {
      element.textContent += text.charAt(i);
      i++;
      setTimeout(type, speed);
    }
  }

  type();
}

function addCustomStyles() {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes ripple {
      to {
        transform: scale(1.5);
        opacity: 0;
      }
    }
    
    @keyframes fadeIn {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }
  `;
  document.head.appendChild(style);
}

// ==========================================
// CONSOLE ART - SECURITY: Removed sensitive info
// ==========================================
function consoleArt() {
  console.log('%cðŸš€ Portfolio Loaded!', 'color: #ffffff; font-size: 20px; font-weight: bold;');
  console.log('%cBuilt with â¤ï¸ by codeRED', 'color: #a3a3a3; font-size: 14px;');
  console.log('%c\nHey there! ðŸ‘‹', 'color: #ededed; font-size: 16px;');
  console.log('%cLike what you see? Let\'s build something together!', 'color: #a3a3a3; font-size: 12px;');
  console.log('%cContact me via the website', 'color: #ffffff; font-size: 12px;');
}

function initStatusBadgeClose() {
  const closeButtons = document.querySelectorAll('.badge-close');

  closeButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      e.stopPropagation();
      const badge = button.closest('.status-badge');

      badge.style.transition = 'all 0.3s ease';
      badge.style.opacity = '0';
      badge.style.transform = 'scale(0.8) translateY(-10px)';

      setTimeout(() => {
        badge.remove();
      }, 300);
    });
  });
}

// ==========================================
// VISITOR COUNTER - SECURE API CALL
// ==========================================
async function initVisitorCounter() {
  const visitorCount = document.getElementById('visitorCount');
  if (!visitorCount) return;
  let storedCount = localStorage.getItem('visitorCount');
  let count = storedCount ? parseInt(storedCount) : 36761;
  visitorCount.textContent = count.toLocaleString();

  try {
    const response = await fetch('/api/visitor-increment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (response.status === 429) {
      console.log('Visitor counter rate limit reached');
      return; // Keep showing cached value
    }

    const result = await response.json();

    if (result.status === 'success' && result.count) {
      const apiCount = result.count;
      visitorCount.textContent = apiCount.toLocaleString();
      localStorage.setItem('visitorCount', apiCount);
    }

  } catch (error) {
    console.error('Visitor counter error:', error.message);
  }
}

// ==========================================
window.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  initVisitorCounter();
  generateGitHubGraph();
  new ParticleSystem();
  new CursorTrail();

  initSmoothScroll();
  initHeaderScroll();
  initCopyButton();
  initProfileAvatar();
  initScrollAnimations();
  renderProjects();
  initProjectsScroll();
  initParallax();
  initStatusBadges();
  initStatusBadgeClose();
  addCustomStyles();
  consoleArt();
  const calendarTrigger = document.querySelector('[data-modal="calendar"]');
  if (calendarTrigger) {
    calendarTrigger.addEventListener('click', (e) => {
      e.preventDefault();
      openCalendar();
    });
  }
  const calendarBooking = document.getElementById('calendarBooking');
  if (calendarBooking) {
    calendarBooking.addEventListener('click', (e) => {
      if (e.target === calendarBooking) {
        closeCalendar();
      }
    });
  }

  console.log('âœ“ All features initialized successfully!');
});

// Debounce function for resize events
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Optimize scroll performance
let ticking = false;
function requestTick(callback) {
  if (!ticking) {
    window.requestAnimationFrame(() => {
      callback();
      ticking = false;
    });
    ticking = true;
  }
}

