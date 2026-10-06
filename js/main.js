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

  /* 4. Videos: carga diferida; el marco queda en blanco hasta que el video esté listo */
  const screens = $$('.browser__screen[data-video]');
  screens.forEach(box => { box._ready = false; });

  function loadVideo(box) {
    if (box._loading) return;
    box._loading = true;
    const v = document.createElement('video');
    v.muted = true; v.loop = true; v.playsInline = true; v.preload = 'metadata';
    v.setAttribute('muted', ''); v.setAttribute('playsinline', '');
    v.setAttribute('aria-label', 'Video de la funcionalidad');
    v.addEventListener('loadeddata', () => {
      box._ready = true; box.appendChild(v);
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
      const should = isActive && visible.has(box) && !reduce && !document.documentElement.classList.contains('lb-open');
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

  /* 6. Copiar el correo al portapapeles */
  $$('[data-copy]').forEach(btn => {
    const label = $('.copy__label', btn), original = label.textContent;
    btn.addEventListener('click', async () => {
      const text = btn.dataset.copy;
      let ok = false;
      try { await navigator.clipboard.writeText(text); ok = true; }
      catch (_) {
        const t = document.createElement('textarea');
        t.value = text; t.setAttribute('readonly', ''); t.style.cssText = 'position:fixed;opacity:0';
        document.body.appendChild(t); t.select();
        try { ok = document.execCommand('copy'); } catch (_) {}
        t.remove();
      }
      label.textContent = ok ? 'Correo copiado' : text;
      btn.classList.toggle('is-copied', ok);
      clearTimeout(btn._t);
      btn._t = setTimeout(() => { label.textContent = original; btn.classList.remove('is-copied'); }, 2200);
    });
  });

  /* 7. Ampliar cualquier pantalla del carrusel (videos y capturas) */
  const lb = document.createElement('div');
  lb.className = 'lb'; lb.hidden = true;
  lb.setAttribute('role', 'dialog'); lb.setAttribute('aria-modal', 'true'); lb.setAttribute('aria-label', 'Vista ampliada');
  lb.innerHTML = '<button class="lb__close" type="button" aria-label="Cerrar vista ampliada"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg></button><div class="lb__body"></div><p class="lb__cap"></p>';
  document.body.appendChild(lb);
  const lbBody = $('.lb__body', lb), lbCap = $('.lb__cap', lb), lbClose = $('.lb__close', lb);
  let lbFrom = null;

  function openLightbox(box, trigger) {
    lbBody.innerHTML = '';
    const slide = box.closest('.slide');
    lbCap.textContent = slide ? ($('h3', slide)?.textContent || '') : '';
    if (box.dataset.video) {
      const v = document.createElement('video');
      v.src = box.dataset.video; v.controls = true; v.autoplay = true; v.loop = true; v.muted = true; v.playsInline = true;
      v.setAttribute('playsinline', '');
      lbBody.className = 'lb__body lb__body--video';
      lbBody.appendChild(v);
      v.play().catch(() => {});
    } else {
      const src = $('img', box);
      const im = document.createElement('img');
      im.src = src.currentSrc || src.src; im.alt = src.alt;
      lbBody.className = 'lb__body lb__body--img';
      lbBody.appendChild(im);
    }
    lbFrom = trigger;
    lb.hidden = false;
    document.documentElement.classList.add('lb-open');
    lbClose.focus();
    syncPlayback();
  }
  function closeLightbox() {
    if (lb.hidden) return;
    lb.hidden = true;
    lbBody.innerHTML = '';
    document.documentElement.classList.remove('lb-open');
    if (lbFrom) lbFrom.focus();
    syncPlayback();
  }
  lbClose.addEventListener('click', closeLightbox);
  lb.addEventListener('click', (e) => { if (e.target === lb || e.target === lbBody) closeLightbox(); });
  addEventListener('keydown', (e) => { if (e.key === 'Escape') closeLightbox(); });

  $$('.slide .browser__screen').forEach(box => {
    const b = document.createElement('button');
    b.className = 'expand'; b.type = 'button'; b.textContent = 'Ampliar';
    b.setAttribute('aria-label', 'Ampliar ' + ($('h3', box.closest('.slide'))?.textContent || 'pantalla'));
    b.addEventListener('click', () => openLightbox(box, b));
    box.appendChild(b);
  });
})();
