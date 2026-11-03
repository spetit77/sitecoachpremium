/* ===== CONFIGURATION ===== */
const CONFIG = {
  YOUTUBE_ID: '',            // ex : 'dQw4w9WgXcQ' (vidéo de présentation)
  INSTAGRAM_URL: '',         // ex : 'https://instagram.com/tonpseudo'
  SUBMIT_URL: '/',           // Netlify Forms : Netlify > Forms > candidature
  THANKS_URL: 'merci.html',  // page de réservation après envoi
};

/* Remplace ces exemples par les vrais résultats de tes élèves (avec leur accord),
   puis passe example à false. Photos : mets le chemin dans before / after. */
const CASES = [
  { name: 'Élève 1', meta: '38 ans · cadre', tag: '−9 kg en 4 mois', story: 'Décris la situation de départ : son quotidien, ce qui le bloquait, ce qu\'il avait déjà essayé.', result: '−9 kg', resultNote: 'en 4 mois, sans régime restrictif', before: '', after: '', example: true },
  { name: 'Élève 2', meta: '42 ans · entrepreneur', tag: '−7 kg en 12 sem.', story: 'Deuxième histoire. Reste concret : métier, âge, obstacle principal et ce qu\'on a changé.', result: '−7 kg', resultNote: 'en 12 semaines', before: '', after: '', example: true },
  { name: 'Élève 3', meta: '34 ans · salarié', tag: '+6 kg de muscle', story: 'Troisième histoire, par exemple une prise de muscle sans reprendre de gras.', result: '+6 kg', resultNote: 'en 6 mois', before: '', after: '', example: true },
  { name: 'Élève 4', meta: '46 ans · père de 3 enfants', tag: '−11 kg en 5 mois', story: 'Quatrième histoire. Un profil très chargé montre que le plan s\'adapte à toutes les vies.', result: '−11 kg', resultNote: 'en 5 mois', before: '', after: '', example: true },
];
const TRANSFORMATIONS = Array.from({ length: 8 }, (_, i) => ({ label: 'Transformation ' + (i + 1), img: '' }));
const REVIEWS = [
  { text: 'Colle ici le message d\'un élève : capture WhatsApp, avis Google, retour après un bilan.', name: 'Élève 1', meta: 'Accompagné en 2026', example: true },
  { text: 'Un avis court et concret fonctionne mieux qu\'un long paragraphe. Garde ses mots à lui.', name: 'Élève 2', meta: 'Accompagné en 2026', example: true },
  { text: 'Idéalement, un avis qui parle d\'autre chose que du poids : énergie, confiance, sommeil.', name: 'Élève 3', meta: 'Accompagné en 2025', example: true },
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
    <div class="stars" aria-label="5 étoiles sur 5">${'<i class="ph-fill ph-star"></i>'.repeat(5)}</div>
    <blockquote>${esc(r.text)}</blockquote>
    ${exampleTag(r)}
    <div class="who"><span class="avatar">${esc(r.name.charAt(0))}</span><div><strong>${esc(r.name)}</strong><span>${esc(r.meta)}</span></div></div>
  </article>`).join('');

/* ===== TITRE DU HERO : apparition mot à mot ===== */
(() => {
  const h = $('#heroTitle');
  let i = 0;
  h.innerHTML = h.innerHTML.split(/(<br[^>]*>)/).map(part => part.startsWith('<br') ? part :
    part.split(/(\s+)/).map(w => w.trim() ? `<span class="h1-word" style="animation-delay:${80 + 40 * i++}ms">${w}</span>` : w).join('')).join('');
  h.classList.add('split');
  // chaque mot reçoit sa portion du dégradé global, pour un dégradé continu de gauche à droite
  const paint = () => {
    const box = h.getBoundingClientRect();
    $$('.h1-word', h).forEach(w => {
      const r = w.getBoundingClientRect();
      w.style.backgroundSize = `${box.width}px 100%`;
      w.style.backgroundPosition = `${box.left - r.left}px 0`;
    });
  };
  paint();
  addEventListener('resize', paint);
  document.fonts?.ready.then(paint);
})();

/* ===== NAVIGATION ===== */
(() => {
  const toggle = $('#navToggle'), menu = $('#mobileMenu');
  const links = $$('a', menu);
  const setOpen = open => {
    document.body.classList.toggle('menu-open', open);
    toggle.setAttribute('aria-expanded', open);
    toggle.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
    menu.setAttribute('aria-hidden', !open);
    // entrée décalée : 60ms par lien, séquence plafonnée à 400ms
    links.forEach((a, i) => a.style.transitionDelay = open ? Math.min(i * 60, 400) + 'ms' : '0ms');
  };
  toggle.addEventListener('click', () => setOpen(!document.body.classList.contains('menu-open')));
  links.forEach(a => a.addEventListener('click', () => setOpen(false)));
  addEventListener('keydown', e => { if (e.key === 'Escape') setOpen(false); });

  // lien actif selon la section visible
  const navLinks = $$('.nav-links a');
  const spy = new IntersectionObserver(entries => entries.forEach(en => {
    if (!en.isIntersecting) return;
    navLinks.forEach(a => a.classList.toggle('is-active', a.getAttribute('href') === '#' + en.target.id));
  }), { rootMargin: '-45% 0px -50% 0px' });
  navLinks.forEach(a => { const s = $(a.getAttribute('href')); if (s) spy.observe(s); });
})();

/* ===== VIDÉO : chargée seulement au clic ===== */
(() => {
  const facade = $('#videoFacade');
  if (!CONFIG.YOUTUBE_ID) {
    facade.disabled = true;
    facade.style.cursor = 'default';
    $('.play', facade).style.opacity = '.4';
    $('#videoSub').textContent = 'Vidéo bientôt disponible';
    return;
  }
  facade.addEventListener('click', () => {
    const iframe = document.createElement('iframe');
    iframe.src = `https://www.youtube-nocookie.com/embed/${encodeURIComponent(CONFIG.YOUTUBE_ID)}?autoplay=1&rel=0&playsinline=1`;
    iframe.title = 'Vidéo de présentation de Steven Coaching';
    iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
    iframe.allowFullscreen = true;
    $('#video').appendChild(iframe);
    facade.remove();
  });
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
  // glisser à la souris
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

