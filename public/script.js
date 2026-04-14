// ============================================
// ANNIVERSARY CARD — dennisloveshallie.com
// ============================================

// ---- Dance style definitions ----
const DANCE_STYLES = {
  tango: {
    name: 'Tango',
    bg: 'linear-gradient(135deg, #1a0000 0%, #4a0000 30%, #8b0000 60%, #c41e3a 100%)',
    accent: '#c41e3a',
    accentDark: '#8b0000',
    accentGlow: 'rgba(196, 30, 58, 0.35)',
    text: '#ffd700',
    silhouette: 'rgba(255, 215, 0, 0.10)',
    bpm: 132,
    pattern: 'tango',
  },
  salsa: {
    name: 'Salsa',
    bg: 'linear-gradient(135deg, #7a1800 0%, #cc3300 30%, #ff5722 60%, #ff9800 100%)',
    accent: '#ff5722',
    accentDark: '#cc3300',
    accentGlow: 'rgba(255, 87, 34, 0.35)',
    text: '#ffffff',
    silhouette: 'rgba(255, 255, 255, 0.10)',
    bpm: 180,
    pattern: 'salsa',
  },
  blues: {
    name: 'Blues',
    bg: 'linear-gradient(135deg, #070720 0%, #0f0f3d 30%, #1a1a5e 60%, #2a2a7e 100%)',
    accent: '#4a7af5',
    accentDark: '#1a1a5e',
    accentGlow: 'rgba(74, 122, 245, 0.35)',
    text: '#87ceeb',
    silhouette: 'rgba(135, 206, 235, 0.10)',
    bpm: 72,
    pattern: 'blues',
  },
  swing: {
    name: 'Swing',
    bg: 'linear-gradient(135deg, #3a1f00 0%, #6b3a00 30%, #b8860b 60%, #daa520 100%)',
    accent: '#daa520',
    accentDark: '#8b6914',
    accentGlow: 'rgba(218, 165, 32, 0.35)',
    text: '#fff8dc',
    silhouette: 'rgba(255, 248, 220, 0.10)',
    bpm: 156,
    pattern: 'swing',
  },
  hiphop: {
    name: 'Hip Hop',
    bg: 'linear-gradient(135deg, #0a0a0a 0%, #1a0a2e 30%, #2a0a3e 60%, #3a1a4e 100%)',
    accent: '#e040fb',
    accentDark: '#7b1fa2',
    accentGlow: 'rgba(224, 64, 251, 0.35)',
    text: '#00ffcc',
    silhouette: 'rgba(0, 255, 204, 0.08)',
    bpm: 90,
    pattern: 'hiphop',
  },
  country: {
    name: 'Country',
    bg: 'linear-gradient(135deg, #3e1e08 0%, #6b3a1a 30%, #a0522d 60%, #cd853f 100%)',
    accent: '#cd853f',
    accentDark: '#8b5a2b',
    accentGlow: 'rgba(205, 133, 63, 0.35)',
    text: '#fff8dc',
    silhouette: 'rgba(255, 248, 220, 0.10)',
    bpm: 120,
    pattern: 'country',
  },
};

// ---- Application state ----
let selectedStyle = null;
let activeBgLayer = 1;
let audioCtx = null;
let currentMusicNodes = [];
let musicLoopTimer = null;
let sparkleInterval = null;

// ============================================
// MUSIC ENGINE — Web Audio API
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

function midi(note) {
  return 440 * Math.pow(2, (note - 69) / 12);
}

function playTone(ctx, dest, freq, start, dur, gain, type) {
  const osc = ctx.createOscillator();
  const g = ctx.createGain();
  osc.type = type || 'triangle';
  osc.frequency.value = freq;
  g.gain.setValueAtTime(0, start);
  g.gain.linearRampToValueAtTime(gain, start + 0.015);
  g.gain.setValueAtTime(gain * 0.8, start + dur * 0.7);
  g.gain.exponentialRampToValueAtTime(0.001, start + dur);
  osc.connect(g);
  g.connect(dest);
  osc.start(start);
  osc.stop(start + dur + 0.05);
  currentMusicNodes.push(osc);
}

