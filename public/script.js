// ============================================
// ANNIVERSARY CARD — dennisloveshallie.com
// ============================================

// ---- Dance style definitions ----
const DANCE_STYLES = {
  tango: {
    name: 'Tango',
    image: 'images/tango.jpg',
    overlay: 'linear-gradient(135deg, rgba(26,0,0,0.6), rgba(140,0,0,0.45))',
    accent: '#c41e3a',
    accentDark: '#8b0000',
    accentGlow: 'rgba(196, 30, 58, 0.35)',
    text: '#ffd700',
    silhouette: 'rgba(255, 215, 0, 0.10)',
    audio: 'music/tango.mp3',
  },
  salsa: {
    name: 'Salsa',
    image: 'images/latin.jpg',
    bgPos: 'center top',
    overlay: 'linear-gradient(135deg, rgba(122,24,0,0.6), rgba(255,87,34,0.4))',
    accent: '#ff5722',
    accentDark: '#cc3300',
    accentGlow: 'rgba(255, 87, 34, 0.35)',
    text: '#ffffff',
    silhouette: 'rgba(255, 255, 255, 0.10)',
    audio: 'music/Salsa.mp3',
  },
  ballroom: {
    name: 'Ballroom',
    image: 'images/ballroom.jpg',
    bgPos: 'center center',
    overlay: 'linear-gradient(135deg, rgba(20,10,30,0.6), rgba(80,40,90,0.45))',
    accent: '#c084fc',
    accentDark: '#7c3aed',
    accentGlow: 'rgba(192, 132, 252, 0.35)',
    text: '#e9d5ff',
    audio: 'music/ballroom.mp3',
  },
  swing: {
    name: 'Swing',
    image: 'images/swing.jpg',
    bgPos: 'center center',
    overlay: 'linear-gradient(135deg, rgba(58,31,0,0.5), rgba(184,134,11,0.35))',
    accent: '#daa520',
    accentDark: '#8b6914',
    accentGlow: 'rgba(218, 165, 32, 0.35)',
    text: '#fff8dc',
    silhouette: 'rgba(255, 248, 220, 0.10)',
    audio: 'music/swing.mp3',
  },
  hiphop: {
    name: 'Hip Hop',
    image: 'images/hiphop.jpg',
    overlay: 'linear-gradient(135deg, rgba(10,10,10,0.65), rgba(42,10,62,0.5))',
    accent: '#e040fb',
    accentDark: '#7b1fa2',
    accentGlow: 'rgba(224, 64, 251, 0.35)',
    text: '#00ffcc',
    silhouette: 'rgba(0, 255, 204, 0.08)',
    audio: 'music/hiphop.wav',
  },
  country: {
    name: 'Country',
    image: 'images/country.jpeg',
    bgPos: 'center top',
    overlay: 'linear-gradient(135deg, rgba(62,30,8,0.5), rgba(160,82,45,0.35))',
    accent: '#cd853f',
    accentDark: '#8b5a2b',
    accentGlow: 'rgba(205, 133, 63, 0.35)',
    text: '#fff8dc',
    silhouette: 'rgba(255, 248, 220, 0.10)',
    audio: 'music/country.wav',
  },
};

