/* ============================================================
   VIMMI — one continuous birthday experience
   CUSTOMIZE EVERYTHING in CONFIG below. That's the only part
   you ever need to touch:
   - girlfriendName / myName .... names everywhere (auto-updates)
   - heroPhotos ................ opening collage art/photos
   - memories .................. gallery [{image,date,caption}]
   - reasons ................... sticky-note lines
   - timeline .................. story entries
   - musicPlaylist ............. [{title,artist,src}] mp3s in assets/
   - loveLetter ................ the letter ([MY NAME] auto-fills)
   - openWhen .................. sad / missYou / angry / smile
   ============================================================ */
const CONFIG = {
  girlfriendName: "Vimmi",
  myName: "mankiii",
  heroPhotos: [
    "assets/photo1.jpg", "assets/photo2.jpg", "assets/photo3.jpg",
    "assets/photo4.jpg", "assets/photo5.jpg", "assets/photo6.jpg",
  ],
  memories: [
    { image: "assets/photo1.jpg", date: "", caption: "Look at us 🥹" },
    { image: "assets/photo2.jpg", date: "", caption: "One of my favourites." },
    { image: "assets/photo3.jpg", date: "", caption: "Peak us." },
    { image: "assets/photo4.jpg", date: "", caption: "This one." },
    { image: "assets/photo5.jpg", date: "", caption: "I'd replay this day." },
    { image: "assets/photo6.jpg", date: "", caption: "Stop being cute challenge: failed." },
    { image: "assets/photo7.jpg", date: "", caption: "Certified goofball 😘" },
    { image: "assets/photo8.jpg", date: "", caption: "My favourite notification 🥹" },
  ],
  reasons: [
    "Your smile.", "Your laugh.",
    "The way you make ordinary days feel better.",
    "The little things you do.", "The way you are.",
  ],
  timeline: [
    { date: "10 January", title: "The first time I saw you", text: "Computer lab. That's it. That's the whole meet-cute." },
    { date: "ADD DATE", title: "ADD MOMENT", text: "ADD STORY — replace me in CONFIG.timeline" },
    { date: "ADD DATE", title: "ADD MOMENT", text: "ADD STORY — replace me in CONFIG.timeline" },
  ],
  musicPlaylist: [
    { title: "Chaiyya Chaiyya", artist: "Sukhwinder Singh • Sapna Awasthi", youtube: "9MX-QejdVaQ" },
    { title: "Ye Tune Kya Kiya", artist: "Javed Bashir • Pritam", youtube: "w9Qo6p4XsXE" },
  ],
  loveLetter: `Dear Vimmi,

I don't know how to put everything I want to say into one website.

But I know where it started.

10 January.

A computer lab.

The first time I saw you.

And somehow, that moment eventually became you.

My Bugs.
My Tota.
My Bongi.

😂❤️

I'm really glad I met you.

I'm really glad you're in my life.

And I hope this birthday is just the beginning of another amazing year for you.

Happy Birthday, Vimmi.

I love you.

And yes...

you're stuck with me.

Love,
[MY NAME]`,
  openWhen: {
    sad: "Hey Bugs. Bad days don't get to keep you. Drink some water, listen to one old song LOUD, and remember: you're still my favourite person. Even grumpy. Especially grumpy. ❤️",
    missYou: "Hi Tota. Missing me already? Good. That means the system works. I'm basically always one text away, dramatically waiting like it's a 90s movie interval. 🫶",
    angry: "Okay Bongi. Breathe. Count to 10. Do NOT throw anything. Now smile a tiny bit — no? A MICRO-smile? There it is. Knew you couldn't resist me. 😤❤️",
    smile: "Mission accomplished. You smiled. Which was the whole plan. You're cute when you smile, you know. Yes, I'm flirting with you. What are you going to do about it? ❤️",
  },
};

const NO_TAUNTS = ["Nice try 😂", "Nope.", "You thought.", "Absolutely not.", "Try YES.", "Wrong button.",
  "Stop chasing me 😭", "Bugs says no.", "Tota detected 🦜", "Bongi says YES 👀", "I'm not letting you.", "Too slow 😌"];
const COMPLIMENTS = ["You're cute, you know.", "Still obsessed.", "Stop being so pretty.",
  "Yes, I'm flirting with you.", "Bugs spotted 👀", "Tota detected 🦜", "Bongi energy activated.", "You're my favourite."];
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const isMobile = window.matchMedia("(pointer: coarse)").matches;

/* ---------------- helpers ---------------- */
const $ = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];
const rand = (a, b) => a + Math.random() * (b - a);
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
function fmtT(s) { if (!isFinite(s)) return "0:00"; return `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`; }
const fxLayer = $("#fx"), flash = $("#bigFlash");
const bigOverlay = $("#bigHeart"), bigText = $(".big-heart-text");

function toast(msg, ms = 2600) {
  const wrap = $("#toasts");
  const el = document.createElement("div");
  el.className = "toast"; el.textContent = msg;
  wrap.appendChild(el);
  setTimeout(() => { el.style.opacity = "0"; el.style.transition = "opacity .4s"; setTimeout(() => el.remove(), 400); }, ms);
  while (wrap.children.length > 3) wrap.firstChild.remove();
}
function screenFlash(s = 0.85) {
  if (reducedMotion) return;
  flash.style.opacity = String(s);
  setTimeout(() => (flash.style.opacity = "0"), 220);
}
function shake() {
  if (reducedMotion) return;
  document.body.animate(
    [{ transform: "translate(0,0)" }, { transform: "translate(6px,-4px)" }, { transform: "translate(-6px,4px)" }, { transform: "translate(0,0)" }],
    { duration: 350 });
}
function showBigHeart(text = "", ms = 1400) {
  bigText.textContent = text;
  bigOverlay.classList.add("on");
  clearTimeout(showBigHeart._t);
  showBigHeart._t = setTimeout(() => bigOverlay.classList.remove("on"), ms);
}
function setDim(v) { const d = $("#dimmer"); if (d) d.style.opacity = String(v); }
function playSound(kind) {
  try {
    const map = { click: "assets/sounds/click.mp3", heart: "assets/sounds/heart.mp3", celebration: "assets/sounds/celebration.mp3" };
    if (!map[kind]) return;
    const a = new Audio(map[kind]); a.volume = 0.35;
    a.play().catch(() => {});
  } catch {}
}

/* ---------------- tiny synth sfx (zero files, gesture-gated) ---------------- */
const Sfx = {
  ctx: null, enabled: true,
  ac() {
    if (!this.ctx) { try { this.ctx = new (window.AudioContext || window.webkitAudioContext)(); } catch { return null; } }
    if (this.ctx?.state === "suspended") this.ctx.resume().catch(() => {});
    return this.ctx;
  },
  tone({ f = 440, f2 = null, t = 0.12, type = "sine", vol = 0.12, when = 0 }) {
    if (!this.enabled || reducedMotion) return;
    const ctx = this.ac(); if (!ctx) return;
    try {
      const t0 = ctx.currentTime + when;
      const o = ctx.createOscillator(), g = ctx.createGain();
      o.type = type; o.frequency.setValueAtTime(f, t0);
      if (f2) o.frequency.exponentialRampToValueAtTime(Math.max(f2, 1), t0 + t);
      g.gain.setValueAtTime(0.0001, t0);
      g.gain.exponentialRampToValueAtTime(vol, t0 + 0.015);
      g.gain.exponentialRampToValueAtTime(0.0001, t0 + t);
      o.connect(g).connect(ctx.destination);
      o.start(t0); o.stop(t0 + t + 0.05);
    } catch {}
  },
  click() { this.tone({ f: 660, f2: 440, t: 0.08, type: "triangle", vol: 0.08 }); },
  pop(n = 0) { this.tone({ f: 480 + n * 90, f2: 900 + n * 120, t: 0.12, vol: 0.14 }); },
  boing(n = 0) { this.tone({ f: 220 + n * 40, f2: 90, t: 0.22, type: "sawtooth", vol: 0.05 }); },
  fanfare() { [523, 659, 784, 1047, 784, 1047].forEach((f, i) => this.tone({ f, t: 0.22, type: "triangle", vol: 0.1, when: i * 0.11 })); },
  toggle() { this.enabled = !this.enabled; return this.enabled; },
};