function playNoise(ctx, dest, start, dur, gain) {
  const sr = ctx.sampleRate;
  const len = Math.floor(sr * dur);
  const buf = ctx.createBuffer(1, len, sr);
  const data = buf.getChannelData(0);
  for (let i = 0; i < len; i++) {
    data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (len * 0.15));
  }
  const src = ctx.createBufferSource();
  const g = ctx.createGain();
  const filt = ctx.createBiquadFilter();
  src.buffer = buf;
  filt.type = 'highpass';
  filt.frequency.value = 800;
  g.gain.value = gain;
  src.connect(filt);
  filt.connect(g);
  g.connect(dest);
  src.start(start);
  currentMusicNodes.push(src);
}

function playKick(ctx, dest, start, gain) {
  const osc = ctx.createOscillator();
  const g = ctx.createGain();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(150, start);
  osc.frequency.exponentialRampToValueAtTime(40, start + 0.12);
  g.gain.setValueAtTime(gain, start);
  g.gain.exponentialRampToValueAtTime(0.001, start + 0.25);
  osc.connect(g);
  g.connect(dest);
  osc.start(start);
  osc.stop(start + 0.3);
  currentMusicNodes.push(osc);
}

// --- Pattern definitions ---
// Each returns a loopDuration in seconds and schedules notes from `t0`

function scheduleTango(ctx, dest, t0) {
  const bpm = 132;
  const b = 60 / bpm;
  const loopBeats = 8;
  // Bass — habanera-ish
  [0, 2, 4, 6].forEach(beat => {
    playTone(ctx, dest, midi(38), t0 + beat * b, b * 0.6, 0.2, 'sine');
  });
  [1.5, 3.5, 5.5, 7.5].forEach(beat => {
    playTone(ctx, dest, midi(45), t0 + beat * b, b * 0.3, 0.14, 'sine');
  });
  // Melody — dramatic staccato
  const mel = [[0, 62], [0.5, 65], [1, 62], [2, 69], [3, 67], [3.5, 65],
               [4, 64], [4.5, 65], [5, 62], [6, 57], [7, 62]];
  mel.forEach(([beat, note]) => {
    playTone(ctx, dest, midi(note), t0 + beat * b, b * 0.35, 0.12, 'triangle');
  });
  // Percussion
  [0, 2, 4, 6].forEach(beat => playNoise(ctx, dest, t0 + beat * b, 0.04, 0.18));
  return loopBeats * b;
}

function scheduleSalsa(ctx, dest, t0) {
  const bpm = 170;
  const b = 60 / bpm;
  const loopBeats = 8;
  // Bass tumbao
  [[0, 48], [1.5, 43], [2.5, 45], [4, 48], [5.5, 43], [6.5, 47]].forEach(([beat, note]) => {
    playTone(ctx, dest, midi(note), t0 + beat * b, b * 0.4, 0.18, 'sine');
  });
  // Melody bright
  [[0, 72], [0.75, 76], [1.5, 79], [2.5, 77], [4, 72], [4.75, 74], [5.5, 76], [6.5, 72]].forEach(([beat, note]) => {
    playTone(ctx, dest, midi(note), t0 + beat * b, b * 0.3, 0.09, 'triangle');
  });
  // Clave 3-2
  [0, 1.5, 3, 4.5, 6].forEach(beat => playNoise(ctx, dest, t0 + beat * b, 0.03, 0.22));
  return loopBeats * b;
}