// ---- Dance info for each style ----
const DANCE_INFO = {
  tango: [
    {
      venue: 'Denver Turnverein',
      addr: '1570 N Clarkson St, Denver',
      schedule: 'Tuesdays 6:30\u20137:30pm beginner class, followed by milonga (social dancing) until 10:30pm. Sundays 1\u20134pm tango brunch with beginner class at 1pm, intermediate at 2pm, open practice at 3pm. 2nd Saturday of each month is a milonga from 8pm\u2013midnight.',
      desc: 'Argentine tango in close embrace. Beginner class assumes zero experience and rotates topics so every week is standalone \u2014 you never feel behind. The milonga after class is where you actually dance with other people in a low-pressure social setting. Intimate, dramatic, very much a couples dance.',
    },
  ],
  salsa: [
    {
      venue: 'La Rumba',
      addr: '99 W 9th Ave, Denver',
      schedule: 'Mondays, Tuesdays, Wednesdays at 7pm and 8pm. Monday is salsa, Tuesday is bachata, Wednesday mixes both at different levels.',
      desc: 'Classes inside a Latin nightclub so you stay and social dance after. No pre-registration, just show up. Each class is self-contained. Expect a packed room, good music, and learning basic patterns you can use on the floor the same night. Bring each other as partners.',
    },
    {
      venue: 'Colorado New Style',
      addr: 'Denver',
      schedule: '5 weekly drop-in classes at various times covering salsa, bachata, and reggaeton across 3 levels.',
      desc: "Denver\u2019s dedicated Latin dance studio. Pre-registration required. More structured instruction than the nightclub classes, still drop-in friendly.",
    },
    {
      venue: 'Bachata Denver',
      addr: 'Denver',
      schedule: 'Sundays 6:30pm, Mondays 7pm (beginner). Tuesdays 6:30pm (intermediate).',
      desc: 'Bachata-focused studio with a strong community. Good if bachata specifically is the vibe you two gravitate toward.',
    },
  ],
  ballroom: [
    {
      venue: 'Denver Turnverein',
      addr: '1570 N Clarkson St, Denver',
      schedule: 'Mondays 6:15\u20137pm beginner class, then dance party 7\u201310pm. Wednesdays 6:15\u20137pm absolute beginner fundamentals (first Wednesday of each month is free), then level 2 at 7pm and practice party at 8pm. 1st and 3rd Saturdays 7\u20138pm class then dance bash 8\u201311pm.',
      desc: 'A different dance style rotates every few weeks \u2014 foxtrot, bachata, east coast swing, waltz. You learn basics of whichever style is up that week, then practice during the social dance after. Beautiful 1921 ballroom with chandeliers and a sprung wood floor. The Saturday bash includes light refreshments and a DJ.',
      upcoming: 'Apr 20 & 27 Foxtrot \u00b7 May 4 & 11 Bachata \u00b7 May 18 & 25 East Coast Swing',
    },
  ],
  swing: [
    {
      venue: 'Denver Turnverein',
      addr: '1570 N Clarkson St, Denver',
      schedule: "Fridays 7\u20138pm beginner Lindy Hop class, then dance party 8\u201311pm. Sundays 5:30\u20136:30pm West Coast Swing lessons (beginner through intermediate), then social dancing 6:30\u20139:30pm.",
      desc: "Friday Lindy is high energy, bouncy, athletic swing \u2014 think 1940s Harlem. Beginner class each week is standalone so gaps don\u2019t matter. Sunday West Coast Swing is smoother, slower, more musical \u2014 danced to contemporary music rather than big band. Both end with social dancing. The Turnverein\u2019s Friday swing night is known as one of the friendliest dance scenes in Colorado.",
    },
  ],
  hiphop: [
    {
      venue: 'Elemental Studios',
      addr: '4668 Glencoe St, Denver',
      schedule: 'Classes every day of the week at various times. Styles include hip hop, shuffle, reggaeton, R&B, Latin fusion, heels, Brazilian funk, contemporary, and more. Check their weekly schedule for specific times since it rotates by instructor.',
      desc: "This is choreography-based, not partner dancing \u2014 you learn routines side by side instead of lead/follow. Beginner to advanced, very inclusive atmosphere. No contracts, pure drop-in. Book through MindBody.",
    },
  ],
  country: [
    {
      venue: 'Denver Turnverein',
      addr: '1570 N Clarkson St, Denver',
      schedule: 'Thursdays 6:15\u20137pm class, then country/western dance 7\u201310pm. Style rotates: two-step, waltz, West Coast Swing, line dance, cowboy cha cha.',
      upcoming: 'Apr 30 Line Dance \u00b7 May 7 & 14 West Coast Swing \u00b7 May 21 & 28 Two-Step',
    },
    {
      venue: 'Whiskey Baron Dance Hall & Saloon',
      addr: 'Colorado Springs',
      schedule: 'Wednesdays & Fridays line dance lessons, Thursdays couples lessons. Evenings.',
      desc: "Full dance hall and saloon \u2014 the most casual date-night option. Lesson then open dancing with drinks. If you\u2019re in the Springs instead of Denver, this is the spot.",
    },
  ],
};