/* ---------------- kawaii heart factory ---------------- */
function heartSVG(variant = "mini") {
  const faces = {
    mini: `<circle cx="38" cy="40" r="4.5" fill="#3a1020"/><circle cx="62" cy="40" r="4.5" fill="#3a1020"/><circle cx="39.5" cy="38.5" r="1.5" fill="#fff"/><circle cx="63.5" cy="38.5" r="1.5" fill="#fff"/><path d="M43 50 Q50 56 57 50" stroke="#3a1020" stroke-width="3" fill="none" stroke-linecap="round"/><ellipse cx="28" cy="48" rx="6" ry="4" fill="#ff8fb2" opacity=".8"/><ellipse cx="72" cy="48" rx="6" ry="4" fill="#ff8fb2" opacity=".8"/>`,
    big: `<path d="M32 40 q4 -6 8 0" stroke="#3a1020" stroke-width="3.5" fill="none" stroke-linecap="round"/><path d="M60 40 q4 -6 8 0" stroke="#3a1020" stroke-width="3.5" fill="none" stroke-linecap="round"/><path d="M40 54 Q50 68 60 54 Q50 60 40 54 Z" fill="#3a1020"/><ellipse cx="25" cy="50" rx="7" ry="4.5" fill="#ff8fb2"/><ellipse cx="75" cy="50" rx="7" ry="4.5" fill="#ff8fb2"/>`,
    plain: ``,
  };
  return `<svg viewBox="0 0 100 94" aria-hidden="true"><defs><linearGradient id="hg${variant}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ff8fb2"/><stop offset=".55" stop-color="#ff4d7e"/><stop offset="1" stop-color="#c2255c"/></linearGradient></defs><path d="M50 88 C20 62 6 44 6 30 C6 14 18 6 30 6 C39 6 46 11 50 18 C54 11 61 6 70 6 C82 6 94 14 94 30 C94 44 80 62 50 88 Z" fill="url(#hg${variant})"/><ellipse cx="30" cy="26" rx="9" ry="6" fill="#fff" opacity=".55" transform="rotate(-24 30 26)"/>${faces[variant] ?? ""}</svg>`;
}
function injectHearts() {
  $$("[data-svg-heart]").forEach((el) => { el.innerHTML = heartSVG(el.dataset.svgHeart || "mini"); });
  const hm = $(".heart-main"); if (hm && !hm.innerHTML.trim()) hm.innerHTML = heartSVG("mini");
}

/* ---------------- illustrated photo stand-ins ---------------- */
function photoArt(i, fname) {
  const k = ((i % 6) + 6) % 6;
  let seed = (k + 3) * 97 + 13;
  const rnd = () => (seed = (seed * 9301 + 49297) % 233280) / 233280;
  let stars = "";
  for (let s = 0; s < 26; s++)
    stars += `<circle cx="${(rnd() * 400).toFixed(0)}" cy="${(rnd() * 235).toFixed(0)}" r="${(rnd() * 1.7 + 0.6).toFixed(1)}" fill="#ffe9c9" opacity="${(rnd() * 0.5 + 0.3).toFixed(2)}"/>`;
  const heart = (x, y, s, f = "#ff5d8f") =>
    `<g transform="translate(${x} ${y}) scale(${s})"><path d="M0 26C-22 8-30-4-30-14c0-12 9-18 18-18 7 0 11 4 12 9 1-5 5-9 12-9 9 0 18 6 18 18 0 10-8 22-30 40z" fill="${f}"/><circle cx="-8" cy="-11" r="2.6" fill="#3a1020"/><circle cx="8" cy="-11" r="2.6" fill="#3a1020"/><path d="M-5-3q5 4 10 0" stroke="#3a1020" stroke-width="2.2" fill="none" stroke-linecap="round"/></g>`;
  function sprockets(y) {
    let r = `<rect x="0" y="${y}" width="400" height="42" fill="#050505"/>`;
    for (let x = 12; x < 390; x += 38) r += `<rect x="${x}" y="${y + 10}" width="20" height="22" rx="3" fill="#e8dcc8" opacity=".85"/>`;
    return r;
  }
  function bulbs(y) {
    let r = "";
    for (let x = 20; x <= 380; x += 30) r += `<circle cx="${x}" cy="${y}" r="6" fill="#ffd166"><animate attributeName="opacity" values="1;.35;1" dur="1.2s" begin="${((x % 60) / 60).toFixed(2)}s" repeatCount="indefinite"/></circle>`;
    return r;
  }
  const tag = `<text x="200" y="287" text-anchor="middle" font-family="DM Sans,sans-serif" font-size="12" letter-spacing="2.5" fill="#ffd166" opacity=".8">ADD &#8226; ${fname}</text>`;
  const scenes = [
    `<rect width="400" height="300" fill="url(#pabg)"/>${stars}<circle cx="322" cy="62" r="26" fill="#ffe9c9" opacity=".9"/><circle cx="312" cy="54" r="22" fill="#2a0f24" opacity=".55"/>${heart(200, 185, 1.7)}${heart(96, 220, 0.7, "#ff8fb2")}${heart(310, 215, 0.55, "#cfc2ff")}`,
    `<rect width="400" height="300" fill="url(#pbbl)"/>${stars}<rect x="104" y="66" width="192" height="126" rx="12" fill="#0a0a16" stroke="#cfc2ff" stroke-width="3"/><rect x="118" y="80" width="164" height="98" rx="6" fill="#1c1440"/>${heart(200, 122, 0.75, "#ff8fb2")}<rect x="188" y="192" width="24" height="22" fill="#0a0a16"/><rect x="150" y="214" width="100" height="12" rx="6" fill="#0a0a16"/><rect x="90" y="232" width="220" height="34" rx="8" fill="#05050c" stroke="#cfc2ff" stroke-width="2" opacity=".8"/><line x1="115" y1="244" x2="285" y2="244" stroke="#cfc2ff" stroke-width="2" opacity=".5"/><line x1="115" y1="254" x2="285" y2="254" stroke="#cfc2ff" stroke-width="2" opacity=".3"/>`,
    `<rect width="400" height="300" fill="url(#pabg)"/>${stars}<rect x="150" y="46" width="100" height="26" rx="12" fill="none" stroke="#c98a4b" stroke-width="6"/><rect x="62" y="70" width="276" height="150" rx="16" fill="#33200f" stroke="#c98a4b" stroke-width="3"/><circle cx="140" cy="150" r="36" fill="#12040d" stroke="#f5e6c8" stroke-width="4"/><circle cx="260" cy="150" r="36" fill="#12040d" stroke="#f5e6c8" stroke-width="4"/><circle cx="140" cy="150" r="9" fill="#f5e6c8"/><circle cx="260" cy="150" r="9" fill="#f5e6c8"/><rect x="176" y="140" width="48" height="20" rx="4" fill="#f5e6c8" opacity=".85"/><text x="96" y="60" font-size="30" fill="#ffd166">&#9834;</text><text x="292" y="52" font-size="24" fill="#ff8fb2">&#9835;</text>${heart(200, 254, 0.6)}`,
    `<rect width="400" height="300" fill="#0d0309"/>${sprockets(46)}${sprockets(218)}<rect x="30" y="100" width="340" height="100" rx="8" fill="#1e0a18" stroke="#ffd166" stroke-width="2"/>${heart(130, 150, 0.8)}${heart(200, 150, 0.8, "#ff8fb2")}${heart(270, 150, 0.8, "#cfc2ff")}`,
    `<rect width="400" height="300" fill="url(#pabg)"/>${stars}<ellipse cx="200" cy="256" rx="122" ry="15" fill="#e8dcc8" opacity=".9"/><rect x="112" y="158" width="176" height="96" rx="10" fill="#e63956"/><rect x="112" y="158" width="176" height="26" rx="10" fill="#fff3ea"/><circle cx="140" cy="188" r="8" fill="#fff3ea"/><circle cx="180" cy="188" r="8" fill="#fff3ea"/><circle cx="220" cy="188" r="8" fill="#fff3ea"/><circle cx="260" cy="188" r="8" fill="#fff3ea"/><rect x="148" y="106" width="12" height="52" rx="4" fill="#fff3ea"/><rect x="194" y="106" width="12" height="52" rx="4" fill="#fff3ea"/><rect x="240" y="106" width="12" height="52" rx="4" fill="#fff3ea"/><ellipse cx="154" cy="96" rx="9" ry="12" fill="#ff9f1c"/><ellipse cx="200" cy="96" rx="9" ry="12" fill="#ff9f1c"/><ellipse cx="246" cy="96" rx="9" ry="12" fill="#ff9f1c"/><circle cx="182" cy="222" r="4.5" fill="#3a1020"/><circle cx="218" cy="222" r="4.5" fill="#3a1020"/><path d="M188 234q12 10 24 0" stroke="#3a1020" stroke-width="3.5" fill="none" stroke-linecap="round"/>`,
    `<rect width="400" height="300" fill="#160710"/>${bulbs(30)}<text x="200" y="182" text-anchor="middle" font-family="Georgia,serif" font-style="italic" font-size="72" fill="#ffd166">V &#9829; V</text><text x="200" y="226" text-anchor="middle" font-family="DM Sans,sans-serif" font-size="16" letter-spacing="6" fill="#ffb3c9">NOW SHOWING</text>${bulbs(262)}${heart(60, 150, 0.5)}${heart(340, 150, 0.5)}`,
  ];
  return `<svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" role="img" aria-label="Illustrated stand-in for ${fname}"><defs><linearGradient id="pabg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3d0f28"/><stop offset="1" stop-color="#12040d"/></linearGradient><linearGradient id="pbbl" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1c1440"/><stop offset="1" stop-color="#0d0616"/></linearGradient></defs>${scenes[k]}${tag}</svg>`;
}