function scheduleBlues(ctx, dest, t0) {
  const bpm = 72;
  const b = 60 / bpm;
  const loopBeats = 8;
  // Walking bass
  [40, 43, 45, 46, 45, 43, 40, 38].forEach((note, i) => {
    playTone(ctx, dest, midi(note), t0 + i * b, b * 0.85, 0.2, 'sine');
  });
  // Blues melody
  [[0, 64, 0.9], [1, 67, 0.6], [2, 69, 1.5], [4, 72, 0.9], [5, 71, 0.6], [6, 67, 1.5]].forEach(([beat, note, dur]) => {
    playTone(ctx, dest, midi(note), t0 + beat * b, b * dur, 0.1, 'triangle');
  });
  // Shuffle hats
  for (let i = 0; i < loopBeats; i++) {
    playNoise(ctx, dest, t0 + i * b, 0.03, 0.08);
    playNoise(ctx, dest, t0 + (i + 0.67) * b, 0.03, 0.05);
  }
  return loopBeats * b;
}

function scheduleSwing(ctx, dest, t0) {
  const bpm = 156;
  const b = 60 / bpm;
  const loopBeats = 8;
  // Walking bass
  [48, 52, 55, 57, 55, 52, 48, 47].forEach((note, i) => {
    playTone(ctx, dest, midi(note), t0 + i * b, b * 0.75, 0.18, 'sine');
  });
  // Bouncy melody
  [[0, 72], [0.67, 76], [1, 79], [2, 76], [2.67, 72], [3, 74],
   [4, 79], [4.67, 76], [5, 72], [6, 74], [6.67, 76], [7, 79]].forEach(([beat, note]) => {
    playTone(ctx, dest, midi(note), t0 + beat * b, b * 0.35, 0.09, 'triangle');
  });
  // Ride pattern (swing feel)
  for (let i = 0; i < loopBeats; i++) {
    playNoise(ctx, dest, t0 + i * b, 0.02, 0.1);
    playNoise(ctx, dest, t0 + (i + 0.67) * b, 0.02, 0.06);
  }
  return loopBeats * b;
}

function scheduleHiphop(ctx, dest, t0) {
  const bpm = 90;
  const b = 60 / bpm;
  const loopBeats = 8;
  // 808 kick
  [0, 0.75, 2, 4, 4.75, 6].forEach(beat => playKick(ctx, dest, t0 + beat * b, 0.35));
  // Snare
  [1, 3, 5, 7].forEach(beat => playNoise(ctx, dest, t0 + beat * b, 0.08, 0.25));
  // Hi-hats
  for (let i = 0; i < loopBeats * 2; i++) {
    playNoise(ctx, dest, t0 + i * b * 0.5, 0.02, 0.07);
  }
  // Melody — sparse, cool
  [[0, 64], [1.5, 67], [3, 72], [4, 71], [5.5, 67], [7, 64]].forEach(([beat, note]) => {
    playTone(ctx, dest, midi(note), t0 + beat * b, b * 0.5, 0.1, 'square');
  });
  // Sub bass
  [0, 4].forEach(beat => {
    playTone(ctx, dest, midi(28), t0 + beat * b, b * 1.8, 0.2, 'sine');
  });
  return loopBeats * b;
}

function scheduleCountry(ctx, dest, t0) {
  const bpm = 120;
  const b = 60 / bpm;
  const loopBeats = 8;
  // Boom-chuck bass
  [0, 2, 4, 6].forEach(beat => {
    playTone(ctx, dest, midi(43), t0 + beat * b, b * 0.6, 0.2, 'sine'); // boom
  });
  [1, 3, 5, 7].forEach(beat => {
    playTone(ctx, dest, midi(55), t0 + beat * b, b * 0.3, 0.1, 'triangle'); // chuck
    playTone(ctx, dest, midi(59), t0 + beat * b, b * 0.3, 0.08, 'triangle');
    playTone(ctx, dest, midi(62), t0 + beat * b, b * 0.3, 0.06, 'triangle');
  });
  // Country melody
  [[0, 67], [0.5, 69], [1, 71], [2, 72], [3, 71], [3.5, 69],
   [4, 67], [5, 64], [6, 62], [7, 64]].forEach(([beat, note]) => {
    playTone(ctx, dest, midi(note), t0 + beat * b, b * 0.4, 0.1, 'triangle');
  });
  // Boot stomp
  [0, 2, 4, 6].forEach(beat => playKick(ctx, dest, t0 + beat * b, 0.15));
  [1, 3, 5, 7].forEach(beat => playNoise(ctx, dest, t0 + beat * b, 0.04, 0.12));
  return loopBeats * b;
}