// ---- Application state ----
let selectedStyle = null;
let activeBgLayer = 1;
let audioCtx = null;
let currentAudio = null;
let sparkleInterval = null;

// ============================================
// MUSIC — HTML5 Audio for dance tracks
// ============================================

function startMusic(style) {
  stopMusic();
  const data = DANCE_STYLES[style];
  if (!data || !data.audio) return;

  currentAudio = new Audio(data.audio);
  currentAudio.loop = true;
  currentAudio.volume = 0.6;
  currentAudio.play().catch(() => {});
}

function stopMusic() {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
    currentAudio = null;
  }
}

// ============================================
// FANFARE — Web Audio API synth (no file needed)
// ============================================

function getAudioCtx() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

function playFanfare() {
  const ctx = getAudioCtx();
  const master = ctx.createGain();
  master.gain.value = 0.4;
  master.connect(ctx.destination);
  const now = ctx.currentTime + 0.05;

  function tone(freq, start, dur, gain, type) {
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    g.gain.setValueAtTime(0, start);
    g.gain.linearRampToValueAtTime(gain, start + 0.015);
    g.gain.exponentialRampToValueAtTime(0.001, start + dur);
    osc.connect(g);
    g.connect(master);
    osc.start(start);
    osc.stop(start + dur + 0.05);
  }

  const m = n => 440 * Math.pow(2, (n - 69) / 12);
  [[0, 60, 0.18], [0.18, 64, 0.18], [0.36, 67, 0.18], [0.56, 72, 1.0]].forEach(([t, n, d]) => {
    tone(m(n), now + t, d, 0.2, 'sawtooth');
  });
  [60, 64, 67, 72, 76].forEach(n => tone(m(n), now + 0.56, 1.8, 0.06, 'sine'));
}

// ============================================
// AMBIENT SPARKLES
// ============================================

function startSparkles() {
  const container = document.getElementById('ambient-bg');
  sparkleInterval = setInterval(() => {
    const s = document.createElement('div');
    s.className = 'sparkle';
    s.style.left = Math.random() * 100 + '%';
    const size = Math.random() * 3 + 2;
    s.style.width = size + 'px';
    s.style.height = size + 'px';
    s.style.animationDuration = (Math.random() * 5 + 6) + 's';
    container.appendChild(s);
    setTimeout(() => s.remove(), 12000);
  }, 400);
}

// ============================================
// CARD OPENING ANIMATION
// ============================================

function openCard() {
  const wrapper = document.getElementById('card-wrapper');
  wrapper.classList.add('opening');

  // After card slides down, show dance page
  setTimeout(() => {
    document.getElementById('page-card').classList.remove('active');
    setTimeout(() => {
      document.getElementById('page-dance').classList.add('active');
      createDanceSpotlights();
    }, 300);
  }, 800);
}

function createDanceSpotlights() {
  const container = document.getElementById('dance-spotlights');
  container.innerHTML = '';
  for (let i = 0; i < 4; i++) {
    const s = document.createElement('div');
    s.className = 'dance-spot';
    s.style.setProperty('--from', (-300 + i * 100) + 'px');
    s.style.setProperty('--to', (window.innerWidth * 0.4 + i * 200) + 'px');
    s.style.setProperty('--dur', (4 + Math.random() * 3) + 's');
    s.style.setProperty('--delay', (i * 0.8) + 's');
    s.style.width = (180 + Math.random() * 120) + 'px';
    container.appendChild(s);
  }
}

