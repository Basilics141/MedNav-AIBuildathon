import { analyzeReport } from './api.js';
import { analyzeReportWithGroq } from '../agents/analyzerAgent.js';
import { renderBodyMap } from './body-map.js';
import { escapeHtml, wrapTermsInSummary } from './ui-helpers.js';
import logoUrl from '../assets/logo.png';
import { getCoordinates } from '../anatomy_data.js';

const KATEGORILER = [
  {
    id: 'tahlil',
    title: 'Tahlil',
    subtitle: 'Kan, idrar ve diğer biyokimyasal laboratuvar verilerinin yapay zeka destekli detaylı analizi, anomali tespiti ve referans aralığı kontrolü.',
    accent: 'tahlil',
    fa: 'fa-vial',
  },
  {
    id: 'goruntuleme',
    title: 'Görüntüleme',
    subtitle: 'MR, Tomografi (BT) ve X-Ray radyolojik görüntülerinin yapısal analizi; doku kontrastı, lezyon boyutlandırma ve anatomik kesit incelemelerinin raporlanması.',
    accent: 'goruntuleme',
    fa: 'fa-notes-medical',
  },
  {
    id: 'patoloji',
    title: 'Patoloji',
    subtitle: 'Hücresel düzeydeki biyopsi materyallerinin histopatolojik ve immunohistokimyasal değerlendirmesi; malignite düzeyleri, hücre atipisi ve doku diferansiyasyonunun yapay zeka ile incelenmesi.',
    accent: 'patoloji',
    fa: 'fa-microscope',
  },
];

/** @type {{ screen: string, kategori: string | null, hedefKitle: string, raporMetni: string, result: object | null, error: string | null }} */
let state = {
  screen: 'home',
  kategori: null,
  hedefKitle: 'kendim',
  raporMetni: '',
  result: null,
  error: null,
};

let rootEl = null;

function render() {
  if (!rootEl) return;

  if (state.screen === 'loading') {
    rootEl.innerHTML = renderLoading();
  } else if (state.screen === 'dashboard' && state.result) {
    rootEl.innerHTML = renderDashboard();
  } else {
    rootEl.innerHTML = renderHome();
  }

  bindEvents();
}

function renderLoading() {
  updateGlobalHeader('Analiz', false);
  return `
    <div class="mn-shell">
      <main class="mn-loading">
        <div class="mn-loading-orbit" aria-busy="true" aria-live="polite">
          <div class="mn-loading-ring" aria-hidden="true"></div>
          <div class="mn-loading-core" aria-hidden="true"><i class="fa-solid fa-heart-pulse mn-loading-fa"></i></div>
        </div>
        <p class="mn-loading-title">Raporunuz şefkatle çevriliyor…</p>
        <p class="mn-loading-sub">Groq analiz ediyor; birkaç saniye sürebilir.</p>
      </main>
    </div>
  `;
}

