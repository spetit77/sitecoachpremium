/* ===== CONFIGURATION ===== */
const CONFIG = {
  YOUTUBE_ID: '',              // ex : 'dQw4w9WgXcQ' : affiche un bouton « Voir la vidéo » sur la photo du hero
  INSTAGRAM_URL: '',           // ex : 'https://instagram.com/tonpseudo'
  HERO_PHOTO: '',              // ex : 'photos/steven-hero.jpg' (portrait, format 4:5 conseillé)
  COACH_PHOTO: '',             // ex : 'photos/steven-coach.jpg'
  SUBMIT_URL: '/',             // Netlify Forms : Netlify > Forms > candidature
  THANKS_URL: 'merci.html',    // page de réservation Cal.com après envoi
};

/* Remplace ces exemples par les vrais résultats de tes élèves (avec leur accord),
   puis passe example à false. Photos : mets le chemin dans before / after (ex : 'photos/eleve1-avant.jpg'). */
const CASES = [
  { name: 'Élève 1', meta: '29 ans · femme', tag: 'Silhouette affinée', story: 'Décris son point de départ : son objectif, ce qui la bloquait, ce qu\'elle avait déjà essayé.', result: '−8 cm', resultNote: 'de tour de taille en 4 mois', before: '', after: '', example: true },
  { name: 'Élève 2', meta: '33 ans · homme', tag: '+5 kg de muscle', story: 'Une prise de muscle sans reprendre de gras. Précise son niveau de départ et ce qu\'on a changé.', result: '+5 kg', resultNote: 'de muscle en 6 mois', before: '', after: '', example: true },
  { name: 'Élève 3', meta: '41 ans · femme', tag: 'Recomposition', story: 'Un poids presque stable, mais un corps qui change : moins de gras, des jambes et des fessiers galbés.', result: '−4 kg', resultNote: 'de gras en 5 mois', before: '', after: '', example: true },
  { name: 'Élève 4', meta: '36 ans · homme', tag: 'Abdos visibles', story: 'Une sèche complète avec un emploi du temps chargé. Raconte ce qui a fait la différence pour lui.', result: '−10 kg', resultNote: 'en 4 mois, abdos visibles', before: '', after: '', example: true },
];
const TRANSFORMATIONS = Array.from({ length: 4 }, (_, i) => ({ label: 'Transformation ' + (i + 1), img: '' }));
const REVIEWS = [
  { text: 'Colle ici le message d\'un élève : capture WhatsApp, avis Google, retour après un bilan.', name: 'Élève 1', meta: 'Accompagné en 2026', example: true },
  { text: 'Un avis court et concret fonctionne mieux qu\'un long paragraphe. Garde ses propres mots.', name: 'Élève 2', meta: 'Accompagné en 2026', example: true },
  { text: 'Idéalement, un avis qui parle d\'autre chose que du poids : confiance, énergie, vêtements qui tombent mieux.', name: 'Élève 3', meta: 'Accompagné en 2025', example: true },
  { text: 'Pense à demander l\'accord de chaque élève avant de publier son avis ou ses photos.', name: 'Élève 4', meta: 'Accompagné en 2025', example: true },
];

/* ===== OUTILS ===== */
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const store = {
  get(k) { try { return sessionStorage.getItem(k); } catch (e) { return null; } },
  set(k, v) { try { sessionStorage.setItem(k, v); } catch (e) {} },
  del(k) { try { sessionStorage.removeItem(k); } catch (e) {} },
};
const photo = (src, label) => `<div class="photo">${src ? `<img src="${esc(src)}" alt="${esc(label)}" loading="lazy">` : `<i class="ph ph-image"></i>${esc(label)}`}</div>`;
const exampleTag = item => item.example ? '<span class="tag example">Exemple à remplacer</span>' : '';