// ============================================
// DANCE STYLE SELECTION
// ============================================

function selectDance(style) {
  if (selectedStyle === style) return;
  selectedStyle = style;
  const data = DANCE_STYLES[style];

  // Update button states
  document.querySelectorAll('.dance-option').forEach(btn => {
    btn.classList.toggle('selected', btn.dataset.style === style);
    if (btn.dataset.style === style) {
      btn.style.setProperty('--accent', data.accent);
    }
  });

  // Cross-fade background with image
  const nextLayer = activeBgLayer === 1 ? 2 : 1;
  const nextEl = document.getElementById('dance-bg-' + nextLayer);
  const currEl = document.getElementById('dance-bg-' + activeBgLayer);
  nextEl.style.backgroundImage = data.overlay + ', url(' + data.image + ')';
  if (data.bgPos) nextEl.style.backgroundPosition = data.bgPos;
  else nextEl.style.backgroundPosition = 'center center';
  nextEl.style.opacity = '1';
  currEl.style.opacity = '0';
  activeBgLayer = nextLayer;

  // Update title color
  document.getElementById('dance-title').style.color = data.text;

  // Update lock-in button
  const lockBtn = document.getElementById('btn-lockin');
  lockBtn.disabled = false;
  lockBtn.classList.add('enabled');
  lockBtn.style.setProperty('--accent', data.accent);
  lockBtn.style.setProperty('--accent-dark', data.accentDark);
  lockBtn.style.setProperty('--accent-glow', data.accentGlow);

  // Show info panel
  showInfoPanel(style, data);

  // Start music for this style
  startMusic(style);
}

function showInfoPanel(style, data) {
  const panel = document.getElementById('info-panel');
  const info = DANCE_INFO[style];
  if (!info || !info.length) {
    panel.classList.remove('visible');
    return;
  }

  let html = '<div class="info-card" style="--info-accent:' + data.accent + '">';
  info.forEach((v, i) => {
    if (i > 0) html += '<div class="info-divider"></div>';
    html += '<div class="info-venue">';
    html += '<div class="info-venue-name">' + v.venue + '</div>';
    html += '<div class="info-venue-addr">' + v.addr + '</div>';
    html += '<div class="info-schedule">' + v.schedule + '</div>';
    if (v.desc) html += '<div class="info-desc">' + v.desc + '</div>';
    if (v.upcoming) html += '<div class="info-upcoming">\u{1F4C5} Upcoming: ' + v.upcoming + '</div>';
    html += '</div>';
  });
  html += '</div>';

  panel.innerHTML = html;
  panel.classList.add('visible');
}

// ============================================
// LOCK IN — CELEBRATION
// ============================================

function lockIn() {
  if (!selectedStyle) return;
  const data = DANCE_STYLES[selectedStyle];

  stopMusic();

  // Transition to celebration page
  document.getElementById('page-dance').classList.remove('active');

  setTimeout(() => {
    // Set celebration background with image
    const celebBg = document.getElementById('celebrate-bg');
    celebBg.style.backgroundImage = data.overlay + ', url(' + data.image + ')';
    celebBg.style.backgroundSize = 'cover';
    celebBg.style.backgroundPosition = data.bgPos || 'center center';

    // Set dance name
    const nameEl = document.getElementById('celebrate-dance-name');
    nameEl.textContent = data.name;
    nameEl.style.borderColor = data.accent;

    // Set text colors
    document.getElementById('celebrate-content').style.color = data.text;

    // Show page
    document.getElementById('page-celebrate').classList.add('active');

    // Play fanfare
    setTimeout(() => playFanfare(), 200);

    // Launch spotlights
    createSpotlights();

    // Launch confetti
    setTimeout(() => launchConfetti(), 400);
    setTimeout(() => launchConfetti(), 1800);
  }, 500);
}

