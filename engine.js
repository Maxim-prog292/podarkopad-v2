/* Deterministic, time-based simulation; no DOM or browser dependencies. */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.GiftCatcherEngine = factory();
})(typeof window === 'undefined' ? globalThis : window, function () {
  'use strict';
  const clamp = (n, lo, hi) => Math.max(lo, Math.min(hi, n));
  class Game {
    constructor(random = Math.random) { this.random = random; this.reset(1440, 900); }
    reset(width, height) {
      this.state = { phase: 'idle', width, height, elapsed: 0, score: 0, lives: 5, caught: 0, streak: 0, maxStreak: 0, gifts: [], power: null, powerLeft: 0, powerDuration: 0, basketX: width / 2, targetX: width / 2 };
      this.spawnClock = 0; this.nextBonus = 9; this.lastPower = ''; this.sequence = 0; this.spawned = 0;
      this.resize(width, height);
    }
    resize(width, height) {
      const s = this.state, rx = width / s.width, ry = height / s.height;
      s.basketX *= rx; s.targetX *= rx;
      for (const gift of s.gifts) { gift.x *= rx; gift.y *= ry; }
      s.width = width; s.height = height;
      const oldScale = s.scale;
      s.scale = clamp(Math.min(width / 1440, height / 850), .68, 1.4);
      if (oldScale) for (const gift of s.gifts) gift.r *= s.scale / oldScale;
      s.basketWidth = 180 * s.scale; s.basketY = height - 106 * s.scale;
      s.mouthY = s.basketY + 17 * s.scale;
      s.basketX = clamp(s.basketX, s.basketWidth / 2 + 8, width - s.basketWidth / 2 - 8);
      s.targetX = clamp(s.targetX, s.basketWidth / 2 + 8, width - s.basketWidth / 2 - 8);
    }
    start() { this.state.phase = 'playing'; }
    pause() { if (this.state.phase === 'playing') this.state.phase = 'paused'; }
    resume() { if (this.state.phase === 'paused') this.state.phase = 'playing'; }
    moveTo(x) { if (Number.isFinite(x)) this.state.targetX = clamp(x, this.state.basketWidth / 2 + 8, this.state.width - this.state.basketWidth / 2 - 8); }
    spawn(type, x) {
      const s = this.state, r = 28 * s.scale;
      const gift = { id: ++this.sequence, type, x: clamp(x, r + 10, s.width - r - 10), y: Math.max(155, 115 * s.scale) - r, r, speed: .9 + this.random() * .2, angle: (this.random() - .5) * 18, variant: this.sequence % 2 };
      s.gifts.push(gift); return gift;
    }
    activatePower(events) {
      const s = this.state;
      const powers = ['slow', 'magnet', 'double', 'clear'].filter(p => p !== this.lastPower);
      const power = powers[Math.floor(this.random() * powers.length)];
      this.lastPower = power;
      s.power = null; s.powerLeft = 0; s.powerDuration = 0;
      if (power === 'clear') {
        const count = s.gifts.filter(g => g.type === 'bad').length;
        s.gifts = s.gifts.filter(g => g.type !== 'bad');
        s.score += 15;
        events.push({ type: 'power', power, count });
      } else {
        s.power = power;
        s.powerDuration = { slow: 5, magnet: 6, double: 10 }[power];
        s.powerLeft = s.powerDuration;
        events.push({ type: 'power', power });
      }
    }
    step(dt) {
      const s = this.state, events = [];
      if (s.phase !== 'playing' || !Number.isFinite(dt) || dt <= 0) return events;
      dt = Math.min(dt, .1);
      s.elapsed += dt;
      s.basketX += (s.targetX - s.basketX) * (1 - Math.exp(-28 * dt));
      if (s.powerLeft > 0) {
        s.powerLeft = Math.max(0, s.powerLeft - dt);
        if (!s.powerLeft) { events.push({ type: 'powerEnd', power: s.power }); s.power = null; }
      }
      this.spawnClock += dt;
      const interval = Math.max(.42, .88 - s.elapsed * .0035);
      if (this.spawnClock >= interval) {
        this.spawnClock -= interval;
        let type = this.spawned >= 4 && this.random() < .18 ? 'bad' : 'good';
        if (s.elapsed >= this.nextBonus) { type = 'bonus'; this.nextBonus = s.elapsed + 13 + this.random() * 6; }
        let x = 45 * s.scale + this.random() * (s.width - 90 * s.scale);
        for (let attempt = 0; attempt < 4 && s.gifts.some(g => g.y < 240 * s.scale && Math.abs(g.x - x) < 86 * s.scale); attempt++) x = 45 * s.scale + this.random() * (s.width - 90 * s.scale);
        this.spawn(type, x); this.spawned++;
      }
      const fallSpeed = Math.max(80, (s.mouthY - 110) / Math.max(2.8, 5.2 - s.elapsed * .018));
      for (const gift of [...s.gifts]) {
        if (!s.gifts.includes(gift)) continue;
        if (s.power === 'magnet' && gift.type !== 'bad') gift.x += (s.basketX - gift.x) * (1 - Math.exp(-dt * 2));
        const previousY = gift.y;
        gift.y += fallSpeed * gift.speed * dt * (s.power === 'slow' ? .5 : 1);
        const hit = previousY - gift.r <= s.mouthY && gift.y + gift.r >= s.mouthY && Math.abs(gift.x - s.basketX) < s.basketWidth * .42 + gift.r * .5;
        if (hit) {
          s.gifts = s.gifts.filter(g => g.id !== gift.id);
          if (gift.type === 'bad') {
            s.lives = Math.max(0, s.lives - 1); s.score = Math.max(0, s.score - 5); s.streak = 0;
            events.push({ type: 'damage', x: gift.x, y: s.mouthY, reason: 'bad' });
          } else if (gift.type === 'bonus') {
            s.score += 10;
            events.push({ type: 'catch', x: gift.x, y: s.mouthY, points: 10, bonus: true });
            this.activatePower(events);
          } else {
            s.caught++; s.streak++; s.maxStreak = Math.max(s.maxStreak, s.streak);
            const multiplier = Math.min(3, 1 + Math.floor(s.streak / 5));
            const points = 5 * multiplier * (s.power === 'double' ? 2 : 1);
            s.score += points;
            events.push({ type: 'catch', x: gift.x, y: s.mouthY, points });
            if (s.streak === 5 || s.streak === 10 || s.streak % 20 === 0) events.push({ type: 'streak', value: s.streak, multiplier });
          }
        } else if (gift.y - gift.r > s.height) {
          s.gifts = s.gifts.filter(g => g.id !== gift.id);
          if (gift.type === 'good') { s.lives = Math.max(0, s.lives - 1); s.streak = 0; events.push({ type: 'damage', x: gift.x, y: s.height - 50, reason: 'miss' }); }
        }
        if (s.lives <= 0) { s.phase = 'ended'; events.push({ type: 'end' }); break; }
      }
      return events;
    }
  }
  return { Game };
});
