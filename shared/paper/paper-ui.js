/* Shared local illustration library. Each shape is defined once, then reused with SVG <use>. */
(() => {
  'use strict';
  if (window.PaperUI) return;
  const svgNS = 'http://www.w3.org/2000/svg';
  const library = document.createElementNS(svgNS, 'svg');
  library.classList.add('paper-symbols');
  library.setAttribute('aria-hidden', 'true');
  library.innerHTML = `<defs>
    <filter id="paper-grain" x="0" y="0" width="100%" height="100%">
      <feTurbulence type="fractalNoise" baseFrequency=".65" numOctaves="3" stitchTiles="stitch" seed="7"/>
      <feColorMatrix type="saturate" values="0"/>
    </filter>
    <symbol id="paper-star" viewBox="0 0 40 40"><path d="m20 1 5.6 12.7 13.9 1.4-10.4 9.4 3.1 13.7L20 31.1 7.8 38.2l3.1-13.7L.5 15.1l13.9-1.4Z" fill="currentColor"/><path d="m20 1 .1 30.1L7.8 38.2 13.9 13.7Z" fill="#fff" opacity=".12"/></symbol>
    <symbol id="paper-moon" viewBox="0 0 100 120">
      <path d="M75 5C38-2 7 23 7 59c0 39 32 63 70 51-25-8-42-29-42-53C35 33 51 14 75 5Z" fill="#efdda7"/>
      <path d="M75 5C51 14 35 33 35 57c0 24 17 45 42 53-12 4-25 2-35-4C20 81 20 39 43 19 53 10 64 6 75 5Z" fill="#d9bd79" opacity=".32"/>
      <path d="M25 27C12 45 12 70 23 86" fill="none" stroke="#fff0c5" stroke-width="2" opacity=".55"/>
    </symbol>
    <symbol id="paper-snowflake" viewBox="0 0 40 40"><g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M20 2v36M4.4 11l31.2 18M4.4 29l31.2-18M15 6l5 5 5-5M15 34l5-5 5 5M5.5 17l7-2-1.8-7M29.3 32l-1.8-7 7-2M5.5 23l7 2-1.8 7M29.3 8l-1.8 7 7 2"/></g></symbol>
    <symbol id="paper-arrow" viewBox="0 0 24 24"><path d="M5 12h13M12 5l7 7-7 7" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></symbol>
    <symbol id="paper-disc" viewBox="0 0 200 200"><path d="M26 45 48 25 77 17 110 16 143 29 164 53 178 82 177 117 165 145 139 169 108 177 74 173 45 157 25 134 17 101 19 70Z" fill="#d8e3d8"/><path d="M20 135q47-30 84-7t68 2l-10 22-37 24-46-1-34-17Z" fill="#eaf0df"/></symbol>
    <symbol id="paper-fir" viewBox="0 0 160 300">
      <path d="m71 233 19 1 1 64-23-1Z" fill="#9a7853"/>
      <path d="m80 3 45 85-14-3 31 72-18-4 35 91-45-7-33 7-36-4-44 5 34-90-17 5 32-76-17 8Z" fill="currentColor"/>
      <path d="m80 3 2 242-37-5-44 5 34-90-17 5 32-76-17 8Z" fill="#fff" opacity=".08"/>
      <path d="m80 3 19 36-17-4-13 6-11 2Z M50 84l31 7 31-6 9 20-23-3-16 5-24-4-18 4Z M35 155l26 7 22-4 27 3 14-8 9 24-31-4-18 6-29-4-31 9Z M13 214l37 5 30-5 31 6 36-6 12 30-45-7-33 7-36-4-44 5Z" fill="#e7eee1"/>
    </symbol>
    <symbol id="paper-snowy-fir" viewBox="0 0 160 300">
      <use href="#paper-fir" width="160" height="300"/>
      <path d="M6 300q10-22 43-25 15-29 38-22 17 3 24 20 31 0 44 27Z" fill="#dfe8df"/>
      <path d="M6 300q10-22 43-25 15-29 38-22-11 0-14 16-4 18-27 18-21 1-40 13Z" fill="#f0f1e5"/>
    </symbol>
    <symbol id="paper-sprig" viewBox="0 0 100 55">
      <path d="M6 29 96 26" fill="none" stroke="#796848" stroke-width="3"/>
      <path d="m16 29-9-20m20 20-9-25m21 24-7-26m19 26-4-24m16 24 1-23m10 22 7-18m-65 20-8 17m20-18-6 23m19-23-2 25m14-25 4 23m8-24 10 21m1-22 15 18" fill="none" stroke="#326650" stroke-width="4"/>
      <path d="m22 28-9-18m21 18-6-22m18 22-3-20m16 19 2-19m-33 21-4 16m17-17v20m13-21 5 19m7-19 9 16m4-17 11 12" fill="none" stroke="#54816a" stroke-width="3"/>
    </symbol>
    <symbol id="paper-cone" viewBox="0 0 44 70">
      <path d="m22 2 11 9 8 18-1 20-9 15-10 5-12-10-6-17 2-20 8-15Z" fill="#946847"/>
      <path d="m22 2 2 58-3 9-12-10-6-17 2-20 8-15Z" fill="#ad8257"/>
      <path d="m12 16 9 7 11-7M7 29l10 7 9-7 11 6M7 43l10 7 10-9 12 7M13 55l10 5 10-7" fill="none" stroke="#d0a273" stroke-width="3"/>
    </symbol>
    <symbol id="paper-branch" viewBox="0 0 380 210">
      <path d="M10 7Q140 55 345 165M108 42l-9 75M186 83l51-58M252 116l-6 70" fill="none" stroke="#977650" stroke-width="6"/>
      <use href="#paper-sprig" x="9" y="0" width="126" height="65" transform="rotate(18 72 32)"/>
      <use href="#paper-sprig" x="71" y="48" width="115" height="64" transform="rotate(78 100 66)"/>
      <use href="#paper-sprig" x="127" y="49" width="128" height="65" transform="rotate(25 181 80)"/>
      <use href="#paper-sprig" x="194" y="1" width="109" height="60" transform="rotate(-35 220 48)"/>
      <use href="#paper-sprig" x="226" y="99" width="132" height="67" transform="rotate(25 276 132)"/>
      <use href="#paper-sprig" x="217" y="138" width="98" height="56" transform="rotate(80 249 150)"/>
      <use href="#paper-cone" x="119" y="70" width="34" height="55" transform="rotate(-18 136 95)"/>
      <use href="#paper-cone" x="279" y="139" width="31" height="49" transform="rotate(-15 294 162)"/>
      <path d="m18 9 49 9-7 6 43 8-9 7 39 10-7 6-47-12-28-15Z" fill="#e7ecdf"/>
    </symbol>
    <symbol id="paper-gift" viewBox="0 0 100 110">
      <path d="m11 38 78-2-2 66-74 3Z" fill="#b7473e"/><path d="m11 38 78-2-2 66-15 1 1-65Z" fill="#a43e37"/>
      <path d="m6 27 87-1 2 18-90 1Z" fill="#cd5b4a"/><path d="m41 27 17-1 1 77-17 1Z" fill="#ddb864"/>
      <path d="M49 28C7 36 8-6 31 5c11 6 19 20 18 23Zm3-1C43 2 80-3 78 12c-1 9-16 15-26 15Z" fill="none" stroke="#dbb768" stroke-width="7" stroke-linejoin="round"/>
      <path d="m50 26-19 21 4-19ZM52 27l19 16-6-17Z" fill="#e9c47b"/>
      <g fill="#edcf9c"><circle cx="24" cy="58" r="2"/><circle cx="76" cy="65" r="2"/><circle cx="28" cy="86" r="2"/><circle cx="68" cy="91" r="2"/></g>
    </symbol>
    <symbol id="paper-small-gift" viewBox="0 0 90 95"><path d="m9 29 73-2 1 62-72 3Z" fill="#477c72"/><path d="m9 29 18 60 56-1-1-61Z" fill="#386b64"/><path d="m5 23 80-2 2 16-82 2Z" fill="#5c9080"/><path d="m36 23 16-1 3 68-17 1Z" fill="#deb96c"/><path d="M43 23C7 24 17-7 32 7l12 16c3-27 30-27 26-12-2 9-17 12-26 12Z" fill="none" stroke="#e1bc72" stroke-width="6"/></symbol>
    <symbol id="paper-basket" viewBox="0 0 130 65"><path d="m8 12 114-1-14 47-84 3Z" fill="#b68748"/><path d="m17 18 96-1-9 34-75 4Z" fill="#cba05b"/><g stroke="#e1bc77" stroke-width="3"><path d="m35 20 7 32m17-33 2 33m20-34-3 33m19-34-5 33M22 30h84M26 42h77"/></g><path d="m7 10 116-2 1 12-116 3Z" fill="#ad7840"/></symbol>
    <symbol id="paper-snowball" viewBox="0 0 100 100"><path d="m24 10 26-7 24 8 18 20 5 25-12 23-21 15-28 0-24-16L3 55l5-28Z" fill="#faf5e8"/><path d="m24 10-7 25 6 30 23 15 26 0 20-18-7 17-21 15H36L12 78 3 55l5-28Z" fill="#c5dbe0"/><path d="m31 14-8 20 6-4 10-14Z" fill="#fffdf3"/><g color="#9abac3"><use href="#paper-snowflake" x="40" y="32" width="30" height="30"/></g></symbol>
    <symbol id="paper-snowman" viewBox="0 0 130 190">
      <path d="m28 115-23-20m15 13-2-17m86 29 22-24m-12 15 10 3" stroke="#956d4e" stroke-width="5" fill="none" stroke-linecap="round"/>
      <path d="m31 104 30-13 29 8 17 22 3 29-15 23-32 9-30-8-14-24 1-27Z" fill="var(--snow-body,#eeeeda)"/>
      <path d="m23 119 5 33 19 17 36 4-20 9-30-8-14-24 1-27Z" fill="var(--snow-shade,#cedbd0)"/>
      <path d="m38 48 19-9 27 5 15 21-3 26-18 14-27-1-20-16-3-22Z" fill="var(--snow-face,#f8f1de)"/>
      <path d="m36 58 2 25 16 15 28 1-4 6-27-1-20-16-3-22Z" fill="var(--snow-head-shade,#d8e2d6)"/>
      <path d="m26 52 8-11 5-17 14-10 23 1 17 11 4 17 9 9Z" fill="var(--snow-hat,#b74b42)"/><path d="m28 47 76-1 2 10-80 1Z" fill="var(--snow-brim,#d26350)"/>
      <path d="m44 15 4-8 11-5 13 3 4 9Z" fill="#f4e8ce"/>
      <path d="m34 98 29 4 29-5 4 12-37 6-27-7Z" fill="var(--snow-scarf,#ba5041)"/><path d="m76 111 14-1-2 36-15-4Z" fill="var(--snow-tail,#c15b48)"/>
      <circle cx="49" cy="69" r="3" fill="var(--snow-eyes,#28454b)"/><circle cx="78" cy="69" r="3" fill="var(--snow-eyes,#28454b)"/>
      <path d="m62 74 23 6-23 5Z" fill="#cc8b46"/><path d="m48 85 6 4 9 1 8-3" fill="none" stroke="var(--snow-mouth,#6a6757)" stroke-width="2" stroke-linecap="round"/>
      <circle cx="60" cy="132" r="4" fill="#456268"/><circle cx="61" cy="153" r="4" fill="#456268"/>
    </symbol>
    <symbol id="paper-snowman-bonus" viewBox="0 0 130 190"><g style="--snow-hat:#c69a43;--snow-brim:#e0b65f;--snow-scarf:#c9a052;--snow-tail:#b58a3c"><use href="#paper-snowman" width="130" height="190"/></g><g color="#d4ab51"><use href="#paper-star" x="48" y="120" width="28" height="28"/></g></symbol>
    <symbol id="paper-snowman-coal" viewBox="0 0 130 190"><g style="--snow-body:#3c555e;--snow-shade:#29444f;--snow-face:#536c70;--snow-head-shade:#3a565e;--snow-hat:#263e46;--snow-brim:#69817e;--snow-scarf:#a66d53;--snow-tail:#925a47;--snow-eyes:#f2e9cf;--snow-mouth:transparent"><use href="#paper-snowman" width="130" height="190"/></g><path d="m43 60 12 5m18 0 12-5M50 92q13-9 25-1" fill="none" stroke="#eee5ce" stroke-width="3" stroke-linecap="round"/><path d="m53 127 17 17m0-17-17 17" stroke="#e0cbb3" stroke-width="5"/></symbol>
    <symbol id="paper-snowman-frozen" viewBox="0 0 130 190"><g style="--snow-body:#d4edf0;--snow-shade:#9bc7d0;--snow-face:#e7f4eb;--snow-head-shade:#bddbdb;--snow-hat:#679fae;--snow-brim:#97c5cc;--snow-scarf:#75afb9;--snow-tail:#57939f"><use href="#paper-snowman" width="130" height="190"/></g><g color="#4e899b"><use href="#paper-snowflake" x="45" y="116" width="35" height="35"/></g></symbol>
    <symbol id="paper-snowbank" viewBox="0 0 200 60"><path d="M5 43 21 30l26-4 16-16 29-6 29 7 19 17 30-1 26 19-36 10-91 1Z" fill="#d7e2da"/><path d="m5 43 31 1 26 5 73-1 43-11 18 9-36 10-91 1Z" fill="#adc7cb"/><path d="m56 28 11-14 24-4 13 4-29 6Z" fill="#f6f1df"/></symbol>
    <symbol id="paper-book" viewBox="0 0 160 145">
      <path d="m10 26 62-9 9 7 62-6 8 104-65 9-10-4-60 7Z" fill="#8f3f38"/>
      <path d="m15 20 59-8 8 11 56-7 8 100-61 7-9-5-56 10Z" fill="#d4b887"/>
      <path d="m17 13 57-6 8 15 51-7 8 95-57 7-9-6-54 10Z" fill="#f6e8c9"/>
      <path d="m74 7 1 104 9 6-2-95Z" fill="#ddcda7"/>
      <path d="m19 14 45-4-9 14-33 5Z" fill="#fff3d8"/>
      <g color="#357165"><use href="#paper-fir" x="24" y="27" width="40" height="70"/></g>
      <g color="#d1a552"><use href="#paper-star" x="95" y="37" width="27" height="27"/></g>
      <path d="m96 78 27-2m-27 10 24-2m-24 10 20-2" stroke="#bc9e71" stroke-width="3"/>
      <path d="m87 116 11-1-1 28-7-6-6 7Z" fill="#b54a3e"/>
    </symbol>
    <symbol id="paper-tree" viewBox="0 0 160 210">
      <g color="#357365"><use href="#paper-fir" x="19" y="15" width="123" height="190"/></g>
      <g color="#d8ac52"><use href="#paper-star" x="63" y="2" width="35" height="35"/></g>
      <path d="m57 78 41 10m-53 25 65 13m-75 24 88 14" stroke="#dab764" stroke-width="4" fill="none"/>
      <g fill="#b94b40"><circle cx="65" cy="77" r="5"/><circle cx="98" cy="113" r="6"/><circle cx="53" cy="148" r="6"/></g>
      <g fill="#e5c47f"><circle cx="84" cy="99" r="4"/><circle cx="77" cy="144" r="4"/><circle cx="108" cy="162" r="5"/></g>
    </symbol>
    <symbol id="paper-art-gifts" viewBox="0 0 200 200">
      <use href="#paper-disc" width="200" height="200"/>
      <use href="#paper-small-gift" x="90" y="38" width="82" height="95" transform="rotate(12 131 85)"/>
      <use href="#paper-gift" x="26" y="37" width="105" height="119" transform="rotate(-9 78 96)"/>
      <use href="#paper-basket" x="40" y="139" width="125" height="52"/>
      <g color="#cfaa58"><use href="#paper-star" x="23" y="32" width="18" height="18"/><use href="#paper-star" x="163" y="119" width="16" height="16"/></g>
    </symbol>
    <symbol id="paper-art-snowballs" viewBox="0 0 200 200">
      <use href="#paper-disc" width="200" height="200"/>
      <path d="M44 131Q70 30 149 47" fill="none" stroke="#90b0b5" stroke-width="2.5" stroke-dasharray="5 6"/>
      <use href="#paper-small-gift" x="122" y="28" width="40" height="46" transform="rotate(16 142 50)"/>
      <use href="#paper-snowball" x="32" y="67" width="112" height="112" transform="rotate(-16 88 120)"/>
      <use href="#paper-snowball" x="117" y="127" width="48" height="48"/>
      <g color="#7eaaaf"><use href="#paper-snowflake" x="31" y="37" width="23" height="23"/><use href="#paper-snowflake" x="155" y="88" width="25" height="25"/></g>
    </symbol>
    <symbol id="paper-art-snowman" viewBox="0 0 200 200"><use href="#paper-disc" width="200" height="200"/><use href="#paper-snowman" x="36" y="8" width="132" height="181"/><g color="#d4b465"><use href="#paper-star" x="153" y="38" width="20" height="20"/></g><g color="#82a7ab"><use href="#paper-snowflake" x="23" y="86" width="25" height="25"/></g></symbol>
    <symbol id="paper-art-quiz" viewBox="0 0 200 200"><use href="#paper-disc" width="200" height="200"/><use href="#paper-book" x="18" y="29" width="163" height="150" transform="rotate(-9 100 100)"/><g color="#d1a552"><use href="#paper-star" x="143" y="21" width="23" height="23"/><use href="#paper-star" x="28" y="34" width="13" height="13"/></g></symbol>
    <symbol id="paper-art-tree" viewBox="0 0 200 200"><use href="#paper-disc" width="200" height="200"/><use href="#paper-tree" x="25" y="2" width="148" height="192"/><path d="m65 76 69 11m-82 25 89 14m-99 21 107 18" stroke="#e9e6ce" stroke-width="2" stroke-dasharray="3 3"/></symbol>
    <symbol id="paper-art-frost" viewBox="0 0 200 200">
      <use href="#paper-disc" width="200" height="200"/>
      <path d="m33 44 130-4 4 122-129 7Z" fill="#7caaaf"/>
      <g color="#397365"><use href="#paper-fir" x="48" y="63" width="55" height="100"/><use href="#paper-fir" x="102" y="51" width="53" height="107"/></g>
      <path d="m33 44 130-4 1 28-17-4-22 11-19 23-25 3-18 29-26 7Z" fill="#f7f3e5"/>
      <path d="m37 147 36-10 26-35 32-4 34-28 2 92-129 7Z" fill="#dfe9df"/>
      <path d="m58 155 27-19 26-24 29-5 20-22" fill="none" stroke="#f9f7eb" stroke-width="15" stroke-linecap="round"/>
      <path d="m28 40 140-5 4 132-139 8Z" fill="none" stroke="#e2c795" stroke-width="8" stroke-linejoin="round"/>
      <g color="#91b6bc"><use href="#paper-snowflake" x="42" y="52" width="30" height="30"/><use href="#paper-snowflake" x="124" y="128" width="26" height="26"/></g>
    </symbol>
    <symbol id="paper-danger-gift" viewBox="0 0 100 110"><path d="m11 38 78-2-2 66-74 3Z" fill="#35505a"/><path d="m6 27 87-1 2 18-90 1Z" fill="#49616a"/><path d="M49 28C7 36 8-6 31 5c11 6 19 20 18 23Zm3-1C43 2 80-3 78 12c-1 9-16 15-26 15Z" fill="none" stroke="#627b80" stroke-width="7"/><path d="m33 54 32 33m0-33L33 87" stroke="#de8065" stroke-width="10"/></symbol>
    <symbol id="paper-bonus-gift" viewBox="0 0 100 110"><path d="m11 38 78-2-2 66-74 3Z" fill="#d5a34d"/><path d="m6 27 87-1 2 18-90 1Z" fill="#e4ba6c"/><path d="m41 27 17-1 1 77-17 1Z" fill="#f6e6b6"/><path d="M49 28C7 36 8-6 31 5c11 6 19 20 18 23Zm3-1C43 2 80-3 78 12c-1 9-16 15-26 15Z" fill="none" stroke="#f6e6b6" stroke-width="7"/><g color="#fff2cf"><use href="#paper-star" x="31" y="54" width="37" height="37"/></g></symbol>
    <symbol id="paper-heart" viewBox="0 0 40 40"><path d="M20 35 5 21C-7 8 10-3 20 10 30-3 47 8 35 21Z" fill="currentColor"/><path d="M7 13q2-8 10-3" stroke="#fff" stroke-width="2" fill="none" opacity=".35"/></symbol>
    <symbol id="paper-pause" viewBox="0 0 24 24"><path d="M6 4h4v16H6ZM14 4h4v16h-4Z" fill="currentColor"/></symbol>
    <symbol id="paper-cup" viewBox="0 0 100 110"><path d="M25 12h50l-5 46-20 17-20-17Z" fill="#d4ac59"/><path d="m26 22-18-2 2 25 23 13m41-36 18-2-2 25-23 13" fill="none" stroke="#ba914d" stroke-width="8"/><path d="M45 71h10v22h18v12H27V93h18Z" fill="#b28c4c"/><g color="#f5e3aa"><use href="#paper-star" x="36" y="24" width="28" height="28"/></g></symbol>
    <symbol id="paper-hourglass" viewBox="0 0 40 40"><path d="M9 4h22v5L21 20l10 11v5H9v-5l10-11L9 9Z" fill="none" stroke="currentColor" stroke-width="3"/><path d="m12 11 8 8 8-8Zm0 20 8-8 8 8Z" fill="currentColor"/></symbol>
    <symbol id="paper-magnet" viewBox="0 0 40 40"><path d="M7 5v17a13 13 0 0 0 26 0V5h-9v17a4 4 0 0 1-8 0V5Z" fill="currentColor"/><path d="M7 5h9v7H7Zm17 0h9v7h-9Z" fill="#f6edda"/></symbol>
    <symbol id="paper-double" viewBox="0 0 40 40"><path d="m5 14 10 12M15 14 5 26M22 12q14-9 14 1 0 6-14 14h14" stroke="currentColor" stroke-width="4" fill="none" stroke-linejoin="round"/></symbol>
    <symbol id="paper-sweep" viewBox="0 0 40 40"><path d="m29 3 5 3-17 22-5-4Z" fill="currentColor"/><path d="m12 19 13 9-9 10-15-9Z" fill="currentColor"/><path d="m6 28 10 7m-5-10 9 7" stroke="#f6edda" stroke-width="2"/></symbol>
  </defs>`;
  document.body.prepend(library);

  const cardTemplate = document.createElement('template');
  cardTemplate.innerHTML = `<a class="game-card"><svg class="game-card-art" viewBox="0 0 200 200" aria-hidden="true"><use/></svg><span class="game-card-copy"><span class="game-card-title"></span><span class="game-card-description"></span></span></a>`;

  function renderGameCards(container, games) {
    const fragment = document.createDocumentFragment();
    for (const game of games) {
      const card = cardTemplate.content.firstElementChild.cloneNode(true);
      card.href = game.href;
      card.dataset.game = game.id;
      card.style.setProperty('--card-accent', game.accent || '#285951');
      card.querySelector('.game-card-art use').setAttribute('href', '#' + game.art);
      card.querySelector('.game-card-title').textContent = game.title;
      card.querySelector('.game-card-description').textContent = game.description;
      card.setAttribute('aria-label', game.title + '. ' + game.description);
      fragment.append(card);
    }
    container.replaceChildren(fragment);
  }

  window.PaperUI = Object.freeze({ renderGameCards });
})();