/* ---------------- particle fx ---------------- */
function burstHearts(n = 60, origin = null) {
  if (reducedMotion) n = Math.min(n, 15);
  if (isMobile) n = Math.round(n * 0.45);
  const ox = origin?.x ?? innerWidth / 2, oy = origin?.y ?? innerHeight / 2;
  for (let i = 0; i < n; i++) {
    const el = document.createElement("div");
    el.className = "fx-heart";
    el.style.left = ox + "px"; el.style.top = oy + "px";
    if (Math.random() < 0.68) {
      el.innerHTML = heartSVG(Math.random() < 0.5 ? "mini" : "plain");
      const s = Math.round(rand(16, 44));
      el.style.width = s + "px"; el.style.height = s + "px";
    } else { el.textContent = pick(["✨", "⭐", "💖"]); el.style.fontSize = rand(12, 26) + "px"; }
    fxLayer.appendChild(el);
    const ang = rand(0, Math.PI * 2), dist = rand(80, Math.min(420, innerWidth * 0.6));
    el.animate(
      [{ transform: "translate(-50%,-50%) scale(0)", opacity: 1 },
       { transform: `translate(${Math.cos(ang) * dist}px,${Math.sin(ang) * dist - 120}px) scale(1) rotate(${rand(-90, 90)}deg)`, opacity: 1, offset: 0.6 },
       { transform: `translate(${Math.cos(ang) * dist}px,${Math.sin(ang) * dist + 160}px) scale(.6)`, opacity: 0 }],
      { duration: rand(1100, 2200), easing: "cubic-bezier(.2,.8,.3,1)" }
    ).onfinish = () => el.remove();
  }
}
function burstConfetti(n = 80, origin = null) {
  if (reducedMotion) n = Math.min(n, 20);
  if (isMobile) n = Math.round(n * 0.5);
  const colors = ["#ff5d8f", "#ffc46b", "#cfc2ff", "#7c5cbf", "#ffffff", "#e63956", "#22c55e"];
  const ox = origin?.x ?? innerWidth / 2, oy = origin?.y ?? innerHeight * 0.35;
  for (let i = 0; i < n; i++) {
    const el = document.createElement("div");
    el.className = "fx-confetti";
    const s = rand(6, 13);
    el.style.cssText += `left:${ox}px;top:${oy}px;width:${s}px;height:${s * rand(0.5, 1.4)}px;background:${pick(colors)};border-radius:${Math.random() > 0.5 ? "50%" : "3px"};`;
    fxLayer.appendChild(el);
    el.animate(
      [{ transform: "translate(-50%,-50%) rotate(0)", opacity: 1 },
       { transform: `translate(${rand(-1, 1) * innerWidth * 0.45}px,${rand(-0.3, 0.9) * innerHeight}px) rotate(${rand(360, 1080)}deg)`, opacity: 0 }],
      { duration: rand(1300, 2600), easing: "cubic-bezier(.2,.7,.3,1)" }
    ).onfinish = () => el.remove();
  }
}
function burstSparkles(n = 40, origin = null) {
  if (reducedMotion) return;
  if (isMobile) n = Math.round(n * 0.5);
  const oy = origin?.y ?? innerHeight / 2;
  for (let i = 0; i < n; i++) {
    const el = document.createElement("div");
    el.className = "fx-spark"; el.textContent = "✨";
    el.style.left = origin ? (origin.x + rand(-160, 160)) + "px" : rand(0, innerWidth) + "px";
    el.style.top = (origin ? oy + rand(-160, 160) : rand(0, innerHeight)) + "px";
    el.style.fontSize = rand(10, 26) + "px";
    fxLayer.appendChild(el);
    el.animate([{ opacity: 0, transform: "scale(0)" }, { opacity: 1, transform: "scale(1.3)", offset: 0.4 }, { opacity: 0, transform: "scale(0)" }],
      { duration: rand(900, 1800) }).onfinish = () => el.remove();
  }
}
function ringBurst(x, y) {
  if (reducedMotion) return;
  for (let i = 0; i < 3; i++) {
    const el = document.createElement("div");
    el.className = "fx-ring";
    el.style.left = x - 170 + "px"; el.style.top = y - 170 + "px";
    el.style.animationDelay = i * 0.12 + "s";
    fxLayer.appendChild(el);
    setTimeout(() => el.remove(), 1400);
  }
}
function megaCelebration(text = "") {
  const c = { x: innerWidth / 2, y: innerHeight / 2 };
  screenFlash(); shake(); ringBurst(c.x, c.y);
  burstHearts(140, c); burstConfetti(140); burstSparkles(60, c);
  if (text) showBigHeart(text, 1800);
  playSound("celebration");
}

/* ---------------- blow-out show engine ---------------- */
function rocket(x0, y0) {
  return new Promise((resolve) => {
    const dy = rand(180, 320);
    const bx = x0 + rand(-30, 30), by = y0 - dy;
    if (reducedMotion) return resolve({ x: bx, y: by });
    const r = document.createElement("div");
    r.className = "fw-rocket";
    r.style.left = x0 + "px"; r.style.top = y0 + "px";
    fxLayer.appendChild(r);
    const trail = setInterval(() => {
      const t = document.createElement("div");
      t.className = "fw-trail";
      const rc = r.getBoundingClientRect();
      t.style.left = rc.left + rc.width / 2 + "px";
      t.style.top = rc.top + rc.height + "px";
      fxLayer.appendChild(t);
      setTimeout(() => t.remove(), 520);
    }, 40);
    r.animate(
      [{ transform: "translate(0,0)", opacity: 1 }, { transform: `translate(${bx - x0}px,${by - y0}px)`, opacity: 1 }],
      { duration: 650, easing: "cubic-bezier(.2,.7,.3,1)" }
    ).onfinish = () => { clearInterval(trail); r.remove(); resolve({ x: bx, y: by }); };
  });
}
function explodeFirework(x, y, palette, big = true) {
  const n = reducedMotion ? 10 : big ? 60 : 36;
  ringBurst(x, y); screenFlash(0.25); playSound("heart");
  for (let i = 0; i < n; i++) {
    const c = pick(palette);
    const s = document.createElement("div");
    s.className = "fw-spark";
    const ang = (i / n) * Math.PI * 2 + rand(-0.12, 0.12);
    const dist = rand(60, big ? 220 : 150);
    const tilt = (ang * 180) / Math.PI + 90;
    s.style.cssText += `left:${x}px;top:${y}px;width:3px;height:${Math.round(rand(8, 16))}px;background:${c};color:${c};`;
    fxLayer.appendChild(s);
    const dx = Math.cos(ang) * dist, dyy = Math.sin(ang) * dist;
    s.animate(
      [{ transform: `translate(-50%,-50%) rotate(${tilt}deg)`, opacity: 1 },
       { transform: `translate(calc(-50% + ${dx}px),calc(-50% + ${dyy * 0.7}px)) rotate(${tilt}deg)`, opacity: 1, offset: 0.55 },
       { transform: `translate(calc(-50% + ${dx * 1.05}px),calc(-50% + ${dyy * 0.7 + 130}px)) rotate(${tilt}deg)`, opacity: 0 }],
      { duration: rand(1100, 1900), easing: "cubic-bezier(.15,.7,.3,1)" }
    ).onfinish = () => s.remove();
  }
  burstHearts(Math.max(4, Math.round(n / 7)), { x, y });
  burstSparkles(Math.round(n / 3), { x, y });
}
async function smokeHeart(cx, cy) {
  const N = reducedMotion ? 6 : 16, sc = 9, dots = [];
  for (let i = 0; i < N; i++) {
    const t = (i / N) * Math.PI * 2;
    const hx = 16 * Math.pow(Math.sin(t), 3);
    const hy = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
    const px = cx + hx * sc, py = cy + hy * sc;
    const d = document.createElement("div");
    d.className = "smoke-dot";
    d.style.left = px + "px"; d.style.top = py + "px";
    fxLayer.appendChild(d);
    dots.push({ el: d, x: px, y: py });
    d.animate(
      [{ opacity: 0, transform: "translate(-50%,-50%) scale(.4)" }, { opacity: 0.85, transform: "translate(-50%,-50%) scale(1)" }],
      { duration: 500, delay: i * 45, fill: "backwards" }
    );
  }
  await wait(N * 45 + 900);
  dots.forEach(({ el, x, y }, i) => setTimeout(() => { el.remove(); burstHearts(3, { x, y }); }, i * 30));
  await wait(N * 30 + 500);
}
function popWishLetters() {
  const h = $("#wishReveal h2");
  if (!h || h.dataset.popped) return;
  h.dataset.popped = "1";
  let k = 0;
  const walk = (node) => {
    [...node.childNodes].forEach((ch) => {
      if (ch.nodeType === 3) {
        const frag = document.createDocumentFragment();
        [...ch.textContent].forEach((c) => {
          if (c === " ") { frag.appendChild(document.createTextNode(" ")); return; }
          const s = document.createElement("span");
          s.className = "wl"; s.textContent = c;
          s.style.animationDelay = `${0.05 + k++ * 0.035}s`;
          frag.appendChild(s);
        });
        node.replaceChild(frag, ch);
      } else if (ch.nodeType === 1) walk(ch);
    });
  };
  walk(h);
  h.classList.add("letters");
}

