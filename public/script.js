// ============================================
// ANNIVERSARY CARD — Magazine Edition
// ============================================

const DANCE_STYLES = {
  tango: {
    name: 'Tango',
    color: '#D72638',
    darkColor: '#8B1A25',
    image: 'images/tango.jpg',
    overlay: 'linear-gradient(135deg, rgba(26,0,0,0.55), rgba(140,0,0,0.4))',
    text: '#ffd700',
    audio: 'music/tango.mp3',
  },
  salsa: {
    name: 'Salsa',
    color: '#FF6B2B',
    darkColor: '#B84A1E',
    image: 'images/latin.jpg',
    bgPos: 'center top',
    overlay: 'linear-gradient(135deg, rgba(100,20,0,0.55), rgba(255,87,34,0.35))',
    text: '#ffffff',
    audio: 'music/Salsa.mp3',
  },
  ballroom: {
    name: 'Ballroom',
    color: '#D4A017',
    darkColor: '#8B6914',
    image: 'images/ballroom.jpg',
    bgPos: 'center center',
    overlay: 'linear-gradient(135deg, rgba(20,10,0,0.55), rgba(140,100,10,0.4))',
    text: '#fff8dc',
    audio: 'music/ballroom.mp3',
  },
  swing: {
    name: 'Swing',
    color: '#00A878',
    darkColor: '#006B4E',
    image: 'images/swing.jpg',
    bgPos: 'center center',
    overlay: 'linear-gradient(135deg, rgba(0,20,10,0.55), rgba(0,100,60,0.35))',
    text: '#e0fff0',
    audio: 'music/swing.mp3',
  },
  hiphop: {
    name: 'Hip Hop',
    color: '#C72CC8',
    darkColor: '#7A1B7B',
    image: 'images/hiphop.jpg',
    overlay: 'linear-gradient(135deg, rgba(10,0,10,0.6), rgba(60,10,60,0.45))',
    text: '#f0d0ff',
    audio: 'music/hiphop.wav',
  },
  country: {
    name: 'Country',
    color: '#1B98D4',
    darkColor: '#135F85',
    image: 'images/country.jpeg',
    bgPos: 'center top',
    overlay: 'linear-gradient(135deg, rgba(0,10,20,0.55), rgba(10,60,100,0.4))',
    text: '#d0f0ff',
    audio: 'music/country.wav',
  },
};

const DANCE_INFO = {
  tango: [{
    venue: 'Denver Turnverein',
    addr: '1570 N Clarkson St, Denver',
    schedule: 'Tuesdays 6:30pm beginner class, then social dancing until 10:30pm. Sundays 1pm beginner, 2pm intermediate, 3pm open practice.',
    desc: 'Argentine tango in close embrace. Beginner class assumes zero experience and rotates topics weekly so every session is standalone. The social dance after is low-pressure and very much a couples dance.',
    links: [
      { label: 'Tango Colorado', url: 'https://www.tangocolorado.org' },
      { label: 'Turnverein Calendar', url: 'https://www.denverturnverein.com/general-clean' },
    ],
  }],
  salsa: [{
    venue: 'La Rumba',
    addr: '99 W 9th Ave, Denver',
    schedule: 'Mon 7pm & 8pm (salsa). Tue 7pm & 8pm (bachata). Wed 7pm & 8pm (mixed levels).',
    desc: 'Classes inside a Latin nightclub \u2014 learn patterns then stay and social dance after. No pre-registration, just show up. Each class is self-contained. Bring each other as partners.',
    links: [
      { label: 'Se\u00f1ora & Jig', url: 'https://salsawithsenoraandjig.com' },
      { label: 'Colorado New Style', url: 'https://coloradonewstyle.com' },
    ],
  }],
  ballroom: [{
    venue: 'Denver Turnverein',
    addr: '1570 N Clarkson St, Denver',
    schedule: 'Wednesdays 6:15pm beginner fundamentals (first Wed free), level 2 at 7pm, practice party at 8pm. 1st & 3rd Saturdays 7pm class then dance bash 8\u201311pm.',
    desc: 'Wednesday is the dedicated ballroom night \u2014 classes assume zero experience. Saturday bash is a proper date night with a DJ and light refreshments. Beautiful 1921 ballroom with chandeliers.',
    links: [
      { label: 'Strides Ballroom', url: 'https://www.stridesballroom.com/group-lessons' },
      { label: 'Turnverein Calendar', url: 'https://www.denverturnverein.com/general-clean' },
    ],
  }],
  swing: [{
    venue: 'Denver Turnverein',
    addr: '1570 N Clarkson St, Denver',
    schedule: 'Fridays 7pm beginner Lindy Hop, dance party 8\u201311pm. Sundays 5:30pm West Coast Swing lessons, social dancing 6:30\u20139:30pm.',
    desc: 'Friday Lindy is bouncy and athletic \u2014 think 1940s Harlem. Sunday West Coast Swing is smoother and danced to contemporary music. Both standalone classes followed by social dancing. One of the friendliest dance scenes in Colorado.',
    links: [
      { label: 'CO Swing Dance Club', url: 'https://www.coloradoswingdanceclub.com' },
      { label: 'Rocky Mtn Swing', url: 'https://www.rmswingdance.com' },
    ],
  }],
  hiphop: [{
    venue: 'Elemental Studios',
    addr: '4668 Glencoe St, Denver',
    schedule: 'Classes every day \u2014 hip hop, shuffle, reggaeton, R&B, Latin fusion, and more. Check weekly schedule for times.',
    desc: 'Choreography-based, not partner dancing \u2014 you learn routines side by side. Beginner to advanced, no contracts, pure drop-in. Very inclusive community.',
    links: [
      { label: 'Weekly Schedule', url: 'https://www.elementalstudiosdenver.com/weeklyschedule' },
      { label: 'Book a Class', url: 'https://www.elementalstudiosdenver.com/bookclass' },
    ],
  }],
  country: [{
    venue: 'Denver Turnverein',
    addr: '1570 N Clarkson St, Denver',
    schedule: 'Thursdays 6:15pm class then country/western dance 7\u201310pm. Rotates: two-step, waltz, line dance, cowboy cha cha.',
    desc: 'Upcoming: Apr 30 Line Dance \u00b7 May 7 & 14 West Coast Swing \u00b7 May 21 & 28 Two-Step. Whiskey Baron in the Springs has Thursday couples lessons if you\u2019re down south.',
    links: [
      { label: 'Turnverein Calendar', url: 'https://www.denverturnverein.com/general-clean' },
      { label: 'Whiskey Baron', url: 'https://thewhiskeybarondancehallandsaloon.com/dance-lessons.html' },
    ],
  }],
};

