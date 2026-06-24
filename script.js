// Network background animation
const canvas = document.getElementById("canvas");
if (canvas) {
  const ctx = canvas.getContext("2d");
  
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  
  let points = [];
  const POINT_COUNT = 120;
  const MAX_DIST = 120;
  
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
  
    requestAnimationFrame(animate);
  }
  
  animate();
  
  window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  });
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