/* ---------------- names / boot ---------------- */
function applyNames() {
  $$(".gf").forEach((el) => (el.textContent = CONFIG.girlfriendName));
  document.title = `Happy Birthday, ${CONFIG.girlfriendName} ❤️`;
  const kt = $(".word[data-word='2']");
  if (kt) kt.childNodes[0].textContent = CONFIG.girlfriendName.toUpperCase();
  const cn = $("#creditName"); if (cn) cn.textContent = CONFIG.myName;
  const ct = $("#cakeText"); if (ct) ct.textContent = `HAPPY BIRTHDAY ${CONFIG.girlfriendName.toUpperCase()}`;
  $("#letterText").textContent = CONFIG.loveLetter.replace("[MY NAME]", CONFIG.myName);
}

function buildCollage() {
  const grid = $("#collageGrid"), blur = $("#collageBlur");
  const photos = CONFIG.heroPhotos.filter(Boolean);
  const captions = ["us 🥹", "favourite human", "peak us", "this one ❤️", "replay this day", "bugs 🐛"];
  const list = photos.length ? photos : [null, null, null, null, null, null];
  if (photos.length) {
    const probe = new Image();
    probe.onload = () => (blur.style.backgroundImage = `url("${photos[0]}")`);
    probe.src = photos[0];
  }
  list.slice(0, 7).forEach((src, i) => {
    const fig = document.createElement("figure");
    fig.style.setProperty("--rot", `${(i % 2 ? -1 : 1) * (i + 1)}deg`);
    fig.style.animationDelay = `var(--cd,0s)`;
    const cap = captions[i % captions.length];
    if (src) {
      const img = document.createElement("img");
      img.src = src; img.alt = `Photo of us ${i + 1}`; img.loading = i > 1 ? "lazy" : "eager";
      img.onerror = () => { fig.innerHTML = `<div class="art-fill">${photoArt(i, "assets/photo" + (i + 1) + ".jpg")}</div><figcaption>${cap}</figcaption>`; };
      fig.appendChild(img);
      const fc = document.createElement("figcaption"); fc.textContent = cap;
      fig.appendChild(fc);
    } else {
      fig.innerHTML = `<div class="art-fill">${photoArt(i, "assets/photo" + (i + 1) + ".jpg")}</div><figcaption>${cap}</figcaption>`;
    }
    grid.appendChild(fig);
  });
  if (!reducedMotion && !isMobile) {
    $("#ch0").addEventListener("pointermove", (e) => {
      const dx = (e.clientX / innerWidth - 0.5) * 14, dy = (e.clientY / innerHeight - 0.5) * 14;
      grid.style.transform = `translate(${dx}px,${dy}px)`;
    });
  }
}

/* ---------------- observers ---------------- */
function initObservers() {
  const chObs = new IntersectionObserver((ents) => {
    ents.forEach((e) => {
      if (!e.isIntersecting) return;
      e.target.classList.add("in");
      const h2 = e.target.querySelector("h2");
      if (h2 && !reducedMotion && !e.target.dataset.sparkled) {
        e.target.dataset.sparkled = "1";
        const r = h2.getBoundingClientRect();
        burstSparkles(8, { x: r.left + r.width / 2, y: r.top + 24 });
      }
      if (e.target.id === "ch3" && !reducedMotion && !e.target.dataset.counted) {
        e.target.dataset.counted = "1";
        playLeader();
      }
    });
  }, { threshold: 0.3 });
  $$(".chapter").forEach((el) => chObs.observe(el));

  const itemObs = new IntersectionObserver((ents) => {
    ents.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); itemObs.unobserve(e.target); } });
  }, { threshold: 0.25 });
  const watchItems = () => $$(".tl-item:not(.in), .file:not(.in), .sticky:not(.in), .case:not(.in), .polaroid:not(.in)")
    .forEach((el) => itemObs.observe(el));
  watchItems();
  return watchItems;
}

function playLeader() {
  const ch = $("#ch3");
  const L = document.createElement("div");
  L.className = "leader";
  L.innerHTML = `<div class="leader-rings"></div><div class="leader-sweep"></div><div class="leader-num">3</div>`;
  L.setAttribute("aria-hidden", "true");
  ch.prepend(L);
  const N = L.querySelector(".leader-num");
  let n = 3; Sfx.pop(3);
  const t = setInterval(() => {
    n--; Sfx.pop(Math.max(n, 0));
    if (n <= 0) { clearInterval(t); L.remove(); return; }
    N.textContent = n;
    N.animate([{ transform: "scale(1.6)", opacity: 0 }, { transform: "scale(1)", opacity: 1 }], { duration: 300 });
  }, 480);
}

/* ---------------- chrome: progress, cursor, tilt, compliments ---------------- */
function initChrome() {
  const bar = $("#progBar"), heart = $(".prog-heart");
  addEventListener("scroll", () => {
    const h = document.documentElement;
    const p = h.scrollTop / (h.scrollHeight - h.clientHeight || 1);
    bar.style.width = p * 100 + "%"; heart.style.left = `calc(${p * 100}% - 7px)`;
  }, { passive: true });

  if (!isMobile && !reducedMotion) {
    let last = 0;
    addEventListener("pointermove", (e) => {
      const now = performance.now();
      if (now - last < 90 || Math.random() > 0.35) return;
      last = now;
      const el = document.createElement("div");
      el.textContent = pick(["💗", "✨", "💖"]);
      el.style.cssText = `position:fixed;left:${e.clientX}px;top:${e.clientY}px;pointer-events:none;z-index:250;font-size:${rand(10, 18)}px;`;
      document.body.appendChild(el);
      el.animate([{ opacity: 1, transform: "translateY(0) scale(1)" }, { opacity: 0, transform: "translateY(-46px) scale(.4)" }], { duration: 800 }).onfinish = () => el.remove();
    });
  }
  if (!isMobile && !reducedMotion) {
    $$(".tilt").forEach((card) => {
      card.addEventListener("pointermove", (e) => {
        const r = card.getBoundingClientRect();
        card.style.transform = `perspective(700px) rotateX(${((e.clientY - r.top) / r.height - 0.5) * -10}deg) rotateY(${((e.clientX - r.left) / r.width - 0.5) * 10}deg)`;
      });
      card.addEventListener("pointerleave", () => (card.style.transform = ""));
    });
  }
  let shown = 0;
  setInterval(() => {
    if (document.hidden || shown > 5 || Math.random() > 0.4) return;
    shown++; toast(pick(COMPLIMENTS));
  }, 45000);
  $("#jumpCake")?.addEventListener("click", () => $("#ch13").scrollIntoView({ behavior: "smooth" }));
  $("#musicToggle")?.addEventListener("click", () => Music.toggle());
  $("#sfxToggle")?.addEventListener("click", (e) => {
    const on = Sfx.toggle();
    e.currentTarget.textContent = on ? "🔔 sfx" : "🔕 sfx";
    if (on) Sfx.click();
  });
  // tap anywhere → tiny heart pop
  addEventListener("pointerdown", (e) => {
    if (reducedMotion) return;
    if (e.target instanceof Element && e.target.closest("button, a, input, label")) return;
    burstHearts(4, { x: e.clientX ?? innerWidth / 2, y: e.clientY ?? innerHeight / 2 });
  });
}

