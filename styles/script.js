/* ══════════════════════════════════════════════════════
   PORTFOLIO BUT R&T – script.js
══════════════════════════════════════════════════════ */

// ── NAVBAR MOBILE ─────────────────────────────────────
const menuToggle = document.getElementById('menuToggle');
const navLinks   = document.getElementById('navLinks');

if (menuToggle && navLinks) {
  menuToggle.addEventListener('click', () => navLinks.classList.toggle('open'));
  document.addEventListener('click', e => {
    if (!e.target.closest('.navbar')) navLinks.classList.remove('open');
  });
}

// ── NAVBAR ACTIVE LINK on scroll ──────────────────────
const sections = document.querySelectorAll('section[id]');
window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(s => {
    if (window.scrollY >= s.offsetTop - 80) current = s.id;
  });
  document.querySelectorAll('.nav-links a').forEach(a => {
    a.classList.remove('active-nav');
    if (a.getAttribute('href') === '#' + current) a.classList.add('active-nav');
  });
}, { passive: true });

// ── CAROUSEL ──────────────────────────────────────────
function initCarousel(carouselId, prevBtnClass, nextBtnClass) {
  const carousel = document.getElementById(carouselId);
  const prevBtn  = document.querySelector('.' + prevBtnClass);
  const nextBtn  = document.querySelector('.' + nextBtnClass);
  if (!carousel || !prevBtn || !nextBtn) return;

  let index = 0;
  const getCardWidth = () => {
    const card = carousel.querySelector('.skill-card');
    if (!card) return 200;
    return card.offsetWidth + parseInt(getComputedStyle(carousel).gap || 0);
  };
  const visibleCount = () => Math.floor(carousel.parentElement.offsetWidth / getCardWidth());
  const maxIndex = () => Math.max(0, carousel.children.length - visibleCount());

  const update = () => {
    carousel.style.transform = `translateX(-${index * getCardWidth()}px)`;
  };
  prevBtn.addEventListener('click', () => { index = Math.max(0, index - 1); update(); });
  nextBtn.addEventListener('click', () => { index = Math.min(maxIndex(), index + 1); update(); });
}
initCarousel('competences-carousel', 'carousel-prev', 'carousel-next');

// ── SCROLL REVEAL ─────────────────────────────────────
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); revealObserver.unobserve(e.target); } });
}, { threshold: 0.1 });
document.querySelectorAll('.ref-card, .project-card, .timeline-item, .bilan-block, .skill-card').forEach(el => {
  el.classList.add('fade-in');
  revealObserver.observe(el);
});

// ── SAÉ FILTERS ───────────────────────────────────────
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    document.querySelectorAll('#saes-grid .project-card').forEach(card => {
      if (filter === 'all' || card.dataset.sem === filter) card.classList.remove('hidden-sae');
      else card.classList.add('hidden-sae');
    });
  });
});

// ── BILAN TABS ────────────────────────────────────────
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
    btn.classList.add('active');
    const target = document.getElementById(btn.dataset.tab);
    if (target) target.classList.add('active');
  });
});

// ── POPUP SAÉ ─────────────────────────────────────────
const popup    = document.getElementById('saePopup');
const closeBtn = document.getElementById('closePopup');

