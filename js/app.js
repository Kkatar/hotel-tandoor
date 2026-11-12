/* ==========================================================================
   Hotel Tandoor Corner · interactions
   Vanilla JS + GSAP (ScrollTrigger) + Lenis. No build step: open index.html.
   Order of things: language → loader → build every section → reveal.
   ========================================================================== */
(function () {
  'use strict';

  var TC = window.TC || {};
  var cfg = TC.config || {};
  var doc = document, root = doc.documentElement;
  var $ = function (s, c) { return (c || doc).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || doc).querySelectorAll(s)); };
  var clamp = function (v, a, b) { return Math.max(a, Math.min(b, v)); };
  var rnd = function (a, b) { return a + Math.random() * (b - a); };
  var wait = function (ms) { return new Promise(function (r) { setTimeout(r, ms); }); };
  var store = {
    get: function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set: function (k, v) { try { localStorage.setItem(k, v); } catch (e) { /* sandboxed */ } }
  };
  var session = {
    get: function (k) { try { return sessionStorage.getItem(k); } catch (e) { return null; } },
    set: function (k, v) { try { sessionStorage.setItem(k, v); } catch (e) { /* sandboxed */ } }
  };

  var gsap = window.gsap, ScrollTrigger = window.ScrollTrigger, Lenis = window.Lenis;
  var REDUCED = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var STATIC = REDUCED || !gsap || !ScrollTrigger;
  var isSmall = function () { return window.innerWidth <= 760; };

  /* ------------------------------------------------------------------ language */
  var EN = {};
  var lang = root.getAttribute('data-lang') || ((navigator.language || '').toLowerCase().indexOf('mr') === 0 ? 'mr' : 'en');
  var D = function () { return (TC.dyn && TC.dyn[lang]) || TC.dyn.en; };
  var DEV = '०१२३४५६७८९';
  var num = function (v) { return lang === 'mr' ? String(v).replace(/\d/g, function (d) { return DEV[d]; }) : String(v); };
  var tr = function (key) {
    if (lang === 'mr' && TC.mr && TC.mr[key] != null) return TC.mr[key];
    return EN[key] != null ? EN[key] : key;
  };

  function harvest() {
    $$('[data-i18n]').forEach(function (el) {
      var k = el.getAttribute('data-i18n');
      if (EN[k] == null) EN[k] = el.innerHTML.replace(/\s+/g, ' ').trim();
    });
    $$('[data-i18n-attr]').forEach(function (el) {
      el.getAttribute('data-i18n-attr').split(';').forEach(function (pair) {
        var p = pair.split(':');
        if (EN[p[1]] == null) EN[p[1]] = el.getAttribute(p[0]) || '';
      });
    });
    EN['meta.title'] = doc.title;
  }

  /* The hero plate lives inside the wordmark in English (it is the first "O"); park it before text is rewritten. */
  function parkDish() {
    var dish = $('.hero__dish'), stage = $('.hero__stage'), front = $('.hero__layer--front');
    if (dish && stage && dish.parentNode !== stage) stage.insertBefore(dish, front);
  }

  function applyLang() {
    parkDish();
    root.lang = lang;
    root.setAttribute('data-lang', lang);
    $$('[data-i18n]').forEach(function (el) {
      el.innerHTML = tr(el.getAttribute('data-i18n'));
      el.removeAttribute('aria-label');
    });
    $$('[data-i18n-attr]').forEach(function (el) {
      el.getAttribute('data-i18n-attr').split(';').forEach(function (pair) {
        var p = pair.split(':');
        el.setAttribute(p[0], tr(p[1]));
      });
    });
    doc.title = tr('meta.title');
    $$('[data-num]').forEach(function (el) {
      var n = el.getAttribute('data-num');
      el.textContent = num(el.hasAttribute('data-plain') ? n : ('0' + n).slice(-2));
    });
    $$('[data-count]').forEach(function (el) { el.textContent = money(+el.getAttribute('data-count')); });
    renderMarquees();
    renderWeek();
    renderStatus();
    renderClock(true);
    var list = $('[data-names-list]');
    if (list) list.innerHTML = D().marquee.n1.concat(D().marquee.n2).map(function (t) { return '<li>' + esc(t) + '</li>'; }).join('');
    langUI();
  }

  function langUI() {
    var box = $('.lang'); if (!box) return;
    var thumb = $('.lang__thumb', box);
    $$('button', box).forEach(function (b) {
      var on = b.getAttribute('data-lang') === lang;
      b.setAttribute('aria-pressed', on ? 'true' : 'false');
      if (on && thumb) {
        thumb.style.width = b.offsetWidth + 'px';
        thumb.style.transform = 'translateX(' + (b.offsetLeft - 3) + 'px)';
      }
    });
  }

  var esc = function (s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;'); };
  var money = function (n) { return '₹' + num(n); };

  /* ------------------------------------------------------------------ time, status, clock */
  function nowLocal() {
    var o = { day: 0, h: 12, m: 0, s: 0 };
    try {
      var parts = new Intl.DateTimeFormat('en-GB', { timeZone: cfg.tz || 'Asia/Kolkata', weekday: 'short', hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23' }).formatToParts(new Date());
      var get = function (t) { var p = parts.filter(function (x) { return x.type === t; })[0]; return p ? p.value : ''; };
      o.day = { Mon: 0, Tue: 1, Wed: 2, Thu: 3, Fri: 4, Sat: 5, Sun: 6 }[get('weekday')] || 0;
      o.h = +get('hour') % 24; o.m = +get('minute'); o.s = +get('second');
    } catch (e) {
      var d = new Date(); o.day = (d.getDay() + 6) % 7; o.h = d.getHours(); o.m = d.getMinutes(); o.s = d.getSeconds();
    }
    return o;
  }
  var toMin = function (s) { var p = s.split(':'); return +p[0] * 60 + +p[1]; };

  function fmtTime(h, m, short) {
    var h12 = h % 12 || 12, mm = ('0' + m).slice(-2);
    var body = h12 + ((m || !short) ? ':' + mm : '');
    if (lang === 'mr') {
      var part = h < 4 ? 'रात्री' : h < 12 ? 'सकाळी' : h < 16 ? 'दुपारी' : h < 19 ? 'संध्याकाळी' : 'रात्री';
      return part + ' ' + num(body);
    }
    return body + ' ' + (h < 12 ? 'AM' : 'PM');
  }
  var fmtHM = function (s, short) { var p = s.split(':'); return fmtTime(+p[0], +p[1], short); };

  function renderStatus() {
    var hrs = cfg.hours; if (!hrs) return;
    var n = nowLocal(), min = n.h * 60 + n.m, o = toMin(hrs.open), c = toMin(hrs.close);
    var open = c > o ? (min >= o && min < c) : (min >= o || min < c);
    var state = open ? 'open' : (min < o ? 'soon' : 'shut');
    var t = fmtHM(open ? hrs.close : hrs.open, true), d = D();
    var fill = function (s) { return s.replace('{t}', t).replace('{o}', fmtHM(hrs.open, true)).replace('{c}', fmtHM(hrs.close, true)); };
    var map = { pill: fill(d[state + 'Pill']), pillS: fill(d[state + 'PillS'] || d[state + 'Pill']), k: fill(d[state + 'K']), sub: fill(d[state + 'Sub']), summary: fill(d.summary) };
    $$('[data-status]').forEach(function (el) {
      var v = map[el.getAttribute('data-status')];
      if (v != null && el.textContent !== v) el.textContent = v;
    });
    $$('[data-time]').forEach(function (el) {
      var v = fmtHM(hrs[el.getAttribute('data-time')], false);
      if (el.textContent !== v) el.textContent = v;
    });
    root.classList.toggle('is-open', open);
    $$('[data-week] li').forEach(function (li, i) { li.classList.toggle('is-today', i === n.day); });
  }

  function renderWeek() {
    var ul = $('[data-week]'); if (!ul) return;
    ul.innerHTML = D().days.map(function (d) { return '<li>' + d + '</li>'; }).join('');
  }

  var clockSecs = null;
  function renderClock(force) {
    var box = $('[data-clock]'); if (!box) return;
    var n = nowLocal();
    var H = $('[data-hand="h"]', box), M = $('[data-hand="m"]', box), S = $('[data-hand="s"]', box);
    var ha = ((n.h % 12) + n.m / 60) * 30 - 90, ma = (n.m + n.s / 60) * 6 - 90;
    if (H) H.style.transform = 'rotate(' + ha.toFixed(2) + 'deg)';
    if (M) M.style.transform = 'rotate(' + ma.toFixed(2) + 'deg)';
    if (S) {
      if (clockSecs === null) clockSecs = n.s;
      else clockSecs += (((n.s - clockSecs) % 60) + 90) % 60 - 30;      // shortest way round; self-corrects after a sleeping tab
      var sa = clockSecs * 6 - 90;
      if (gsap && !STATIC && !force) gsap.to(S, { rotation: sa, duration: 0.42, ease: 'back.out(2.6)', overwrite: true });
      else if (gsap) gsap.set(S, { rotation: sa });
      else S.style.transform = 'rotate(' + sa + 'deg)';
    }
    var dig = $('[data-clock-digital]');
    if (dig) { var v = fmtTime(n.h, n.m, false); if (dig.textContent !== v) dig.textContent = v; }
  }

  function clockTicks() {
    var box = $('[data-clock-ticks]'); if (!box || box.children.length) return;
    var html = '';
    for (var i = 0; i < 12; i++) {
      var a = i * 30 * Math.PI / 180, r = 39.5;
      html += '<i' + (i % 3 === 0 ? ' class="is-q"' : '') + ' style="left:' + (50 + Math.sin(a) * r).toFixed(2) + '%;top:' + (50 - Math.cos(a) * r).toFixed(2) + '%"></i>';
    }
    box.innerHTML = html;
  }

  /* ------------------------------------------------------------------ text splitting */
  var MARK = /[\u0900-\u0903\u093A-\u094F\u0951-\u0957\u0962\u0963\u200C\u200D\uFE0F\u0300-\u036F]/;
  /* Grapheme clusters, keeping Devanagari conjuncts (consonant + virama + consonant) in one piece. */
  function clusters(str) {
    var out = [], cur = '';
    Array.from(str).forEach(function (ch) {
      if (cur && (MARK.test(ch) || cur.slice(-1) === '\u094D' || cur.slice(-1) === '\u200D')) cur += ch;
      else { if (cur) out.push(cur); cur = ch; }
    });
    if (cur) out.push(cur);
    return out;
  }

  function splitChars(el) {
    var label = el.textContent.replace(/\s+/g, ' ').trim();
    var walk = function (node, into) {
      Array.prototype.slice.call(node.childNodes).forEach(function (n) {
        if (n.nodeType === 3) {
          n.textContent.split(/(\s+)/).forEach(function (tok) {
            if (!tok) return;
            if (/^\s+$/.test(tok)) { into.appendChild(doc.createTextNode(' ')); return; }
            var w = doc.createElement('span'); w.className = 'w'; w.setAttribute('aria-hidden', 'true');
            clusters(tok).forEach(function (c) { var s = doc.createElement('span'); s.className = 'c'; s.textContent = c; w.appendChild(s); });
            into.appendChild(w);
          });
        } else if (n.nodeName === 'BR') { into.appendChild(n.cloneNode(false)); }
        else { var c = n.cloneNode(false); into.appendChild(c); walk(n, c); }
      });
    };
    var frag = doc.createDocumentFragment();
    walk(el, frag);
    el.textContent = '';
    el.appendChild(frag);
    el.setAttribute('aria-label', label);
    return $$('.c', el);
  }

  function splitWords(el) {
    var walk = function (node, into) {
      Array.prototype.slice.call(node.childNodes).forEach(function (n) {
        if (n.nodeType === 3) {
          n.textContent.split(/(\s+)/).forEach(function (tok) {
            if (!tok) return;
            if (/^\s+$/.test(tok)) { into.appendChild(doc.createTextNode(' ')); return; }
            var w = doc.createElement('span'); w.className = 'ww'; w.textContent = tok; into.appendChild(w);
          });
        } else { var c = n.cloneNode(false); into.appendChild(c); walk(n, c); }
      });
    };
    var frag = doc.createDocumentFragment();
    walk(el, frag);
    el.textContent = '';
    el.appendChild(frag);
    return $$('.ww', el);
  }

  function splitLogo(el) {
    var text = el.textContent.trim();
    el.textContent = '';
    clusters(text).forEach(function (c) {
      var l = doc.createElement('span'); l.className = 'l';
      var li = doc.createElement('span'); li.className = 'li'; li.textContent = c;
      l.appendChild(li); el.appendChild(l);
    });
    return $$('.li', el);
  }

  function splitLines(el) {
    var parts = el.innerHTML.split(/<br\s*\/?>/i);
    el.innerHTML = parts.map(function (p) { return '<span class="ln" style="display:block">' + p + '</span>'; }).join('');
    return $$('.ln', el);
  }

  /* Scale a one-line element so its text spans the available width. */
  function fitText(el, maxVh) {
    var box = el.parentNode; if (!box) return;
    el.style.fontSize = '100px';
    el.style.width = 'max-content';
    var w = el.offsetWidth || 1, cs = getComputedStyle(box);
    el.style.width = '';
    var avail = box.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
    var size = 100 * avail / w * 0.985;
    if (maxVh) size = Math.min(size, window.innerHeight * maxVh);
    el.style.fontSize = size.toFixed(1) + 'px';
  }

  /* ------------------------------------------------------------------ marquees */
  var marquees = [];
  function renderMarquees() {
    $$('[data-marquee]').forEach(function (el) {
      var key = el.getAttribute('data-marquee'), items = D().marquee[key] || [];
      var sep = key === 'a' ? '<img class="mq__chili" src="assets/img/sprites/chili-a.webp" alt="" width="344" height="83">'
        : key === 'b' ? '<svg class="mq__ast"><use href="#i-ast"/></svg>' : '';
      el.innerHTML = '<div class="mq__g">' + items.map(function (t) { return '<span class="mq__i">' + esc(t) + '</span>' + sep; }).join('') + '</div>';
      el.style.transform = '';
    });
  }

  function setupMarquees() {
    marquees.forEach(function (m) { m.tween && m.tween.kill(); });
    marquees = [];
    $$('[data-marquee]').forEach(function (el) {
      var first = el.firstElementChild; if (!first) return;
      while (el.children.length > 1) el.removeChild(el.lastChild);
      var w = first.offsetWidth; if (!w) return;
      var copies = Math.ceil(window.innerWidth * 1.25 / w) + 1;
      for (var i = 0; i < copies; i++) el.appendChild(first.cloneNode(true));
      var speed = parseFloat(el.getAttribute('data-speed')) || 80, fwd = speed > 0;
      var tween = gsap.fromTo(el, { x: fwd ? 0 : -w }, { x: fwd ? -w : 0, duration: w / Math.abs(speed), ease: 'none', repeat: -1 });
      marquees.push({ el: el, tween: tween });
    });
  }

  /* ------------------------------------------------------------------ static mode */
  function staticInit() {
    root.classList.add('static', 'booted');
    harvest();
    applyConfig();
    applyLang();
    heroLogo();
    injectSchema();
    clockTicks();
    renderClock(true);
    mapDraw(1e9, true);
    $$('[data-vmap-poi]').forEach(function (el) { el.classList.add('is-on'); });
    setInterval(renderStatus, 20000);
    setInterval(function () { renderClock(true); }, 1000);
    bindLang();
    var small = isSmall();
    window.addEventListener('resize', function () {
      if (isSmall() !== small) { small = isSmall(); applyLang(); heroLogo(); }
      langUI(); mapDraw(1e9, true);
    });
  }

  /* ------------------------------------------------------------------ map (canvas, drawn stroke by stroke) */
  var mapItems = null, mapT = 3.3, mapMaxD = 1, mapNow = 0;
  function mapPrep() {
    var data = window.TC_MAP; if (!data || mapItems) return;
    mapItems = [];
    data.roads.concat(data.buildings).forEach(function (it) { if (it.d > mapMaxD) mapMaxD = it.d; });
    var add = function (it, kind) {
      var p = it.p, seg = [0];
      for (var i = 2; i < p.length; i += 2) seg.push(seg[seg.length - 1] + Math.hypot(p[i] - p[i - 2], p[i + 1] - p[i - 1]));
      var len = seg[seg.length - 1];
      mapItems.push({
        kind: kind, p: p, seg: seg, len: len, w: it.w || 1.4, faint: !!it.f, main: !!it.m,
        start: kind === 'road' ? (it.d / mapMaxD) * mapT * 0.55 : 0.25 + (it.d / mapMaxD) * mapT * 0.62,
        dur: kind === 'road' ? 0.35 + Math.min(1.1, len / 900) : 0.45
      });
    };
    data.buildings.forEach(function (b) { add(b, 'bld'); });
    data.roads.slice().sort(function (a, b) { return a.w - b.w; }).forEach(function (r) { add(r, 'road'); });
  }

  function mapDraw(t, pois) {
    var cv = $('[data-vmap-canvas]'), data = window.TC_MAP; if (!cv || !data) return;
    mapPrep(); mapNow = t;
    var r = cv.getBoundingClientRect(); if (!r.width) return;
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var W = Math.round(r.width * dpr), H = Math.round(r.height * dpr);
    if (cv.width !== W || cv.height !== H) { cv.width = W; cv.height = H; }
    var c = cv.getContext('2d'), s = W / data.w;
    c.setTransform(1, 0, 0, 1, 0, 0); c.clearRect(0, 0, W, H);
    c.setTransform(s, 0, 0, s, 0, 0); c.lineCap = 'round'; c.lineJoin = 'round';
    for (var k = 0; k < mapItems.length; k++) {
      var it = mapItems[k];
      if (t <= it.start) continue;
      var f = Math.min(1, (t - it.start) / it.dur), L = it.len * (1 - (1 - f) * (1 - f)), p = it.p, seg = it.seg;
      c.beginPath(); c.moveTo(p[0], p[1]);
      var i = 1;
      while (i < seg.length && seg[i] <= L) { c.lineTo(p[i * 2], p[i * 2 + 1]); i++; }
      if (i < seg.length) {
        var q = (L - seg[i - 1]) / ((seg[i] - seg[i - 1]) || 1), a = (i - 1) * 2;
        c.lineTo(p[a] + (p[a + 2] - p[a]) * q, p[a + 1] + (p[a + 3] - p[a + 1]) * q);
      }
      if (it.kind === 'bld') {
        if (f >= 1) { c.closePath(); c.fillStyle = 'rgba(253,183,20,.34)'; c.fill(); }
        c.strokeStyle = 'rgba(142,14,21,.62)'; c.lineWidth = 1.5;
      } else {
        c.strokeStyle = it.main ? '#B5121B' : it.faint ? 'rgba(142,14,21,.3)' : 'rgba(142,14,21,.8)';
        c.lineWidth = it.w;
      }
      c.stroke();
    }
    if (pois) {
      $$('[data-vmap-poi]').forEach(function (el) {
        var d = parseFloat(el.getAttribute('data-d')) || 0;
        if (t > 0.5 + (d / mapMaxD) * mapT * 0.75) el.classList.add('is-on');
      });
    }
  }

  /* ------------------------------------------------------------------ language buttons */
  var switching = false;
  function bindLang() {
    $$('.lang button').forEach(function (b) {
      b.addEventListener('click', function () { setLang(b.getAttribute('data-lang')); });
    });
  }
  function fontsFor(l) {
    if (!doc.fonts || !doc.fonts.load) return Promise.resolve();
    var list = l === 'mr'
      ? ['800 40px "Anek Expanded"', '800 40px "Anek Condensed"', '500 20px "Anek Text"', '700 20px "Anek Text"', '700 40px "Tillana"']
      : ['400 40px "Anton"', '800 40px "Archivo"', '800 40px "Barlow Condensed"', '700 40px "Tillana"', '400 20px "Source Sans 3"'];
    var sample = l === 'mr' ? 'तंदूर कॉर्नर' : 'Tandoor';
    return Promise.race([Promise.all(list.map(function (f) { return doc.fonts.load(f, sample).catch(function () {}); })), wait(2500)]);
  }

  function setLang(next) {
    if (next !== 'en' && next !== 'mr') return;
    if (next === lang || switching) return;
    store.set('tc-lang', next);
    if (STATIC) { lang = next; applyLang(); heroLogo(); mapDraw(1e9, true); return; }
    switching = true;
    var wipe = $('.wipe'), cols = $$('.wipe i');
    if (lenis) lenis.stop();
    gsap.set(wipe, { visibility: 'visible' });
    gsap.fromTo(cols, { yPercent: -101 }, {
      yPercent: 0, duration: 0.55, stagger: 0.05, ease: 'expo.inOut',
      onComplete: function () {
        var keep = anchor();
        lang = next;
        teardown();
        applyLang();
        fontsFor(next).then(function () {
          build();
          ScrollTrigger.sort();
          ScrollTrigger.refresh();
          restore(keep);
          var top = window.scrollY < window.innerHeight * 0.5, hi = null;
          if (top) ctx.add(function () { hi = heroIntro(true); });
          gsap.to(cols, {
            yPercent: 101, duration: 0.6, stagger: 0.05, ease: 'expo.inOut', delay: 0.1,
            onStart: function () { if (hi) hi.play(); },
            onComplete: function () {
              gsap.set(wipe, { visibility: 'hidden' });
              if (lenis) lenis.start();
              switching = false;
            }
          });
        });
      }
    });
  }

  function anchor() {
    var y = window.scrollY, secs = $$('[data-section]'), cur = secs[0], idx = 0;
    secs.forEach(function (s, i) { if (s.getBoundingClientRect().top + y <= y + 2) { cur = s; idx = i; } });
    var top = cur.getBoundingClientRect().top + y;
    return { i: idx, f: (y - top) / (cur.offsetHeight || 1) };
  }
  function restore(a) {
    var s = $$('[data-section]')[a.i]; if (!s) return;
    var y = Math.max(0, s.getBoundingClientRect().top + window.scrollY + a.f * s.offsetHeight);
    if (lenis) lenis.scrollTo(y, { immediate: true, force: true }); else window.scrollTo(0, y);
    ScrollTrigger.update();
  }

  /* ==================================================================== animated mode */
  var lenis = null, ctx = null, cleanups = [], heroReady = false, velTarget = 1, velCur = 1;

  function teardown() {
    cleanups.forEach(function (fn) { try { fn(); } catch (e) { /* noop */ } });
    cleanups = [];
    marquees.forEach(function (m) { m.tween && m.tween.kill(); });
    marquees = [];
    if (ctx) ctx.revert();
    ctx = null;
    var rain = $('[data-rain]'); if (rain) rain.innerHTML = '';
  }

  function on(el, type, fn, opts) {
    if (!el) return;
    el.addEventListener(type, fn, opts || false);
    cleanups.push(function () { el.removeEventListener(type, fn, opts || false); });
  }

  function build() {
    ctx = gsap.context(function () {
      setupMarquees();
      sHero();
      sGeneric();
      sDef();
      sBuild();
      sGallery();
      sNames();
      sDuo();
      sFamily();
      sHours();
      sVisit();
      sEnd();
    });
  }

  /* ---------- 01 hero ---------- */
  /* Split the wordmark into letters and let the plate take one letter's place:
     the "•" if the word has one (Marathi), otherwise the first "O" (English).
     On phones the plate sits big under the word instead. */
  function heroLogo() {
    var word = $('.hero__word'); if (!word) return [];
    var letters = splitLogo(word), cells = $$('.l', word);
    var slot = cells.filter(function (l) { return l.textContent === '•'; })[0] ||
               cells.filter(function (l) { return l.textContent.toUpperCase() === 'O'; })[0];
    if (slot && !isSmall()) { slot.classList.add('l--dish'); slot.appendChild($('.hero__dish')); }
    else if (slot && slot.textContent === '•') slot.classList.add('l--gap');
    return letters;
  }

  var heroParts = null;
  function sHero() {
    var sec = $('.s-hero'); if (!sec) return;
    var letters = heroLogo();
    var sprites = $$('.sp', sec).map(function (el) {
      return {
        el: el, p: $('.sp__p', el), b: $('.sp__b', el), d: parseFloat(el.getAttribute('data-depth')) || 0.5,
        x: parseFloat(el.style.getPropertyValue('--x')), y: parseFloat(el.style.getPropertyValue('--y'))
      };
    }).filter(function (s) { return s.el.offsetParent !== null || getComputedStyle(s.el).display !== 'none'; });
    var dish = $('[data-hero-dish]'), dishP = $('[data-hero-dish-p]'), dishImg = $('[data-hero-dish-img]'), dishSh = $('[data-hero-dish-sh]');
    heroParts = { sec: sec, letters: letters, sprites: sprites, dish: dish, dishImg: dishImg };

    // scroll: the scene comes apart as you leave
    var tl = gsap.timeline({ defaults: { duration: 1 }, scrollTrigger: { trigger: sec, start: 'top top', end: 'bottom top', scrub: true, invalidateOnRefresh: true } });
    tl.to('[data-hero-logo]', { yPercent: 30, scale: 0.86, ease: 'none' }, 0)
      .to('[data-hero-pattern]', { rotation: '+=6', scale: 1.2, ease: 'none' }, 0)
      .to('[data-hero-fade]', { y: function () { return -window.innerHeight * 0.16; }, autoAlpha: 0, ease: 'none', duration: 0.55 }, 0)
      .to('[data-hero-stamp]', { y: function () { return -window.innerHeight * 0.22; }, autoAlpha: 0, ease: 'none', duration: 0.55 }, 0)
      .to(dish, { y: function () { return window.innerHeight * 0.2; }, scale: 1.12, ease: 'none' }, 0)
      .to(dishImg, { rotation: 150, ease: 'none' }, 0);
    sprites.forEach(function (s, i) {
      var dx = (s.x - 50) / 50, dy = (s.y - 59) / 50, near = Math.max(s.d, 0);
      tl.to(s.el, {
        x: function () { return dx * window.innerWidth * (0.14 + near * 0.2); },
        y: function () { return (dy * 0.2 - 0.12 - near * 0.42) * window.innerHeight; },
        rotation: (i % 2 ? 1 : -1) * (30 + near * 70), ease: 'none'
      }, 0);
    });

    // idle: everything floats a little, each piece on its own clock
    var idle = [];
    sprites.forEach(function (s, i) {
      idle.push(gsap.to(s.b, {
        y: (i % 2 ? -1 : 1) * rnd(8, 18) * (0.6 + Math.abs(s.d) * 0.5), rotation: rnd(-7, 7), x: rnd(-6, 6),
        duration: rnd(2.6, 4.6), ease: 'sine.inOut', yoyo: true, repeat: -1, delay: -rnd(0, 4)
      }));
    });
    idle.push(gsap.to(dishP, { y: -9, rotation: 1.6, duration: 3.4, ease: 'sine.inOut', yoyo: true, repeat: -1 }));
    ScrollTrigger.create({
      trigger: sec, start: 'top bottom', end: 'bottom top',
      onToggle: function (self) { idle.forEach(function (t) { self.isActive ? t.resume() : t.pause(); }); }
    });

    // pointer: near things move more, the shadow slides the other way
    var qs = sprites.map(function (s) {
      return { d: s.d, x: gsap.quickTo(s.p, 'x', { duration: 1, ease: 'power3' }), y: gsap.quickTo(s.p, 'y', { duration: 1, ease: 'power3' }) };
    });
    var dx_ = gsap.quickTo(dishP, 'x', { duration: 1.1, ease: 'power3' }), dy_ = gsap.quickTo(dishP, 'y', { duration: 1.1, ease: 'power3' });
    var sx_ = gsap.quickTo(dishSh, 'x', { duration: 1.1, ease: 'power3' }), sy_ = gsap.quickTo(dishSh, 'y', { duration: 1.1, ease: 'power3' });
    on(sec, 'pointermove', function (e) {
      if (!heroReady || e.pointerType === 'touch') return;
      var nx = e.clientX / window.innerWidth - 0.5, ny = e.clientY / window.innerHeight - 0.5;
      qs.forEach(function (q) { q.x(-nx * q.d * 54); q.y(-ny * q.d * 40); });
      dx_(-nx * 16); sx_(nx * 26); sy_(ny * 18);
    }, { passive: true });
    on(sec, 'pointerleave', function () {
      qs.forEach(function (q) { q.x(0); q.y(0); });
      dx_(0); sx_(0); sy_(0);
    });
    void dy_;
  }

  /* The entrance of the hero. Runs after the loader, and again after a language switch at the top. */
  function heroIntro(paused, first) {
    var h = heroParts; if (!h) return gsap.timeline();
    heroReady = false;
    var stage = h.sec.getBoundingClientRect();
    var tl = gsap.timeline({ paused: !!paused, defaults: { ease: 'expo.out' }, onComplete: function () { heroReady = true; } });
    tl.from(h.letters, { yPercent: lang === 'mr' ? 150 : 122, rotation: function () { return rnd(-12, 12); }, duration: 1.3, stagger: 0.06, ease: 'back.out(1.6)' }, 0)
      .from('[data-hero-corner]', { scale: 0, rotation: '-=40', duration: 0.9, ease: 'back.out(1.7)' }, 0.6)
      .from(h.dish, { scale: 0.3, autoAlpha: 0, duration: 1.3 }, 0.2)
      .from(h.dishImg, { rotation: -170, duration: 1.9 }, 0.2)
      .from(h.sprites.map(function (s) { return s.p; }), {
        x: function (i) { return (50 - h.sprites[i].x) / 100 * stage.width; },
        y: function (i) { return (59 - h.sprites[i].y) / 100 * stage.height; },
        rotation: function () { return rnd(-150, 150); }, duration: 1.5, stagger: { each: 0.04, from: 'random' }
      }, 0.38)
      .from(h.sprites.map(function (s) { return s.b; }), { scale: 0, duration: 1.1, ease: 'back.out(1.5)', stagger: { each: 0.04, from: 'random' } }, 0.38)
      .from('[data-hero-fade]', { y: 26, autoAlpha: 0, duration: 0.9, stagger: 0.08 }, 0.75)
      .from('[data-hero-stamp]', { scale: 0, rotation: -180, duration: 1, ease: 'back.out(1.7)' }, 0.85);
    if (first) tl.from('[data-topbar-item]', { y: -34, autoAlpha: 0, duration: 0.8, stagger: 0.07 }, 0.6);
    return tl;
  }

  /* ---------- shared reveals ---------- */
  function sGeneric() {
    var up = lang === 'mr' ? 138 : 116;
    $$('[data-split]').forEach(function (el) {
      var cs = splitChars(el);
      gsap.from(cs, {
        yPercent: up, rotation: function () { return rnd(-14, 14); }, duration: 1.1, ease: 'back.out(1.4)', stagger: 0.025,
        scrollTrigger: { trigger: el, start: 'top 90%', once: true }
      });
    });
    $$('[data-write]').forEach(function (el) {
      var lines = splitLines(el);
      gsap.fromTo(lines, { clipPath: 'inset(-25% 102% -25% -6%)' }, {
        clipPath: 'inset(-25% -6% -25% -6%)', duration: 1.35, ease: 'power2.inOut', stagger: 0.42,
        scrollTrigger: { trigger: el, start: 'top 88%', once: true }
      });
    });
    $$('[data-parallax]').forEach(function (el) {
      var n = parseFloat(el.getAttribute('data-parallax')) || 10;
      gsap.fromTo(el, { yPercent: -n }, { yPercent: n, ease: 'none', scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true } });
    });
    // top-bar logo leans into the scroll
    var spin = gsap.quickTo('[data-logo-spin]', 'rotation', { duration: 0.6, ease: 'power3' });
    ScrollTrigger.create({
      start: 0, end: 'max',
      onUpdate: function (self) {
        var v = self.getVelocity();
        spin(-10 + clamp(v / 90, -20, 20));
        velTarget = 1 + Math.min(5, Math.abs(v) / 420);
      }
    });
    var settle = function () { spin(-10); };
    ScrollTrigger.addEventListener('scrollEnd', settle);
    cleanups.push(function () { ScrollTrigger.removeEventListener('scrollEnd', settle); });
  }

  /* ---------- 03 definition ---------- */
  function sDef() {
    var card = $('[data-stampcard]'); if (!card) return;
    gsap.from(card, { y: 70, rotation: -3.5, autoAlpha: 0, duration: 1.2, ease: 'expo.out', scrollTrigger: { trigger: card, start: 'top 88%', once: true } });
    var txt = $('[data-words]');
    if (txt) {
      var words = splitWords(txt);
      gsap.fromTo(words, { opacity: 0.14 }, { opacity: 1, ease: 'none', stagger: 0.08, scrollTrigger: { trigger: txt, start: 'top 80%', end: 'bottom 52%', scrub: true } });
    }
  }

  /* ---------- 04 build a thali ---------- */
  function sBuild() {
    var pin = $('[data-build-pin]'); if (!pin) return;
    var stage = $('.build__stage', pin), thali = $('[data-thali]'), spin = $('[data-thali-spin]');
    var tand = $('[data-tandoori]'), tandImg = $('[data-tandoori-img]');
    var steps = $$('.step', pin), box = $('[data-build-steps]'), bar = $('[data-build-bar]');
    var result = $('[data-build-result]'), twist = $('[data-build-twist]');
    var AT = [0.05, 0.19, 0.33, 0.47, 0.585, 0.635];        // when each piece lands (pin progress)
    var STEP = [0.05, 0.19, 0.33, 0.47, 0.585];

    var thud = function () { gsap.fromTo(spin, { scale: 0.984 }, { scale: 1, duration: 0.55, ease: 'elastic.out(1,0.42)', overwrite: 'auto' }); };

    var drops = $$('[data-piece]', pin).map(function (pc, i) {
      var img = $('.pc__img', pc), sh = $('.pc__sh', pc), r0 = (i % 2 ? -1 : 1) * rnd(20, 36);
      var tl = gsap.timeline({ paused: true });
      // falling: big and loose, with a wide soft shadow far from the object …
      tl.fromTo(img, { autoAlpha: 0, scale: 1.8, rotation: r0, yPercent: -26 }, { autoAlpha: 1, scale: 1, rotation: 0, yPercent: 0, duration: 0.6, ease: 'power3.in' }, 0)
        .fromTo(sh, { autoAlpha: 0, scale: 1.3, xPercent: 10, yPercent: 14 }, { autoAlpha: 0.5, scale: 0.9, xPercent: 0, yPercent: 0, duration: 0.6, ease: 'power3.in' }, 0)
        // … landing: a small squash, and the whole plate takes the hit
        .to(img, { scale: 0.962, duration: 0.07, ease: 'power1.out' }, 0.6)
        .to(img, { scale: 1, duration: 0.55, ease: 'elastic.out(1,0.45)' }, 0.67)
        .call(thud, null, 0.61);
      tl._on = false;
      return tl;
    });

    gsap.set([result, twist], { autoAlpha: 0, y: 18 });
    var show = function (el, on_) {
      if (el._on === on_) return; el._on = on_;
      gsap.to(el, on_ ? { autoAlpha: 1, y: 0, duration: 0.6, ease: 'back.out(1.8)', overwrite: true } : { autoAlpha: 0, y: 18, duration: 0.3, ease: 'power2.in', overwrite: true });
    };

    var twistTl = gsap.timeline({ paused: true })
      .to(thali, { x: function () { return -window.innerWidth * (isSmall() ? 1.1 : 0.63); }, y: function () { return isSmall() ? 0 : window.innerHeight * 0.3; }, rotation: -60, duration: 1, ease: 'expo.inOut' }, 0)
      .fromTo(tand, { autoAlpha: 0, x: function () { return window.innerWidth * 0.6; }, rotation: 0 }, { autoAlpha: 1, x: 0, duration: 1.05, ease: 'expo.inOut' }, 0.04)
      .fromTo(tandImg, { rotation: 150 }, { rotation: 0, duration: 1.25, ease: 'expo.out' }, 0.04);
    var twistOn = false;

    var update = function (p) {
      gsap.set(bar, { scaleX: p });
      gsap.set(spin, { rotation: -9 + p * 17 });
      drops.forEach(function (tl, i) {
        var want = p >= AT[i];
        if (want !== tl._on) { tl._on = want; want ? tl.timeScale(1).play() : tl.timeScale(1.9).reverse(); }
      });
      var active = -1;
      STEP.forEach(function (t, i) { if (p >= t) active = i; });
      if (p >= 0.72) active = 5;
      steps.forEach(function (s, i) { s.classList.toggle('is-active', i === active); s.classList.toggle('is-done', i < active); });
      box.classList.toggle('is-hidden', p >= 0.7);
      show(result, p >= 0.72 && p < 0.86);
      show(twist, p >= 0.9);
      var tw = p >= 0.88;
      if (tw !== twistOn) { twistOn = tw; tw ? twistTl.timeScale(1).play() : twistTl.timeScale(1.5).reverse(); }
    };

    // the empty plate slides in spinning, like it was dealt onto the table
    gsap.from(stage, { xPercent: 85, rotation: 150, duration: 1.5, ease: 'expo.out', scrollTrigger: { trigger: pin, start: 'top 62%', toggleActions: 'play none none reverse' } });

    ScrollTrigger.create({
      trigger: pin, start: 'top top', end: '+=430%', pin: true, anticipatePin: 1,
      onUpdate: function (self) { update(self.progress); },
      onRefresh: function (self) { if (!twistOn) twistTl.invalidate(); update(self.progress); }
    });
  }

  /* ---------- 05 gallery (pinned, sideways) ---------- */
  function sGallery() {
    var pin = $('[data-gallery-pin]'), track = $('[data-gallery-track]'); if (!pin || !track) return;
    var dist = function () { return Math.max(0, track.scrollWidth - window.innerWidth); };
    var move = gsap.to(track, {
      x: function () { return -dist(); }, ease: 'none',
      scrollTrigger: { trigger: pin, start: 'top top', end: function () { return '+=' + dist(); }, pin: true, scrub: true, anticipatePin: 1, invalidateOnRefresh: true }
    });
    gsap.to('[data-gallery-bg]', {
      xPercent: -45, ease: 'none',
      scrollTrigger: { trigger: pin, start: 'top top', end: function () { return '+=' + dist(); }, scrub: true, invalidateOnRefresh: true }
    });
    $$('.card', track).forEach(function (card) {
      var img = $('img', card), title = $('.card__title', card), n = $('.card__num', card);
      gsap.fromTo(card, { rotation: 7, scale: 0.84 }, { rotation: 0, scale: 1, ease: 'none', scrollTrigger: { trigger: card, containerAnimation: move, start: 'left 100%', end: 'left 62%', scrub: true } });
      if (img) gsap.fromTo(img, { xPercent: -6 }, { xPercent: 6, ease: 'none', scrollTrigger: { trigger: card, containerAnimation: move, start: 'left right', end: 'right left', scrub: true } });
      if (title) gsap.from(title, { scale: 0, rotation: -14, duration: 0.55, ease: 'back.out(2)', scrollTrigger: { trigger: card, containerAnimation: move, start: 'left 78%', toggleActions: 'play none none reverse' } });
      if (n) gsap.from(n, { yPercent: 60, autoAlpha: 0, duration: 0.45, ease: 'back.out(2)', scrollTrigger: { trigger: card, containerAnimation: move, start: 'left 84%', toggleActions: 'play none none reverse' } });
    });
  }

  /* ---------- 06 names + prices ---------- */
  function sNames() {
    var list = $('[data-prices]'); if (!list) return;
    gsap.from($$('.price', list), { y: 40, autoAlpha: 0, duration: 0.9, ease: 'expo.out', stagger: 0.09, scrollTrigger: { trigger: list, start: 'top 86%', once: true } });
    $$('[data-count]', list).forEach(function (el, i) {
      var n = +el.getAttribute('data-count'), o = { v: 0 };
      gsap.to(o, {
        v: n, duration: 1.5, ease: 'power3.out', delay: Math.floor(i / 2) * 0.09,
        onUpdate: function () { el.textContent = money(Math.round(o.v)); },
        scrollTrigger: { trigger: list, start: 'top 86%', once: true }
      });
    });
    gsap.from('.names__sub', { y: 20, autoAlpha: 0, duration: 0.8, ease: 'expo.out', scrollTrigger: { trigger: '.names__sub', start: 'top 92%', once: true } });
  }

  /* ---------- 07 red → white wipe ---------- */
  function sDuo() {
    var frame = $('[data-duo-frame]'); if (!frame) return;
    var tl = gsap.timeline({
      scrollTrigger: { trigger: frame, start: 'center center', end: '+=130%', pin: '[data-duo-pin]', scrub: true, anticipatePin: 1, invalidateOnRefresh: true }
    });
    tl.to({}, { duration: 0.06 })
      .fromTo('[data-duo-over]', { xPercent: -100 }, { xPercent: 0, ease: 'none', duration: 1 }, '>')
      .fromTo('[data-duo-img]', { xPercent: 100 }, { xPercent: 0, ease: 'none', duration: 1 }, '<')
      .fromTo('[data-duo-line]', { x: 0 }, { x: function () { return frame.offsetWidth; }, ease: 'none', duration: 1 }, '<')
      .to({}, { duration: 0.08 });
    tl.fromTo('[data-duo-cap="in"]', { opacity: 0.3 }, { opacity: 1, ease: 'none', duration: 1 }, 0.06)
      .fromTo('[data-duo-cap="out"]', { opacity: 1 }, { opacity: 0.3, ease: 'none', duration: 1 }, 0.06);
  }

  function sFamily() {
    var pol = $$('[data-polaroid]'); if (!pol.length) return;
    pol.forEach(function (p, i) {
      gsap.from(p, {
        y: 110, rotation: (i % 2 ? '+=' : '-=') + 16, autoAlpha: 0, duration: 1.2, ease: 'back.out(1.25)', delay: i * 0.1,
        scrollTrigger: { trigger: '.family__photos', start: 'top 80%', once: true }
      });
    });
    gsap.from('.family__lead, .family__src', { y: 24, autoAlpha: 0, duration: 0.9, stagger: 0.1, ease: 'expo.out', scrollTrigger: { trigger: '.family__lead', start: 'top 88%', once: true } });
    gsap.from('[data-says] li', { xPercent: -24, autoAlpha: 0, duration: 0.9, stagger: 0.1, ease: 'expo.out', scrollTrigger: { trigger: '[data-says]', start: 'top 88%', once: true } });
  }

  /* ---------- 08 hours ---------- */
  function sHours() {
    var sec = $('.s-hours'); if (!sec) return;
    gsap.from('[data-hrow]', { xPercent: -30, autoAlpha: 0, duration: 1.1, ease: 'expo.out', stagger: 0.12, scrollTrigger: { trigger: '.hours__rows', start: 'top 86%', once: true } });
    gsap.from('.hrow__today', { scale: 0, rotation: -40, duration: 0.7, ease: 'back.out(2.4)', delay: 0.55, scrollTrigger: { trigger: '.hours__rows', start: 'top 86%', once: true } });
    gsap.from('[data-week] li', { scale: 0, duration: 0.5, ease: 'back.out(2)', stagger: 0.05, scrollTrigger: { trigger: '[data-week]', start: 'top 92%', once: true } });
    gsap.fromTo('[data-disc]', { scale: 0.5 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: '.hours__side', start: 'top bottom', end: 'center 55%', scrub: true } });
    gsap.from('[data-clock]', { scale: 0.55, rotation: -50, autoAlpha: 0, duration: 1.3, ease: 'back.out(1.5)', scrollTrigger: { trigger: '.hours__side', start: 'top 72%', once: true } });
    gsap.from('.clock__label', { y: 16, autoAlpha: 0, duration: 0.7, delay: 0.5, ease: 'expo.out', scrollTrigger: { trigger: '.hours__side', start: 'top 72%', once: true } });
  }

  /* ---------- 09 visit ---------- */
  function sVisit() {
    var sec = $('.s-visit'); if (!sec) return;
    gsap.fromTo('[data-visit-water]', { xPercent: 0 }, { xPercent: -33.333, ease: 'none', scrollTrigger: { trigger: sec, start: 'top bottom', end: 'bottom top', scrub: true } });
    $$('[data-pop]', sec).forEach(function (grp) {
      gsap.from(grp.children, { scale: 0.5, autoAlpha: 0, duration: 0.6, ease: 'back.out(2)', stagger: 0.06, scrollTrigger: { trigger: grp, start: 'top 92%', once: true } });
    });
    gsap.from('.visit__addr, .visit__near, .visit__status', { y: 24, autoAlpha: 0, duration: 0.9, stagger: 0.09, ease: 'expo.out', scrollTrigger: { trigger: '.visit__addr', start: 'top 90%', once: true } });
    gsap.from('.visit__stamp', { scale: 0, rotation: -160, duration: 1, ease: 'back.out(1.6)', scrollTrigger: { trigger: '.visit__stamp', start: 'top 96%', once: true } });

    var fig = $('[data-vmap]'); if (!fig) return;
    $$('[data-vmap-poi]', fig).forEach(function (el) { el.classList.remove('is-on'); });
    mapDraw(0, false);
    var o = { t: 0 };
    gsap.to(o, {
      t: mapT + 0.9, duration: mapT + 0.9, ease: 'none', onUpdate: function () { mapDraw(o.t, true); },
      scrollTrigger: { trigger: fig, start: 'top 74%', once: true }
    });
    gsap.from(fig, { y: 60, autoAlpha: 0, duration: 1.1, ease: 'expo.out', scrollTrigger: { trigger: fig, start: 'top 90%', once: true } });
    var rx = gsap.quickTo(fig, 'rotationX', { duration: 0.8, ease: 'power3' }), ry = gsap.quickTo(fig, 'rotationY', { duration: 0.8, ease: 'power3' });
    on(fig, 'pointermove', function (e) {
      if (e.pointerType === 'touch') return;
      var r = fig.getBoundingClientRect();
      ry(((e.clientX - r.left) / r.width - 0.5) * 9); rx(-((e.clientY - r.top) / r.height - 0.5) * 7);
    }, { passive: true });
    on(fig, 'pointerleave', function () { rx(0); ry(0); });
    var ro = null;
    if (window.ResizeObserver) {
      ro = new ResizeObserver(function () { mapDraw(mapNow, false); });
      ro.observe(fig);
      cleanups.push(function () { ro.disconnect(); });
    }
  }

  /* ---------- 10 footer ---------- */
  var RAIN = [['chili-a', 344, 83], ['chili-b', 71, 285], ['chili-c', 99, 262], ['green-chili', 340, 100], ['lemon-half', 182, 182], ['lemon-wedge', 213, 124],
    ['onion-ring', 207, 205], ['garlic-clove', 93, 145], ['coriander', 168, 215], ['star-anise', 154, 155], ['curry-leaf', 136, 260], ['chili-a', 344, 83]];
  function sEnd() {
    var sec = $('.s-end'); if (!sec) return;
    var shout = $('[data-end-shout]');
    if (shout) {
      var cs = splitChars(shout);
      fitText(shout, lang === 'mr' ? 0.3 : 0.42);
      gsap.from(cs, {
        yPercent: lang === 'mr' ? 150 : 122, rotation: function () { return rnd(-30, 30); }, duration: 1.2, stagger: 0.04, ease: 'elastic.out(1,0.5)',
        scrollTrigger: { trigger: shout, start: 'top 94%', once: true }
      });
    }
    gsap.from('.linkcard', { y: 50, rotation: -4, autoAlpha: 0, duration: 1, ease: 'back.out(1.5)', scrollTrigger: { trigger: '.linkcard', start: 'top 92%', once: true } });

    // ingredients drift down behind the text while the footer is on screen
    var box = $('[data-rain]'); if (!box) return;
    var small = isSmall(), N = small ? 8 : 15, rain = [];
    var W = function () { return box.offsetWidth; }, H = function () { return box.offsetHeight; };
    for (var i = 0; i < N; i++) {
      (function (i) {
        var meta = RAIN[i % RAIN.length], depth = rnd(0.5, 1.15);
        var wpx = meta[1] * (small ? 0.42 : 0.6) * depth * (window.innerWidth / 1440 * 0.6 + 0.5);
        var img = doc.createElement('img');
        img.src = 'assets/img/sprites/' + meta[0] + '.webp'; img.alt = ''; img.decoding = 'async';
        img.width = meta[1]; img.height = meta[2];
        img.style.width = Math.round(wpx) + 'px';
        if (depth < 0.72) { img.style.filter = 'blur(1.6px)'; img.style.opacity = '.75'; }
        box.appendChild(img);
        var tw = gsap.fromTo(img,
          { x: function () { return rnd(0, W()) - wpx / 2; }, y: -280, rotation: function () { return rnd(-180, 180); } },
          { x: '+=' + Math.round(rnd(-140, 140)), y: function () { return H() + 280; }, rotation: '+=' + Math.round(rnd(-320, 320)), duration: rnd(7, 12) / depth, ease: 'none', repeat: -1, repeatRefresh: true, paused: true });
        tw.progress(Math.random());
        rain.push(tw);
      })(i);
    }
    ScrollTrigger.create({
      trigger: sec, start: 'top bottom', end: 'bottom top',
      onToggle: function (self) { rain.forEach(function (t) { self.isActive ? t.play() : t.pause(); }); }
    });

    // tap = a handful of chillies
    on(sec, 'click', function (e) {
      if (e.target.closest('a,button')) return;
      var r = box.getBoundingClientRect(), x0 = e.clientX - r.left, y0 = e.clientY - r.top;
      for (var k = 0; k < 9; k++) {
        (function () {
          var meta = RAIN[[0, 1, 2, 3, 11][Math.floor(Math.random() * 5)]], w = meta[1] * rnd(0.3, 0.55);
          var img = doc.createElement('img');
          img.src = 'assets/img/sprites/' + meta[0] + '.webp'; img.alt = ''; img.style.width = Math.round(w) + 'px';
          box.appendChild(img);
          var vx = rnd(-320, 320), up = rnd(120, 340), spin = rnd(-540, 540);
          gsap.set(img, { x: x0 - w / 2, y: y0, scale: 0.3, rotation: rnd(-90, 90) });
          gsap.timeline({ onComplete: function () { img.remove(); } })
            .to(img, { x: '+=' + vx * 0.45, y: '-=' + up, scale: 1, rotation: '+=' + spin * 0.4, duration: 0.5, ease: 'power2.out' })
            .to(img, { x: '+=' + vx * 0.75, y: H() + 300, rotation: '+=' + spin, duration: rnd(1.2, 1.9), ease: 'power2.in' });
        })();
      }
    });
  }

  /* ---------- cursor, magnets, hover hops (bound once) ---------- */
  function initPointer() {
    if (!window.matchMedia || !matchMedia('(hover:hover) and (pointer:fine)').matches) return;
    root.classList.add('has-cursor');
    var c = $('.cursor'), label = $('.cursor__label');
    var qx = gsap.quickTo(c, 'x', { duration: 0.35, ease: 'power3' }), qy = gsap.quickTo(c, 'y', { duration: 0.35, ease: 'power3' });
    window.addEventListener('pointermove', function (e) { qx(e.clientX); qy(e.clientY); c.classList.add('is-on'); }, { passive: true });
    doc.addEventListener('pointerover', function (e) {
      var t = e.target.closest ? e.target.closest('[data-cursor],a,button') : null;
      var key = t && t.getAttribute('data-cursor');
      c.classList.toggle('is-label', !!key);
      c.classList.toggle('is-link', !!t && !key);
      if (key) label.textContent = (D().cursor && D().cursor[key]) || '';
    });
    root.addEventListener('mouseleave', function () { c.classList.remove('is-on'); });

    // letters hop when the pointer brushes them
    doc.addEventListener('pointerover', function (e) {
      var t = e.target;
      if (!t.classList || !t.classList.contains('c') || gsap.isTweening(t)) return;
      var em = parseFloat(getComputedStyle(t).fontSize) || 40;
      t.classList.add('is-hop');
      gsap.to(t, { y: -0.2 * em, duration: 0.2, ease: 'power2.out', yoyo: true, repeat: 1, onComplete: function () { t.classList.remove('is-hop'); } });
    });

    // buttons lean toward the pointer and spring back
    $$('[data-magnetic]').forEach(function (el) {
      el.addEventListener('pointermove', function (e) {
        var r = el.getBoundingClientRect();
        gsap.to(el, { x: (e.clientX - (r.left + r.width / 2)) * 0.28, y: (e.clientY - (r.top + r.height / 2)) * 0.32, duration: 0.4, ease: 'power3', overwrite: 'auto' });
      });
      el.addEventListener('pointerleave', function () { gsap.to(el, { x: 0, y: 0, duration: 0.9, ease: 'elastic.out(1,0.4)', overwrite: 'auto' }); });
    });
  }

  /* ---------- boot ---------- */
  function preload(onStep) {
    var imgs = $$('img[data-preload]'), total = imgs.length + 1, done = 0;
    var step = function () { done++; onStep(done / total); };
    var jobs = imgs.map(function (img) {
      var p = (img.complete && img.naturalWidth) ? Promise.resolve() : new Promise(function (r) {
        img.addEventListener('load', r, { once: true }); img.addEventListener('error', r, { once: true });
      });
      return p.then(function () { return img.decode ? img.decode().catch(function () {}) : null; }).then(step);
    });
    jobs.push(fontsFor(lang).then(function () { return doc.fonts && doc.fonts.ready; }).then(step, step));
    return Promise.race([Promise.all(jobs), wait(8000)]);
  }

  function boot() {
    gsap.registerPlugin(ScrollTrigger);
    ScrollTrigger.config({ ignoreMobileResize: true });
    root.classList.add('booted');
    harvest();
    applyConfig();
    applyLang();
    clockTicks();
    bindLang();
    injectSchema();

    if (Lenis) {
      lenis = new Lenis({ lerp: 0.09, wheelMultiplier: 0.95, touchMultiplier: 1.4 });
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add(function (t) { lenis.raf(t * 1000); });
      gsap.ticker.lagSmoothing(0);
      lenis.stop();
      window.__lenis = lenis;
    }
    window.scrollTo(0, 0);
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';

    // marquees speed up with the scroll and ease back
    gsap.ticker.add(function () {
      velCur += (velTarget - velCur) * 0.12;
      velTarget += (1 - velTarget) * 0.07;
      for (var i = 0; i < marquees.length; i++) marquees[i].tween.timeScale(velCur);
    });

    doc.addEventListener('click', function (e) {
      var a = e.target.closest ? e.target.closest('a[href^="#"]') : null; if (!a) return;
      var id = a.getAttribute('href'), target = id.length > 1 ? $(id) : null; if (!target) return;
      e.preventDefault();
      if (lenis) lenis.scrollTo(target, { duration: 1.6 }); else target.scrollIntoView({ behavior: 'smooth' });
    });

    initPointer();
    setInterval(renderStatus, 20000);
    setInterval(function () { renderClock(false); }, 1000);

    var lastW = window.innerWidth, wasSmall = isSmall(), rz;
    window.addEventListener('resize', function () {
      clearTimeout(rz);
      rz = setTimeout(function () {
        langUI();
        if (window.innerWidth === lastW) return;
        lastW = window.innerWidth;
        if (isSmall() !== wasSmall && !switching) {            // crossed the phone breakpoint: the scenes are built differently
          wasSmall = isSmall();
          var keep = anchor();
          teardown(); applyLang(); build(); ScrollTrigger.sort(); ScrollTrigger.refresh(); restore(keep);
          return;
        }
        setupMarquees();
        var shout = $('[data-end-shout]'); if (shout) fitText(shout, lang === 'mr' ? 0.3 : 0.42);
        ScrollTrigger.refresh();
      }, 250);
    });

    var intro = $('.intro'), bar = $('[data-intro-bar]'), seen = session.get('tc-seen');
    session.set('tc-seen', '1');
    var introLetters = splitLogo($('.intro__logo'));

    // two frames so the loader paints before the heavy lifting starts
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        Promise.all([preload(function (p) { if (bar) bar.style.transform = 'scaleX(' + p.toFixed(3) + ')'; }), wait(seen ? 700 : 2300)]).then(function () {
          build();
          ScrollTrigger.sort();
          ScrollTrigger.refresh();
          var hi = null;
          ctx.add(function () { hi = heroIntro(true, true); });

          var tl = gsap.timeline({
            onComplete: function () {
              if (intro) intro.style.display = 'none';
              if (lenis) lenis.start();
              var deep = location.hash.length > 1 ? $(location.hash) : null;
              if (deep && lenis) lenis.scrollTo(deep, { duration: 1.6 });
              // warm the other language so the switch is instant
              var idle = window.requestIdleCallback || function (f) { setTimeout(f, 1200); };
              idle(function () {
                fontsFor(lang === 'mr' ? 'en' : 'mr');
                // decode the gallery photos ahead of time so no card ever scrolls in blank
                $$('.card img').forEach(function (im) { if (im.decode) im.decode().catch(function () {}); });
              });
            }
          });
          tl.set(['.intro__logo', '.intro__go'], { visibility: 'visible' })
            .to('.intro__cover', { yPercent: -100, duration: 0.9, ease: 'expo.inOut' }, 0.1)
            .from(introLetters, { yPercent: -170, rotation: function () { return rnd(-25, 25); }, duration: 0.9, stagger: 0.07, ease: 'bounce.out' }, 0.5)
            .from('.intro__go', { y: 22, autoAlpha: 0, duration: 0.5, ease: 'back.out(2)' }, 1.1)
            .to('.intro__cols i', { yPercent: -101, duration: 1.1, stagger: 0.07, ease: 'expo.inOut' }, '+=0.4')
            .to(introLetters, { yPercent: -260, rotation: function () { return rnd(-24, 24); }, duration: 0.85, stagger: 0.05, ease: 'expo.in' }, '<')
            .to('.intro__go', { autoAlpha: 0, duration: 0.3 }, '<')
            .call(function () { if (hi) hi.play(); }, null, '<0.5');
        });
      });
    });
  }

  /* js/content.js is the single place to change the phone number and the links. */
  function applyConfig() {
    var L = cfg.links || {};
    $$('[data-link]').forEach(function (a) { var u = L[a.getAttribute('data-link')]; if (u) a.setAttribute('href', u); });
    if (cfg.phone) $$('a[href^="tel:"]').forEach(function (a) { a.setAttribute('href', 'tel:' + cfg.phone); });
    if (cfg.phoneDisplay) $$('[data-phone]').forEach(function (el) { el.textContent = cfg.phoneDisplay; });
  }

  function injectSchema() {
    try {
      var a = cfg.address || {}, s = doc.createElement('script');
      s.type = 'application/ld+json';
      s.textContent = JSON.stringify({
        '@context': 'https://schema.org', '@type': 'Restaurant', name: cfg.name, telephone: cfg.phone,
        servesCuisine: ['Kolhapuri', 'Maharashtrian', 'North Indian', 'Tandoori'],
        address: { '@type': 'PostalAddress', streetAddress: a.street, addressLocality: a.city, addressRegion: a.region, postalCode: a.postal, addressCountry: a.country },
        geo: cfg.geo ? { '@type': 'GeoCoordinates', latitude: cfg.geo.lat, longitude: cfg.geo.lng } : undefined,
        openingHoursSpecification: cfg.hours ? [{ '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'], opens: cfg.hours.open, closes: cfg.hours.close }] : undefined,
        hasMap: cfg.links && cfg.links.directions, sameAs: cfg.links && cfg.links.facebook ? [cfg.links.facebook] : undefined
      });
      doc.head.appendChild(s);
    } catch (e) { /* non-critical */ }
  }

  if (STATIC) {
    if (doc.readyState === 'loading') doc.addEventListener('DOMContentLoaded', staticInit); else staticInit();
  } else {
    if (doc.readyState === 'loading') doc.addEventListener('DOMContentLoaded', boot); else boot();
  }
})();