/* ---------------- enter + love ---------------- */
function initEnter() {
  // orbiting hearts around the giant button
  const zone = $(".love-zone");
  ["o1", "o2", "o3"].forEach((c, i) => {
    const s = document.createElement("span");
    s.className = "orbit " + c;
    s.setAttribute("aria-hidden", "true");
    s.innerHTML = heartSVG(i === 1 ? "plain" : "mini");
    zone.prepend(s);
  });
  $("#enterBtn").addEventListener("click", (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    const o = { x: r.left + r.width / 2, y: r.top + r.height / 2 };
    playSound("heart");
    burstHearts(90, o); burstConfetti(90, o); ringBurst(o.x, o.y);
    Music.tryAutoplay();
    $("#ch1").scrollIntoView({ behavior: "smooth" });
    toast(`Hi ${CONFIG.girlfriendName}. This way 👇❤️`);
  });
  $("#iloveBtn").addEventListener("click", (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    megaCelebration(`I LOVE YOU, ${CONFIG.girlfriendName.toUpperCase()} ❤️`); Sfx.pop(2);
    e.currentTarget.animate([{ transform: "scale(1)" }, { transform: "scale(1.35)" }, { transform: "scale(1)" }],
      { duration: 600, easing: "cubic-bezier(.2,1.6,.3,1)" });
    document.querySelector(".love-zone .buddy")?.animate(
      [{ transform: "translateY(0) scale(1)" }, { transform: "translateY(-26px) scale(1.15) rotate(-6deg)" }, { transform: "translateY(0) scale(1)" }],
      { duration: 600, easing: "cubic-bezier(.2,1.6,.3,1)" });
    $("#loveReveal").classList.remove("hidden");
    $("#loveReveal").scrollIntoView({ behavior: "smooth", block: "center" });
  });
}

/* ---------------- runaway NO ---------------- */
function addCrowd(arena) {
  const c = document.createElement("div");
  c.className = "crowd"; c.setAttribute("aria-hidden", "true");
  for (let i = 0; i < 8; i++) {
    const s = document.createElement("span");
    s.innerHTML = heartSVG("mini");
    c.appendChild(s);
  }
  arena.before(c);
}
function makeRunaway(arenaId, noId, yesId, tauntId, doneCallback) {
  const arena = document.getElementById(arenaId), no = document.getElementById(noId), yes = document.getElementById(yesId);
  addCrowd(arena);
  let escapes = 0;
  const SURRENDER_AFTER = 7;
  function place() {
    // random spot inside the arena that never covers the YES button
    const pad = 8;
    const aw = arena.clientWidth, ah = arena.clientHeight;
    const nw = no.offsetWidth || 100, nh = no.offsetHeight || 50;
    const yw = yes.getBoundingClientRect(), awRect = arena.getBoundingClientRect();
    const m = 14;
    const yL = yw.left - awRect.left - m, yR = yw.right - awRect.left + m;
    const yT = yw.top - awRect.top - m, yB = yw.bottom - awRect.top + m;
    let x = Math.max(pad, aw - nw - pad), y = Math.max(pad, ah - nh - pad);
    for (let t = 0; t < 60; t++) {
      const cx = rand(pad, Math.max(pad + 1, aw - nw - pad));
      const cy = rand(pad, Math.max(pad + 1, ah - nh - pad));
      if (cx - 4 < yR && cx + nw + 4 > yL && cy - 4 < yB && cy + nh + 4 > yT) continue;
      x = cx; y = cy; break;
    }
    no.style.left = "0"; no.style.top = "0";
    no.style.transform = `translate(${x}px,${y}px) rotate(${rand(-10, 10)}deg) scale(${rand(0.9, 1.1)})`;
  }
  function move() {
    if (no.dataset.done === "1") return;
    escapes++;
    place();
    no.classList.remove("landed"); void no.offsetWidth; no.classList.add("landed");
    const r0 = no.getBoundingClientRect();
    for (let k = 0; k < 3; k++) {
      const pf = document.createElement("span");
      pf.className = "no-poof"; pf.textContent = "💨";
      pf.style.left = r0.left + rand(0, r0.width) + "px";
      pf.style.top = r0.top + rand(0, r0.height) + "px";
      document.body.appendChild(pf);
      setTimeout(() => pf.remove(), 650);
    }
    const taunt = document.getElementById(tauntId);
    if (taunt) taunt.textContent = pick(NO_TAUNTS) + ` (${escapes}/${SURRENDER_AFTER})`;
    Sfx.boing(escapes); playSound("click");
    const rc = no.getBoundingClientRect();
    burstHearts(6, { x: rc.left + rc.width / 2, y: rc.top + rc.height / 2 });
    arena.parentElement?.querySelector(".crowd")?.querySelectorAll("span").forEach((s, j) => {
      s.animate([{ transform: "translateY(0)" }, { transform: "translateY(-12px)" }, { transform: "translateY(0)" }],
        { duration: 350, delay: j * 45 });
    });
    if (escapes >= SURRENDER_AFTER) {
      no.dataset.done = "1";
      no.textContent = "Fine... YES ❤️";
      no.style.background = "linear-gradient(135deg,#22c55e,#16a34a)";
      no.style.borderStyle = "solid"; no.style.borderColor = "#22c55e";
      no.onclick = (ev) => { ev.preventDefault(); doneCallback(); };
      if (taunt) taunt.textContent = "okay okay, it gives up. click it. 😂";
    }
  }
  no.addEventListener("pointerenter", (e) => { if (e.pointerType !== "touch") move(); });
  no.addEventListener("mouseenter", move);
  no.addEventListener("pointerdown", (e) => { e.preventDefault(); move(); });
  no.addEventListener("touchstart", (e) => { e.preventDefault(); move(); }, { passive: false });
  no.addEventListener("click", (e) => { if (no.dataset.done !== "1") { e.preventDefault(); move(); } });
  yes.addEventListener("click", doneCallback);
  addEventListener("resize", () => { if (no.dataset.done !== "1") place(); });
  place();
}
function initAsk() {
  makeRunaway("arena1", "no1", "yes1", "taunt1", () => {
    megaCelebration("I KNEW IT. ❤️"); Sfx.pop(4);
    $("#yesReveal1").classList.remove("hidden");
    $("#yesReveal1").scrollIntoView({ behavior: "smooth", block: "center" });
  });
  makeRunaway("arena2", "no2", "yes2", "taunt2", () => {
    megaCelebration("Correct answer ❤️"); Sfx.fanfare();
    $("#yesReveal2").classList.remove("hidden");
    $("#ch15").scrollIntoView({ behavior: "smooth" });
  });
}

/* ---------------- SRK ---------------- */
function initSrk() {
  const res = $("#srkResult");
  const bulbs = $(".marquee-bulbs");
  for (let i = 0; i < 12; i++) bulbs.appendChild(document.createElement("i"));
  $("#meBtn").addEventListener("click", (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    burstHearts(70, { x: r.left + r.width / 2, y: r.top }); Sfx.pop(3);
    res.classList.remove("hidden");
    res.innerHTML = `<p>Awwww. Finally. 😌❤️</p><p class="muted">SRK will survive. Probably. He's dramatic like that.</p>`;
    playSound("heart");
  });
  $("#srkBtn").addEventListener("click", (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    burstHearts(30, { x: r.left + r.width / 2, y: r.top }); Sfx.boing(2);
    res.classList.remove("hidden");
    res.innerHTML = `<p>I KNEW IT 😭</p><p>Okay. Fine. I'll allow it.</p><p class="muted">But I'm still slightly offended. And still making you cake. That's love.</p>`;
    toast("SRK wins again 👑😭");
  });
}