// ---- State ----
let selectedStyle = null;
let activeBgLayer = 1;
let audioCtx = null;
let currentAudio = null;
let sparkleInterval = null;

// ============================================
// MUSIC
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
// FANFARE
// ============================================

function getAudioCtx() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  if (audioCtx.state === 'suspended') audioCtx.resume();
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
  [[0,60,0.18],[0.18,64,0.18],[0.36,67,0.18],[0.56,72,1.0]].forEach(([t,n,d]) => tone(m(n), now+t, d, 0.2, 'sawtooth'));
  [60,64,67,72,76].forEach(n => tone(m(n), now+0.56, 1.8, 0.06, 'sine'));
}

// ============================================
// SPARKLES
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
// CARD OPENING
// ============================================

function openCard() {
  document.getElementById('card-wrapper').classList.add('opening');
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
// DANCE SELECTION
// ============================================

function selectDance(style) {
  if (selectedStyle === style) return;
  selectedStyle = style;
  const data = DANCE_STYLES[style];

  // Update card selected states
  document.querySelectorAll('.dcard').forEach(btn => {
    btn.classList.toggle('selected', btn.dataset.style === style);
  });

  // Cross-fade background
  const nextLayer = activeBgLayer === 1 ? 2 : 1;
  const nextEl = document.getElementById('dance-bg-' + nextLayer);
  const currEl = document.getElementById('dance-bg-' + activeBgLayer);
  nextEl.style.backgroundImage = data.overlay + ', url(' + data.image + ')';
  nextEl.style.backgroundPosition = data.bgPos || 'center center';
  nextEl.style.opacity = '1';
  currEl.style.opacity = '0';
  activeBgLayer = nextLayer;

  // Update lock-in button
  const lockBtn = document.getElementById('btn-lockin');
  lockBtn.disabled = false;
  lockBtn.classList.add('enabled');
  lockBtn.style.setProperty('--accent', data.color);

  // Show editorial info
  showInfoBlock(style, data);

  // Start music
  startMusic(style);
}

// ============================================
// EDITORIAL INFO BLOCK
// ============================================

function showInfoBlock(style, data) {
  const block = document.getElementById('info-block');
  const info = DANCE_INFO[style];
  if (!info || !info.length) { block.classList.remove('visible'); return; }

  const v = info[0];
  let linksHtml = '';
  if (v.links) {
    linksHtml = '<div class="info-links">' +
      v.links.map(l =>
        '<a class="info-ed-link" href="' + l.url + '" target="_blank" rel="noopener" style="color:' + data.color + '">' +
        l.label + ' \u2192' +
        '<span style="position:absolute;bottom:0;left:0;right:0;height:3px;background:' + data.color + ';opacity:0.4"></span>' +
        '</a>'
      ).join('') +
      '</div>';
  }

  block.innerHTML =
    '<div class="info-editorial">' +
      '<div class="info-stripe" style="background:' + data.color + '"></div>' +
      '<div class="info-venue-name">' + v.venue + '</div>' +
      '<div class="info-venue-addr">' + v.addr + '</div>' +
      '<div class="info-schedule-wrap">' +
        '<div class="info-schedule-bar" style="background:' + data.color + '"></div>' +
        '<div class="info-schedule-text">' + v.schedule + '</div>' +
      '</div>' +
      '<div class="info-desc-text">' + v.desc + '</div>' +
      linksHtml +
    '</div>';

  block.classList.add('visible');

  // Scroll info into view
  setTimeout(() => {
    block.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, 100);
}

// ============================================
// LOCK IN
// ============================================

function lockIn() {
  if (!selectedStyle) return;
  const data = DANCE_STYLES[selectedStyle];
  stopMusic();

  document.getElementById('page-dance').classList.remove('active');

  setTimeout(() => {
    const celebBg = document.getElementById('celebrate-bg');
    celebBg.style.backgroundImage = data.overlay + ', url(' + data.image + ')';
    celebBg.style.backgroundPosition = data.bgPos || 'center center';

    const nameEl = document.getElementById('celebrate-dance-name');
    nameEl.textContent = data.name;
    nameEl.style.borderColor = data.color;

    document.getElementById('celebrate-content').style.color = data.text;
    document.getElementById('page-celebrate').classList.add('active');

    setTimeout(() => playFanfare(), 200);
    createSpotlights();
    setTimeout(() => launchConfetti(), 400);
    setTimeout(() => launchConfetti(), 1800);
  }, 500);
}

// ============================================
// SPOTLIGHTS (celebration)
// ============================================

function createSpotlights() {
  const container = document.getElementById('spotlight-container');
  container.innerHTML = '';
  for (let i = 0; i < 6; i++) {
    const spot = document.createElement('div');
    spot.className = 'spotlight';
    spot.style.setProperty('--start-x', (-300 + Math.random() * 200) + 'px');
    spot.style.setProperty('--end-x', (window.innerWidth * 0.3 + Math.random() * window.innerWidth * 0.7) + 'px');
    spot.style.setProperty('--sweep-dur', (3 + Math.random() * 3) + 's');
    spot.style.setProperty('--sweep-delay', (i * 0.5 + Math.random() * 0.5) + 's');
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
  const colors = ['#D72638','#FF6B2B','#D4A017','#00A878','#C72CC8','#1B98D4','#ffd700','#ff69b4'];

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
      if (p.shape === 'circle') { ctx.beginPath(); ctx.arc(0, 0, p.w / 2, 0, Math.PI * 2); ctx.fill(); }
      else if (p.shape === 'heart') { drawHeart(ctx, 0, 0, p.w); }
      else { ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h); }
      ctx.restore();
      p.y += p.vy; p.x += p.vx; p.angle += p.spin;
    });
    frame++;
    if (frame < 420) requestAnimationFrame(animate);
    else ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
  animate();
}

