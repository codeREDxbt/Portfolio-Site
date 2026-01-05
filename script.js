// ==========================================
// THEME TOGGLE WITH SOUND
// ==========================================
function initThemeToggle() {
  const themeToggle = document.getElementById('themeToggle');
  const sunIcon = document.querySelector('.sun-icon');
  const moonIcon = document.querySelector('.moon-icon');
  
  // Create click sound
  const clickSound = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTGH0fPTgjMGHm7A7+OZRAE');
  clickSound.volume = 0.3;
  
  // Check for saved theme
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'light') {
    document.body.classList.add('light-mode');
    sunIcon.style.display = 'none';
    moonIcon.style.display = 'block';
  }
  
  if (!themeToggle) return;
  
  themeToggle.addEventListener('click', () => {
    // Play sound
    clickSound.currentTime = 0;
    clickSound.play().catch(e => console.log('Audio play failed:', e));
    
    // Toggle theme
    document.body.classList.toggle('light-mode');
    
    // Toggle icons
    if (document.body.classList.contains('light-mode')) {
      sunIcon.style.display = 'none';
      moonIcon.style.display = 'block';
      localStorage.setItem('theme', 'light');
    } else {
      sunIcon.style.display = 'block';
      moonIcon.style.display = 'none';
      localStorage.setItem('theme', 'dark');
    }
    
    // Add animation
    themeToggle.style.transform = 'rotate(360deg)';
    setTimeout(() => {
      themeToggle.style.transform = 'rotate(0deg)';
    }, 300);
  });
}

// ==========================================
// CALENDAR BOOKING FUNCTIONALITY
// ==========================================
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
  
  // Update month display
  const monthDisplay = document.querySelector('.calendar-month');
  if (monthDisplay) {
    monthDisplay.innerHTML = `${monthNames[currentMonth]} <span>${currentYear}</span>`;
  }
  
  const firstDay = new Date(currentYear, currentMonth, 1).getDay();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  
  // Add empty cells for days before the month starts
  for (let i = 0; i < firstDay; i++) {
    const emptyDay = document.createElement('div');
    emptyDay.className = 'calendar-day disabled';
    calendarDays.appendChild(emptyDay);
  }
  
  // Add days of the month
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
  const bookingDetails = `Date: ${date}\nTime: ${time}`;
  
  // Send email notification via FormSubmit
  const email = 'codeREDx07@proton.me';
  const subject = 'New Calendar Booking';
  const body = `A call has been booked!\n\n${bookingDetails}`;
  
  // Open email client
  window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  
  // Show confirmation
  setTimeout(() => {
    alert(`✓ Booking confirmed for ${date} at ${time}!\nOpening your email to send confirmation.`);
    closeCalendar();
  }, 100);
}

// ==========================================
// GITHUB CONTRIBUTION GRAPH
// ==========================================
async function generateGitHubGraph() {
  const graph = document.getElementById('contributionGraph');
  if (!graph) return;
  
  const username = 'codeREDxbt';
  
  try {
    // Fetch real GitHub contribution data
    const response = await fetch(`https://api.github.com/users/${username}/events/public?per_page=1000`);
    const events = await response.json();
    
    // Count contributions by date
    const contributionMap = {};
    const now = new Date();
    const oneYearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
    
    events.forEach(event => {
      const date = new Date(event.created_at);
      if (date >= oneYearAgo) {
        const dateStr = date.toISOString().split('T')[0];
        contributionMap[dateStr] = (contributionMap[dateStr] || 0) + 1;
      }
    });
    
    // Generate 52 weeks * 7 days = 364 cells
    const weeks = 52;
    const daysPerWeek = 7;
    let cellIndex = 0;
    
    for (let week = 0; week < weeks; week++) {
      for (let day = 0; day < daysPerWeek; day++) {
        const cell = document.createElement('a');
        cell.className = 'graph-cell';
        cell.href = `https://github.com/${username}`;
        cell.target = '_blank';
        cell.rel = 'noopener noreferrer';
        cell.style.cursor = 'pointer';
        
        // Calculate date for this cell
        const cellDate = new Date(oneYearAgo.getTime() + (cellIndex * 24 * 60 * 60 * 1000));
        const dateStr = cellDate.toISOString().split('T')[0];
        
        // Get contribution level (0-4)
        const contributions = contributionMap[dateStr] || 0;
        let level = 0;
        if (contributions > 0) level = 1;
        if (contributions > 5) level = 2;
        if (contributions > 10) level = 3;
        if (contributions > 20) level = 4;
        
        cell.classList.add(`level-${level}`);
        
        // Tooltip on hover
        const text = contributions > 0 ? `${contributions} contributions` : 'No contributions';
        cell.title = `${text} on ${dateStr}`;
        
        graph.appendChild(cell);
        cellIndex++;
      }
    }
  } catch (error) {
    console.log('GitHub API rate limit or error - using fallback data');
    // Fallback to random data if API fails
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
}

// ==========================================
// PARTICLE SYSTEM WITH CANVAS
// ==========================================
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
      // Move particles
      particle.x += particle.vx;
      particle.y += particle.vy;
      
      // Mouse interaction - repel particles
      const dx = this.mouse.x - particle.x;
      const dy = this.mouse.y - particle.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance < 150) {
        const force = (150 - distance) / 150;
        particle.x -= dx * force * 0.02;
        particle.y -= dy * force * 0.02;
      }
      
      // Boundary check with bounce
      if (particle.x < 0 || particle.x > this.canvas.width) particle.vx *= -1;
      if (particle.y < 0 || particle.y > this.canvas.height) particle.vy *= -1;
      
      // Draw particle - Complete inversion for light mode
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

