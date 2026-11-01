/* Standalone offline countdown. Target: midnight on January 1 in Moscow. */
(() => {
  'use strict';
  const yearFormatter = new Intl.DateTimeFormat('en', { timeZone: 'Europe/Moscow', year: 'numeric' });
  const forms = { days: ['день', 'дня', 'дней'], hours: ['час', 'часа', 'часов'], minutes: ['минута', 'минуты', 'минут'], seconds: ['секунда', 'секунды', 'секунд'] };
  function plural(value, variants) {
    const hundred = value % 100;
    const ten = value % 10;
    return hundred >= 11 && hundred <= 14 ? variants[2] : ten === 1 ? variants[0] : ten >= 2 && ten <= 4 ? variants[1] : variants[2];
  }
  function getState(now = new Date()) {
    const targetYear = Number(yearFormatter.format(now)) + 1;
    const target = new Date(`${targetYear}-01-01T00:00:00+03:00`);
    const total = Math.max(0, Math.floor((target - now) / 1000));
    return { targetYear, days: Math.floor(total / 86400), hours: Math.floor(total / 3600) % 24, minutes: Math.floor(total / 60) % 60, seconds: total % 60 };
  }
  function mount(element) {
    const fields = Object.fromEntries(Object.keys(forms).map(key => [key, { number: element.querySelector(`[data-part="${key}"]`), label: element.querySelector(`[data-label="${key}"]`) }]));
    function update() {
      const state = getState();
      const spoken = [];
      for (const [key, field] of Object.entries(fields)) {
        const text = key === 'days' ? String(state[key]) : String(state[key]).padStart(2, '0');
        if (field.number.textContent !== text) field.number.textContent = text;
        const label = plural(state[key], forms[key]);
        if (field.label.textContent !== label) field.label.textContent = label;
        spoken.push(state[key] + ' ' + label);
      }
      element.setAttribute('aria-label', `До 1 января ${state.targetYear} года по московскому времени: ${spoken.join(', ')}`);
    }
    update();
    const interval = window.setInterval(update, 1000);
    const onVisibility = () => { if (!document.hidden) update(); };
    document.addEventListener('visibilitychange', onVisibility);
    return () => { window.clearInterval(interval); document.removeEventListener('visibilitychange', onVisibility); };
  }
  window.PaperCountdown = Object.freeze({ getState, plural, mount });
  document.querySelectorAll('[data-countdown]').forEach(mount);
})();