// ============================================
// INIT
// ============================================

document.addEventListener('DOMContentLoaded', () => {

  // Set card colors from style data
  const cardColors = { tango: '#D72638', salsa: '#FF6B2B', ballroom: '#D4A017', swing: '#00A878', hiphop: '#C72CC8', country: '#1B98D4' };
  document.querySelectorAll('.dcard').forEach(btn => {
    const c = cardColors[btn.dataset.style];
    if (c) btn.style.setProperty('--card-color', c);
    btn.style.background = c;
  });

  // Music prompt
  const prompt = document.getElementById('music-prompt');
  document.getElementById('btn-start').addEventListener('click', () => {
    getAudioCtx();
    prompt.style.transition = 'opacity 0.6s ease';
    prompt.style.opacity = '0';
    setTimeout(() => {
      prompt.style.display = 'none';
      document.getElementById('page-card').classList.add('active');
      startSparkles();
    }, 600);
  });

  // Card open
  document.getElementById('btn-open').addEventListener('click', openCard);

  // Dance cards
  document.querySelectorAll('.dcard').forEach(btn => {
    btn.addEventListener('click', () => selectDance(btn.dataset.style));
  });

  // Lock-in
  document.getElementById('btn-lockin').addEventListener('click', lockIn);

  // Resize
  window.addEventListener('resize', () => {
    const c = document.getElementById('effects-canvas');
    c.width = window.innerWidth;
    c.height = window.innerHeight;
  });
});
