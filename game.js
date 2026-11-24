/* Lane Racer: a no-lose lane racing game for little drivers. */
(function () {
  'use strict';

  // ---------------------------------------------------------------- cars
  var CARS = [
    { id: 'zoom',   name: 'Zoomer',  body: '#ff3b4e', dark: '#c81e33', accent: '#ffffff', style: 'sport',  num: '1' },
    { id: 'bolt',   name: 'Bolt',    body: '#2f7bff', dark: '#1a52c4', accent: '#ffd21f', style: 'formula', num: '7' },
    { id: 'sunny',  name: 'Sunny',   body: '#ffc21f', dark: '#e09400', accent: '#ff5aa5', style: 'buggy',  num: '3' },
    { id: 'leafy',  name: 'Leafy',   body: '#2fc95a', dark: '#1d8e3c', accent: '#ffffff', style: 'muscle', num: '5' },
    { id: 'rocket', name: 'Rocket',  body: '#a55cff', dark: '#7330d1', accent: '#4ef0ff', style: 'rocket', num: '9' }
  ];

  function rr(c, x, y, w, h, r) {
    r = Math.min(r, w / 2, h / 2);
    c.beginPath();
    c.moveTo(x + r, y);
    c.arcTo(x + w, y, x + w, y + h, r);
    c.arcTo(x + w, y + h, x, y + h, r);
    c.arcTo(x, y + h, x, y, r);
    c.arcTo(x, y, x + w, y, r);
    c.closePath();
  }

  // Draws a top-down car centred at (0,0), facing up, size w x h.
  function drawCar(c, car, w, h, t) {
    t = t || 0;
    var hw = w / 2, hh = h / 2;
    // shadow
    c.fillStyle = 'rgba(0,0,0,.22)';
    rr(c, -hw * 0.95 + w * 0.06, -hh + h * 0.06, w * 0.95, h, w * 0.3); c.fill();

    // wheels
    c.fillStyle = '#222';
    var ww = w * 0.22, wh = h * 0.2;
    var wx = car.style === 'formula' || car.style === 'buggy' ? hw * 0.98 : hw * 0.82;
    [[-1, -0.55], [1, -0.55], [-1, 0.55], [1, 0.55]].forEach(function (p) {
      var big = car.style === 'buggy' || (car.style === 'formula' && p[1] > 0);
      var ew = big ? ww * 1.25 : ww, eh = big ? wh * 1.2 : wh;
      rr(c, p[0] * wx - ew / 2, p[1] * hh - eh / 2, ew, eh, ew * 0.35); c.fill();
    });
    c.fillStyle = '#666';
    [[-1, -0.55], [1, -0.55], [-1, 0.55], [1, 0.55]].forEach(function (p) {
      rr(c, p[0] * wx - ww * 0.2, p[1] * hh - wh * 0.3 + ((t * 40) % (wh * 0.6)) * 0 , ww * 0.4, wh * 0.6, 2); c.fill();
    });

    c.lineWidth = Math.max(2, w * 0.04);
    c.strokeStyle = car.dark;

    if (car.style === 'formula') {
      // nose + front wing
      c.fillStyle = car.accent; rr(c, -hw * 0.95, -hh, w * 0.95, h * 0.09, 4); c.fill();
      c.fillStyle = car.body;
      c.beginPath();
      c.moveTo(-w * 0.12, -hh * 0.92); c.lineTo(w * 0.12, -hh * 0.92);
      c.lineTo(w * 0.32, hh * 0.1); c.lineTo(w * 0.34, hh * 0.75);
      c.lineTo(-w * 0.34, hh * 0.75); c.lineTo(-w * 0.32, hh * 0.1); c.closePath();
      c.fill(); c.stroke();
      // side pods
      rr(c, -w * 0.46, -hh * 0.05, w * 0.92, h * 0.38, w * 0.12); c.fill(); c.stroke();
      // rear wing
      c.fillStyle = car.accent; rr(c, -hw, hh * 0.78, w, h * 0.12, 4); c.fill();
      // cockpit + helmet
      c.fillStyle = '#222'; rr(c, -w * 0.13, -hh * 0.2, w * 0.26, h * 0.3, w * 0.1); c.fill();
      c.fillStyle = car.accent; c.beginPath(); c.arc(0, -hh * 0.05, w * 0.1, 0, 7); c.fill();
    } else if (car.style === 'buggy') {
      c.fillStyle = car.body;
      rr(c, -hw * 0.78, -hh * 0.88, w * 0.78, h * 0.88, w * 0.3); c.fill(); c.stroke();
      // roll cage
      c.strokeStyle = '#333'; c.lineWidth = w * 0.06;
      rr(c, -w * 0.3, -hh * 0.25, w * 0.6, h * 0.42, w * 0.08); c.stroke();
      c.beginPath(); c.moveTo(-w * 0.3, 0); c.lineTo(w * 0.3, 0); c.stroke();
      // seat + driver
      c.fillStyle = car.accent; c.beginPath(); c.arc(0, -hh * 0.08, w * 0.13, 0, 7); c.fill();
      // spots
      c.fillStyle = car.accent;
      c.beginPath(); c.arc(-w * 0.2, -hh * 0.6, w * 0.07, 0, 7); c.fill();
      c.beginPath(); c.arc(w * 0.2, -hh * 0.6, w * 0.07, 0, 7); c.fill();
      c.beginPath(); c.arc(0, hh * 0.6, w * 0.09, 0, 7); c.fill();
    } else {
      // sport / muscle / rocket share a body
      var bw = car.style === 'muscle' ? w * 0.9 : w * 0.82;
      c.fillStyle = car.body;
      if (car.style === 'rocket') {
        c.beginPath();
        c.moveTo(0, -hh);
        c.quadraticCurveTo(bw / 2, -hh * 0.75, bw / 2, -hh * 0.1);
        c.lineTo(bw / 2, hh * 0.92); c.lineTo(-bw / 2, hh * 0.92);
        c.lineTo(-bw / 2, -hh * 0.1);
        c.quadraticCurveTo(-bw / 2, -hh * 0.75, 0, -hh);
        c.closePath(); c.fill(); c.stroke();
        // fins
        c.fillStyle = car.dark;
        c.beginPath(); c.moveTo(-bw / 2, hh * 0.4); c.lineTo(-hw * 1.05, hh); c.lineTo(-bw / 2, hh * 0.92); c.fill();
        c.beginPath(); c.moveTo(bw / 2, hh * 0.4); c.lineTo(hw * 1.05, hh); c.lineTo(bw / 2, hh * 0.92); c.fill();
      } else {
        rr(c, -bw / 2, -hh * 0.96, bw, h * 0.94, w * (car.style === 'sport' ? 0.36 : 0.18)); c.fill(); c.stroke();
      }
      // stripes
      c.fillStyle = car.accent;
      if (car.style === 'muscle') {
        c.fillRect(-w * 0.16, -hh * 0.94, w * 0.1, h * 0.92);
        c.fillRect(w * 0.06, -hh * 0.94, w * 0.1, h * 0.92);
      } else if (car.style === 'sport') {
        c.fillRect(-w * 0.06, -hh * 0.94, w * 0.12, h * 0.92);
      } else {
        c.beginPath(); c.arc(0, -hh * 0.55, w * 0.1, 0, 7); c.fill();
      }
      // windscreen
      c.fillStyle = '#9fe4ff';
      c.beginPath();
      c.moveTo(-bw * 0.4, -hh * 0.3); c.lineTo(bw * 0.4, -hh * 0.3);
      c.lineTo(bw * 0.32, -hh * 0.02); c.lineTo(-bw * 0.32, -hh * 0.02); c.closePath(); c.fill();
      c.fillStyle = 'rgba(255,255,255,.7)';
      c.fillRect(-bw * 0.28, -hh * 0.25, bw * 0.12, hh * 0.08);
      // roof
      c.fillStyle = car.dark; rr(c, -bw * 0.34, -hh * 0.02, bw * 0.68, h * 0.28, w * 0.1); c.fill();
      // number circle
      c.fillStyle = '#fff'; c.beginPath(); c.arc(0, hh * 0.12, w * 0.15, 0, 7); c.fill();
      c.fillStyle = car.dark;
      c.font = '900 ' + Math.round(w * 0.22) + 'px system-ui, sans-serif';
      c.textAlign = 'center'; c.textBaseline = 'middle';
      c.fillText(car.num, 0, hh * 0.13);
      // spoiler
      if (car.style !== 'rocket') { c.fillStyle = car.dark; rr(c, -bw / 2 - 2, hh * 0.78, bw + 4, h * 0.1, 4); c.fill(); }
      // headlights
      c.fillStyle = '#fff6a0';
      c.beginPath(); c.arc(-bw * 0.3, -hh * 0.86, w * 0.06, 0, 7); c.fill();
      c.beginPath(); c.arc(bw * 0.3, -hh * 0.86, w * 0.06, 0, 7); c.fill();
    }
  }

  // ---------------------------------------------------------------- audio
  var Audio = (function () {
    var ctx = null, master = null, musicGain = null, on = true, musicTimer = null, nextNote = 0, step = 0;
    try { on = localStorage.getItem('lr-sound') !== 'off'; } catch (e) {}
    function ensure() {
      if (!ctx) {
        var AC = window.AudioContext || window.webkitAudioContext;
        if (!AC) return null;
        ctx = new AC();
        master = ctx.createGain(); master.gain.value = on ? 0.7 : 0; master.connect(ctx.destination);
        musicGain = ctx.createGain(); musicGain.gain.value = 0.16; musicGain.connect(master);
      }
      if (ctx.state === 'suspended') ctx.resume();
      return ctx;
    }
    function tone(freq, dur, type, vol, when, slideTo, dest) {
      if (!ctx) return;
      var t = (when || ctx.currentTime);
      var o = ctx.createOscillator(), g = ctx.createGain();
      o.type = type || 'sine';
      o.frequency.setValueAtTime(freq, t);
      if (slideTo) o.frequency.exponentialRampToValueAtTime(slideTo, t + dur);
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(vol || 0.3, t + 0.01);
      g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      o.connect(g); g.connect(dest || master);
      o.start(t); o.stop(t + dur + 0.05);
    }
    function noise(dur, vol, filterFreq) {
      if (!ctx) return;
      var len = Math.floor(ctx.sampleRate * dur), buf = ctx.createBuffer(1, len, ctx.sampleRate), d = buf.getChannelData(0);
      for (var i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / len);
      var s = ctx.createBufferSource(), f = ctx.createBiquadFilter(), g = ctx.createGain();
      s.buffer = buf; f.type = 'lowpass'; f.frequency.value = filterFreq || 1200; g.gain.value = vol || 0.3;
      s.connect(f); f.connect(g); g.connect(master); s.start();
    }
    // cheerful major-pentatonic loop
    var MEL = [0, 4, 7, 9, 7, 4, 2, 4, 0, 2, 4, 7, 9, 12, 9, 7];
    var BASS = [0, 0, 5, 5, 7, 7, 5, 5];
    function schedule() {
      if (!ctx) return;
      while (nextNote < ctx.currentTime + 0.3) {
        var beat = 0.2;
        if (step % 2 === 0 || Math.random() < 0.5) tone(523.25 * Math.pow(2, MEL[step % 16] / 12), 0.18, 'triangle', 0.5, nextNote, null, musicGain);
        if (step % 2 === 0) tone(130.8 * Math.pow(2, BASS[(step / 2) % 8] / 12), 0.35, 'sine', 0.7, nextNote, null, musicGain);
        nextNote += beat; step++;
      }
    }
    return {
      unlock: function () { ensure(); },
      isOn: function () { return on; },
      toggle: function () {
        on = !on;
        try { localStorage.setItem('lr-sound', on ? 'on' : 'off'); } catch (e) {}
        if (ensure()) master.gain.setTargetAtTime(on ? 0.7 : 0, ctx.currentTime, 0.05);
        return on;
      },
      startMusic: function () {
        if (!ensure() || musicTimer) return;
        nextNote = ctx.currentTime + 0.1; step = 0;
        musicTimer = setInterval(schedule, 100);
      },
      stopMusic: function () { clearInterval(musicTimer); musicTimer = null; },
      suspend: function () { if (ctx && ctx.state === 'running') ctx.suspend(); },
      resume: function () { if (ctx && ctx.state === 'suspended') ctx.resume(); },
      swoosh: function () { noise(0.15, 0.12, 2500); },
      coin: function () { if (!ctx) return; var t = ctx.currentTime; tone(988, 0.08, 'square', 0.12, t); tone(1319, 0.25, 'square', 0.12, t + 0.07); },
      bump: function () { if (!ctx) return; tone(300, 0.35, 'sine', 0.5, null, 90); noise(0.12, 0.2, 600); },
      boing: function () { if (!ctx) return; tone(200, 0.4, 'triangle', 0.4, null, 600); },
      pow: function () { if (!ctx) return; noise(0.2, 0.35, 3000); tone(660, 0.2, 'square', 0.12, null, 1320); },
      power: function () { if (!ctx) return; var t = ctx.currentTime; [523, 659, 784, 1047].forEach(function (f, i) { tone(f, 0.18, 'triangle', 0.3, t + i * 0.07); }); },
      honk: function () { if (!ctx) return; var t = ctx.currentTime; tone(440, 0.14, 'square', 0.15, t); tone(554, 0.14, 'square', 0.15, t); tone(440, 0.2, 'square', 0.15, t + 0.18); tone(554, 0.2, 'square', 0.15, t + 0.18); },
      fanfare: function () { if (!ctx) return; var t = ctx.currentTime; [523, 659, 784, 659, 784, 1047].forEach(function (f, i) { tone(f, i === 5 ? 0.6 : 0.16, 'square', 0.14, t + i * 0.13); tone(f / 2, 0.16, 'triangle', 0.2, t + i * 0.13); }); },
      pop: function () { if (!ctx) return; tone(900, 0.12, 'sine', 0.35, null, 250); }
    };
  })();

  // ---------------------------------------------------------------- setup
  var canvas = document.getElementById('game');
  var ctx = canvas.getContext('2d');
  var W = 0, H = 0, DPR = 1;
  var LANES = 3, road = { x: 0, w: 0 }, laneW = 0, carW = 0, carH = 0;

  function resize() {
    DPR = Math.min(window.devicePixelRatio || 1, 2);
    W = window.innerWidth; H = window.innerHeight;
    canvas.width = Math.round(W * DPR); canvas.height = Math.round(H * DPR);
    road.w = Math.min(W * 0.8, H * 0.78, 760);
    road.x = (W - road.w) / 2;
    laneW = road.w / LANES;
    carW = laneW * 0.52; carH = carW * 1.75;
    if (state && state.player) state.player.y = H - carH * 0.9 - Math.max(30, H * 0.06);
  }

  function laneX(i) { return road.x + laneW * (i + 0.5); }

  // ---------------------------------------------------------------- state
  var state = null;
  var COINS_PER_TROPHY = 20;

  function newGame(car) {
    state = {
      car: car,
      t: 0, dist: 0,
      baseSpeed: 0, speedMul: 1,
      player: { lane: 1, x: laneX(1), y: 0, tilt: 0, bump: 0, spin: 0 },
      things: [], decor: [], parts: [], floaters: [],
      nextSpawn: 0, nextDecor: 0, dashOff: 0,
      coins: 0, trophies: 0,
      star: 0, boost: 0, shield: false, magnet: 0,
      celebrate: 0
    };
    resize();
    state.player.x = laneX(1);
    // pre-fill scenery
    for (var y = -100; y < H + 100; y += 70) addDecor(y);
    state.nextSpawn = H * 0.5;
    updateHud(true);
  }

  // ---------------------------------------------------------------- spawning
  var OBSTACLES = ['cone', 'cone', 'crate', 'tires', 'puddle', 'rock', 'barrier'];
  var POWERS = ['star', 'boost', 'shield', 'magnet'];

  function rand(a, b) { return a + Math.random() * (b - a); }
  function pick(a) { return a[Math.floor(Math.random() * a.length)]; }

  function spawnRow() {
    var r = Math.random();
    var y = -carH;
    if (r < 0.45) {
      // obstacles in 1 (sometimes 2) lanes, never all three
      var lanes = [0, 1, 2].sort(function () { return Math.random() - 0.5; });
      var n = Math.random() < 0.25 ? 2 : 1;
      for (var i = 0; i < n; i++) addThing('obstacle', pick(OBSTACLES), lanes[i], y);
      // a coin in a free lane as a reward for dodging
      if (Math.random() < 0.6) addThing('coin', 'coin', lanes[2], y);
    } else if (r < 0.85) {
      // a line of coins, sometimes snaking between lanes
      var lane = Math.floor(Math.random() * 3), snake = Math.random() < 0.4;
      for (var k = 0; k < 5; k++) {
        addThing('coin', 'coin', lane, y - k * carH * 0.55);
        if (snake && k === 2) lane = Math.max(0, Math.min(2, lane + (Math.random() < 0.5 ? -1 : 1)));
      }
    } else {
      addThing('power', pick(POWERS), Math.floor(Math.random() * 3), y);
    }
  }

  function addThing(kind, type, lane, y) {
    var s = kind === 'coin' ? carW * 0.55 : kind === 'power' ? carW * 0.85 : carW * (type === 'barrier' ? 1.15 : type === 'puddle' ? 1.1 : 0.9);
    state.things.push({ kind: kind, type: type, lane: lane, x: laneX(lane), y: y, s: s, hit: false, vx: 0, vy: 0, rot: 0, vr: 0, alpha: 1, wob: Math.random() * 6 });
  }

  var DECOR = ['tree', 'tree', 'bush', 'flower', 'flower', 'rock', 'tree2'];
  function addDecor(y) {
    var side = Math.random() < 0.5 ? -1 : 1;
    var margin = road.x;
    if (margin < 20) return;
    var x = side < 0 ? rand(10, margin - 25) : rand(road.x + road.w + 25, W - 10);
    state.decor.push({ type: pick(DECOR), x: x, y: y, s: rand(0.8, 1.3), hue: Math.floor(Math.random() * 5) });
  }

  // ---------------------------------------------------------------- input
  var playing = false, paused = false;

  function moveLane(dir) {
    if (!playing || !state) return;
    var p = state.player;
    var nl = Math.max(0, Math.min(LANES - 1, p.lane + dir));
    if (nl !== p.lane) { p.lane = nl; Audio.swoosh(); }
    else { p.tilt = dir * 0.25; } // little nudge at the edge
    flashArrow(dir);
  }

  var touchStart = null;
  canvas.addEventListener('pointerdown', function (e) {
    Audio.unlock();
    touchStart = { x: e.clientX, y: e.clientY, id: e.pointerId, moved: false };
  });
  canvas.addEventListener('pointermove', function (e) {
    if (!touchStart || touchStart.id !== e.pointerId || touchStart.moved) return;
    var dx = e.clientX - touchStart.x;
    if (Math.abs(dx) > 40) { touchStart.moved = true; moveLane(dx > 0 ? 1 : -1); }
  });
  canvas.addEventListener('pointerup', function (e) {
    if (!touchStart || touchStart.id !== e.pointerId) return;
    if (!touchStart.moved) moveLane(e.clientX < W / 2 ? -1 : 1);
    touchStart = null;
  });
  canvas.addEventListener('pointercancel', function () { touchStart = null; });
  window.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft' || e.key === 'a') moveLane(-1);
    if (e.key === 'ArrowRight' || e.key === 'd') moveLane(1);
  });
  document.addEventListener('gesturestart', function (e) { e.preventDefault(); });
  document.addEventListener('dblclick', function (e) { e.preventDefault(); });

  var arrowEls = { '-1': document.querySelector('.arrow.left'), '1': document.querySelector('.arrow.right') };
  function flashArrow(dir) {
    var el = arrowEls[String(dir)]; if (!el) return;
    el.classList.add('flash'); setTimeout(function () { el.classList.remove('flash'); }, 140);
  }

  // ---------------------------------------------------------------- update
  function update(dt) {
    var s = state, p = s.player;
    s.t += dt;
    s.baseSpeed = H * (0.55 + Math.min(s.t / 240, 0.35)); // speeds up very gently over minutes
    var target = s.boost > 0 ? 1.8 : 1;
    if (p.bump > 0) target = 0.45;
    s.speedMul += (target - s.speedMul) * Math.min(1, dt * 3);
    var v = s.baseSpeed * s.speedMul * dt;
    s.dist += v;
    s.dashOff = (s.dashOff + v) % (carH * 1.2);

    // timers
    if (s.star > 0) s.star -= dt;
    if (s.boost > 0) s.boost -= dt;
    if (s.magnet > 0) s.magnet -= dt;
    if (s.celebrate > 0) s.celebrate -= dt;

    // player
    var tx = laneX(p.lane);
    var dx = tx - p.x;
    p.x += dx * Math.min(1, dt * 12);
    p.tilt += ((dx / laneW) * 0.5 - p.tilt) * Math.min(1, dt * 10);
    if (p.bump > 0) { p.bump -= dt; p.spin = Math.sin(p.bump * 22) * 0.35 * (p.bump / 1.0); } else p.spin = 0;

    // spawn
    s.nextSpawn -= v;
    if (s.nextSpawn <= 0) { spawnRow(); s.nextSpawn = carH * rand(2.2, 3.4); }
    s.nextDecor -= v;
    if (s.nextDecor <= 0) { addDecor(-80); s.nextDecor = rand(35, 80); }

    // decor
    for (var i = s.decor.length - 1; i >= 0; i--) { s.decor[i].y += v; if (s.decor[i].y > H + 120) s.decor.splice(i, 1); }

    var invincible = s.star > 0 || s.boost > 0;
    var pw = carW * 0.8, ph = carH * 0.85;

    for (i = s.things.length - 1; i >= 0; i--) {
      var o = s.things[i];
      if (o.hit) {
        o.x += o.vx * dt; o.y += o.vy * dt; o.rot += o.vr * dt; o.alpha -= dt * 1.2;
        if (o.alpha <= 0) { s.things.splice(i, 1); }
        continue;
      }
      o.y += v;
      o.wob += dt;
      if (o.kind === 'coin' && s.magnet > 0) {
        var mx = p.x - o.x, my = p.y - o.y;
        var d = Math.sqrt(mx * mx + my * my);
        if (d < H * 0.5) { o.x += mx * Math.min(1, dt * 6); o.y += my * Math.min(1, dt * 6); }
      }
      if (o.y > H + 100) { s.things.splice(i, 1); continue; }

      // collision
      if (Math.abs(o.x - p.x) < (pw + o.s) / 2 * 0.8 && Math.abs(o.y - p.y) < (ph + o.s) / 2 * 0.8) {
        if (o.kind === 'coin') {
          s.things.splice(i, 1);
          collectCoin(o.x, o.y);
        } else if (o.kind === 'power') {
          s.things.splice(i, 1);
          getPower(o.type, o.x, o.y);
        } else {
          hitObstacle(o, invincible);
        }
      }
    }

    // particles
    for (i = s.parts.length - 1; i >= 0; i--) {
      var q = s.parts[i];
      q.life -= dt;
      if (q.life <= 0) { s.parts.splice(i, 1); continue; }
      q.x += q.vx * dt; q.y += q.vy * dt + (q.fall ? 0 : v * 0.5); q.vy += (q.g || 0) * dt; q.rot += (q.vr || 0) * dt;
    }
    for (i = s.floaters.length - 1; i >= 0; i--) { var f = s.floaters[i]; f.life -= dt; f.y -= 60 * dt; if (f.life <= 0) s.floaters.splice(i, 1); }

    // trails
    if (s.boost > 0 && Math.random() < 0.9) puff(p.x + rand(-carW * 0.2, carW * 0.2), p.y + carH * 0.5, ['#ffef5a', '#ff9d2e', '#ff4d2e'], 1);
    if (s.star > 0 && Math.random() < 0.7) sparkle(p.x + rand(-carW * 0.5, carW * 0.5), p.y + carH * 0.4, 1);
  }

  function collectCoin(x, y) {
    var s = state;
    s.coins++;
    Audio.coin();
    sparkle(x, y, 6);
    if (s.coins >= COINS_PER_TROPHY) {
      s.coins = 0; s.trophies++;
      s.celebrate = 2.5;
      Audio.fanfare();
      confetti();
      updateHud(false, true);
    } else updateHud();
  }

  function getPower(type, x, y) {
    var s = state;
    Audio.power();
    burst(x, y, ['#fff', '#ffe14d', '#4ef0ff'], 18);
    if (type === 'star') s.star = 7;
    else if (type === 'boost') s.boost = 4;
    else if (type === 'shield') s.shield = true;
    else if (type === 'magnet') s.magnet = 9;
    s.floaters.push({ type: type, x: x, y: y, life: 1.2 });
  }

  function hitObstacle(o, invincible) {
    var s = state, p = s.player;
    o.hit = true;
    var side = o.x < p.x ? -1 : 1;
    o.vx = side * rand(300, 600); o.vy = -rand(300, 600); o.vr = side * rand(6, 12);
    if (invincible) {
      Audio.pow();
      burst(o.x, o.y, ['#fff', '#ffe14d', '#ff5aa5'], 14);
      collectCoin(o.x, o.y); // smashing things with a star is a treat
      return;
    }
    if (s.shield) {
      s.shield = false;
      Audio.pop();
      burst(p.x, p.y, ['#bdf3ff', '#ffffff', '#7fdcff'], 20);
      return;
    }
    if (o.type === 'puddle') { o.vx = 0; o.vy = 0; o.vr = 0; Audio.boing(); p.bump = 0.6; splash(o.x, o.y); return; }
    Audio.bump();
    setTimeout(Audio.boing, 120);
    p.bump = 1.0;
    dizzy(p.x, p.y - carH * 0.4);
    try { if (navigator.vibrate) navigator.vibrate(60); } catch (e) {}
  }

  // ---------------------------------------------------------------- particles
  function burst(x, y, colors, n) {
    for (var i = 0; i < n; i++) {
      var a = Math.random() * Math.PI * 2, sp = rand(120, 380);
      state.parts.push({ x: x, y: y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, life: rand(0.4, 0.8), max: 0.8, r: rand(4, 9), c: pick(colors), shape: 'dot', fall: true });
    }
  }
  function sparkle(x, y, n) {
    for (var i = 0; i < n; i++) {
      state.parts.push({ x: x + rand(-10, 10), y: y + rand(-10, 10), vx: rand(-80, 80), vy: rand(-120, 20), life: rand(0.4, 0.7), max: 0.7, r: rand(5, 10), c: pick(['#fff', '#ffe14d', '#ff9dd2', '#8ff7ff']), shape: 'star', rot: Math.random() * 6, vr: rand(-6, 6), fall: true });
    }
  }
  function puff(x, y, colors, n) {
    for (var i = 0; i < n; i++) state.parts.push({ x: x, y: y, vx: rand(-30, 30), vy: rand(80, 200), life: rand(0.25, 0.45), max: 0.45, r: rand(8, 16), c: pick(colors), shape: 'dot', fall: true });
  }
  function splash(x, y) {
    for (var i = 0; i < 14; i++) { var a = -Math.random() * Math.PI; state.parts.push({ x: x, y: y, vx: Math.cos(a) * rand(100, 260), vy: Math.sin(a) * rand(100, 260), g: 700, life: 0.6, max: 0.6, r: rand(4, 8), c: pick(['#5ab8ff', '#9fd8ff', '#fff']), shape: 'dot', fall: true }); }
  }
  function dizzy(x, y) {
    for (var i = 0; i < 5; i++) {
      state.parts.push({ orbit: true, a: i / 5 * Math.PI * 2, life: 1.1, max: 1.1, r: 10, c: pick(['#ffe14d', '#fff']), shape: 'star', rot: 0, vr: 5, x: 0, y: 0, vx: 0, vy: 0, fall: true });
    }
  }
  function confetti() {
    for (var i = 0; i < 120; i++) state.parts.push({ x: rand(0, W), y: rand(-H * 0.3, 0), vx: rand(-60, 60), vy: rand(150, 400), life: rand(1.8, 3), max: 3, r: rand(6, 11), c: pick(['#ff3b4e', '#ffc21f', '#2fc95a', '#2f7bff', '#a55cff', '#ff5aa5']), shape: 'rect', rot: Math.random() * 6, vr: rand(-8, 8), fall: true });
  }

  // ---------------------------------------------------------------- drawing
  var GRASS = '#5ccf6a', GRASS2 = '#52c060';
  function drawWorld() {
    var s = state, c = ctx;
    c.setTransform(DPR, 0, 0, DPR, 0, 0);
    // grass with scrolling stripes
    c.fillStyle = GRASS; c.fillRect(0, 0, W, H);
    var band = 90, off = s.dist % (band * 2);
    c.fillStyle = GRASS2;
    for (var y = -band * 2 + off; y < H; y += band * 2) c.fillRect(0, y, W, band);

    // decor (behind road edges is fine; they sit off-road)
    s.decor.forEach(drawDecor);

    // road
    c.fillStyle = '#4a4f5c'; c.fillRect(road.x, 0, road.w, H);
    // kerbs
    var kw = Math.max(10, road.w * 0.03), seg = 40, koff = s.dist % (seg * 2);
    for (y = -seg * 2 + koff; y < H; y += seg * 2) {
      c.fillStyle = '#ff3b4e'; c.fillRect(road.x - kw, y, kw, seg); c.fillRect(road.x + road.w, y, kw, seg);
      c.fillStyle = '#fff'; c.fillRect(road.x - kw, y + seg, kw, seg); c.fillRect(road.x + road.w, y + seg, kw, seg);
    }
    // lane dashes
    c.fillStyle = 'rgba(255,255,255,.85)';
    var dashL = carH * 0.6, gap = carH * 1.2;
    for (var l = 1; l < LANES; l++) {
      var lx = road.x + laneW * l - 4;
      for (y = -gap + s.dashOff; y < H; y += gap) { rr(c, lx, y, 8, dashL, 4); c.fill(); }
    }

    // things
    s.things.forEach(function (o) {
      c.save();
      c.globalAlpha = Math.max(0, o.alpha);
      c.translate(o.x, o.y); c.rotate(o.rot);
      if (o.kind === 'coin') drawCoin(c, o.s, o.wob);
      else if (o.kind === 'power') drawPower(c, o.type, o.s, o.wob);
      else drawObstacle(c, o.type, o.s);
      c.restore();
    });

    // player
    var p = s.player;
    c.save();
    c.translate(p.x, p.y + (p.bump > 0 ? Math.abs(Math.sin(p.bump * 14)) * -8 : 0));
    if (s.magnet > 0) {
      c.strokeStyle = 'rgba(255,80,120,' + (0.25 + 0.15 * Math.sin(s.t * 8)) + ')';
      c.lineWidth = 6;
      c.beginPath(); c.arc(0, 0, carH * 0.75 + Math.sin(s.t * 8) * 6, 0, 7); c.stroke();
    }
    c.rotate(p.tilt + p.spin);
    if (s.boost > 0) drawFlame(c, s.t);
    if (s.star > 0) {
      c.shadowColor = 'hsl(' + ((s.t * 400) % 360) + ',100%,60%)'; c.shadowBlur = 30;
    }
    drawCar(c, s.car, carW, carH, s.t);
    c.shadowBlur = 0;
    if (s.star > 0) {
      c.globalCompositeOperation = 'source-atop';
      c.fillStyle = 'hsla(' + ((s.t * 400) % 360) + ',100%,60%,.35)';
      c.fillRect(-carW, -carH, carW * 2, carH * 2);
      c.globalCompositeOperation = 'source-over';
    }
    c.restore();
    if (s.shield) {
      c.save();
      c.translate(p.x, p.y);
      var g = c.createRadialGradient(0, 0, carH * 0.3, 0, 0, carH * 0.72);
      g.addColorStop(0, 'rgba(150,230,255,0)'); g.addColorStop(0.85, 'rgba(150,230,255,.35)'); g.addColorStop(1, 'rgba(255,255,255,.8)');
      c.fillStyle = g; c.beginPath(); c.arc(0, 0, carH * 0.72 + Math.sin(s.t * 5) * 3, 0, 7); c.fill();
      c.fillStyle = 'rgba(255,255,255,.7)'; c.beginPath(); c.ellipse(-carH * 0.3, -carH * 0.35, carH * 0.12, carH * 0.06, -0.7, 0, 7); c.fill();
      c.restore();
    }

    // particles
    s.parts.forEach(function (q) {
      var a = Math.max(0, q.life / q.max);
      c.save(); c.globalAlpha = Math.min(1, a * 1.5);
      if (q.orbit) {
        var ang = q.a + (1.1 - q.life) * 7;
        c.translate(p.x + Math.cos(ang) * carW * 0.7, p.y - carH * 0.55 + Math.sin(ang) * carW * 0.25);
      } else c.translate(q.x, q.y);
      c.rotate(q.rot || 0);
      c.fillStyle = q.c;
      if (q.shape === 'star') starPath(c, q.r, q.r * 0.45, 5), c.fill();
      else if (q.shape === 'rect') c.fillRect(-q.r / 2, -q.r / 4, q.r, q.r / 2);
      else { c.beginPath(); c.arc(0, 0, q.r * (0.5 + a * 0.5), 0, 7); c.fill(); }
      c.restore();
    });

    // power-up pop-ups
    s.floaters.forEach(function (f) {
      c.save(); c.globalAlpha = Math.min(1, f.life * 2);
      c.translate(f.x, f.y); var k = 1 + (1.2 - f.life) * 0.8; c.scale(k, k);
      drawPower(c, f.type, carW * 0.8, 0, true);
      c.restore();
    });

    // trophy celebration
    if (s.celebrate > 0) {
      var tt = 2.5 - s.celebrate;
      var sc = Math.min(1, tt * 3) * (1 + Math.sin(tt * 8) * 0.05);
      c.save(); c.translate(W / 2, H * 0.38);
      c.globalAlpha = Math.min(1, s.celebrate * 2);
      c.scale(sc, sc);
      c.fillStyle = 'rgba(255,255,255,.6)';
      c.save(); c.rotate(tt * 0.6); for (var r = 0; r < 12; r++) { c.rotate(Math.PI / 6); c.beginPath(); c.moveTo(0, 0); c.lineTo(-30, -H * 0.3); c.lineTo(30, -H * 0.3); c.fill(); } c.restore();
      drawTrophy(c, Math.min(W, H) * 0.22);
      c.restore();
    }
  }

  function starPath(c, R, r, n) {
    c.beginPath();
    for (var i = 0; i < n * 2; i++) {
      var a = i * Math.PI / n - Math.PI / 2, rad = i % 2 ? r : R;
      c.lineTo(Math.cos(a) * rad, Math.sin(a) * rad);
    }
    c.closePath();
  }

  function drawCoin(c, s, wob) {
    var sx = Math.abs(Math.cos(wob * 3)) * 0.7 + 0.3;
    c.save(); c.scale(sx, 1);
    c.fillStyle = '#e8a200'; c.beginPath(); c.arc(0, 3, s / 2, 0, 7); c.fill();
    var g = c.createRadialGradient(-s * 0.15, -s * 0.15, 2, 0, 0, s / 2);
    g.addColorStop(0, '#fff6a8'); g.addColorStop(0.5, '#ffd21f'); g.addColorStop(1, '#f0b400');
    c.fillStyle = g; c.beginPath(); c.arc(0, 0, s / 2, 0, 7); c.fill();
    c.fillStyle = '#fff3a0'; starPath(c, s * 0.22, s * 0.1, 5); c.fill();
    c.restore();
  }

  function drawPower(c, type, s, wob, noBase) {
    var bob = Math.sin((wob || 0) * 4) * s * 0.06;
    c.translate(0, bob);
    if (!noBase) {
      c.fillStyle = 'rgba(255,255,255,.9)';
      c.beginPath(); c.arc(0, 0, s * 0.6, 0, 7); c.fill();
      c.strokeStyle = 'hsl(' + (((wob || 0) * 200) % 360) + ',100%,60%)'; c.lineWidth = 5;
      c.beginPath(); c.arc(0, 0, s * 0.6, 0, 7); c.stroke();
    }
    if (type === 'star') {
      c.fillStyle = '#ffd21f'; c.strokeStyle = '#ff9d00'; c.lineWidth = 4;
      starPath(c, s * 0.45, s * 0.2, 5); c.fill(); c.stroke();
      c.fillStyle = '#333';
      c.beginPath(); c.arc(-s * 0.08, -s * 0.02, s * 0.04, 0, 7); c.arc(s * 0.08, -s * 0.02, s * 0.04, 0, 7); c.fill();
    } else if (type === 'boost') {
      c.fillStyle = '#ffcf1f'; c.strokeStyle = '#ff7a00'; c.lineWidth = 4;
      c.beginPath();
      c.moveTo(s * 0.08, -s * 0.45); c.lineTo(-s * 0.25, s * 0.05); c.lineTo(-s * 0.02, s * 0.05);
      c.lineTo(-s * 0.1, s * 0.45); c.lineTo(s * 0.25, -s * 0.08); c.lineTo(s * 0.02, -s * 0.08); c.closePath();
      c.fill(); c.stroke();
    } else if (type === 'shield') {
      var g = c.createRadialGradient(-s * 0.1, -s * 0.1, 2, 0, 0, s * 0.42);
      g.addColorStop(0, '#ffffff'); g.addColorStop(0.6, '#9be8ff'); g.addColorStop(1, '#38b6ff');
      c.fillStyle = g; c.beginPath(); c.arc(0, 0, s * 0.4, 0, 7); c.fill();
      c.fillStyle = 'rgba(255,255,255,.9)'; c.beginPath(); c.ellipse(-s * 0.14, -s * 0.16, s * 0.1, s * 0.05, -0.7, 0, 7); c.fill();
    } else if (type === 'magnet') {
      c.lineCap = 'butt';
      c.strokeStyle = '#ff3b4e'; c.lineWidth = s * 0.18;
      c.beginPath(); c.arc(0, -s * 0.02, s * 0.22, Math.PI, 0); c.stroke();
      c.beginPath(); c.moveTo(-s * 0.22, -s * 0.02); c.lineTo(-s * 0.22, s * 0.18); c.moveTo(s * 0.22, -s * 0.02); c.lineTo(s * 0.22, s * 0.18); c.stroke();
      c.strokeStyle = '#d8dde6';
      c.beginPath(); c.moveTo(-s * 0.22, s * 0.18); c.lineTo(-s * 0.22, s * 0.34); c.moveTo(s * 0.22, s * 0.18); c.lineTo(s * 0.22, s * 0.34); c.stroke();
    }
  }

  function drawObstacle(c, type, s) {
    c.fillStyle = 'rgba(0,0,0,.2)';
    if (type === 'barrier') { rr(c, -s * 0.46, -s * 0.1, s, s * 0.36, 8); c.fill(); }
    else if (type !== 'puddle') { c.beginPath(); c.ellipse(s * 0.06, s * 0.08, s * 0.44, s * 0.4, 0, 0, 7); c.fill(); }
    if (type === 'cone') {
      c.fillStyle = '#ff7a1a'; rr(c, -s * 0.45, -s * 0.45, s * 0.9, s * 0.9, s * 0.15); c.fill();
      c.fillStyle = '#ff9a3d'; c.beginPath(); c.arc(0, 0, s * 0.34, 0, 7); c.fill();
      c.fillStyle = '#fff'; c.beginPath(); c.arc(0, 0, s * 0.24, 0, 7); c.fill();
      c.fillStyle = '#ff7a1a'; c.beginPath(); c.arc(0, 0, s * 0.12, 0, 7); c.fill();
    } else if (type === 'crate') {
      c.fillStyle = '#c98a45'; rr(c, -s * 0.45, -s * 0.45, s * 0.9, s * 0.9, 6); c.fill();
      c.strokeStyle = '#8a5a26'; c.lineWidth = s * 0.08; rr(c, -s * 0.4, -s * 0.4, s * 0.8, s * 0.8, 4); c.stroke();
      c.beginPath(); c.moveTo(-s * 0.4, -s * 0.4); c.lineTo(s * 0.4, s * 0.4); c.moveTo(s * 0.4, -s * 0.4); c.lineTo(-s * 0.4, s * 0.4); c.stroke();
    } else if (type === 'tires') {
      [[-0.22, -0.2], [0.22, -0.2], [0, 0.2]].forEach(function (q) {
        c.fillStyle = '#2a2a2a'; c.beginPath(); c.arc(q[0] * s, q[1] * s, s * 0.26, 0, 7); c.fill();
        c.fillStyle = '#555'; c.beginPath(); c.arc(q[0] * s, q[1] * s, s * 0.12, 0, 7); c.fill();
      });
    } else if (type === 'puddle') {
      c.fillStyle = '#4aa8ff';
      c.beginPath(); c.ellipse(0, 0, s * 0.5, s * 0.36, 0, 0, 7); c.ellipse(s * 0.25, s * 0.15, s * 0.3, s * 0.22, 0, 0, 7); c.fill();
      c.fillStyle = 'rgba(255,255,255,.6)'; c.beginPath(); c.ellipse(-s * 0.15, -s * 0.1, s * 0.15, s * 0.06, -0.3, 0, 7); c.fill();
    } else if (type === 'rock') {
      c.fillStyle = '#9aa0ad';
      c.beginPath(); c.moveTo(-s * 0.45, s * 0.2); c.lineTo(-s * 0.3, -s * 0.35); c.lineTo(s * 0.1, -s * 0.45); c.lineTo(s * 0.45, -s * 0.1); c.lineTo(s * 0.35, s * 0.35); c.lineTo(-s * 0.2, s * 0.42); c.closePath(); c.fill();
      c.fillStyle = '#c3c8d2'; c.beginPath(); c.moveTo(-s * 0.25, -s * 0.25); c.lineTo(s * 0.08, -s * 0.35); c.lineTo(0, -s * 0.05); c.closePath(); c.fill();
    } else if (type === 'barrier') {
      rr(c, -s * 0.5, -s * 0.18, s, s * 0.36, 8); c.fillStyle = '#fff'; c.fill();
      c.save(); c.clip();
      c.fillStyle = '#ff3b4e';
      for (var i = -4; i < 5; i++) { c.beginPath(); c.moveTo(i * s * 0.2, -s * 0.2); c.lineTo(i * s * 0.2 + s * 0.1, -s * 0.2); c.lineTo(i * s * 0.2 - s * 0.05, s * 0.2); c.lineTo(i * s * 0.2 - s * 0.15, s * 0.2); c.fill(); }
      c.restore();
      c.fillStyle = '#ffd21f'; c.beginPath(); c.arc(-s * 0.4, -s * 0.18, s * 0.07, 0, 7); c.arc(s * 0.4, -s * 0.18, s * 0.07, 0, 7); c.fill();
    }
  }

  function drawFlame(c, t) {
    var f = 0.8 + Math.sin(t * 40) * 0.2;
    c.fillStyle = '#ff7a1a';
    c.beginPath(); c.moveTo(-carW * 0.3, carH * 0.45); c.quadraticCurveTo(0, carH * (0.45 + 0.7 * f), carW * 0.3, carH * 0.45); c.fill();
    c.fillStyle = '#ffe14d';
    c.beginPath(); c.moveTo(-carW * 0.16, carH * 0.45); c.quadraticCurveTo(0, carH * (0.45 + 0.4 * f), carW * 0.16, carH * 0.45); c.fill();
  }

  function drawTrophy(c, s) {
    c.fillStyle = '#ffc21f'; c.strokeStyle = '#e08a00'; c.lineWidth = s * 0.04;
    // handles
    c.beginPath(); c.arc(-s * 0.32, -s * 0.15, s * 0.16, 0, 7); c.stroke();
    c.beginPath(); c.arc(s * 0.32, -s * 0.15, s * 0.16, 0, 7); c.stroke();
    // cup
    c.beginPath(); c.moveTo(-s * 0.36, -s * 0.38); c.lineTo(s * 0.36, -s * 0.38);
    c.quadraticCurveTo(s * 0.34, s * 0.12, 0, s * 0.16); c.quadraticCurveTo(-s * 0.34, s * 0.12, -s * 0.36, -s * 0.38); c.fill(); c.stroke();
    c.fillRect(-s * 0.06, s * 0.14, s * 0.12, s * 0.16);
    rr(c, -s * 0.24, s * 0.28, s * 0.48, s * 0.12, 6); c.fill(); c.stroke();
    c.fillStyle = '#fff6a8'; starPath(c, s * 0.12, s * 0.055, 5); c.fill();
  }

  var TREE_COLORS = ['#2e9e48', '#3fb35a', '#25883d', '#48b84f', '#2f9e60'];
  var FLOWER_COLORS = ['#ff5aa5', '#ffd21f', '#ffffff', '#ff7a1a', '#a55cff'];
  function drawDecor(d) {
    var c = ctx, s = d.s;
    c.save(); c.translate(d.x, d.y); c.scale(s, s);
    if (d.type === 'tree' || d.type === 'tree2') {
      c.fillStyle = 'rgba(0,0,0,.18)'; c.beginPath(); c.ellipse(8, 10, 30, 26, 0, 0, 7); c.fill();
      c.fillStyle = TREE_COLORS[d.hue];
      c.beginPath(); c.arc(0, 0, 28, 0, 7); c.fill();
      c.fillStyle = 'rgba(255,255,255,.18)'; c.beginPath(); c.arc(-9, -9, 12, 0, 7); c.fill();
      if (d.type === 'tree2') { c.fillStyle = '#ff3b4e'; [[-10, 6], [10, -4], [4, 12]].forEach(function (q) { c.beginPath(); c.arc(q[0], q[1], 4, 0, 7); c.fill(); }); }
    } else if (d.type === 'bush') {
      c.fillStyle = '#3aa64f';
      c.beginPath(); c.arc(-10, 0, 14, 0, 7); c.arc(10, 0, 14, 0, 7); c.arc(0, -8, 14, 0, 7); c.fill();
    } else if (d.type === 'flower') {
      c.fillStyle = FLOWER_COLORS[d.hue];
      for (var i = 0; i < 5; i++) { var a = i / 5 * Math.PI * 2; c.beginPath(); c.arc(Math.cos(a) * 7, Math.sin(a) * 7, 6, 0, 7); c.fill(); }
      c.fillStyle = '#ffd21f'; c.beginPath(); c.arc(0, 0, 5, 0, 7); c.fill();
    } else if (d.type === 'rock') {
      c.fillStyle = '#b8bec8'; c.beginPath(); c.ellipse(0, 0, 16, 11, 0.3, 0, 7); c.fill();
    }
    c.restore();
  }

  // ---------------------------------------------------------------- HUD
  var hud = document.getElementById('hud'), selectEl = document.getElementById('select');
  var barFill = document.getElementById('bar-fill'), trophiesEl = document.getElementById('trophies');
  var TROPHY_SVG = '<svg class="tro" viewBox="0 0 24 24"><path fill="#ffc21f" stroke="#e08a00" stroke-width="1.2" d="M6 3h12v3h3a4 4 0 0 1-4 5 6 6 0 0 1-4 3v3h3v3H8v-3h3v-3a6 6 0 0 1-4-3 4 4 0 0 1-4-5h3z"/></svg>';
  function updateHud(reset, newTrophy) {
    barFill.style.width = (state.coins / COINS_PER_TROPHY * 100) + '%';
    if (reset) trophiesEl.innerHTML = '';
    if (newTrophy) {
      if (trophiesEl.children.length >= 5) trophiesEl.removeChild(trophiesEl.firstChild);
      trophiesEl.insertAdjacentHTML('beforeend', TROPHY_SVG);
    }
  }

  var SOUND_ON = '<svg viewBox="0 0 24 24"><path d="M3 9v6h4l5 5V4L7 9zm13.5 3a4.5 4.5 0 0 0-2.5-4v8a4.5 4.5 0 0 0 2.5-4zM14 3.2v2.1a7 7 0 0 1 0 13.4v2.1a9 9 0 0 0 0-17.6z"/></svg>';
  var SOUND_OFF = '<svg viewBox="0 0 24 24"><path d="M3 9v6h4l5 5V4L7 9zm13.6 3 2.7-2.7-1.3-1.3-2.7 2.7-2.7-2.7-1.3 1.3 2.7 2.7-2.7 2.7 1.3 1.3 2.7-2.7 2.7 2.7 1.3-1.3z"/></svg>';
  var soundBtns = [document.getElementById('sound'), document.getElementById('sound-sel')];
  function paintSound() { soundBtns.forEach(function (b) { b.innerHTML = Audio.isOn() ? SOUND_ON : SOUND_OFF; }); }
  soundBtns.forEach(function (b) {
    b.addEventListener('click', function () { Audio.unlock(); Audio.toggle(); paintSound(); });
  });
  paintSound();

  document.getElementById('home').addEventListener('click', function () { showSelect(); });

  // ---------------------------------------------------------------- car select
  var carsEl = document.getElementById('cars');
  var cardCanvases = [];
  CARS.forEach(function (car) {
    var b = document.createElement('button');
    b.className = 'car-card';
    b.setAttribute('aria-label', car.name);
    var cv = document.createElement('canvas');
    var nm = document.createElement('div'); nm.className = 'name'; nm.textContent = car.name;
    b.appendChild(cv); b.appendChild(nm);
    b.addEventListener('click', function () {
      if (b.classList.contains('picked')) return;
      Audio.unlock(); Audio.honk();
      b.classList.add('picked');
      setTimeout(function () { startGame(car); }, 550);
    });
    carsEl.appendChild(b);
    cardCanvases.push({ cv: cv, car: car });
  });

  var selectT = 0;
  function drawCards(dt) {
    selectT += dt;
    cardCanvases.forEach(function (o, i) {
      var cv = o.cv, r = cv.getBoundingClientRect();
      if (!r.width) return;
      var w = Math.round(r.width * DPR), h = Math.round(r.height * DPR);
      if (cv.width !== w || cv.height !== h) { cv.width = w; cv.height = h; }
      var c = cv.getContext('2d');
      c.setTransform(1, 0, 0, 1, 0, 0);
      c.clearRect(0, 0, w, h);
      // little road tile
      c.fillStyle = '#4a4f5c'; rr(c, w * 0.12, 0, w * 0.76, h, w * 0.12); c.fill();
      c.fillStyle = 'rgba(255,255,255,.8)';
      var off = (selectT * h * 0.8 + i * 30) % (h * 0.5);
      for (var y = -h * 0.5 + off; y < h; y += h * 0.5) c.fillRect(w / 2 - w * 0.015, y, w * 0.03, h * 0.2);
      c.save();
      c.translate(w / 2, h / 2 + Math.sin(selectT * 6 + i) * h * 0.015);
      c.rotate(Math.sin(selectT * 2 + i) * 0.05);
      drawCar(c, o.car, w * 0.42, w * 0.42 * 1.75, selectT);
      c.restore();
    });
  }

  function showSelect() {
    playing = false;
    Audio.stopMusic();
    hud.classList.add('hidden');
    selectEl.classList.remove('hidden');
    Array.prototype.forEach.call(carsEl.children, function (b) { b.classList.remove('picked'); });
  }

  function startGame(car) {
    newGame(car);
    selectEl.classList.add('hidden');
    hud.classList.remove('hidden');
    playing = true;
    Audio.startMusic();
    keepAwake();
  }

  var wakeLock = null;
  function keepAwake() {
    try {
      if (navigator.wakeLock && !wakeLock) navigator.wakeLock.request('screen').then(function (l) { wakeLock = l; l.addEventListener('release', function () { wakeLock = null; }); }).catch(function () {});
    } catch (e) {}
  }

  // ---------------------------------------------------------------- loop
  var last = performance.now();
  function frame(now) {
    var dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    if (playing && !paused) { update(dt); drawWorld(); }
    else if (!playing) {
      drawCards(dt);
    }
    requestAnimationFrame(frame);
  }

  document.addEventListener('visibilitychange', function () {
    paused = document.hidden;
    if (paused) Audio.suspend(); else { Audio.resume(); last = performance.now(); if (playing) keepAwake(); }
  });
  window.addEventListener('resize', resize);
  window.addEventListener('orientationchange', function () { setTimeout(resize, 200); });

  resize();
  requestAnimationFrame(frame);

  // test hook
  window.__laneRacer = { drawCar: drawCar, cars: CARS, get state() { return state; }, start: function (i) { startGame(CARS[i || 0]); }, moveLane: moveLane };
})();