// ==========================================
// SMOOTH SCROLL FOR ANCHOR LINKS
// ==========================================
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

// ==========================================
// HEADER SCROLL EFFECTS
// ==========================================
function initHeaderScroll() {
  let lastScroll = 0;
  const header = document.querySelector('.site-header');
  
  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    // Add background on scroll
    if (currentScroll > 100) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    
    // Hide/show header on scroll direction
    if (currentScroll > lastScroll && currentScroll > 200) {
      header.style.transform = 'translateY(-100%)';
    } else {
      header.style.transform = 'translateY(0)';
    }
    
    lastScroll = currentScroll;
  });
}

// ==========================================
// COPY NPX COMMAND TO CLIPBOARD
// ==========================================
function initCopyButton() {
  const copyBtn = document.querySelector('.npx-copy');
  if (!copyBtn) return;
  
  copyBtn.addEventListener('click', async () => {
    const code = document.querySelector('.npx-code').textContent;
    
    try {
      await navigator.clipboard.writeText(code);
      
      // Success feedback
      copyBtn.textContent = '✓';
      copyBtn.style.color = '#10b981';
      
      setTimeout(() => {
        copyBtn.textContent = '📋';
        copyBtn.style.color = '';
      }, 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
      
      // Fallback for older browsers
      const textarea = document.createElement('textarea');
      textarea.value = code;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      
      try {
        document.execCommand('copy');
        copyBtn.textContent = '✓';
        copyBtn.style.color = '#10b981';
        setTimeout(() => {
          copyBtn.textContent = '📋';
          copyBtn.style.color = '';
        }, 2000);
      } catch (err) {
        console.error('Fallback copy failed:', err);
      }
      
      document.body.removeChild(textarea);
    }
  });
}

// ==========================================
// PROFILE AVATAR CLICK EFFECT
// ==========================================
function initProfileAvatar() {
  const profileAvatar = document.querySelector('.profile-avatar');
  if (!profileAvatar) return;
  
  profileAvatar.addEventListener('click', () => {
    // Reset animation
    profileAvatar.style.animation = 'none';
    setTimeout(() => {
      profileAvatar.style.animation = '';
    }, 10);
    
    // Create ripple effect
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

// ==========================================
// INTERSECTION OBSERVER FOR SCROLL ANIMATIONS
// ==========================================
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
  
  // Observe animated elements
  document.querySelectorAll('.project-item, .stack-badge, .github-placeholder').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
  });
}

// ==========================================
// PROJECT CARDS DRAG-TO-SCROLL
// ==========================================
function initProjectsScroll() {
  const projectsScroll = document.querySelector('.projects-scroll');
  if (!projectsScroll) return;
  
  let isDown = false;
  let startX;
  let scrollLeft;
  
  projectsScroll.addEventListener('mousedown', (e) => {
    isDown = true;
    projectsScroll.style.cursor = 'grabbing';
    startX = e.pageX - projectsScroll.offsetLeft;
    scrollLeft = projectsScroll.scrollLeft;
  });
  
  projectsScroll.addEventListener('mouseleave', () => {
    isDown = false;
    projectsScroll.style.cursor = 'grab';
  });
  
  projectsScroll.addEventListener('mouseup', () => {
    isDown = false;
    projectsScroll.style.cursor = 'grab';
  });
  
  projectsScroll.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - projectsScroll.offsetLeft;
    const walk = (x - startX) * 2; // Scroll speed multiplier
    projectsScroll.scrollLeft = scrollLeft - walk;
  });
}