/* ===== CONTENUS ===== */
$('#casesTrack').innerHTML = CASES.map(c => `
  <article class="card case">
    <div class="case-head"><div><h3 class="h3">${esc(c.name)}</h3><span class="small">${esc(c.meta)}</span></div><span class="tag">${esc(c.tag)}</span></div>
    <div class="photos">${photo(c.before, 'Avant')}${photo(c.after, 'Après')}</div>
    <p>${esc(c.story)}</p>
    ${exampleTag(c)}
    <div class="result"><strong>${esc(c.result)}</strong><span>${esc(c.resultNote)}</span></div>
  </article>`).join('');

$('#gallery').innerHTML = TRANSFORMATIONS.map(t => `
  <figure class="photo">${t.img ? `<img src="${esc(t.img)}" alt="${esc(t.label)}" loading="lazy">` : '<i class="ph ph-image"></i>Photo à ajouter'}<figcaption>${esc(t.label)}</figcaption></figure>`).join('');

$('#reviewsTrack').innerHTML = REVIEWS.map(r => `
  <article class="card review">
    <blockquote>${esc(r.text)}</blockquote>
    ${exampleTag(r)}
    <div class="who"><span class="avatar">${esc(r.name.charAt(0))}</span><div><strong>${esc(r.name)}</strong><span>${esc(r.meta)}</span></div></div>
  </article>`).join('');

/* Photos du coach : remplacent les emplacements dès qu'un chemin est renseigné */
const setPhoto = (box, src, alt) => {
  if (!src) return;
  const img = new Image();
  img.className = 'photo-img'; img.alt = alt; img.src = src;
  img.onload = () => { $('.placeholder', box)?.remove(); box.prepend(img); };
};
setPhoto($('#heroPortrait'), CONFIG.HERO_PHOTO, 'Steven, coach sportif');
setPhoto($('#coachVisual'), CONFIG.COACH_PHOTO, 'Steven pendant une séance de coaching');

/* Vidéo : bouton sur le portrait, chargée seulement au clic */
if (CONFIG.YOUTUBE_ID) {
  const box = $('#heroPortrait');
  const btn = document.createElement('button');
  btn.type = 'button'; btn.className = 'play';
  btn.innerHTML = '<i class="ph-fill ph-play"></i>Voir la vidéo · 5 min';
  btn.addEventListener('click', () => {
    const iframe = document.createElement('iframe');
    iframe.src = `https://www.youtube-nocookie.com/embed/${encodeURIComponent(CONFIG.YOUTUBE_ID)}?autoplay=1&rel=0&playsinline=1`;
    iframe.title = 'Vidéo de présentation de Steven Coaching';
    iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
    iframe.allowFullscreen = true;
    box.appendChild(iframe); btn.remove();
  });
  box.appendChild(btn);
}

/* ===== NAVIGATION ===== */
(() => {
  const toggle = $('#navToggle'), menu = $('#mobileMenu');
  const links = $$('a', menu);
  const setOpen = open => {
    document.body.classList.toggle('menu-open', open);
    toggle.setAttribute('aria-expanded', open);
    toggle.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
    menu.setAttribute('aria-hidden', !open);
    links.forEach((a, i) => a.style.transitionDelay = open ? Math.min(i * 60, 300) + 'ms' : '0ms');
  };
  toggle.addEventListener('click', () => setOpen(!document.body.classList.contains('menu-open')));
  links.forEach(a => a.addEventListener('click', () => setOpen(false)));
  addEventListener('keydown', e => { if (e.key === 'Escape') setOpen(false); });

  const onScroll = () => document.body.classList.toggle('scrolled', scrollY > 24);
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  const navLinks = $$('.nav-links a');

  /* pastille qui glisse sous le lien survolé ou actif */
  const ul = $('.nav-links');
  const pill = document.createElement('li');
  pill.className = 'nav-pill'; pill.setAttribute('aria-hidden', 'true');
  ul.prepend(pill); ul.classList.add('has-pill');
  let hovering = false;
  const moveTo = a => {
    if (!a) { pill.classList.remove('on'); return; }
    if (!pill.classList.contains('on')) {
      pill.style.transition = 'none';
      requestAnimationFrame(() => { pill.style.transition = ''; });
    }
    pill.style.width = a.offsetWidth + 'px';
    pill.style.transform = `translateX(${a.parentElement.offsetLeft}px)`;
    pill.classList.add('on');
  };
  ul.addEventListener('pointerover', e => { const a = e.target.closest('a'); if (a) { hovering = true; moveTo(a); } });
  ul.addEventListener('pointerleave', () => { hovering = false; moveTo($('a.is-active', ul)); });

  const spy = new IntersectionObserver(entries => entries.forEach(en => {
    if (!en.isIntersecting) return;
    navLinks.forEach(a => a.classList.toggle('is-active', a.getAttribute('href') === '#' + en.target.id));
    if (!hovering) moveTo($('a.is-active', ul));
  }), { rootMargin: '-45% 0px -50% 0px' });
  navLinks.forEach(a => { const s = $(a.getAttribute('href')); if (s) spy.observe(s); });
})();