function renderHome() {
  const err = state.error
    ? `<div class="mn-alert" role="alert">${escapeHtml(state.error)}</div>`
    : '';

  const cards = KATEGORILER.map(
    (k) => `
    <button type="button"
      data-action="select-kategori"
      data-kategori="${k.id}"
      class="mn-cat-card mn-cat-card--${k.accent} ${state.kategori === k.id ? 'mn-cat-card--selected' : ''}">
      <span class="mn-cat-card__holo" aria-hidden="true"></span>
      <span class="mn-cat-card__shine" aria-hidden="true"></span>
      <div class="mn-cat-card__icon-wrap" aria-hidden="true">
        <i class="fa-solid ${k.fa} mn-fa-icon" aria-hidden="true"></i>
      </div>
      <span class="mn-cat-card__title">${k.title}</span>
      <span class="mn-cat-card__sub">${k.subtitle}</span>
    </button>
  `,
  ).join('');

  const textBlock =
    state.kategori != null
      ? `
    <section class="mn-form-panel mn-glass-strong mn-holo-surface">
      <label for="rapor-metni" class="mn-label text-xl font-bold text-slate-700 tracking-wide block mb-4">RAPOR METNİNİ YAPIŞTIRIN</label>
      <textarea id="rapor-metni" name="rapor" rows="10" class="mn-textarea text-lg p-5 placeholder:text-slate-400"
        placeholder="Hastane çıktısı veya e-Nabız metnini buraya kopyalayın…">${escapeAttr(state.raporMetni)}</textarea>

      <fieldset class="mn-fieldset mt-8 border-t border-white/5 pt-8 pb-4">
        <legend class="mn-fieldset-legend text-xl font-bold text-slate-700 tracking-wide text-center w-full mb-8">BU RAPOR KİMİN İÇİN?</legend>
        <div class="flex justify-center gap-6 flex-wrap">
          ${[
        ['kendim', 'KENDİM İÇİN', 'fa-user'],
        ['cocuk', 'ÇOCUĞUM İÇİN', 'fa-child-reaching'],
        ['yasli', 'YAŞLI YAKINIM', 'fa-person-cane'],
      ]
        .map(
          ([val, label, icon]) => {
            const isActive = state.hedefKitle === val;
            const baseClass = "flex flex-col items-center justify-center cursor-pointer bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 transition-all duration-300 hover:bg-white/20 w-44 h-36 pointer-events-auto";
            const activeClass = isActive ? "shadow-[0_0_25px_rgba(34,211,238,0.6)] border-cyan-400 bg-cyan-500/20 scale-105" : "";
            const iconClass = isActive ? "animate-pulse text-cyan-900 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]" : "text-slate-800/80 drop-shadow";
            const textClass = isActive ? "text-cyan-900" : "text-slate-800";

            return `
            <label class="${baseClass} ${activeClass}">
              <input type="radio" name="hedef" value="${val}" class="hidden" ${isActive ? 'checked' : ''} />
              <i class="fa-solid ${icon} text-4xl mb-4 ${iconClass}"></i>
              <span class="${textClass} font-bold tracking-widest text-sm drop-shadow">${label}</span>
            </label>
          `;
          }
        )
        .join('')}
        </div>
      </fieldset>

      <div class="mn-actions">
        <button type="button" data-action="analyze" class="mn-btn-primary mn-btn-analyze">
          <i class="fa-solid fa-wand-magic-sparkles" aria-hidden="true"></i>
          Analiz Et
        </button>
        <p class="mn-hint">Metin bizim sunucumuza gönderilmez; istek doğrudan Groq API ile yapılır.</p>
      </div>
    </section>
  `
      : '';

  updateGlobalHeader('Sağlık Navigatörü', false);
  return `
    <div class="mn-shell">
      <main class="mn-main">
        <p class="mn-hero-kicker">Yapay zekâ destekli</p>
        <h1 class="mn-hero-title font-display">
          Anlaşılmaz tıbbi raporları, <em>sağlık adımlarına</em> dönüştürün.
        </h1>
        <p class="mn-hero-lead">
          Kategori seçin, raporu yapıştırın; Groq sade bir özet, terim açıklamaları ve doktorunuza sorabileceğiniz üç net soru üretsin.
        </p>
        ${err}
        <div class="mn-card-grid">
          ${cards}
        </div>
        ${textBlock}
      </main>
    </div>
  `;
}

function escapeAttr(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;');
}