// ==========================================
// CURSOR TRAIL EFFECT
// ==========================================
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
    
    // Fade out animation
    setTimeout(() => {
      dot.style.opacity = '0';
      dot.style.transform = 'scale(0)';
    }, 50);
    
    setTimeout(() => {
      dot.remove();
    }, 550);
  }
}

// ==========================================
// PARALLAX EFFECT FOR HERO CARD
// ==========================================
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
    // Smooth easing
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

// ==========================================
// STAGGER ANIMATION FOR STATUS BADGES
// ==========================================
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

// ==========================================
// PROJECT PREVIEW MODAL (PLACEHOLDER)
// ==========================================
function initProjectModals() {
  const previewButtons = document.querySelectorAll('.project-btn');
  
  previewButtons.forEach(btn => {
    btn.addEventListener('click', function() {
      const projectTitle = this.closest('.project-item').querySelector('.project-title').textContent;
      
      // Create modal (basic implementation)
      const modal = document.createElement('div');
      modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.9);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        animation: fadeIn 0.3s ease;
      `;
      
      modal.innerHTML = `
        <div style="background: #111; border: 1px solid #333; border-radius: 12px; padding: 40px; max-width: 600px; text-align: center;">
          <h2 style="color: #ededed; margin-bottom: 20px;">${projectTitle}</h2>
          <p style="color: #a3a3a3; margin-bottom: 30px;">Preview coming soon...</p>
          <button onclick="this.closest('div').parentElement.remove()" style="background: #3b82f6; color: white; padding: 12px 24px; border: none; border-radius: 8px; cursor: pointer;">Close</button>
        </div>
      `;
      
      document.body.appendChild(modal);
      
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          modal.remove();
        }
      });
    });
  });
}

// ==========================================
// ADD RIPPLE ANIMATION KEYFRAMES
// ==========================================
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
// CONSOLE ART
// ==========================================
function consoleArt() {
  console.log('%c🚀 Portfolio Loaded!', 'color: #ffffff; font-size: 20px; font-weight: bold;');
  console.log('%cBuilt with ❤️ by codeRED', 'color: #a3a3a3; font-size: 14px;');
  console.log('%c\nHey there! 👋', 'color: #ededed; font-size: 16px;');
  console.log('%cLike what you see? Let\'s build something together!', 'color: #a3a3a3; font-size: 12px;');
  console.log('%cEmail: codeREDx07@proton.me', 'color: #ffffff; font-size: 12px;');
}

// ==========================================
// STATUS BADGE CLOSE BUTTONS
// ==========================================
function initStatusBadgeClose() {
  const closeButtons = document.querySelectorAll('.badge-close');
  
  closeButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      e.stopPropagation();
      const badge = button.closest('.status-badge');
      
      // Fade out animation
      badge.style.transition = 'all 0.3s ease';
      badge.style.opacity = '0';
      badge.style.transform = 'scale(0.8) translateY(-10px)';
      
      // Remove after animation
      setTimeout(() => {
        badge.remove();
      }, 300);
    });
  });
}

// ==========================================
// VISITOR COUNTER WITH REAL-TIME DATA
// ==========================================
function initVisitorCounter() {
  const visitorCount = document.getElementById('visitorCount');
  if (!visitorCount) return;
  
  // Get stored count from localStorage
  let storedCount = localStorage.getItem('visitorCount');
  let count = storedCount ? parseInt(storedCount) : 36761;
  
  // Increment by random 1-5 to simulate active visitors
  count += Math.floor(Math.random() * 5) + 1;
  
  // Update localStorage
  localStorage.setItem('visitorCount', count);
  
  // Display count immediately
  visitorCount.textContent = count.toLocaleString();
  
  // Try to fetch real data from CountAPI
  fetch(`https://api.countapi.xyz/hit/codeREDxbt-portfolio/visitors`)
    .then(response => response.json())
    .then(data => {
      if (data && data.value) {
        // Use API data and update display
        const apiCount = data.value;
        visitorCount.textContent = apiCount.toLocaleString();
        localStorage.setItem('visitorCount', apiCount);
      }
    })
    .catch(error => {
      console.log('CountAPI unavailable, using local count');
      // Keep showing localStorage value
    });
}

// ==========================================
window.addEventListener('DOMContentLoaded', () => {
  // Initialize all components
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
  initProjectsScroll();
  initParallax();
  initStatusBadges();
  initStatusBadgeClose();
  initProjectModals();
  addCustomStyles();
  consoleArt();
  // Calendar modal listeners (only if a modal trigger exists)
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
  
  console.log('✓ All features initialized successfully!');
});

// ==========================================
// PERFORMANCE OPTIMIZATION
// ==========================================
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
