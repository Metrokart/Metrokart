/* ══════════════════════════════════════════════════════
   METROKART — LANDING PAGE SCRIPTS
══════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  /* ─── NAVBAR SCROLL ─────────────────────────────── */
  const navbar = document.getElementById('navbar');

  const handleScroll = () => {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });

  /* ─── HAMBURGER / MOBILE MENU ───────────────────── */
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');
  const navClose  = document.getElementById('navClose');

  const closeMenu = () => {
    if (navLinks?.classList.contains('open')) {
      navLinks.classList.remove('open');
      hamburger?.setAttribute('aria-expanded', 'false');
      hamburger?.querySelectorAll('span').forEach(s => s.style.cssText = '');
    }
  };

  hamburger?.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = navLinks.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', isOpen);

    // Transform hamburger to X
    const spans = hamburger.querySelectorAll('span');
    if (isOpen) {
      spans[0].style.cssText = 'transform:rotate(45deg) translate(5px,5px)';
      spans[1].style.cssText = 'opacity:0';
      spans[2].style.cssText = 'transform:rotate(-45deg) translate(5px,-5px)';
    } else {
      spans.forEach(s => s.style.cssText = '');
    }
  });

  // Close button click
  navClose?.addEventListener('click', (e) => {
    e.stopPropagation();
    closeMenu();
  });

  // Close mobile menu on link click
  navLinks?.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // Close menu on click outside
  document.addEventListener('click', (e) => {
    if (navLinks?.classList.contains('open') && !navLinks.contains(e.target) && !hamburger?.contains(e.target)) {
      closeMenu();
    }
  });

  // Close menu on scroll
  window.addEventListener('scroll', () => {
    if (navLinks?.classList.contains('open')) {
      closeMenu();
    }
  }, { passive: true });

  /* ─── SCROLL REVEAL (IntersectionObserver) ──────── */
  const revealEls = document.querySelectorAll('[data-index]');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  revealEls.forEach(el => revealObserver.observe(el));

  /* ─── FLOATING PARTICLES ────────────────────────── */
  const particlesContainer = document.getElementById('particles');

  if (particlesContainer) {
    const PARTICLE_COUNT = 18;
    const colors = ['#eebc3b', '#133e76', '#d4a52a', '#1a4d8f', '#f5d06a'];

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const p = document.createElement('div');
      p.className = 'particle';

      const size   = Math.random() * 6 + 4;
      const left   = Math.random() * 100;
      const bottom = Math.random() * 40;
      const dur    = (Math.random() * 4 + 5).toFixed(1);
      const delay  = (Math.random() * 8).toFixed(1);
      const color  = colors[Math.floor(Math.random() * colors.length)];
      const opacity = (Math.random() * 0.4 + 0.2).toFixed(2);

      p.style.cssText = `
        left: ${left}%;
        bottom: ${bottom}%;
        width: ${size}px;
        height: ${size}px;
        background: ${color};
        --dur: ${dur}s;
        --delay: -${delay}s;
        opacity: ${opacity};
        border-radius: ${Math.random() > 0.5 ? '50%' : '4px'};
      `;

      particlesContainer.appendChild(p);
    }
  }

  /* ─── CAROUSEL ──────────────────────────────────── */
  const track    = document.getElementById('carouselTrack');
  const prevBtn  = document.getElementById('prevBtn');
  const nextBtn  = document.getElementById('nextBtn');
  const dotsWrap = document.getElementById('carouselDots');

  if (track && prevBtn && nextBtn) {
    const slides     = track.querySelectorAll('.carousel-slide');
    const totalSlides = slides.length;
    let current      = 0;
    let autoTimer;

    // Build dots
    slides.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('aria-label', `Slide ${i + 1}`);
      dot.addEventListener('click', () => goTo(i));
      dotsWrap.appendChild(dot);
    });

    const dots = dotsWrap.querySelectorAll('.carousel-dot');

    const goTo = (idx) => {
      current = (idx + totalSlides) % totalSlides;
      track.style.transform = `translateX(-${current * 100}%)`;
      dots.forEach((d, i) => d.classList.toggle('active', i === current));
    };

    prevBtn.addEventListener('click', () => { goTo(current - 1); resetAuto(); });
    nextBtn.addEventListener('click', () => { goTo(current + 1); resetAuto(); });

    // Auto-play
    const startAuto = () => {
      autoTimer = setInterval(() => goTo(current + 1), 4000);
    };

    const resetAuto = () => {
      clearInterval(autoTimer);
      startAuto();
    };

    // Touch/swipe support
    let startX = 0;
    track.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
    track.addEventListener('touchend', e => {
      const diff = startX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) {
        diff > 0 ? goTo(current + 1) : goTo(current - 1);
        resetAuto();
      }
    }, { passive: true });

    // Pause on hover
    track.parentElement.addEventListener('mouseenter', () => clearInterval(autoTimer));
    track.parentElement.addEventListener('mouseleave', startAuto);

    startAuto();
  }

  /* ─── SMOOTH COUNTER ANIMATION ──────────────────── */
  const animateCounter = (el, target, suffix = '') => {
    const start = 0;
    const duration = 1500;
    const startTime = performance.now();

    const update = (now) => {
      const elapsed  = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased    = 1 - Math.pow(1 - progress, 3); // cubic ease-out
      el.textContent = Math.round(start + (target - start) * eased) + suffix;
      if (progress < 1) requestAnimationFrame(update);
    };

    requestAnimationFrame(update);
  };

  // Observe stat numbers
  const statNumberEls = document.querySelectorAll('.stat-number');
  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const rawText = el.textContent.trim();

        if (rawText === '500+') {
          animateCounter(el, 500, '+');
        } else if (rawText === '10K+') {
          // Special case
          let val = 0;
          const inc = setInterval(() => {
            val += 200;
            if (val >= 10000) { el.textContent = '10K+'; clearInterval(inc); }
            else el.textContent = (val / 1000).toFixed(1) + 'K+';
          }, 30);
        } else if (rawText === '5★') {
          setTimeout(() => { el.textContent = '5★'; }, 1000);
        }

        statsObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  statNumberEls.forEach(el => statsObserver.observe(el));

  /* ─── PARALLAX ON SCROLL ─────────────────────────── */
  const heroBlobs = document.querySelectorAll('.blob');

  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    heroBlobs.forEach((blob, i) => {
      const speed = (i + 1) * 0.08;
      blob.style.transform += ` translateY(${y * speed}px)`;
    });
  }, { passive: true });

  /* ─── CURSOR GLOW EFFECT (subtle) ───────────────── */
  const glow = document.createElement('div');
  glow.style.cssText = `
    position: fixed;
    width: 300px; height: 300px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(238,188,59,0.06) 0%, transparent 70%);
    pointer-events: none;
    z-index: 9999;
    transform: translate(-50%, -50%);
    transition: opacity 0.3s;
    will-change: transform;
  `;
  document.body.appendChild(glow);

  let glowX = 0, glowY = 0, targetX = 0, targetY = 0;

  document.addEventListener('mousemove', (e) => {
    targetX = e.clientX;
    targetY = e.clientY;
  });

  const animateGlow = () => {
    glowX += (targetX - glowX) * 0.08;
    glowY += (targetY - glowY) * 0.08;
    glow.style.left = glowX + 'px';
    glow.style.top  = glowY + 'px';
    requestAnimationFrame(animateGlow);
  };
  animateGlow();

});