const SCHEDULERS = {
  tango: scheduleTango,
  salsa: scheduleSalsa,
  blues: scheduleBlues,
  swing: scheduleSwing,
  hiphop: scheduleHiphop,
  country: scheduleCountry,
};

function startMusic(style) {
  stopMusic();
  const ctx = getAudioCtx();

  // Master gain
  const master = ctx.createGain();
  master.gain.value = 0.5;
  master.connect(ctx.destination);

  const scheduler = SCHEDULERS[style];
  if (!scheduler) return;

  let running = true;

  function loop() {
    if (!running) return;
    const loopDur = scheduler(ctx, master, ctx.currentTime + 0.05);
    musicLoopTimer = setTimeout(loop, (loopDur - 0.1) * 1000);
  }
  loop();

  // Store cleanup
  currentMusicNodes._master = master;
  currentMusicNodes._stop = () => { running = false; };
}

function stopMusic() {
  if (currentMusicNodes._stop) currentMusicNodes._stop();
  clearTimeout(musicLoopTimer);
  musicLoopTimer = null;
  currentMusicNodes.forEach(n => { try { n.stop(); } catch (e) {} });
  currentMusicNodes = [];
}

function playFanfare() {
  const ctx = getAudioCtx();
  const master = ctx.createGain();
  master.gain.value = 0.45;
  master.connect(ctx.destination);

  const now = ctx.currentTime + 0.05;
  // Rising brass fanfare
  const fanfareNotes = [
    [0,    60, 0.18], // C4
    [0.18, 64, 0.18], // E4
    [0.36, 67, 0.18], // G4
    [0.56, 72, 1.0],  // C5 (held)
  ];
  fanfareNotes.forEach(([t, note, dur]) => {
    playTone(ctx, master, midi(note), now + t, dur, 0.2, 'sawtooth');
  });
  // Chord swell
  [60, 64, 67, 72, 76].forEach(note => {
    playTone(ctx, master, midi(note), now + 0.56, 1.8, 0.06, 'sine');
  });
  // Shimmer
  playNoise(ctx, master, now + 0.5, 0.15, 0.2);
  playNoise(ctx, master, now + 0.7, 0.1, 0.15);
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

  // After doors swing, transition to dance page
  setTimeout(() => {
    document.getElementById('page-card').classList.remove('active');
    setTimeout(() => {
      document.getElementById('page-dance').classList.add('active');
    }, 300);
  }, 1200);
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

  // Cross-fade background
  const nextLayer = activeBgLayer === 1 ? 2 : 1;
  const nextEl = document.getElementById('dance-bg-' + nextLayer);
  const currEl = document.getElementById('dance-bg-' + activeBgLayer);
  nextEl.style.background = data.bg;
  nextEl.style.opacity = '1';
  currEl.style.opacity = '0';
  activeBgLayer = nextLayer;

  // Update silhouette color
  document.querySelector('.silhouette-wrap').style.color = data.silhouette;

  // Update title color
  document.getElementById('dance-title').style.color = data.text;

  // Update lock-in button
  const lockBtn = document.getElementById('btn-lockin');
  lockBtn.disabled = false;
  lockBtn.classList.add('enabled');
  lockBtn.style.setProperty('--accent', data.accent);
  lockBtn.style.setProperty('--accent-dark', data.accentDark);
  lockBtn.style.setProperty('--accent-glow', data.accentGlow);

  // Start music for this style
  startMusic(style);
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
    // Set celebration background
    document.getElementById('celebrate-bg').style.background = data.bg;

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
