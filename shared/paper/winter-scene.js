/* One landscape shared by the menu and the games. */
(() => {
  'use strict';
  const template = document.createElement('template');
  template.innerHTML = `<svg class="paper-landscape" width="100%" height="100%" viewBox="0 0 1920 1080" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
<rect width="1920" height="1080" fill="#214a60"/>
<path d="M0 0H1920V690Q1540 580 1200 700T0 680Z" fill="#28546a"/>
<g class="scene-stars" fill="#f8e9c9">
<circle cx="150" cy="155" r="3"/><circle cx="345" cy="76" r="2"/><circle cx="1570" cy="92" r="3"/><circle cx="1780" cy="200" r="2"/><circle cx="90" cy="410" r="3"/><circle cx="1820" cy="510" r="3"/><circle cx="1430" cy="63" r="2"/>
<use href="#paper-snowflake" x="82" y="245" width="40" height="40"/><use href="#paper-snowflake" x="1770" y="80" width="46" height="46"/>
</g>
<path d="M0 845Q220 760 480 838T960 855T1450 815T1920 790V1080H0Z" fill="#7498a8"/>
<g opacity=".45" color="#406b79"><use href="#paper-snowy-fir" x="-35" y="370" width="220" height="470"/><use href="#paper-snowy-fir" x="165" y="590" width="130" height="270"/><use href="#paper-snowy-fir" x="1720" y="385" width="220" height="465"/><use href="#paper-snowy-fir" x="1620" y="610" width="140" height="280"/></g>
<path d="M0 945Q240 810 540 940T1140 940T1920 895V1080H0Z" fill="#b5ced3"/>
<g color="#204e4c"><use href="#paper-snowy-fir" x="-105" y="570" width="315" height="560"/><use href="#paper-snowy-fir" x="1730" y="530" width="300" height="565"/><use href="#paper-snowy-fir" x="65" y="835" width="140" height="260"/></g>
<path d="M0 1030Q195 975 420 1027T970 1020T1470 1018T1920 990V1080H0Z" fill="#e3e8db"/>
<use href="#paper-branch" x="-55" y="-28" width="380" height="210"/>
<use href="#paper-branch" transform="translate(1975 -28) scale(-1 1)" width="380" height="210"/>
</svg>`;
  const ns = 'http://www.w3.org/2000/svg';
  function ornament(symbol, className, viewBox) {
    const icon = document.createElementNS(ns, 'svg');
    icon.classList.add(className); icon.setAttribute('viewBox', viewBox); icon.setAttribute('aria-hidden', 'true');
    const use = document.createElementNS(ns, 'use'); use.setAttribute('href', '#' + symbol);
    use.setAttribute('width', '100%'); use.setAttribute('height', '100%'); icon.append(use); return icon;
  }
  function mount(container) {
    container.replaceChildren(template.content.cloneNode(true));
    if (container.hasAttribute('data-paper-moon')) container.append(ornament('paper-moon', 'paper-moon', '0 0 100 120'));
    if (container.hasAttribute('data-paper-snow')) {
      const snow = document.createElement('div'); snow.className = 'paper-flurry'; snow.setAttribute('aria-hidden', 'true');
      const fragment = document.createDocumentFragment();
      const count = Math.min(140, Math.max(54, Math.round(window.innerWidth / 11)));
      for (let i = 0; i < count; i++) {
        const flake = ornament('paper-snowflake', 'paper-flake', '0 0 40 40');
        flake.style.setProperty('--flake-left', ((i * 61.803398875) % 108 - 4).toFixed(2) + '%');
        flake.style.setProperty('--flake-size', (5 + i % 5) + 'px');
        flake.style.setProperty('--flake-speed', (8 + (i * 7 % 65) / 10) + 's');
        flake.style.setProperty('--flake-delay', (-i * 1.37) + 's');
        flake.style.setProperty('--flake-drift', (25 + i * 13 % 90) + 'px');
        flake.style.setProperty('--flake-opacity', (.3 + i % 5 * .11).toFixed(2));
        fragment.append(flake);
      }
      snow.append(fragment); container.append(snow);
    }
  }
  document.querySelectorAll('[data-paper-scene]').forEach(mount);
  window.PaperScene = Object.freeze({ mount });
})();