/* ===== CARROUSELS ===== */
$$('[data-carousel]').forEach(car => {
  const track = $('.track', car), items = [...track.children];
  const prev = $('[data-prev]', car), next = $('[data-next]', car), dots = $('[data-dots]', car);
  dots.innerHTML = items.map(() => '<i></i>').join('');
  const step = () => (items[0]?.offsetWidth || 300) + 16;
  prev.addEventListener('click', () => track.scrollBy({ left: -step(), behavior: 'smooth' }));
  next.addEventListener('click', () => track.scrollBy({ left: step(), behavior: 'smooth' }));
  let ticking = false;
  const update = () => {
    ticking = false;
    const max = track.scrollWidth - track.clientWidth - 2;
    prev.disabled = track.scrollLeft <= 2;
    next.disabled = track.scrollLeft >= max;
    const idx = track.scrollLeft >= max ? items.length - 1 : Math.round(track.scrollLeft / step());
    [...dots.children].forEach((d, i) => d.classList.toggle('on', i === idx));
  };
  track.addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
  addEventListener('resize', update);
  update();
  let down = false, startX = 0, startLeft = 0, moved = false;
  track.addEventListener('mousedown', e => { down = true; moved = false; startX = e.pageX; startLeft = track.scrollLeft; track.classList.add('dragging'); });
  addEventListener('mousemove', e => { if (!down) return; const dx = e.pageX - startX; if (Math.abs(dx) > 4) moved = true; track.scrollLeft = startLeft - dx; });
  addEventListener('mouseup', () => {
    if (!down) return;
    down = false; track.classList.remove('dragging');
    track.scrollTo({ left: Math.round(track.scrollLeft / step()) * step(), behavior: 'smooth' });
  });
  track.addEventListener('click', e => { if (moved) { e.preventDefault(); e.stopPropagation(); } }, true);
});