/* ===== QUESTIONNAIRE EN 8 ÉTAPES ===== */
(() => {
  const form = $('#applyForm');
  const steps = $$('.step', form);
  const total = steps.length;
  const bar = $('#bar'), count = $('#stepCount'), hint = $('#stepHint'), formError = $('#formError');
  let cur = 0;

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

  const show = (i, dir = 1, scroll = true) => {
    cur = i;
    steps.forEach((s, k) => { s.hidden = k !== i; s.classList.toggle('back', dir < 0); });
    bar.style.transform = `scaleX(${(i + 1) / total})`;
    count.textContent = `Étape ${i + 1} sur ${total}`;
    hint.textContent = $('input[type=radio]', steps[i]) ? 'Choisis une réponse' : 'Complète les champs';
    formError.textContent = '';
    if (scroll) {
      const card = $('.quiz');
      if (card.getBoundingClientRect().top < 80) card.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
    }
    store.set('quizStep', i);
  };

  const validate = i => {
    const fields = $$('input', steps[i]);
    const radios = fields.filter(f => f.type === 'radio');
    if (radios.length && !radios.some(r => r.checked)) { formError.textContent = 'Choisis une réponse pour continuer.'; return false; }
    let ok = true;
    fields.filter(f => f.type !== 'radio').forEach(f => {
      if (f.type === 'checkbox') { if (!f.checked && f.required) { ok = false; formError.textContent = 'Coche la case de consentement pour envoyer ta candidature.'; } return; }
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
    if (e.target.type === 'radio') setTimeout(() => { if (validate(cur) && cur < total - 1) show(cur + 1); }, 280);
  });
  form.addEventListener('input', e => { save(); if (e.target.classList.contains('invalid')) setFieldError(e.target, errorFor(e.target)); });
  form.addEventListener('focusout', e => { if (e.target.matches('.field input') && e.target.value) setFieldError(e.target, errorFor(e.target)); });
  $$('.step-back', form).forEach(b => b.addEventListener('click', () => show(Math.max(0, cur - 1), -1)));
  $$('.step-next', form).forEach(b => b.addEventListener('click', () => { if (validate(cur)) show(cur + 1); }));
  form.addEventListener('keydown', e => {
    if (e.key === 'Enter' && e.target.matches('.field input') && cur < total - 1) { e.preventDefault(); if (validate(cur)) show(cur + 1); }
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
  show(Number.isInteger(saved) && saved < total ? saved : 0, 1, false);

  form.addEventListener('submit', async e => {
    e.preventDefault();
    if (!validate(cur)) return;
    const btn = $('#submitBtn');
    const data = Object.fromEntries(new FormData(form));
    btn.classList.add('is-loading');
    btn.firstChild.textContent = 'Envoi en cours ';
    formError.textContent = '';
    try {
      // en local, aucun serveur ne reçoit le formulaire : on passe directement à la suite
      const local = location.protocol === 'file:' || ['localhost', '127.0.0.1'].includes(location.hostname) || !CONFIG.SUBMIT_URL;
      if (!local) {
        const res = await fetch(CONFIG.SUBMIT_URL, { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams(data).toString() });
        if (!res.ok) throw new Error('HTTP ' + res.status);
      }
      store.del('quizData'); store.del('quizStep');
      store.set('leadFirstName', data.firstName);
      // repris par merci.html pour préremplir la réservation Cal.com
      store.set('leadName', `${data.firstName} ${data.lastName}`.trim());
      store.set('leadEmail', data.email);
      location.href = CONFIG.THANKS_URL;
    } catch (ex) {
      formError.textContent = "L'envoi a échoué. Vérifie ta connexion et réessaie. Si le problème continue, contacte Steven sur Instagram.";
      btn.classList.remove('is-loading');
      btn.firstChild.textContent = 'Envoyer ma candidature ';
    }
  });
})();

/* ===== PHRASE RÉVÉLÉE MOT À MOT ===== */
(() => {
  const p = $('#tagline');
  const wrap = (node, accent) => node.textContent.split(/(\s+)/).map(w => w.trim() ? `<span class="w${accent ? ' accent' : ''}">${esc(w)}</span>` : w).join('');
  p.innerHTML = [...p.childNodes].map(n => n.nodeType === 3 ? wrap(n, false) : wrap(n, true)).join('');
  const words = $$('.w', p);
  if (reduced) { words.forEach(w => w.classList.add('on')); return; }
  // chaque mot s'allume en franchissant une ligne située à 60% de la hauteur de l'écran
  const io = new IntersectionObserver(entries => entries.forEach(en => {
    if (en.isIntersecting) { en.target.classList.add('on'); io.unobserve(en.target); }
  }), { rootMargin: '0px 0px -40% 0px' });
  words.forEach(w => io.observe(w));
})();

/* ===== APPARITIONS ET COMPTEURS ===== */
const revealer = new IntersectionObserver(entries => entries.forEach(en => {
  if (en.isIntersecting) { en.target.classList.add('in'); revealer.unobserve(en.target); }
}), { threshold: .12 });
$$('.reveal, .reveal-group').forEach(el => revealer.observe(el));

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

/* ===== CTA MOBILE COLLANT ===== */
(() => {
  const sticky = $('#stickyCta');
  let heroVisible = true, applyVisible = false, finalVisible = false;
  const sync = () => sticky.classList.toggle('show', !heroVisible && !applyVisible && !finalVisible);
  const watch = (el, set) => new IntersectionObserver(([en]) => { set(en.isIntersecting); sync(); }).observe(el);
  watch($('.hero'), v => heroVisible = v);
  watch($('#postuler'), v => applyVisible = v);
  watch($('.final'), v => finalVisible = v);
})();

/* ===== DIVERS ===== */
$('#year').textContent = new Date().getFullYear();
if (CONFIG.INSTAGRAM_URL) { const a = $('#instagramLink'); a.href = CONFIG.INSTAGRAM_URL; a.hidden = false; }
