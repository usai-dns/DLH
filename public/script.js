// ==========================================
// Music — start on page open via prompt
// ==========================================
function setupMusic() {
  const prompt = document.getElementById('music-prompt');
  const btnStart = document.getElementById('btn-start');
  const music = document.getElementById('celebration-music');

  btnStart.addEventListener('click', () => {
    // Start music immediately on user interaction (bypasses autoplay restrictions)
    if (music) {
      music.volume = 0.5;
      music.play().catch(() => {});
    }

    // Fade out prompt, reveal the card
    prompt.style.transition = 'opacity 0.6s ease';
    prompt.style.opacity = '0';
    setTimeout(() => {
      prompt.style.display = 'none';
      document.getElementById('page-question').classList.add('active');
      createFloatingHearts();
    }, 600);
  });
}

// ==========================================
// Floating Hearts Background
// ==========================================
function createFloatingHearts() {
  const container = document.getElementById('hearts-bg');
  const hearts = ['❤️', '💕', '💗', '💖', '💘', '🩷'];

  setInterval(() => {
    const heart = document.createElement('span');
    heart.className = 'floating-heart';
    heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
    heart.style.left = Math.random() * 100 + '%';
    heart.style.fontSize = (Math.random() * 20 + 14) + 'px';
    heart.style.animationDuration = (Math.random() * 4 + 6) + 's';
    container.appendChild(heart);

    setTimeout(() => heart.remove(), 10000);
  }, 500);
}

// ==========================================
// No Button — Dodge the mouse!
// ==========================================
function setupNoButton() {
  const btnNo = document.getElementById('btn-no');

  function dodgeButton(e) {
    const rect = btnNo.getBoundingClientRect();
    const btnCenterX = rect.left + rect.width / 2;
    const btnCenterY = rect.top + rect.height / 2;

    const distX = e.clientX - btnCenterX;
    const distY = e.clientY - btnCenterY;
    const distance = Math.sqrt(distX * distX + distY * distY);

    if (distance < 150) {
      const vw = window.innerWidth;
      const vh = window.innerHeight;

      let newX, newY;
      const maxAttempts = 20;
      for (let i = 0; i < maxAttempts; i++) {
        newX = Math.random() * (vw - rect.width - 40) + 20;
        newY = Math.random() * (vh - rect.height - 40) + 20;

        const newDist = Math.sqrt(
          Math.pow(e.clientX - (newX + rect.width / 2), 2) +
          Math.pow(e.clientY - (newY + rect.height / 2), 2)
        );
        if (newDist > 200) break;
      }

      btnNo.style.position = 'fixed';
      btnNo.style.left = newX + 'px';
      btnNo.style.top = newY + 'px';
      btnNo.style.zIndex = '10';
      btnNo.style.transition = 'left 0.2s ease, top 0.2s ease';
    }
  }

  document.addEventListener('mousemove', dodgeButton);

  // Also dodge on touch for mobile
  btnNo.addEventListener('touchstart', (e) => {
    e.preventDefault();
    const touch = e.touches[0];
    dodgeButton({ clientX: touch.clientX, clientY: touch.clientY });
  });
}

// ==========================================
// Confetti
// ==========================================
function launchConfetti() {
  const canvas = document.getElementById('confetti-canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const confettiPieces = [];
  const colors = ['#e91e63', '#ff5722', '#ff9800', '#ffeb3b', '#4caf50', '#2196f3', '#9c27b0', '#f48fb1'];
  const shapes = ['circle', 'rect', 'heart'];

  for (let i = 0; i < 200; i++) {
    confettiPieces.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height - canvas.height,
      w: Math.random() * 10 + 5,
      h: Math.random() * 6 + 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      shape: shapes[Math.floor(Math.random() * shapes.length)],
      velocity: Math.random() * 3 + 2,
      angle: Math.random() * 360,
      spin: (Math.random() - 0.5) * 8,
      drift: (Math.random() - 0.5) * 2,
    });
  }

  let frameCount = 0;

  function drawHeart(ctx, x, y, size) {
    ctx.beginPath();
    const topY = y - size / 2;
    ctx.moveTo(x, topY + size / 4);
    ctx.bezierCurveTo(x, topY, x - size / 2, topY, x - size / 2, topY + size / 4);
    ctx.bezierCurveTo(x - size / 2, topY + size / 2, x, topY + size * 0.6, x, topY + size * 0.8);
    ctx.bezierCurveTo(x, topY + size * 0.6, x + size / 2, topY + size / 2, x + size / 2, topY + size / 4);
    ctx.bezierCurveTo(x + size / 2, topY, x, topY, x, topY + size / 4);
    ctx.fill();
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    confettiPieces.forEach((p) => {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate((p.angle * Math.PI) / 180);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = Math.max(0, 1 - frameCount / 300);

      if (p.shape === 'circle') {
        ctx.beginPath();
        ctx.arc(0, 0, p.w / 2, 0, Math.PI * 2);
        ctx.fill();
      } else if (p.shape === 'heart') {
        drawHeart(ctx, 0, 0, p.w);
      } else {
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      }

      ctx.restore();

      p.y += p.velocity;
      p.x += p.drift;
      p.angle += p.spin;
    });

    frameCount++;

    if (frameCount < 400) {
      requestAnimationFrame(animate);
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }

  animate();
}

// ==========================================
// Yes Button Handler
// ==========================================
function setupYesButton() {
  const btnYes = document.getElementById('btn-yes');

  btnYes.addEventListener('click', () => {
    launchConfetti();

    setTimeout(() => {
      const pageQuestion = document.getElementById('page-question');
      const pageDetails = document.getElementById('page-details');

      pageQuestion.classList.remove('active');

      setTimeout(() => {
        pageDetails.classList.add('active');
        setTimeout(() => launchConfetti(), 500);
      }, 400);
    }, 1500);
  });
}

// ==========================================
// Initialize
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  setupMusic();
  setupNoButton();
  setupYesButton();
});