/* ===== QUESTIONNAIRE : fenêtre + 8 étapes ===== */
const quiz = (() => {
  const modal = $('#postuler');
  const form = $('#applyForm');
  const steps = $$('.step', form);
  const total = steps.length;
  const segs = $$('#segments i'), count = $('#stepCount'), hint = $('#stepHint'), formError = $('#formError');
  let cur = 0, opener = null;

  /* ouverture / fermeture */
  const open = () => {
    if (modal.open) return;
    opener = document.activeElement;
    document.documentElement.classList.add('modal-open');
    modal.showModal();
    history.replaceState(null, '', '#postuler');
    focusStep();
  };
  const close = () => { if (modal.open) modal.close(); };
  modal.addEventListener('close', () => {
    document.documentElement.classList.remove('modal-open');
    if (location.hash === '#postuler') history.replaceState(null, '', location.pathname + location.search);
    opener?.focus?.({ preventScroll: true });
  });
  $('#quizClose').addEventListener('click', close);
  modal.addEventListener('click', e => { if (e.target === modal) close(); });   // clic sur le fond
  document.addEventListener('click', e => {
    const a = e.target.closest('a[href="#postuler"], a[href$="/#postuler"]');
    if (!a) return;
    e.preventDefault();
    open();
  });

  /* validation */
  const messages = {
    valueMissing: 'Ce champ est obligatoire.',
    typeMismatch: 'Adresse email invalide. Exemple : prenom@exemple.fr',
    patternMismatch: 'Numéro invalide. Saisis au moins 8 chiffres.',
    rangeUnderflow: 'Valeur trop basse.',
    rangeOverflow: 'Valeur trop haute.',
  };
  const errorFor = f => { for (const k in messages) if (f.validity[k]) return messages[k]; return f.validity.valid ? '' : 'Valeur invalide.'; };
  const setFieldError = (f, msg) => {
    f.classList.toggle('invalid', !!msg);
    f.setAttribute('aria-invalid', !!msg);
    const slot = f.parentElement.querySelector('.field-error');
    if (slot) slot.textContent = msg;
  };

  const focusStep = () => {
    const s = steps[cur];
    const target = $('input:checked', s) || $('input:not([type=hidden])', s);
    // sur mobile, on évite d'ouvrir le clavier automatiquement
    if (target && (target.type === 'radio' || matchMedia('(min-width: 768px)').matches)) target.focus({ preventScroll: true });
    else $('legend', s)?.focus?.();
  };

  const show = (i, dir = 1) => {
    cur = i;
    steps.forEach((s, k) => { s.hidden = k !== i; s.classList.toggle('back', dir < 0); });
    segs.forEach((g, k) => { g.classList.toggle('done', k < i); g.classList.toggle('cur', k === i); });
    count.textContent = `Étape ${i + 1} sur ${total}`;
    hint.textContent = $('input[type=radio]', steps[i]) ? 'Choisis une réponse' : 'Complète les champs';
    formError.textContent = '';
    $('.quiz-inner', modal).scrollTop = 0;
    if (modal.open) focusStep();
    store.set('quizStep', i);
  };

  const validate = i => {
    const fields = $$('input', steps[i]);
    const radios = fields.filter(f => f.type === 'radio');
    if (radios.length && !radios.some(r => r.checked)) { formError.textContent = 'Choisis une réponse pour continuer.'; return false; }
    let ok = true;
    fields.filter(f => f.type !== 'radio').forEach(f => {
      if (f.type === 'checkbox') { if (!f.checked && f.required) { ok = false; formError.textContent = 'Coche la case de consentement pour continuer.'; } return; }
      if (f.required && !f.value.trim()) f.value = '';
      const msg = errorFor(f);
      setFieldError(f, msg);
      if (msg) ok = false;
    });
    if (!ok && !formError.textContent) formError.textContent = 'Corrige les champs signalés pour continuer.';
    return ok;
  };

  const save = () => store.set('quizData', JSON.stringify(Object.fromEntries(new FormData(form))));

  form.addEventListener('change', e => {
    save();
    if (e.target.type === 'radio') setTimeout(() => { if (validate(cur) && cur < total - 1) show(cur + 1); }, 320);
  });
  form.addEventListener('input', e => { save(); if (e.target.classList.contains('invalid')) setFieldError(e.target, errorFor(e.target)); });
  form.addEventListener('focusout', e => { if (e.target.matches('.field input') && e.target.value) setFieldError(e.target, errorFor(e.target)); });
  $$('.step-back', form).forEach(b => b.addEventListener('click', () => show(Math.max(0, cur - 1), -1)));
  $$('.step-next', form).forEach(b => b.addEventListener('click', () => { if (validate(cur)) show(cur + 1); }));
  form.addEventListener('keydown', e => {
    if (e.key === 'Enter' && e.target.matches('.field input') && cur < total - 1) { e.preventDefault(); if (validate(cur)) show(cur + 1); }
  });
  // raccourcis clavier A, B, C, D sur les étapes à choix
  modal.addEventListener('keydown', e => {
    if (e.ctrlKey || e.metaKey || e.altKey || e.target.matches('input:not([type=radio])')) return;
    const k = e.key.toUpperCase();
    if (!/^[A-D]$/.test(k)) return;
    const radio = $$('input[type=radio]', steps[cur])[k.charCodeAt(0) - 65];
    if (radio) { radio.checked = true; radio.dispatchEvent(new Event('change', { bubbles: true })); }
  });

  // reprise d'un brouillon
  try {
    const data = JSON.parse(store.get('quizData') || '{}');
    Object.entries(data).forEach(([k, v]) => {
      const el = form.elements[k];
      if (!el || k === 'form-name') return;
      if (el instanceof RadioNodeList) [...el].forEach(r => r.checked = r.value === v);
      else if (el.type === 'checkbox') el.checked = v === 'on';
      else el.value = v;
    });
  } catch (e) {}
  const saved = parseInt(store.get('quizStep'), 10);
  show(Number.isInteger(saved) && saved < total ? saved : 0);

  form.addEventListener('submit', async e => {
    e.preventDefault();
    if (!validate(cur)) return;
    const btn = $('#submitBtn'), label = $('span', btn), icon = $('i', btn);
    const data = Object.fromEntries(new FormData(form));
    btn.classList.add('is-loading');
    label.textContent = 'Envoi en cours';
    icon.className = 'ph ph-circle-notch';
    formError.textContent = '';
    try {
      // en local, aucun serveur ne reçoit le formulaire : on passe directement à la suite
      const local = location.protocol === 'file:' || ['localhost', '127.0.0.1'].includes(location.hostname) || !CONFIG.SUBMIT_URL;
      if (!local) {
        const res = await fetch(CONFIG.SUBMIT_URL, { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams(data).toString() });
        if (!res.ok) throw new Error('HTTP ' + res.status);
      }
      store.del('quizData'); store.del('quizStep');
      // repris par merci.html pour préremplir la réservation Cal.com
      store.set('leadFirstName', data.firstName);
      store.set('leadName', `${data.firstName} ${data.lastName}`.trim());
      store.set('leadEmail', data.email);
      location.href = CONFIG.THANKS_URL;
    } catch (ex) {
      formError.textContent = "L'envoi a échoué. Vérifie ta connexion et réessaie.";
      btn.classList.remove('is-loading');
      label.textContent = 'Choisir mon créneau';
      icon.className = 'ph ph-arrow-right';
    }
  });

  // lien direct vers /#postuler (depuis la page 404, une story Instagram…)
  if (location.hash === '#postuler') open();
  return { open, isOpen: () => modal.open };
})();

