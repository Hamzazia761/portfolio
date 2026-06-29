// Network background animation
const canvas = document.getElementById("canvas");
if (canvas) {
  const ctx = canvas.getContext("2d");

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  let points = [];
  const POINT_COUNT = window.innerWidth < 768 ? 60 : 120;
  const MAX_DIST = 120;
  let animFrameId;
  
  class Point {
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.vx = (Math.random() - 0.5) * 0.5;
      this.vy = (Math.random() - 0.5) * 0.5;
    }
  
    move() {
      this.x += this.vx;
      this.y += this.vy;
  
      if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
      if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
    }
  
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
      ctx.fillStyle = "#4fffcf";
      ctx.fill();
    }
  }
  
  for (let i = 0; i < POINT_COUNT; i++) {
    points.push(new Point());
  }
  
  function drawLines() {
    for (let i = 0; i < points.length; i++) {
      for (let j = i + 1; j < points.length; j++) {
        let dx = points[i].x - points[j].x;
        let dy = points[i].y - points[j].y;
        let dist = Math.sqrt(dx * dx + dy * dy);
  
        if (dist < MAX_DIST) {
          ctx.beginPath();
          ctx.moveTo(points[i].x, points[i].y);
          ctx.lineTo(points[j].x, points[j].y);
  
          ctx.strokeStyle = `rgba(79,255,207,${1 - dist / MAX_DIST})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }
  }
  
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  
    points.forEach(p => {
      p.move();
      p.draw();
    });
  
    drawLines();
  
    animFrameId = requestAnimationFrame(animate);
  }

  animate();

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) cancelAnimationFrame(animFrameId);
    else animate();
  });

  window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  });
}


// Projects carousel
(function () {
    const wrapper = document.querySelector('.carousel-wrapper');
    const track = document.getElementById('projectsCarousel');
    if (!wrapper || !track) return;

    const originals = Array.from(track.children);
    const N = originals.length;

    originals.forEach(card => track.appendChild(card.cloneNode(true)));

    let index = 0;
    let jumping = false;

    function slotWidth() {
        const card = track.children[0];
        const gap = parseFloat(getComputedStyle(track).gap) || 32;
        return card.offsetWidth + gap;
    }

    function place(animate) {
        const cardW = track.children[0].offsetWidth;
        const offset = (wrapper.offsetWidth - cardW) / 2 - index * slotWidth();
        track.style.transition = animate ? 'transform 0.6s cubic-bezier(0.25,0.46,0.45,0.94)' : 'none';
        track.style.transform = `translateX(${offset}px)`;
        Array.from(track.children).forEach((c, i) => c.classList.toggle('active', i === index));
    }

    function goTo(i, animate) {
        index = ((i % N) + N) % N;
        place(animate);
    }

    function advance() {
        if (jumping) return;
        const next = index + 1;
        index = next;
        place(true);
        if (next >= N) {
            jumping = true;
            setTimeout(() => {
                index = 0;
                place(false);
                track.offsetHeight;
                jumping = false;
            }, 620);
        }
    }

    place(false);
    const autoTimer = setInterval(advance, 5000);

    // Drag / swipe support
    let dragStartX = 0;
    let dragging = false;

    function onDragStart(x) {
        dragging = true;
        dragStartX = x;
    }

    function onDragEnd(x) {
        if (!dragging) return;
        dragging = false;
        const diff = dragStartX - x;
        if (Math.abs(diff) > 40) {
            diff > 0 ? advance() : goTo(index - 1, true);
        }
    }

    wrapper.addEventListener('mousedown', e => onDragStart(e.clientX));
    window.addEventListener('mouseup', e => onDragEnd(e.clientX));
    wrapper.addEventListener('touchstart', e => onDragStart(e.touches[0].clientX), { passive: true });
    wrapper.addEventListener('touchend', e => onDragEnd(e.changedTouches[0].clientX), { passive: true });

    window.addEventListener('resize', () => place(false));
})();

// Hamburger nav toggle
const navToggle = document.getElementById('navToggle');
const navMenu   = document.getElementById('navMenu');
if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => navMenu.classList.toggle('open'));
    navMenu.querySelectorAll('a').forEach(a =>
        a.addEventListener('click', () => navMenu.classList.remove('open'))
    );
}

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

// Add fade-in animation on scroll
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

document.querySelectorAll('section > .container, .hero-content').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});