// ============================================
// SPOTLIGHT EFFECT
// ============================================

function createSpotlights() {
  const container = document.getElementById('spotlight-container');
  container.innerHTML = '';

  for (let i = 0; i < 6; i++) {
    const spot = document.createElement('div');
    spot.className = 'spotlight';
    const startX = -300 + Math.random() * 200;
    const endX = window.innerWidth * 0.3 + Math.random() * window.innerWidth * 0.7;
    const dur = 3 + Math.random() * 3;
    const delay = i * 0.5 + Math.random() * 0.5;
    spot.style.setProperty('--start-x', startX + 'px');
    spot.style.setProperty('--end-x', endX + 'px');
    spot.style.setProperty('--sweep-dur', dur + 's');
    spot.style.setProperty('--sweep-delay', delay + 's');
    spot.style.width = (180 + Math.random() * 150) + 'px';
    container.appendChild(spot);
  }
}

// ============================================
// CONFETTI
// ============================================

function launchConfetti() {
  const canvas = document.getElementById('effects-canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const pieces = [];
  const colors = ['#e91e63', '#ff5722', '#ff9800', '#ffeb3b', '#4caf50',
                  '#2196f3', '#9c27b0', '#f48fb1', '#ffd700', '#00e5ff'];

  for (let i = 0; i < 200; i++) {
    pieces.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height - canvas.height,
      w: Math.random() * 10 + 5,
      h: Math.random() * 6 + 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      shape: Math.random() < 0.3 ? 'heart' : Math.random() < 0.5 ? 'circle' : 'rect',
      vy: Math.random() * 3 + 2,
      vx: (Math.random() - 0.5) * 2,
      angle: Math.random() * 360,
      spin: (Math.random() - 0.5) * 8,
    });
  }

  let frame = 0;

  function drawHeart(cx, x, y, size) {
    cx.beginPath();
    const ty = y - size / 2;
    cx.moveTo(x, ty + size / 4);
    cx.bezierCurveTo(x, ty, x - size / 2, ty, x - size / 2, ty + size / 4);
    cx.bezierCurveTo(x - size / 2, ty + size / 2, x, ty + size * 0.6, x, ty + size * 0.8);
    cx.bezierCurveTo(x, ty + size * 0.6, x + size / 2, ty + size / 2, x + size / 2, ty + size / 4);
    cx.bezierCurveTo(x + size / 2, ty, x, ty, x, ty + size / 4);
    cx.fill();
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const alpha = Math.max(0, 1 - frame / 350);

    pieces.forEach(p => {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.angle * Math.PI / 180);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = alpha;

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
      p.y += p.vy;
      p.x += p.vx;
      p.angle += p.spin;
    });

    frame++;
    if (frame < 420) {
      requestAnimationFrame(animate);
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }
  animate();
}

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', () => {

  // --- Music prompt ---
  const prompt = document.getElementById('music-prompt');
  document.getElementById('btn-start').addEventListener('click', () => {
    // Init audio context on user gesture
    getAudioCtx();

    prompt.style.transition = 'opacity 0.6s ease';
    prompt.style.opacity = '0';
    setTimeout(() => {
      prompt.style.display = 'none';
      document.getElementById('page-card').classList.add('active');
      startSparkles();
    }, 600);
  });

  // --- Card open button ---
  document.getElementById('btn-open').addEventListener('click', openCard);

  // --- Dance style buttons ---
  document.querySelectorAll('.dance-option').forEach(btn => {
    btn.addEventListener('click', () => selectDance(btn.dataset.style));
  });

  // --- Lock-in button ---
  document.getElementById('btn-lockin').addEventListener('click', lockIn);

  // --- Resize handler for canvas ---
  window.addEventListener('resize', () => {
    const c = document.getElementById('effects-canvas');
    c.width = window.innerWidth;
    c.height = window.innerHeight;
  });
});