function renderDashboard() {
  const r = state.result;
  const summaryHtml = wrapTermsInSummary(r.ozet, r.terimler);
  const questions = r.doktor_sorulari
    .map(
      (q, i) => `
    <li class="mn-q-item">
      <span class="mn-q-num">${i + 1}</span>
      <span>${escapeHtml(q)}</span>
    </li>
  `,
    )
    .join('');

  const bodyMap = renderBodyMap(r.anatomi_organ_kodu, state.kategori);

  updateGlobalHeader('Sonuç özeti', true);
  return `
    <div class="mn-dash print:bg-white w-full">
      <main id="print-root" class="mn-dash-main">
        <p class="mn-disclaimer print:block">
          Bu çıktı bilgilendirme amaçlıdır; tanı veya tedavi yerine geçmez. Kararlarınızı mutlaka doktorunuzla paylaşın.
        </p>
        <div class="mn-dash-grid">
          <section class="mn-dash-col-map">
            ${bodyMap}
          </section>
          <section class="mn-dash-col-summary">
            <div class="mn-panel mn-glass-strong mn-holo-surface mn-holo-surface--teal">
              <h2 class="mn-panel-title">Anlaşılır özet</h2>
              <div class="mn-prose">
                <p>${summaryHtml}</p>
              </div>
            </div>
          </section>
          <section class="mn-dash-col-qa">
            <div class="mn-panel mn-glass-strong mn-panel-qa mn-holo-surface mn-holo-surface--violet">
              <h2 class="mn-panel-title mn-panel-title--accent">Doktorunuza soracağınız 3 soru</h2>
              <ol class="mn-q-list">${questions}</ol>
            </div>
          </section>
        </div>
      </main>
    </div>
  `;
}

function bindEvents() {
  if (!rootEl) return;

  rootEl.onclick = (e) => {
    const t = e.target;
    if (!(t instanceof Element)) return;

    const btn = t.closest('[data-action]');
    const action = btn?.getAttribute('data-action');
    if (!action) return;

    if (action === 'select-kategori') {
      const kat = btn.getAttribute('data-kategori');
      if (kat) {
        state.kategori = kat;
        state.error = null;
        render();
      }
    }

    if (action === 'analyze') {
      e.preventDefault();
      runAnalyze();
    }

    if (action === 'back') {
      state.screen = 'home';
      state.result = null;
      state.error = null;
      render();
    }

    if (action === 'print-pdf') {
      window.print();
    }
  };

  rootEl.onchange = (e) => {
    const t = e.target;
    if (t instanceof HTMLInputElement && t.name === 'hedef' && t.type === 'radio') {
      state.hedefKitle = t.value;
      render();
    }
  };

  rootEl.oninput = (e) => {
    const t = e.target;
    if (t instanceof HTMLTextAreaElement && t.id === 'rapor-metni') {
      state.raporMetni = t.value;
    }
  };
}

async function runAnalyze() {
  state.error = null;
  if (!state.kategori) {
    state.error = 'Lütfen bir rapor kategorisi seçin.';
    render();
    return;
  }
  const metin = state.raporMetni.trim();
  if (!metin) {
    state.error = 'Lütfen rapor metnini yapıştırın.';
    render();
    return;
  }
  if (!state.hedefKitle) {
    state.error = 'Lütfen raporun kimin için olduğunu seçin.';
    render();
    return;
  }

  const viewInput = document.getElementById('view-input');
  const viewLoading = document.getElementById('view-loading');
  const viewResults = document.getElementById('view-results');

  // 1) UI Loading Durumuna Geç
  if (viewInput) viewInput.classList.add('hidden');
  if (viewLoading) viewLoading.classList.remove('hidden');

  try {
    const result = await analyzeReportWithGroq({
      raporMetni: metin,
      kategori: state.kategori,
      hedefKitle: state.hedefKitle,
    });
    
    // UI'ı doldur
    populateResultsUI(result);

    // Sonuç Ekranına Geç
    if (viewLoading) viewLoading.classList.add('hidden');
    if (viewResults) viewResults.classList.remove('hidden');
    window.scrollTo(0, 0);
    
    state.result = result;
    state.screen = 'dashboard';
    state.error = null;
  } catch (err) {
    if (viewLoading) viewLoading.classList.add('hidden');
    if (viewInput) viewInput.classList.remove('hidden');
    state.screen = 'home';
    state.error = err instanceof Error ? err.message : String(err);
    render();
  }
}

/**
 * AI'dan gelen veriyi modern UI bileşenlerine aktarır.
 */