/* ===== BOUTON FLOTTANT ===== */
(() => {
  const fab = $('#fab');
  let heroVisible = true, finalVisible = false;
  const sync = () => fab.classList.toggle('show', !heroVisible && !finalVisible);
  const watch = (el, set) => new IntersectionObserver(([en]) => { set(en.isIntersecting); sync(); }, { threshold: .15 }).observe(el);
  watch($('.hero-actions'), v => heroVisible = v);
  watch($('.final-box'), v => finalVisible = v);
})();

/* ===== PHRASE RÉVÉLÉE MOT À MOT ===== */
(() => {
  const p = $('#tagline');
  const wrap = (node, accent) => node.textContent.split(/(\s+)/).map(w => w.trim() ? `<span class="w${accent ? ' accent' : ''}">${esc(w)}</span>` : w).join('');
  p.innerHTML = [...p.childNodes].map(n => n.nodeType === 3 ? wrap(n, false) : wrap(n, true)).join('');
  const words = $$('.w', p);
  if (reduced) { words.forEach(w => w.classList.add('on')); return; }
  const io = new IntersectionObserver(entries => entries.forEach(en => {
    if (en.isIntersecting) { en.target.classList.add('on'); io.unobserve(en.target); }
  }), { rootMargin: '0px 0px -40% 0px' });
  words.forEach(w => io.observe(w));
})();

/* ===== APPARITIONS, SURLIGNEUR ET COMPTEURS ===== */
const revealer = new IntersectionObserver(entries => entries.forEach(en => {
  if (en.isIntersecting) { en.target.classList.add('in'); revealer.unobserve(en.target); }
}), { threshold: .12 });
$$('.reveal, .reveal-group').forEach(el => revealer.observe(el));
$$('.mark').forEach(m => m.classList.add('on'));

