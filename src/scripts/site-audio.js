// Synthesised so the seal works without audio assets. Replace with real
// recordings (a wax-crack SFX, a 30–60s shehnai/sitar loop) when available.
let ctx;
let musicNodes = [];
let musicTimer;

function ac() {
  if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
  if (ctx.state === 'suspended') ctx.resume();
  return ctx;
}

export function playCrack() {
  try {
    const c = ac();
    const t = c.currentTime;
    const buf = c.createBuffer(1, c.sampleRate * 0.25, c.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / d.length, 3);
    const src = c.createBufferSource();
    src.buffer = buf;
    const lp = c.createBiquadFilter();
    lp.type = 'lowpass';
    lp.frequency.setValueAtTime(2200, t);
    lp.frequency.exponentialRampToValueAtTime(300, t + 0.2);
    const g = c.createGain();
    g.gain.setValueAtTime(0.5, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.25);
    src.connect(lp).connect(g).connect(c.destination);
    src.start(t);
    const thud = c.createOscillator();
    thud.frequency.setValueAtTime(140, t);
    thud.frequency.exponentialRampToValueAtTime(50, t + 0.18);
    const tg = c.createGain();
    tg.gain.setValueAtTime(0.35, t);
    tg.gain.exponentialRampToValueAtTime(0.001, t + 0.2);
    thud.connect(tg).connect(c.destination);
    thud.start(t);
    thud.stop(t + 0.22);
  } catch (e) {}
}

export function startMusic() {
  try {
    stopMusic();
    const c = ac();
    const master = c.createGain();
    master.gain.setValueAtTime(0, c.currentTime);
    master.gain.linearRampToValueAtTime(0.16, c.currentTime + 3);
    master.connect(c.destination);
    const rev = c.createDelay(1);
    rev.delayTime.value = 0.32;
    const rg = c.createGain();
    rg.gain.value = 0.35;
    rev.connect(rg).connect(rev);
    rev.connect(master);
    const drone = (f) => {
      const o = c.createOscillator();
      o.type = 'triangle';
      o.frequency.value = f;
      const g = c.createGain();
      g.gain.value = 0.18;
      o.connect(g).connect(master);
      o.start();
      return o;
    };
    musicNodes = [master, drone(130.81), drone(196.0)];
    const notes = [261.63, 293.66, 329.63, 392.0, 440.0, 523.25, 440.0, 392.0, 329.63, 293.66];
    let i = 0;
    const pluck = () => {
      const t = c.currentTime;
      const f = notes[i % notes.length];
      i++;
      const o = c.createOscillator();
      o.type = 'sine';
      o.frequency.value = f;
      const o2 = c.createOscillator();
      o2.type = 'triangle';
      o2.frequency.value = f * 2;
      const g = c.createGain();
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(0.5, t + 0.02);
      g.gain.exponentialRampToValueAtTime(0.001, t + 2.4);
      const g2 = c.createGain();
      g2.gain.value = 0.08;
      o.connect(g);
      o2.connect(g2).connect(g);
      g.connect(master);
      g.connect(rev);
      o.start(t);
      o2.start(t);
      o.stop(t + 2.5);
      o2.stop(t + 2.5);
      musicTimer = setTimeout(pluck, 900 + (i % 3) * 250);
    };
    pluck();
  } catch (e) {}
}

export function stopMusic() {
  clearTimeout(musicTimer);
  if (musicNodes.length && ctx) {
    const m = musicNodes[0];
    try {
      m.gain.cancelScheduledValues(ctx.currentTime);
      m.gain.setValueAtTime(m.gain.value, ctx.currentTime);
      m.gain.linearRampToValueAtTime(0, ctx.currentTime + 1.2);
    } catch (e) {}
    const nodes = musicNodes;
    setTimeout(() => nodes.slice(1).forEach((o) => { try { o.stop(); } catch (e) {} }), 1300);
  }
  musicNodes = [];
}