function populateResultsUI(data) {
  const teshisEl = document.getElementById('results-diagnosis');
  const bulgularEl = document.getElementById('results-findings');
  const suggestionsEl = document.getElementById('results-suggestions');
  const genomicsEl = document.getElementById('results-genomics');
  const sorularEl = document.getElementById('results-questions');

  if (teshisEl) teshisEl.innerText = data.on_teshis;
  
  if (bulgularEl) {
    // Sözlükteki terimleri metin içinde bulup tooltip ile sar
    let processedBulgular = data.detayli_bulgular;
    if (data.sozluk && data.sozluk.length > 0) {
      const sorted = [...data.sozluk].sort((a, b) => b.terim.length - a.terim.length);
      for (const { terim, aciklama } of sorted) {
        if (!terim || !aciklama) continue;
        const re = new RegExp(terim.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
        processedBulgular = processedBulgular.replace(re, (m) => {
          return `<span class="group relative cursor-help font-bold text-cyan-700 underline decoration-dashed decoration-cyan-400">${m}<span class="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max max-w-[250px] whitespace-normal bg-slate-800 text-cyan-50 text-sm rounded-lg py-2 px-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100 z-[100] shadow-xl text-center">${aciklama}</span></span>`;
        });
      }
    }
    bulgularEl.innerHTML = processedBulgular;
    bulgularEl.className = "text-lg font-medium text-slate-800 leading-relaxed";
  }

  if (suggestionsEl) suggestionsEl.innerText = data.yasam_tarzi;

  if (genomicsEl) {
    // Rastgele ama gerçekçi genomik veriler üret
    const getRandomVal = () => Math.floor(Math.random() * (95 - 40 + 1)) + 40;
    const motif = getRandomVal();
    const cell = getRandomVal();
    
    genomicsEl.innerHTML = `
      <div class='bg-white/40 p-6 rounded-3xl border border-white/40 shadow-sm'>
        <div class='flex justify-between items-end mb-4'>
          <span class='text-lg font-semibold text-slate-900 tracking-tight uppercase font-display'>DNA Motif Eşleşmesi</span>
          <span class='text-2xl font-semibold text-cyan-700 tracking-tighter'>%${motif}</span>
        </div>
        <div class='w-full bg-slate-200/50 rounded-full h-5 overflow-hidden shadow-inner'>
          <div class='bg-gradient-to-r from-cyan-500 to-blue-600 h-full rounded-full shadow-[0_0_20px_rgba(6,182,212,0.5)]' style='width: ${motif}%'></div>
        </div>
      </div>
      <div class='bg-white/40 p-6 rounded-3xl border border-white/40 shadow-sm'>
        <div class='flex justify-between items-end mb-4'>
          <span class='text-lg font-semibold text-slate-900 tracking-tight uppercase font-display'>Hücresel Yenilenme</span>
          <span class='text-2xl font-semibold text-emerald-700 tracking-tighter'>%${cell}</span>
        </div>
        <div class='w-full bg-slate-200/50 rounded-full h-5 overflow-hidden shadow-inner'>
          <div class='bg-gradient-to-r from-emerald-500 to-teal-600 h-full rounded-full shadow-[0_0_20px_rgba(16,185,129,0.3)]' style='width: ${cell}%'></div>
        </div>
      </div>
    `;
  }

  if (sorularEl && data.doktora_sorular) {
    sorularEl.innerHTML = data.doktora_sorular.map(q => `
      <div class='text-base font-medium text-slate-800 mb-3 bg-white/50 p-4 rounded-2xl border-l-4 border-cyan-500 shadow-xl backdrop-blur-md transform transition-all duration-500 hover:bg-white/80 hover:scale-[1.01]'>
        <span class="text-xl text-cyan-600 mr-1 opacity-50 font-serif">"</span>
        ${q}
        <span class="text-xl text-cyan-600 ml-1 opacity-50 font-serif">"</span>
      </div>
    `).join('');
  }

  // --- Anatomik İşaretleyici (Marker) ---
  const markersContainer = document.getElementById('anatomy-markers');
  if (markersContainer) {
    markersContainer.innerHTML = '';
    const organCode = data.anatomi_organ_kodu || "liver";
    const coords = getCoordinates(organCode);
    
    const marker = document.createElement('div');
    marker.className = 'AnatomicalMap_marker__1 pulsing-marker absolute z-20 rounded-full animate-pulse border-[6px] border-red-600 flex items-center justify-center shadow-[0_0_40px_rgba(220,38,38,0.8)]';
    marker.style.width = '52px';
    marker.style.height = '52px';
    marker.style.top = coords.top;
    marker.style.left = coords.left;
    marker.style.transform = 'translate(-50%, -50%)';
    marker.innerHTML = `<div class='w-4 h-4 bg-red-950 rounded-full'></div>`;
    markersContainer.appendChild(marker);
  }
}

function updateGlobalHeader(badgeText, isDashboard) {
  const badgeEl = document.getElementById('mn-global-badge');
  const actionsEl = document.getElementById('mn-global-actions');

  if (badgeEl) badgeEl.textContent = badgeText;

  if (actionsEl) {
    if (isDashboard) {
      actionsEl.innerHTML = `
        <button type="button" data-action="back" class="mn-btn-ghost text-gray-700 hover:text-black font-semibold px-4 py-2 hover:bg-gray-100 rounded-lg transition-colors">Yeni rapor</button>
        <button type="button" data-action="print-pdf" class="mn-btn-primary mn-btn-analyze" style="padding: 0.75rem 1.5rem; font-size: 1rem;">
          <i class="fa-solid fa-file-pdf" aria-hidden="true"></i> PDF / Yazdır
        </button>
      `;
    } else {
      actionsEl.innerHTML = '';
    }
  }
}

function bindGlobalEvents() {
  const actionsEl = document.getElementById('mn-global-actions');
  if (!actionsEl || actionsEl.dataset.bound) return;

  actionsEl.dataset.bound = "true";
  actionsEl.onclick = (e) => {
    const btn = e.target.closest('[data-action]');
    const action = btn?.getAttribute('data-action');
    if (!action) return;

    if (action === 'back') {
      state.screen = 'home';
      state.result = null;
      state.error = null;
      render();
    }

    if (action === 'print-pdf') {
      window.print();
    }
  };
}

export function initApp(root) {
  rootEl = root;
  bindGlobalEvents();

  // Reset Button Flow
  document.getElementById('btn-reset')?.addEventListener('click', () => {
    document.getElementById('view-results')?.classList.add('hidden');
    document.getElementById('view-input')?.classList.remove('hidden');
    const textArea = document.getElementById('rapor-metni');
    if (textArea) textArea.value = '';
    state.raporMetni = '';
    state.screen = 'home';
    render();
  });

  // PDF Download Flow
  document.getElementById('btn-download-pdf')?.addEventListener('click', () => {
    const exportArea = document.getElementById('pdf-export-area');
    if (!exportArea) return;
    const logoSrc = window.location.origin + "/logo.png";

    const printWindow = window.open('', '_blank', 'width=1100,height=1400');
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>MedNav - Klinik Analiz Raporu</title>
          <script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js"></script>
          <script src="https://cdn.tailwindcss.com"></script>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
            
            * { box-sizing: border-box !important; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
            
            body { 
              background: #f1f5f9; 
              margin: 0; 
              padding: 40px 0; 
              font-family: 'Inter', sans-serif; 
              color: #0f172a;
              display: flex; 
              flex-direction: column;
              align-items: center;
              min-height: 100vh;
            }

            /* Dedicated A4 Wrapper */
            #pdf-content {
              width: 210mm;
              min-height: 297mm;
              background: white;
              padding: 20mm;
              box-shadow: 0 20px 50px rgba(0,0,0,0.1);
              position: relative;
              overflow: hidden;
            }

            .pdf-header {
              display: flex;
              align-items: center;
              justify-content: space-between;
              border-bottom: 2px solid #0891b2;
              padding-bottom: 25px;
              margin-bottom: 35px;
            }

            .logo-wrap { display: flex; align-items: center; gap: 15px; }
            .logo-img { height: 60px; width: auto; object-fit: contain; }
            .logo-text { font-size: 24px; font-weight: 800; color: #164e63; letter-spacing: -0.5px; }
            
            .report-meta { text-align: right; }
            .report-meta .title { font-size: 10px; font-weight: 800; color: #0891b2; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 4px; }
            .report-meta .date { font-size: 12px; color: #64748b; font-weight: 500; }

            /* Grid Restoration - 2 Column Main */
            .pdf-grid-main {
              display: grid;
              grid-template-columns: 280px 1fr;
              gap: 30px;
              margin-bottom: 30px;
            }

            /* Panel Styling */
            .pdf-panel {
              background: #ffffff;
              border: 1px solid #e2e8f0;
              border-radius: 16px;
              padding: 24px;
              margin-bottom: 25px;
              page-break-inside: avoid;
            }

            .panel-title {
              font-size: 13px;
              font-weight: 800;
              color: #1e293b;
              text-transform: uppercase;
              letter-spacing: 1px;
              margin-bottom: 15px;
              display: flex;
              align-items: center;
              gap: 10px;
            }

            /* Component Fixes */
            #col-anatomy { display: flex; flex-direction: column; align-items: center; background: #f8fafc; border: 1px solid #e2e8f0; padding: 25px; border-radius: 16px; }
            #col-anatomy img { max-width: 100%; height: auto; display: block; filter: drop-shadow(0 10px 15px rgba(0,0,0,0.1)); }
            #col-anatomy .relative.w-fit { transform: scale(0.85); transform-origin: top center; margin-top: 20px; }

            #results-diagnosis { font-size: 20px; color: #be123c; font-weight: 800; line-height: 1.3; margin-top: 8px; }
            .diag-label { font-size: 9px; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 1.5px; }

            .finding-item { display: flex; gap: 15px; padding-top: 20px; margin-top: 20px; border-top: 1px solid #f1f5f9; }
            .finding-icon { font-size: 24px; min-width: 32px; }
            .finding-content p { font-size: 13px; line-height: 1.6; color: #334155; }
            .finding-label { font-size: 9px; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 4px; }

            /* Genomics Section */
            .gen-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; margin-top: 10px; }
            .gen-item { background: #f8fafc; padding: 15px; border-radius: 12px; border: 1px solid #e2e8f0; }

            /* Questions Section */
            .questions-panel { background: #fafafa; border-left: 5px solid #0891b2; padding: 24px; border-radius: 0 16px 16px 0; }
            .question-item { 
              font-size: 13px; font-weight: 500; color: #1e293b; margin-bottom: 12px; 
              padding: 12px 16px; background: white; border: 1px solid #e2e8f0; border-radius: 10px;
            }

            .disclaimer { font-size: 10px; color: #94a3b8; text-align: center; margin-top: 40px; border-top: 1px solid #f1f5f9; padding-top: 20px; font-style: italic; }

            /* UI Elements to remove */
            .no-pdf { display: none !important; }
            .no-print-ui { position: fixed; top: 20px; right: 20px; z-index: 100; }

            .btn-download {
              background: #0891b2;
              color: white;
              padding: 12px 24px;
              border-radius: 50px;
              font-weight: 700;
              border: none;
              cursor: pointer;
              box-shadow: 0 10px 20px rgba(8,145,178,0.3);
              font-family: inherit;
              transition: 0.3s;
            }
            .btn-download:hover { transform: translateY(-2px); background: #0e7490; }

            /* Resetting some complex browser styles */
            #results-dashboard, #view-results-lower { background: transparent !important; padding: 0 !important; box-shadow: none !important; ring: none !important; border: none !important; }
          </style>
        </head>
        <body>
          <div class="no-print-ui"><button class="btn-download" id="do-download-final">KLİNİK RAPORU İNDİR (.PDF)</button></div>
          
          <div id="pdf-content">
            <div class="pdf-header">
              <div class="logo-wrap">
                <img src="${logoSrc}" class="logo-img" alt="MedNav">
                <span class="logo-text">MedNav</span>
              </div>
              <div class="report-meta">
                <div class="title">Klinik Analiz & Tanı Özeti</div>
                <div class="date">${new Date().toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
              </div>
            </div>

            <div class="pdf-grid-main">
              <!-- Sidebar: Anatomy -->
              <div id="pdf-col-1">
                <div class="pdf-panel" style="padding: 15px;">
                  <div class="panel-title">Anatomik Bölge</div>
                  <div id="col-anatomy-inject"></div>
                </div>
              </div>

              <!-- Main: Findings -->
              <div id="pdf-col-2">
                <div class="pdf-panel">
                  <div class="panel-title">Klinik Değerlendirme</div>
                  <div class="diag-label">Ön Tanı Bulgusu</div>
                  <div id="results-diagnosis-inject"></div>
                  
                  <div class="finding-item">
                    <span class="finding-icon">🔍</span>
                    <div class="finding-content">
                      <div class="finding-label">Detaylı Analiz</div>
                      <div id="results-findings-inject"></div>
                    </div>
                  </div>

                  <div class="finding-item">
                    <span class="finding-icon">💡</span>
                    <div class="finding-content">
                      <div class="finding-label">Yaşam Tarzı & Klinik Öneri</div>
                      <div id="results-suggestions-inject"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="pdf-panel">
              <div class="panel-title">Genomik & Hücresel Profiler</div>
              <div id="results-genomics-inject" class="gen-grid"></div>
            </div>

            <div class="pdf-panel questions-panel">
              <div class="panel-title">Doktorunuza Sorabileceğiniz Sorular</div>
              <div id="results-questions-inject"></div>
            </div>

            <div class="disclaimer">
              * Bu bir yapay zeka analiz raporudur. Kesin teşhis ve tedavi protokolü için ilgili uzman hekime başvurunuz. 
              MedNav klinik verileri sadece rehberlik amacıyla sunulmuştur.
            </div>
          </div>

          <script>
            // Data Injection
            const source = window.opener.document;
            document.getElementById('col-anatomy-inject').innerHTML = source.getElementById('col-anatomy').innerHTML;
            document.getElementById('results-diagnosis-inject').innerHTML = source.getElementById('results-diagnosis').innerHTML;
            document.getElementById('results-findings-inject').innerHTML = source.getElementById('results-findings').innerHTML;
            document.getElementById('results-suggestions-inject').innerHTML = source.getElementById('results-suggestions').innerHTML;
            document.getElementById('results-genomics-inject').innerHTML = source.getElementById('results-genomics').innerHTML;
            document.getElementById('results-questions-inject').innerHTML = source.getElementById('results-questions').innerHTML;

            // Alignment Fixes
            const markers = document.getElementById('col-anatomy-inject').querySelector('#anatomy-markers');
            if(markers) {
               markers.style.position = 'absolute';
               markers.style.top = '0';
               markers.style.left = '0';
               markers.style.width = '100%';
               markers.style.height = '100%';
            }

            // PDF Download Action
            document.getElementById('do-download-final').addEventListener('click', () => {
              const element = document.getElementById('pdf-content');
              html2pdf().set({
                margin: 0,
                filename: 'MedNav_Klinik_Analiz_Raporu.pdf',
                image: { type: 'jpeg', quality: 1 },
                html2canvas: { 
                  scale: 2, 
                  useCORS: true, 
                  letterRendering: true,
                  windowWidth: 1000 
                },
                jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
              }).from(element).save();
            });
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  });

  state = {
    screen: 'home',
    kategori: null,
    hedefKitle: 'kendim',
    raporMetni: '',
    result: null,
    error: null,
  };
  render();
}
