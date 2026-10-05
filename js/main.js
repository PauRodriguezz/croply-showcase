/* Croply · Showcase — interacciones y animaciones (sin dependencias) */
(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  /* 1. Aparición al hacer scroll */
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { threshold: 0.18, rootMargin: '0px 0px -6% 0px' });
  $$('.reveal').forEach(el => io.observe(el));
  const tl = $('#tl'); if (tl) io.observe(tl);

  /* 2. Contadores */
  const countIO = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      countIO.unobserve(e.target);
      $$('[data-count]', e.target).forEach(n => {
        const end = +n.dataset.count;
        if (reduce) { n.textContent = end; return; }
        const t0 = performance.now(), dur = 1400;
        const tick = (t) => {
          const p = Math.min(1, (t - t0) / dur), eased = 1 - Math.pow(1 - p, 3);
          n.textContent = Math.round(end * eased);
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      });
    });
  }, { threshold: 0.4 });
  $$('.stats').forEach(el => countIO.observe(el));

  /* 3. Huellas: progreso de scroll */
  const steps = $('.steps');
  if (steps && !reduce) {
    let ticking = false;
    const update = () => {
      const max = document.documentElement.scrollHeight - innerHeight;
      const p = max > 0 ? Math.min(1, Math.max(0, scrollY / max)) : 0;
      steps.style.setProperty('--p', (0.04 + p * 0.96).toFixed(4));
      ticking = false;
    };
    addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
    addEventListener('resize', update);
    update();
  }

  /* 4. Videos: marco con aviso si todavía no existe el archivo */
  const playIcon = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><circle cx="12" cy="12" r="11" opacity=".18"/><path d="M10 8.2v7.6L16.2 12z"/></svg>';
  const screens = $$('.browser__screen[data-video]');
  screens.forEach(box => {
    const ph = document.createElement('div');
    ph.className = 'ph';
    ph.innerHTML = playIcon + '<span>Video próximamente</span><small>' + box.dataset.label + '</small>';
    box.appendChild(ph);
    box._ready = false;
  });

  function loadVideo(box) {
    if (box._loading) return;
    box._loading = true;
    const v = document.createElement('video');
    v.muted = true; v.loop = true; v.playsInline = true; v.preload = 'metadata';
    v.setAttribute('muted', ''); v.setAttribute('playsinline', '');
    v.setAttribute('aria-label', 'Video de la funcionalidad');
    v.addEventListener('loadeddata', () => {
      box._ready = true; $('.ph', box)?.remove(); box.appendChild(v);
      const b = document.createElement('button');
      b.className = 'expand'; b.type = 'button'; b.textContent = 'Ampliar';
      b.addEventListener('click', () => {
        (v.requestFullscreen || v.webkitRequestFullscreen || v.webkitEnterFullscreen || (() => {})).call(v);
        v.play().catch(() => {});
      });
      box.appendChild(b);
      box._video = v;
      syncPlayback();
    }, { once: true });
    v.src = box.dataset.video;
  }

  const lazy = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { loadVideo(e.target); lazy.unobserve(e.target); } });
  }, { rootMargin: '400px' });
  screens.forEach(b => (b.hasAttribute('data-autoplay') ? loadVideo(b) : lazy.observe(b)));

  /* reproducir solo lo visible (y solo la diapositiva activa del carrusel) */
  const visible = new Set();
  const vis = new IntersectionObserver((entries) => {
    entries.forEach(e => { e.isIntersecting ? visible.add(e.target) : visible.delete(e.target); });
    syncPlayback();
  }, { threshold: 0.45 });
  screens.forEach(b => vis.observe(b));

  let current = 0;
  function syncPlayback() {
    screens.forEach(box => {
      const v = box._video; if (!v) return;
      const slide = box.closest('.slide');
      const isActive = !slide || slide === $$('.slide')[current];
      const should = isActive && visible.has(box) && !reduce;
      if (should) v.play().catch(() => {}); else v.pause();
    });
  }

  /* 5. Carrusel */
  const car = $('#carousel');
  if (car) {
    const track = $('.carousel__track', car), slides = $$('.slide', car);
    const dotsBox = $('#dots'), prev = $('#prev'), next = $('#next');
    const dots = slides.map((s, i) => {
      const b = document.createElement('button');
      b.type = 'button'; b.setAttribute('role', 'tab'); b.setAttribute('aria-label', 'Ir a: ' + $('h3', s).textContent);
      b.addEventListener('click', () => go(i));
      dotsBox.appendChild(b); return b;
    });
    function go(i) {
      current = (i + slides.length) % slides.length;
      track.style.transform = 'translateX(' + (-current * 100) + '%)';
      dots.forEach((d, k) => d.setAttribute('aria-selected', String(k === current)));
      slides.forEach((s, k) => s.setAttribute('aria-hidden', String(k !== current)));
      const box = $('.browser__screen[data-video]', slides[current]); if (box) loadVideo(box);
      syncPlayback();
    }
    prev.addEventListener('click', () => go(current - 1));
    next.addEventListener('click', () => go(current + 1));
    car.tabIndex = 0;
    car.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') go(current - 1);
      if (e.key === 'ArrowRight') go(current + 1);
    });
    let x0 = null;
    const vp = $('.carousel__viewport', car);
    vp.addEventListener('pointerdown', (e) => { x0 = e.clientX; });
    vp.addEventListener('pointerup', (e) => {
      if (x0 === null) return;
      const dx = e.clientX - x0; x0 = null;
      if (Math.abs(dx) > 50) go(current + (dx < 0 ? 1 : -1));
    });
    go(0);
  }
})();