/* ---------------- music ---------------- */
const Music = {
  idx: 0, audio: null, yt: null, _ytApi: null, _poll: null, _noteTimer: null, _errToast: false,
  isYT(t) { return !!(t && t.youtube); },
  list() { return CONFIG.musicPlaylist.filter((t) => t.src || t.youtube); },
  init() {
    this.audio = $("#audioEl");
    this.render();
    $("#playBtn").addEventListener("click", () => this.toggle());
    $("#nextBtn").addEventListener("click", () => this.step(1));
    $("#prevBtn").addEventListener("click", () => this.step(-1));
    $("#volBar").addEventListener("input", (e) => {
      const v = +e.target.value;
      this.audio.volume = v;
      try { this.yt?.setVolume(Math.round(v * 100)); } catch {}
    });
    $("#seekBar").addEventListener("input", (e) => {
      const t = this.list()[this.idx];
      const frac = +e.target.value / 100;
      if (this.isYT(t) && this.yt) {
        try { const d = this.yt.getDuration() || 0; if (d) this.yt.seekTo(frac * d, true); } catch {}
      } else if (this.audio.duration) this.audio.currentTime = frac * this.audio.duration;
    });
    this.audio.addEventListener("timeupdate", () => {
      if (this.audio.duration) $("#seekBar").value = (this.audio.currentTime / this.audio.duration) * 100;
      $("#tCur").textContent = fmtT(this.audio.currentTime); $("#tDur").textContent = fmtT(this.audio.duration || 0);
    });
    this.audio.addEventListener("ended", () => this.step(1));
    this.audio.addEventListener("error", () => {
      $("#playlistEl")?.children[this.idx]?.classList.add("missing");
      if (!this._errToast) { this._errToast = true; toast("That mp3 is missing from assets/ — add your files 📻"); }
    });
    this.audio.addEventListener("play", () => this.setUI(true));
    this.audio.addEventListener("pause", () => this.setUI(false));
  },
  setUI(playing) {
    $("#playBtn").textContent = playing ? "⏸" : "▶";
    $("#reelL").classList.toggle("spin", playing);
    $("#reelR").classList.toggle("spin", playing);
    if (playing) this._notes(); else { clearInterval(this._noteTimer); this._noteTimer = null; }
  },
  ytApi() {
    if (this._ytApi) return this._ytApi;
    this._ytApi = new Promise((resolve, reject) => {
      if (window.YT?.Player) return resolve(window.YT);
      const to = setTimeout(() => reject(new Error("yt-timeout")), 15000);
      window.onYouTubeIframeAPIReady = () => { clearTimeout(to); resolve(window.YT); };
      const s = document.createElement("script");
      s.src = "https://www.youtube.com/iframe_api";
      s.onerror = () => { clearTimeout(to); reject(new Error("yt-load")); };
      document.head.appendChild(s);
    });
    return this._ytApi;
  },
  async ensureYT() {
    const YT = await this.ytApi();
    if (!this.yt) {
      await new Promise((resolve) => {
        this.yt = new YT.Player("ytPlayer", {
          height: "4", width: "4",
          playerVars: { autoplay: 0, controls: 0, disablekb: 1, fs: 0, rel: 0 },
          events: {
            onReady: () => resolve(),
            onStateChange: (e) => this._ytState(e.data),
            onError: () => { toast("That YouTube video won't play — skipping 📻"); this.step(1); },
          },
        });
        setTimeout(resolve, 8000);
      });
    }
    return this.yt;
  },
  _ytState(st) {
    if (st === 0) { this.setUI(false); this._pollStop(); this.step(1); return; }
    if (st === 1) { this.setUI(true); this._pollStart(); return; }
    if (st === 2) { this.setUI(false); this._pollStop(); return; }
  },
  _pollStart() {
    this._pollStop();
    this._poll = setInterval(() => {
      try {
        if (!this.yt || this.yt.getPlayerState() !== 1) return;
        const cur = this.yt.getCurrentTime(), dur = this.yt.getDuration() || 0;
        if (dur) $("#seekBar").value = (cur / dur) * 100;
        $("#tCur").textContent = fmtT(cur); $("#tDur").textContent = fmtT(dur);
      } catch {}
    }, 500);
  },
  _pollStop() { clearInterval(this._poll); this._poll = null; },
  select(i) {
    this._pollStop(); this.setUI(false);
    try { this.audio.pause(); } catch {}
    try { this.yt?.pauseVideo(); } catch {}
    this.idx = i; this.render();
  },
  _notes() {
    if (reducedMotion || this._noteTimer) return;
    this._noteTimer = setInterval(() => {
      if (document.hidden || this.audio.paused) return;
      const deck = $("#cassette"); if (!deck || deck.querySelectorAll(".mnote").length > 6) return;
      const n = document.createElement("span");
      n.className = "mnote"; n.textContent = pick(["♪", "♫", "♩"]);
      n.style.left = rand(8, 88) + "%"; n.style.top = "4px";
      deck.appendChild(n);
      setTimeout(() => n.remove(), 2500);
    }, 700);
  },
  render() {
    const pl = $("#playlistEl"); pl.innerHTML = "";
    this.list().forEach((t, i) => {
      const li = document.createElement("li");
      li.innerHTML = `${t.youtube ? "🎬 " : ""}${t.title} — ${t.artist}`;
      if (i === this.idx) li.classList.add("active");
      li.addEventListener("click", () => this.play(i));
      pl.appendChild(li);
    });
    const t = this.list()[this.idx];
    $("#trackTitle").textContent = t ? t.title : "Add mp3s to assets/ 🎶";
    $("#trackArtist").textContent = t ? " — " + t.artist : "";
  },
  async play(i = this.idx) {
    const list = this.list();
    if (!list.length) { toast("Add your mp3s to assets/ first 📻"); return; }
    const t = list[i]; if (!t) return;
    if (this.isYT(t)) {
      let vid = null;
      try { vid = this.yt?.getVideoData?.()?.video_id; } catch {}
      if (i !== this.idx || vid !== t.youtube) {
        this.select(i);
        try {
          const p = await this.ensureYT();
          p.setVolume(Math.round((+($("#volBar")?.value ?? 0.8)) * 100));
          p.loadVideoById(t.youtube);
          try { p.playVideo(); } catch {}
        } catch { toast("YouTube couldn't load — check connection 📻"); }
      } else { try { this.yt.playVideo(); } catch {} }
    } else {
      const want = new URL(t.src, location.href).href;
      if (i !== this.idx || this.audio.src !== want) {
        this.select(i);
        this.audio.src = t.src;
      }
      this.audio.play().catch(() => toast("Couldn't play that file — check assets/ path 🎶"));
    }
  },
  toggle() {
    const t = this.list()[this.idx];
    if (this.isYT(t)) {
      if (this.yt) {
        try {
          if (this.yt.getPlayerState() === 1) this.yt.pauseVideo();
          else this.yt.playVideo();
          return;
        } catch {}
      }
      this.play(this.idx); return;
    }
    if (this.audio.paused) {
      if (!this.audio.src) this.play(this.idx);
      else this.audio.play().catch(() => {});
    } else this.audio.pause();
  },
  step(d) { const l = this.list().length; if (!l) return toast("Playlist is empty 📻"); this.play((this.idx + d + l) % l); },
  tryAutoplay() {
    if (!this.list().length) return;
    this.audio.volume = +($("#volBar")?.value ?? 0.8);
    Promise.resolve(this.play(0)).then(() => toast(`Now playing: ${this.list()[0].title} 🎶`)).catch(() => {});
  },
};