const counter = new IntersectionObserver(entries => entries.forEach(en => {
  if (!en.isIntersecting) return;
  const el = en.target, target = +el.dataset.countup, suffix = el.dataset.suffix || '';
  counter.unobserve(el);
  if (reduced) { el.textContent = target + suffix; return; }
  const t0 = performance.now(), dur = 1600;
  const tick = t => {
    const p = Math.min(1, (t - t0) / dur);
    el.textContent = Math.round(target * (1 - Math.pow(1 - p, 4))) + suffix;
    if (p < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}), { threshold: .6 });
$$('[data-countup]').forEach(el => counter.observe(el));

/* ===== INTERACTIONS ===== */
const finePointer = matchMedia('(hover: hover) and (pointer: fine)').matches;
const EASE = 'cubic-bezier(.22, 1, .36, 1)';

/* Barre de progression de lecture */
(() => {
  const bar = document.createElement('div');
  bar.className = 'scroll-progress'; bar.setAttribute('aria-hidden', 'true');
  document.body.append(bar);
  let ticking = false;
  const update = () => {
    ticking = false;
    const max = document.documentElement.scrollHeight - innerHeight;
    bar.style.transform = `scaleX(${max > 0 ? Math.min(1, scrollY / max) : 0})`;
  };
  addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
  addEventListener('resize', update);
  update();
})();

/* Bande des points forts : avance avec le défilement de la page */
if (!reduced) (() => {
  const strip = $('.strip'), track = $('.strip-track');
  if (!strip || !track) return;
  const set = track.innerHTML;
  track.innerHTML = set + set + set;   // trois copies pour couvrir les grands écrans
  strip.classList.add('is-marquee');
  let width = track.scrollWidth / 3, ticking = false;
  const update = () => {
    ticking = false;
    const x = (scrollY * .4) % width;
    track.style.transform = `translate3d(${-x.toFixed(1)}px, 0, 0)`;
  };
  addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
  addEventListener('resize', () => { width = track.scrollWidth / 3; update(); });
  document.fonts?.ready.then(() => { width = track.scrollWidth / 3; update(); });
  update();
})();

/* Curseur personnalisé : point exact + anneau qui suit, souris uniquement */
if (finePointer && !reduced) (() => {
  const dot = document.createElement('div'), ring = document.createElement('div');
  dot.className = 'cursor-dot'; ring.className = 'cursor-ring';
  ring.innerHTML = '<span class="cursor-label"></span>';
  [dot, ring].forEach(el => { el.setAttribute('aria-hidden', 'true'); document.body.append(el); });
  const label = $('.cursor-label', ring);
  const root = document.documentElement;
  root.classList.add('has-cursor');

  let x = -100, y = -100, rx = x, ry = y, shown = false;
  addEventListener('pointermove', e => {
    if (e.pointerType !== 'mouse') return;
    x = e.clientX; y = e.clientY;
    if (!shown) { shown = true; rx = x; ry = y; root.classList.add('cursor-on'); }
  }, { passive: true });
  root.addEventListener('mouseleave', () => { shown = false; root.classList.remove('cursor-on'); });

  const loop = () => {
    rx += (x - rx) * .18; ry += (y - ry) * .18;
    dot.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    ring.style.transform = `translate3d(${rx}px, ${ry}px, 0)`;
    requestAnimationFrame(loop);
  };
  requestAnimationFrame(loop);

  const DARK = '.dark-section, .feature.dark, .btn-primary, .nav-toggle, .fab-arrow, .portrait, .icon-btn:hover';
  document.addEventListener('pointerover', e => {
    const t = e.target;
    const labelled = t.closest('[data-cursor]');
    const link = t.closest('a, button, summary, label.opt, .opt, input[type=checkbox]');
    root.classList.toggle('cursor-label-on', !!labelled && !link);
    root.classList.toggle('cursor-link', !!link);
    root.classList.toggle('cursor-dark', !!t.closest(DARK));
    label.textContent = labelled && !link ? labelled.dataset.cursor : '';
  });
  addEventListener('pointerdown', () => root.classList.add('cursor-down'));
  addEventListener('pointerup', () => root.classList.remove('cursor-down'));
})();

/* Boutons magnétiques : ils suivent légèrement la souris */
if (finePointer && !reduced) {
  $$('.btn-primary, .btn-yellow, .btn-secondary, .icon-btn, .nav-toggle').filter(el => !el.closest('dialog')).forEach(el => {
    el.classList.add('magnetic');
    el.addEventListener('pointermove', e => {
      const r = el.getBoundingClientRect();
      const nx = (e.clientX - (r.left + r.width / 2)) / (r.width / 2);
      const ny = (e.clientY - (r.top + r.height / 2)) / (r.height / 2);
      el.style.setProperty('--mx', (nx * 6).toFixed(1) + 'px');
      el.style.setProperty('--my', (ny * 4).toFixed(1) + 'px');
    });
    el.addEventListener('pointerleave', () => { el.style.setProperty('--mx', '0px'); el.style.setProperty('--my', '0px'); });
  });
}

/* Hero : le portrait s'incline et la fiche de bilan se décale avec la souris */
if (finePointer && !reduced) (() => {
  const zone = $('.hero'), portrait = $('#heroPortrait'), card = $('.checkin');
  if (!zone || !portrait) return;
  zone.addEventListener('pointermove', e => {
    const r = portrait.getBoundingClientRect();
    const px = Math.max(-1, Math.min(1, (e.clientX - (r.left + r.width / 2)) / innerWidth * 2));
    const py = Math.max(-1, Math.min(1, (e.clientY - (r.top + r.height / 2)) / innerHeight * 2));
    portrait.style.transform = `perspective(1200px) rotateY(${(px * 4).toFixed(2)}deg) rotateX(${(-py * 4).toFixed(2)}deg)`;
    if (card) card.style.translate = `${(px * -14).toFixed(1)}px ${(py * -10).toFixed(1)}px`;
  });
  zone.addEventListener('pointerleave', () => { portrait.style.transform = ''; if (card) card.style.translate = ''; });
})();

/* Titres de section révélés mot à mot */
if (!reduced) (() => {
  const split = el => {
    let i = 0;
    const walk = node => [...node.childNodes].forEach(n => {
      if (n.nodeType === 3) {
        const frag = document.createDocumentFragment();
        n.textContent.split(/(\s+)/).forEach(part => {
          if (!part) return;
          if (/^\s+$/.test(part)) { frag.append(part); return; }
          const outer = document.createElement('span'), inner = document.createElement('span');
          outer.className = 'wd'; inner.textContent = part;
          inner.style.transitionDelay = Math.min(i++ * 45, 630) + 'ms';
          outer.append(inner); frag.append(outer);
        });
        n.replaceWith(frag);
      } else if (n.nodeType === 1 && n.tagName !== 'BR') walk(n);
    });
    walk(el);
  };
  const io = new IntersectionObserver(entries => entries.forEach(en => {
    if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
  }), { threshold: .4 });
  $$('.h2').forEach(h => { split(h); h.classList.add('split'); io.observe(h); });
})();

/* FAQ : la réponse glisse et apparaît (transform et opacity uniquement) */
$$('.faq-item').forEach(d => {
  const summary = $('summary', d), p = $('p', d);
  const body = document.createElement('div');
  body.className = 'faq-body'; p.replaceWith(body); body.append(p);
  if (reduced) return;
  summary.addEventListener('click', e => {
    e.preventDefault();
    if (d.classList.contains('animating')) return;
    d.classList.add('animating');
    if (d.open) {
      d.classList.add('closing');
      body.animate([{ opacity: 1, transform: 'none' }, { opacity: 0, transform: 'translateY(-8px)' }], { duration: 300, easing: EASE })
        .onfinish = () => { d.open = false; d.classList.remove('closing', 'animating'); };
    } else {
      d.open = true;
      body.animate([{ opacity: 0, transform: 'translateY(-8px)' }, { opacity: 1, transform: 'none' }], { duration: 500, easing: EASE })
        .onfinish = () => d.classList.remove('animating');
    }
  });
});

/* ===== DIVERS ===== */
$('#year').textContent = new Date().getFullYear();
if (CONFIG.INSTAGRAM_URL) { const a = $('#instagramLink'); a.href = CONFIG.INSTAGRAM_URL; a.hidden = false; }