function openPopup(btn) {
  const d = btn.dataset;

  // Header
  document.getElementById('popupSemestre').textContent = d.semestre || '';
  document.getElementById('popupTitle').textContent    = d.title || '';

  // Comp chips
  const compsEl = document.getElementById('popupComps');
  compsEl.innerHTML = '';
  (d.competences || '').split(',').forEach(c => {
    const c2 = c.trim();
    const span = document.createElement('span');
    span.textContent = c2;
    let cls = 'comp-chip ';
    if (c2.startsWith('RT1'))    cls += 'chip-rt1';
    else if (c2.startsWith('RT2')) cls += 'chip-rt2';
    else if (c2.startsWith('RT3')) cls += 'chip-rt3';
    else if (c2.startsWith('Cyber') || c2.startsWith('cyber')) cls += 'chip-cyber';
    else if (c2.startsWith('Stage')) cls += 'chip-stage';
    else cls += 'chip-rt1';
    span.className = cls;
    compsEl.appendChild(span);
  });

  // Contexte
  document.getElementById('popupContexte').textContent = d.contexte || '';

  // AC badges
  const acEl = document.getElementById('popupAC');
  acEl.innerHTML = '';
  (d.ac || '').split(',').forEach(ac => {
    const span = document.createElement('span');
    span.className = 'popup-ac-badge';
    span.textContent = ac.trim();
    acEl.appendChild(span);
  });

  // Tâches
  const tachesEl = document.getElementById('popupTaches');
  tachesEl.innerHTML = '';
  (d.taches || '').split('||').forEach(t => {
    const li = document.createElement('li');
    li.textContent = t.trim();
    tachesEl.appendChild(li);
  });

  // Résultats / autoeval
  document.getElementById('popupResultats').textContent      = d.resultats || '';
  document.getElementById('popupPointsForts').textContent    = d.pointsForts || d['points-forts'] || '';
  document.getElementById('popupDifficultes').textContent    = d.difficultes || '';
  document.getElementById('popupSolutions').textContent      = d.solutions || '';
  document.getElementById('popupApprentissages').textContent = d.apprentissages || '';
  document.getElementById('popupAdaptation').textContent     = d.adaptation || '';

  // Preuves & Livrables
  const preuvesSection = document.getElementById('popupPreuvesSection');
  const preuvesEl = document.getElementById('popupPreuves');
  preuvesEl.innerHTML = '';
  const preuvesData = d.preuves || '';
  if (preuvesData.trim()) {
    preuvesSection.style.display = '';
    preuvesData.split('||').forEach(item => {
      const parts = item.split('|');
      if (parts.length < 3) return;
      const [type, label, path] = [parts[0].trim(), parts[1].trim(), parts[2].trim()];
      const comment = parts.length >= 4 ? parts[3].trim() : '';
      const card = document.createElement('div');
      card.className = 'preuve-card';

      let cardContent = '';

      if (type === 'link') {
        const isPreviewable = path.includes('github.io');
        const iframeHtml = isPreviewable ? `
          <div class="preuve-iframe-wrap">
            <iframe src="${path}" loading="lazy" sandbox="allow-scripts allow-same-origin"></iframe>
            <div class="iframe-overlay-hint"><i class="fas fa-expand"></i> Cliquer pour ouvrir</div>
          </div>` : '';
        cardContent = `
          <div class="preuve-icon"><i class="fas fa-external-link-alt"></i></div>
          <div class="preuve-info">
            <span class="preuve-label">${label}</span>
            <span class="preuve-type">Lien externe</span>
          </div>
          <a href="${path}" target="_blank" class="preuve-action btn-preuve"><i class="fas fa-arrow-up-right-from-square"></i> Ouvrir</a>
          ${iframeHtml}`;
      } else if (type === 'image') {
        cardContent = `
          <div class="preuve-icon"><i class="fas fa-image"></i></div>
          <div class="preuve-info">
            <span class="preuve-label">${label}</span>
            <span class="preuve-type">Image</span>
          </div>
          <div class="preuve-actions">
            <button class="preuve-action btn-preuve preuve-preview-btn" data-src="${path}"><i class="fas fa-expand"></i> Plein écran</button>
            <a href="${path}" download class="preuve-action btn-preuve"><i class="fas fa-download"></i></a>
          </div>
          <div class="preuve-thumb-inline">
            <img src="${path}" alt="${label}" loading="lazy" class="preuve-preview-btn" data-src="${path}">
          </div>`;
      } else if (type === 'code') {
        const uid = 'code-' + Math.random().toString(36).substr(2, 6);
        cardContent = `
          <div class="preuve-icon"><i class="fas fa-file-code"></i></div>
          <div class="preuve-info">
            <span class="preuve-label">${label}</span>
            <span class="preuve-type">Code source</span>
          </div>
          <div class="preuve-actions">
            <button class="preuve-action btn-preuve preuve-code-btn" data-src="${path}" data-target="${uid}"><i class="fas fa-code"></i> Voir le code</button>
            <a href="${path}" download class="preuve-action btn-preuve"><i class="fas fa-download"></i></a>
          </div>`;
        card.innerHTML = cardContent;
        if (comment) {
          card.insertAdjacentHTML('beforeend', `<p class="preuve-comment">${comment}</p>`);
        }
        // Code viewer container
        const viewer = document.createElement('div');
        viewer.id = uid;
        viewer.className = 'code-viewer';
        viewer.style.display = 'none';
        card.appendChild(viewer);
        preuvesEl.appendChild(card);
        return;
      } else {
        // download (PDF, VSDX, etc.)
        const ext = path.split('.').pop().toUpperCase();
        const icon = ext === 'PDF' ? 'fa-file-pdf' : ext === 'VSDX' ? 'fa-file-lines' : 'fa-file';
        cardContent = `
          <div class="preuve-icon"><i class="fas ${icon}"></i></div>
          <div class="preuve-info">
            <span class="preuve-label">${label}</span>
            <span class="preuve-type">${ext}</span>
          </div>
          <a href="${path}" download class="preuve-action btn-preuve"><i class="fas fa-download"></i> Télécharger</a>`;
      }

      card.innerHTML = cardContent;
      if (comment) {
        card.insertAdjacentHTML('beforeend', `<p class="preuve-comment">${comment}</p>`);
      }
      preuvesEl.appendChild(card);
    });

    // Preview image buttons
    preuvesEl.querySelectorAll('.preuve-preview-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const src = btn.dataset.src;
        const overlay = document.createElement('div');
        overlay.className = 'image-preview-overlay';
        overlay.innerHTML = `<div class="image-preview-wrap"><img src="${src}" alt="Aperçu"><button class="close-btn" style="position:absolute;top:.5rem;right:.5rem">&times;</button></div>`;
        overlay.addEventListener('click', e => { if (e.target === overlay || e.target.closest('.close-btn')) overlay.remove(); });
        document.body.appendChild(overlay);
      });
    });

    // Iframe preview click -> opens link
    preuvesEl.querySelectorAll('.preuve-iframe-wrap').forEach(wrap => {
      wrap.addEventListener('click', () => {
        const iframe = wrap.querySelector('iframe');
        if (iframe) window.open(iframe.src, '_blank');
      });
    });

    // Code viewer buttons
    preuvesEl.querySelectorAll('.preuve-code-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        const viewer = document.getElementById(btn.dataset.target);
        if (viewer.style.display !== 'none') {
          viewer.style.display = 'none';
          btn.innerHTML = '<i class="fas fa-code"></i> Voir le code';
          return;
        }
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Chargement...';
        try {
          const resp = await fetch(btn.dataset.src);
          const text = await resp.text();
          viewer.innerHTML = '<pre><code>' + text.replace(/</g, '&lt;').replace(/>/g, '&gt;') + '</code></pre>';
          viewer.style.display = 'block';
          btn.innerHTML = '<i class="fas fa-eye-slash"></i> Masquer';
        } catch {
          viewer.innerHTML = '<p style="color:var(--red)">Erreur de chargement du fichier.</p>';
          viewer.style.display = 'block';
          btn.innerHTML = '<i class="fas fa-code"></i> Réessayer';
        }
      });
    });
  } else {
    preuvesSection.style.display = 'none';
  }

  // Barres de niveau
  const niveauxEl = document.getElementById('popupNiveaux');
  niveauxEl.innerHTML = '';
  const niveauMap = {
    'RT1':   parseInt(d.niveauRt1  || d['niveau-rt1']  || 0),
    'RT2':   parseInt(d.niveauRt2  || d['niveau-rt2']  || 0),
    'RT3':   parseInt(d.niveauRt3  || d['niveau-rt3']  || 0),
    'Cyber': parseInt(d.niveauCyber || d['niveau-cyber'] || 0),
  };
  Object.entries(niveauMap).forEach(([label, pct]) => {
    if (!pct) return;
    const row = document.createElement('div');
    row.className = 'popup-niveau-row';
    row.innerHTML = `
      <span class="popup-niveau-label">${label}</span>
      <div class="popup-bar-track">
        <div class="popup-bar-fill" style="width:0%" data-target="${pct}%"></div>
      </div>`;
    niveauxEl.appendChild(row);
  });

  popup.classList.add('open');
  document.body.style.overflow = 'hidden';
  popup.scrollTop = 0;

  // Animate bars after open
  setTimeout(() => {
    niveauxEl.querySelectorAll('.popup-bar-fill').forEach(bar => {
      bar.style.width = bar.dataset.target;
    });
  }, 100);
}

function closePopup() {
  popup.classList.remove('open');
  document.body.style.overflow = '';
}

document.querySelectorAll('.details-btn').forEach(btn => {
  btn.addEventListener('click', () => openPopup(btn));
});
if (closeBtn)  closeBtn.addEventListener('click', closePopup);
if (popup) {
  popup.addEventListener('click', e => { if (e.target === popup) closePopup(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closePopup(); });
}

// ── CONTACT FORM ─────────────────────────────────────
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', e => {
    e.preventDefault();
    const btn = contactForm.querySelector('[type="submit"]');
    btn.innerHTML = '<i class="fas fa-check"></i> Message envoyé !';
    btn.style.background = '#3fb950';
    btn.disabled = true;
    setTimeout(() => {
      btn.innerHTML = '<i class="fas fa-paper-plane"></i> Envoyer';
      btn.style.background = '';
      btn.disabled = false;
      contactForm.reset();
    }, 3000);
  });
}

// ── ACTIVE NAV CSS ────────────────────────────────────
document.head.insertAdjacentHTML('beforeend', `
<style>
  .nav-links a.active-nav { color: var(--text); background: var(--bg-card); }
</style>`);