/* ---------------- reasons / gallery / timeline / cases ---------------- */
let watchItems = () => {};
const Gallery = {
  items: [], cur: 0,
  init(watch) {
    this.items = CONFIG.memories.map((m) => ({ ...m }));
    this._watch = watch;
    this.render();
    $("#uploadInput").addEventListener("change", (e) => {
      [...e.target.files].forEach((f) => {
        if (!f.type.startsWith("image/")) return;
        this.items.unshift({ image: URL.createObjectURL(f), date: "today", caption: f.name.replace(/\.[^.]+$/, "").slice(0, 40) || "us ❤️" });
      });
      this.render();
      toast(`Added ${e.target.files.length} photo(s) 📸`);
      e.target.value = "";
    });
    $("#lbClose").addEventListener("click", () => $("#lightbox").classList.add("hidden"));
    $("#lightbox").addEventListener("click", (e) => { if (e.target.id === "lightbox") $("#lightbox").classList.add("hidden"); });
    $("#lbPrev").addEventListener("click", () => this.step(-1));
    $("#lbNext").addEventListener("click", () => this.step(1));
    addEventListener("keydown", (e) => {
      if ($("#lightbox").classList.contains("hidden")) return;
      if (e.key === "Escape") $("#lightbox").classList.add("hidden");
      if (e.key === "ArrowRight") this.step(1);
      if (e.key === "ArrowLeft") this.step(-1);
    });
  },
  render() {
    const g = $("#gallery"); g.innerHTML = "";
    this.items.forEach((m, i) => {
      const fig = document.createElement("figure");
      fig.className = "polaroid";
      fig.style.setProperty("--rot", `${(i % 2 ? 1 : -1) * (1 + (i % 4))}deg`);
      fig.style.transitionDelay = `${Math.min(i * 0.07, 0.5)}s`;
      fig.innerHTML = `<span class="ph-date">${m.date || "us"}</span><img loading="lazy" alt="Memory: ${m.caption || "us"}" src="${m.image}"><figcaption>${m.caption || "caption me in CONFIG ✍️"}</figcaption>`;
      const img = fig.querySelector("img");
      img.onerror = () => {
        const d = document.createElement("div");
        d.className = "art-fill";
        d.innerHTML = photoArt(i % 6, m.image);
        img.replaceWith(d);
      };
      fig.addEventListener("click", () => this.open(i));
      fig.addEventListener("dblclick", (e) => { burstHearts(40, { x: e.clientX, y: e.clientY }); Sfx.pop(2); });
      g.appendChild(fig);
    });
    if (!this.items.length) g.innerHTML = `<p class="muted">No photos yet — press + ADD OUR PHOTOS 📸</p>`;
    this._watch?.();
  },
  open(i) { this.cur = i; this.show(); $("#lightbox").classList.remove("hidden"); },
  show() { const m = this.items[this.cur]; if (!m) return; $("#lbImg").src = m.image; $("#lbCap").textContent = m.caption || ""; },
  step(d) { this.cur = (this.cur + d + this.items.length) % this.items.length; this.show(); },
};

function initContent(watch) {
  const ns = $("#notes"); ns.innerHTML = "";
  [...CONFIG.reasons, "Just... you. ❤️"].forEach((r, i) => {
    const p = document.createElement("p");
    p.className = "sticky" + (i === CONFIG.reasons.length ? " final" : "");
    p.textContent = r;
    ns.appendChild(p);
  });
  const tl = $("#timeline"); tl.innerHTML = "";
  CONFIG.timeline.forEach((t) => {
    const d = document.createElement("div");
    d.className = "tl-item";
    d.innerHTML = `<span class="tl-date">${t.date}</span><h4>${t.title}</h4><p>${t.text}</p>`;
    tl.appendChild(d);
  });
  const titles = { sad: "For when you're sad 🥺", missYou: "For when you miss me 🫶", angry: "For when you're angry 😤", smile: "For when you need a smile ❤️" };
  $$(".case").forEach((c) => c.addEventListener("click", () => {
    $("#envTitle").textContent = titles[c.dataset.case];
    $("#envText").textContent = CONFIG.openWhen[c.dataset.case] || "Edit me in CONFIG.openWhen ✍️";
    $("#envelope").classList.remove("hidden");
    Sfx.pop(1); playSound("heart");
  }));
  $("#envClose").addEventListener("click", () => $("#envelope").classList.add("hidden"));
  $("#envelope").addEventListener("click", (e) => { if (e.target.id === "envelope") e.currentTarget.classList.add("hidden"); });
  watch();
}

/* ---------------- cake ---------------- */
const Cake = {
  total: 5, out: 0, micStream: null, _leanOn: false, _celebrated: false,
  init() {
    const wrap = $("#candles"); wrap.innerHTML = ""; this.out = 0;
    $("#cake")?.classList.remove("party");
    this._celebrated = false; this.enableLean();
    for (let i = 0; i < this.total; i++) {
      const b = document.createElement("button");
      b.className = "candle"; b.setAttribute("aria-label", `Blow out candle ${i + 1}`);
      b.innerHTML = `<span class="wick"></span><span class="flame"><span class="f-outer"></span><span class="f-inner"></span></span>`;
      b.style.animationDelay = `${i * 0.09}s`;
      b.addEventListener("click", (e) => this.extinguish(b, { x: e.clientX, y: e.clientY }));
      wrap.appendChild(b);
    }
    const sp = $("#sprinkles");
    if (sp && !sp.children.length) {
      ["#ffd166", "#fff3ea", "#7c5cbf", "#22c55e", "#4dc6ff"].forEach(() => {});
      for (let i = 0; i < 26; i++) {
        const s = document.createElement("span");
        s.className = "sprinkle";
        s.style.cssText = `left:${rand(4, 92)}%;top:${rand(8, 88)}%;background:${pick(["#ffd166", "#fff3ea", "#7c5cbf", "#22c55e", "#4dc6ff"])};transform:rotate(${rand(0, 180)}deg)`;
        sp.appendChild(s);
      }
    }
    this.count();
    $("#relightBtn").onclick = () => this.init();
    $("#micBtn").onclick = () => this.enableMic();
  },
  enableLean() {
    if (this._leanOn) return;
    this._leanOn = true;
    const cake = $("#cake");
    if (!cake || reducedMotion || isMobile) return;
    cake.addEventListener("pointermove", (e) => {
      $$(".candle:not(.out) .flame", cake).forEach((f) => {
        const r = f.getBoundingClientRect();
        f.style.setProperty("--lean", `${Math.max(-28, Math.min(28, (e.clientX - (r.left + r.width / 2)) * 0.12))}deg`);
      });
    });
    cake.addEventListener("pointerleave", () => $$(".candle .flame", cake).forEach((f) => f.style.setProperty("--lean", "0deg")));
  },
  count() {
    const left = this.total - this.out;
    $("#candleCount").textContent = this.out >= this.total ? "all out. wish mode: ON ✨" : `${left} ${left === 1 ? "candle" : "candles"} still burning 🔥`;
  },
  extinguish(btn, origin) {
    if (btn.classList.contains("out")) return;
    btn.classList.add("out"); this.out++;
    const puff = document.createElement("span");
    puff.className = "puff"; btn.appendChild(puff);
    setTimeout(() => puff.remove(), 1200);
    burstSparkles(10 + this.out * 8, origin); burstHearts(3 + this.out, origin);
    Sfx.pop(this.out); playSound("heart");
    this.count();
    if (this.out < this.total) {
      const left = this.total - this.out;
      toast(left === 1 ? "last one. make it count ✨" : pick([
        `${left} to go… the cake is nervous`, `${left} left — the icing is sweating`, "the little flames are scared 👀"]));
    } else this.celebrate();
  },
  async celebrate() {
    if (this._celebrated) return;
    this._celebrated = true;
    setDim(reducedMotion ? 0 : 0.55);
    toast("wish locked in… ✨");
    showBigHeart("close your eyes… make it good ✨", 1600);
    await wait(reducedMotion ? 150 : 1500);
    const rect = $("#cake")?.getBoundingClientRect();
    const cx = rect ? rect.left + rect.width / 2 : innerWidth / 2;
    const cy = rect ? rect.top - 30 : innerHeight * 0.4;
    await smokeHeart(cx, cy);
    setDim(0);
    $("#wishReveal").classList.remove("hidden");
    popWishLetters();
    megaCelebration(`HAPPY BIRTHDAY, ${CONFIG.girlfriendName.toUpperCase()} ❤️`); Sfx.fanfare();
    $("#cake")?.classList.add("party");
    $("#wishReveal").scrollIntoView({ behavior: "smooth", block: "center" });
    const pals = [["#ffd166", "#fff3ea", "#ff9f1c"], ["#ff5d8f", "#ffb3c9", "#fff3ea"],
      ["#cfc2ff", "#7c5cbf", "#fff3ea"], ["#7dff9e", "#1faa53", "#fff3ea"]];
    const baseY = rect ? rect.top + 40 : innerHeight * 0.6;
    for (let v = 0; v < (reducedMotion ? 2 : 6); v++) {
      const p = await rocket(cx + rand(-140, 140), baseY + rand(-20, 60));
      explodeFirework(p.x, p.y, pals[(v + 1) % pals.length], v % 2 === 0);
      await wait(reducedMotion ? 60 : rand(220, 420));
    }
    await wait(400);
    explodeFirework(cx, cy - 60, pals[0], true);
    burstConfetti(120);
    this.stopMic();
  },
  async enableMic() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.micStream = stream;
      const ctx = new AudioContext();
      const an = ctx.createAnalyser(); an.fftSize = 512;
      ctx.createMediaStreamSource(stream).connect(an);
      const data = new Uint8Array(an.frequencyBinCount);
      toast("Blow at the mic 🎤 (or just tap them)");
      const tick = () => {
        if (!this.micStream) { ctx.close(); return; }
        an.getByteTimeDomainData(data);
        let peak = 0;
        for (const v of data) peak = Math.max(peak, Math.abs(v - 128) / 128);
        if (peak > 0.35) {
          const lit = $(".candle:not(.out)");
          if (lit) this.extinguish(lit, null);
        }
        if (this.out < this.total) requestAnimationFrame(tick); else this.stopMic();
      };
      tick();
    } catch { toast("Mic blocked — no worries, tapping works perfectly 🎂"); }
  },
  stopMic() { this.micStream?.getTracks().forEach((t) => t.stop()); this.micStream = null; },
};

/* ---------------- easter eggs + cute layer ---------------- */
function initEggs() {
  let clicks = 0;
  $("#logoBtn").addEventListener("click", () => {
    if (++clicks === 5) { clicks = 0; megaCelebration(); toast("Okay detective... you found this 😂"); }
  });
  let buf = "";
  addEventListener("keydown", (e) => {
    if (e.key.length !== 1) return;
    buf = (buf + e.key.toLowerCase()).slice(-7);
    if (buf === "iloveyou") { buf = ""; megaCelebration("psst... you type cute things ❤️"); }
  });
  $("#secretHeart").addEventListener("click", () => {
    megaCelebration(`I LOVE YOU, ${CONFIG.girlfriendName.toUpperCase()} ❤️`);
    toast("You found it. I knew you would. ❤️");
  });
  $("#srkCrown").addEventListener("click", () => {
    showBigHeart("👑", 2000);
    setTimeout(() => {
      toast("Okay, fine. One last SRK reference.");
      setTimeout(() => toast(`${CONFIG.girlfriendName} + SRK = ❤️`), 1800);
      setTimeout(() => toast(`${CONFIG.girlfriendName} + ${CONFIG.myName} = ❤️❤️`), 3600);
      setTimeout(() => toast("I had to remind you. 😂"), 5200);
    }, 900);
  });
  $("#replayBtn").addEventListener("click", () => {
    megaCelebration(); Sfx.fanfare();
    setTimeout(() => { window.scrollTo({ top: 0, behavior: "smooth" }); toast("Encore! 🎬❤️"); }, 1200);
  });
}

function initCute() {
  // drifting kawaii floaties in the hero
  const col = $("#collage");
  if (col && !reducedMotion) {
    const ch0 = $("#ch0");
    let visible = true;
    new IntersectionObserver((es) => (visible = es[0].isIntersecting)).observe(ch0);
    setInterval(() => {
      if (!visible || document.hidden) return;
      if (col.querySelectorAll(".floatie").length > (isMobile ? 4 : 8)) return;
      const f = document.createElement("span");
      f.className = "floatie";
      const s = Math.round(rand(26, 60));
      f.style.left = rand(2, 90) + "%";
      f.style.width = s + "px"; f.style.height = s + "px";
      f.style.animationDuration = rand(7, 13) + "s";
      f.innerHTML = heartSVG(Math.random() < 0.6 ? "mini" : "plain");
      col.appendChild(f);
      setTimeout(() => f.remove(), 13500);
    }, 1400);
  }
  // mascot buddies with rotating one-liners
  [
    { sel: ".love-zone", lines: ["psst… press it", "do it 👀", "big red button. press."] },
    { sel: ".gallery-actions", lines: ["that's my girl 📸", "cute. frame it.", "tota approved 🦜"] },
    { sel: ".cake-controls", lines: ["make it a good one ✨", "i'm not telling", "blow! blow!"] },
  ].forEach(({ sel, lines }, si) => {
    const host = $(sel); if (!host || host.querySelector(".buddy")) return;
    const b = document.createElement("div");
    b.className = "buddy" + (si % 2 ? " flip" : "");
    b.setAttribute("aria-hidden", "true");
    b.innerHTML = `${heartSVG("mini")}<div class="bubble">${lines[0]}</div>`;
    host.appendChild(b);
    let li = 0;
    setInterval(() => {
      li = (li + 1) % lines.length;
      const bub = b.querySelector(".bubble");
      if (!bub) return;
      bub.textContent = lines[li];
      bub.animate([{ transform: "scale(.7)" }, { transform: "scale(1.12)" }, { transform: "scale(1)" }],
        { duration: 350, easing: "cubic-bezier(.2,1.6,.3,1)" });
    }, 3800);
  });
}

/* ---------------- fun zone: scratch gift + dance party ---------------- */
function initScratch() {
  const cv = $("#scratch"); if (!cv) return;
  const ctx = cv.getContext("2d", { willReadFrequently: true });
  const W = cv.width, H = cv.height;
  const g = ctx.createLinearGradient(0, 0, W, H);
  g.addColorStop(0, "#8a6d2b"); g.addColorStop(0.5, "#ffd166"); g.addColorStop(1, "#8a6d2b");
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = "rgba(0,0,0,.15)";
  for (let y = 0; y < H; y += 18) ctx.fillRect(0, y, W, 3);
  ctx.fillStyle = "#3a2400"; ctx.textAlign = "center";
  ctx.font = "800 44px 'DM Sans',sans-serif";
  ctx.fillText("SCRATCH ME ✨", W / 2, H / 2 - 6);
  ctx.font = "600 22px 'DM Sans',sans-serif";
  ctx.fillText("(use your finger. go on.)", W / 2, H / 2 + 34);
  let down = false, done = false, moves = 0;
  const erase = (e) => {
    if (!down || done) return;
    const r = cv.getBoundingClientRect();
    if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) return;
    e.preventDefault();
    const x = (e.clientX - r.left) * (W / r.width), y = (e.clientY - r.top) * (H / r.height);
    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath(); ctx.arc(x, y, 34, 0, 7); ctx.fill();
    if (++moves % 12 === 0) {
      const d = ctx.getImageData(0, 0, W, H).data;
      let clear = 0, total = 0;
      for (let i = 3; i < d.length; i += 4 * 37) { total++; if (d[i] < 40) clear++; }
      if (clear / total > 0.45) {
        done = true;
        ctx.clearRect(0, 0, W, H);
        $("#scratchHint").textContent = "told you it was worth it 😌";
        burstHearts(80); burstConfetti(80); Sfx.fanfare();
        toast("Your gift: me. No refunds ❤️");
      }
    }
  };
  cv.addEventListener("pointerdown", (e) => { down = true; erase(e); });
  addEventListener("pointermove", erase);
  addEventListener("pointerup", () => (down = false));
  addEventListener("pointercancel", () => (down = false));
  $("#scratchSkip")?.addEventListener("click", () => {
    if (done) return;
    done = true; ctx.clearRect(0, 0, W, H);
    toast("Impatient. Cute. ❤️");
  });
}
function initFun() {
  initScratch();
  let partyTimer = null, burstTimer = null;
  $("#partyBtn")?.addEventListener("click", () => {
    if (document.body.classList.contains("party-on")) {
      document.body.classList.remove("party-on");
      clearInterval(burstTimer); clearTimeout(partyTimer);
      toast("party over. back to romance. ❤️");
      return;
    }
    document.body.classList.add("party-on");
    Sfx.fanfare(); playSound("celebration");
    toast("🪩 DANCE BREAK — 12 seconds. GO.");
    burstTimer = setInterval(() => { burstConfetti(40); burstHearts(30); }, 900);
    partyTimer = setTimeout(() => {
      document.body.classList.remove("party-on");
      clearInterval(burstTimer);
      toast("party over. back to romance. ❤️");
    }, 12000);
  });
}

/* ---------------- boot ---------------- */
document.addEventListener("DOMContentLoaded", () => {
  applyNames();
  injectHearts();
  buildCollage();
  const watch = initObservers();
  initChrome();
  initEnter();
  initAsk();
  initSrk();
  Music.init();
  Gallery.init(watch);
  initContent(watch);
  Cake.init();
  initEggs();
  initCute();
  initFun();
});
