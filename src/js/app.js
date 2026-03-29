import { analyzeReport } from './api.js';
import { analyzeReportWithGroq } from '../agents/analyzerAgent.js';
import { sendChatMessage } from '../agents/chatAgent.js';
import { renderBodyMap } from './body-map.js';
import { escapeHtml, wrapTermsInSummary } from './ui-helpers.js';
import logoUrl from '../assets/logo.png';
import { getCoordinates, anatomyNamesTr } from '../anatomy_data.js';
import { updateRadarChart } from './radarChart.js';

const KATEGORILER = [
  {
    id: 'tahlil',
    title: 'Tahlil',
    subtitle: 'Kan, idrar ve hormon gibi laboratuvar sonuçlarınızı yapay zeka ile analiz edip referans aralıklarına göre anlaşılır bir dille değerlendirir.',
    accent: 'tahlil',
    fa: 'fa-vial',
  },
  {
    id: 'goruntuleme',
    title: 'Görüntüleme',
    subtitle: 'MR, Tomografi, Röntgen ve Ultrason raporlarınızı okuyarak vücudunuzdaki yapısal durumları ve bulguları net bir şekilde özetler.',
    accent: 'goruntuleme',
    fa: 'fa-notes-medical',
  },
  {
    id: 'patoloji',
    title: 'Patoloji',
    subtitle: 'Biyopsi ve parça alınma işlemlerine ait karmaşık hücresel raporları inceleyerek doku sağlığı hakkında sade ve anlaşılır bilgiler sunar.',
    accent: 'patoloji',
    fa: 'fa-microscope',
  },
];

let state = {
  screen: 'home',
  kategori: null,
  hedefKitle: 'kendim',
  raporMetni: '',
  result: null,
  error: null,
  chat: {
    active: false,
    history: [],
    context: null
  }
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

  if (viewInput) viewInput.classList.add('hidden');
  if (viewLoading) viewLoading.classList.remove('hidden');

  try {
    const result = await analyzeReportWithGroq({
      raporMetni: metin,
      kategori: state.kategori,
      hedefKitle: state.hedefKitle,
    });

    populateResultsUI(result);

    if (viewLoading) viewLoading.classList.add('hidden');
    if (viewResults) viewResults.classList.remove('hidden');
    window.scrollTo(0, 0);

    state.result = result;
    state.screen = 'dashboard';
    state.error = null;

    state.chat.context = result;
    state.chat.history = [];
    showChatPanel();
  } catch (err) {
    if (viewLoading) viewLoading.classList.add('hidden');
    if (viewInput) viewInput.classList.remove('hidden');
    state.screen = 'home';
    state.error = err instanceof Error ? err.message : String(err);
    render();
  }
}

function populateResultsUI(data) {
  const teshisEl = document.getElementById('results-diagnosis');
  const bulgularEl = document.getElementById('results-findings');
  const suggestionsEl = document.getElementById('results-suggestions');
  const sorularEl = document.getElementById('results-questions');

  if (teshisEl) teshisEl.innerText = data.on_teshis;

  if (bulgularEl) {
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

  const risk = data.risk_level || 'Low';
  updateRadarChart(risk);

  if (sorularEl && data.doktora_sorular) {
    sorularEl.innerHTML = data.doktora_sorular.map(q => `
      <div class='text-base font-medium text-slate-800 mb-3 bg-white/50 p-4 rounded-2xl border-l-4 border-cyan-500 shadow-xl backdrop-blur-md transform transition-all duration-500 hover:bg-white/80 hover:scale-[1.01]'>
        <span class="text-xl text-cyan-600 mr-1 opacity-50 font-serif">"</span>
        ${q}
        <span class="text-xl text-cyan-600 ml-1 opacity-50 font-serif">"</span>
      </div>
    `).join('');
  }

  const markersContainer = document.getElementById('anatomy-markers');
  if (markersContainer) {
    markersContainer.innerHTML = '';
    const organCode = data.anatomi_organ_kodu || "liver";
    markersContainer.dataset.organ = organCode;
    const coords = getCoordinates(organCode);

    const marker = document.createElement('div');
    marker.className = 'AnatomicalMap_marker__1 pulsing-marker absolute z-20 rounded-full border-red-600 flex items-center justify-center';
    marker.style.top = coords.top;
    marker.style.left = coords.left;
    marker.innerHTML = `<div class='pulsing-marker-dot'></div>`;
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
  console.log('MedNav: Initializing app...', { rootEl });
  bindGlobalEvents();

  document.getElementById('btn-reset')?.addEventListener('click', () => {
    document.getElementById('view-results')?.classList.add('hidden');
    document.getElementById('view-input')?.classList.remove('hidden');
    const textArea = document.getElementById('rapor-metni');
    if (textArea) textArea.value = '';
    state.raporMetni = '';
    state.screen = 'home';

    hideChatPanel();
    state.chat.active = false;
    state.chat.history = [];
    render();
  });

  document.getElementById('chat-send-btn')?.addEventListener('click', handleChatSubmit);
  document.getElementById('chat-user-input')?.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleChatSubmit();
  });

  const btnPdf = document.getElementById('btn-download-pdf');
  console.log('MedNav: PDF Button found:', !!btnPdf);

  if (btnPdf) {
    btnPdf.addEventListener('click', async function (e) {
      console.log('PDF Triggered');
      e.preventDefault();
      const btn = this;
      const originalContent = btn.innerHTML;

      // Visual feedback for preparation
      btn.innerHTML = `<i class="fa-solid fa-sync fa-spin"></i> <span>Rapor Hazırlanıyor...</span>`;
      btn.disabled = true;

      // 1. Animation Delay: Wait for Radar Chart animations to finalize (2000ms)
      await new Promise(resolve => setTimeout(resolve, 2000));

      const radarCanvas = document.getElementById('healthRadarChart');
      const radarImage = radarCanvas ? radarCanvas.toDataURL('image/png', 1.0) : '';
      // Use clear absolute URL for assets to prevent ERR_CONNECTION_REFUSED in about:blank
      const logoSrc = window.location.protocol + "//" + window.location.host + "/logo.png";

      const printWindow = window.open('', '_blank', 'width=1200,height=1400');

      // Use template literal for cleaner HTML injection and fix concatenation bugs
      printWindow.document.write(`
<!DOCTYPE html>
<html>
<head>
  <title>Tıbbi Analiz Raporu | MedNav</title>
  <!-- Force library load in head with explicit defer handling -->
  <script src='https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js' crossorigin='anonymous'></script>
  <script src='https://cdn.tailwindcss.com'></script>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
    * { box-sizing: border-box !important; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
    body { background: #f1f5f9; margin: 0; padding: 20px; font-family: 'Inter', sans-serif; display: flex; flex-direction: column; align-items: center; }
    #pdf-content { width: 210mm; background: white; padding: 10mm; position: relative; box-shadow: 0 0 40px rgba(0,0,0,0.1); overflow: hidden; }
    .pdf-header { display: flex; align-items: center; justify-content: space-between; border-bottom: 3px solid #0891b2; padding-bottom: 15px; margin-bottom: 25px; }
    .logo-wrap { display: flex; align-items: center; gap: 10px; }
    .logo-img { height: 45px; width: auto; }
    .logo-text { font-size: 24px; font-weight: 800; color: #164e63; letter-spacing: -1px; }
    .report-meta { text-align: right; }
    .report-meta .title { font-size: 10px; font-weight: 800; color: #0891b2; text-transform: uppercase; letter-spacing: 1px; }
    .report-meta .date { font-size: 13px; color: #64748b; margin-top: 2px; font-weight: 500; }
    
    /* Layout Force: 3-column horizontal grid */
    .pdf-dashboard-flex { display: flex !important; flex-direction: row !important; flex-wrap: nowrap !important; width: 100% !important; gap: 12px !important; margin-bottom: 25px !important; align-items: stretch !important; }
    .pdf-col-anatomy { width: 28% !important; flex-shrink: 0 !important; }
    .pdf-col-summary { width: 44% !important; flex-shrink: 0 !important; }
    .pdf-col-genomics { width: 28% !important; flex-shrink: 0 !important; }
    
    .pdf-panel { background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 14px; height: 100%; display: flex; flex-direction: column; }
    .panel-label { font-size: 9px; font-weight: 800; color: #64748b; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 10px; border-bottom: 1px solid #f1f5f9; padding-bottom: 6px; }
    #anatomy-inject-wrap { text-align: center; flex: 1; display: flex; align-items: center; justify-content: center; min-height: 200px; position: relative; }
    #anatomy-inject-wrap img { width: 100%; height: auto; object-fit: contain; max-height: 220px; }
    
    /* Focus Label for PDF */
    .anatomy-focus-label { 
      display: none; 
      margin-bottom: 20px;
      text-align: center; 
      font-size: 13px; 
      font-weight: 800; 
      color: #be123c; 
      text-transform: uppercase; 
      letter-spacing: 0.5px;
      padding: 8px;
      background: #fff1f2;
      border: 1px solid #fecdd3;
      border-radius: 8px;
    }
    body.pdf-rendering .anatomy-focus-label { display: block !important; }

    /* Hide marker for PDF to ensure professional presentation */
    body.pdf-rendering .pulsing-marker {
      display: none !important;
    }

    .diagnosis-text { font-size: 16px; font-weight: 800; color: #be123c; margin-bottom: 12px; line-height: 1.2; }
    .section-sub { font-size: 9px; font-weight: 700; color: #0891b2; text-transform: uppercase; margin-top: 12px; margin-bottom: 4px; }
    .findings-text { font-size: 11px; line-height: 1.4; color: #334155; }
    .radar-wrap { text-align: center; padding: 8px; background: #f8fafc; border-radius: 10px; border: 1px dashed #cbd5e1; }
    .radar-img { width: 100%; height: auto; }
    .questions-panel { background: #f0f9ff; border-left: 4px solid #0ea5e9; padding: 12px; border-radius: 4px 12px 12px 4px; margin-top: 5px; }
    .question-item { font-size: 11px; font-weight: 500; color: #0c4a6e; margin-bottom: 5px; padding: 8px; background: white; border-radius: 8px; border: 1px solid #e0f2fe; }
    .disclaimer { font-size: 9px; color: #94a3b8; text-align: center; margin-top: 20px; border-top: 1px solid #f1f5f9; padding-top: 12px; font-style: italic; }
    
    /* Chat Exclusion */
    #mn-chat-panel, .mn-chat-panel { display: none !important; }
    
    .no-print-control { position: fixed; top: 20px; left: 50%; transform: translateX(-50%); z-index: 999; }
    .btn-action { background: #0891b2; color: white; padding: 12px 35px; border-radius: 50px; font-weight: 800; border: none; cursor: pointer; box-shadow: 0 10px 25px rgba(8,145,178,0.4); transition: 0.3s; }
    .btn-action:hover { background: #0e7490; transform: translateY(-2px); }
  </style>
</head>
<body>
  <div class='no-print-control'>
    <button class='btn-action' id='do-download-final'>KLİNİK DOSYAYI ONAYLA VE İNDİR</button>
  </div>
  <div id='pdf-content'>
    <div class='pdf-header'>
      <div class='logo-wrap'>
        <img src='${logoSrc}' class='logo-img'>
        <span class='logo-text'>MedNav</span>
      </div>
      <div class='report-meta'>
        <div class='title'>Tıbbi Analiz Raporu</div>
        <div class='date'>${new Date().toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
      </div>
    </div>
    <div class='pdf-dashboard-flex'>
      <div class='pdf-col-anatomy'>
        <div class='pdf-panel'>
          <div class='panel-label'>Anatomik Bölge</div>
          <div id='anatomy-inject-wrap'></div>
        </div>
      </div>
      <div class='pdf-col-summary'>
        <div class='pdf-panel'>
          <div class='panel-label'>Klinik Değerlendirme</div>
          <div class='section-sub'>Teşhis Özeti</div>
          <div id='diag-inject' class='diagnosis-text'></div>
          <div class='section-sub'>Detaylı Bulgular</div>
          <div id='findings-inject' class='findings-text'></div>
          <div class='section-sub'>Klinik Öneriler</div>
          <div id='sugg-inject' class='findings-text'></div>
        </div>
      </div>
      <div class='pdf-col-genomics'>
        <div class='pdf-panel'>
          <div class='panel-label'>Genomik Analiz</div>
          <div class='radar-wrap'>
            <img src='${radarImage}' class='radar-img'>
          </div>
          <div class='mt-4 p-3 bg-slate-50 rounded-lg border border-slate-100 italic text-[8px] text-slate-500 text-center'>
            Hücresel direnç ve metabolik profil verileri AI tarafından senkronize edilmiştır.
          </div>
        </div>
      </div>
    </div>
    <div class='questions-panel'>
      <div class='panel-label' style='color:#0369a1; border-color: #bae6fd; font-size: 9px; margin-bottom: 5px;'>Takip Soruları</div>
      <div id='questions-inject'></div>
    </div>
    <div class='disclaimer'>ÖNEMLİ: Bu rapor yapay zeka tarafından üretilmiş klinik bir rehberdir. Kesin tıbbi kararlar için uzman doktora başvurulmalıdır.</div>
  </div>
  <script>
    const source = window.opener.document;
    const trMap = ${JSON.stringify(anatomyNamesTr)};
    
    document.getElementById('diag-inject').innerText = source.getElementById('results-diagnosis').innerText;
    document.getElementById('findings-inject').innerText = source.getElementById('results-findings').innerText;
    document.getElementById('sugg-inject').innerText = source.getElementById('results-suggestions').innerText;
    document.getElementById('questions-inject').innerHTML = source.getElementById('results-questions').innerHTML;
    
    const anatomySrc = source.getElementById('col-anatomy');
    const anatomyMarkers = anatomySrc.querySelector('#anatomy-markers').innerHTML;
    const anatomyImg = anatomySrc.querySelector('img').src;
    
    // Extract organ key for fallback label
    const organKey = (source.getElementById('anatomy-markers').dataset.organ || 'general').toLowerCase().trim();
    const organNameTr = trMap[organKey] || "GENEL";
    
    document.getElementById('anatomy-inject-wrap').innerHTML = \`
      <div style='display:flex; flex-direction:column; align-items:center; width:100%; height:100%;'>
        <div class='anatomy-focus-label'>BÖLGESEL ODAK: \${organNameTr}</div>
        <div style='position:relative; flex:1; display:flex; align-items:center; justify-content:center;'>
          <img src='\${anatomyImg}' style='max-height: 220px; width:auto;'>
          <div style='position:absolute; inset:0;'>\${anatomyMarkers}</div>
        </div>
      </div>\`;
      
    document.getElementById('do-download-final').addEventListener('click', async () => {
      const btnDownload = document.getElementById('do-download-final');
      const originalText = btnDownload.innerText;
      btnDownload.innerText = 'PDF OLUŞTURULUYOR...';
      btnDownload.disabled = true;

      document.body.classList.add('pdf-rendering');
      
      const element = document.getElementById('pdf-content');
      
      // Small delay for class application
      await new Promise(r => setTimeout(r, 150));

      // Log for diagnostic with version stamp to confirm code update
      console.log('[v7-FIX] MedNav: Starting html2pdf generation...');
      
      if (typeof html2pdf === 'undefined') {
        console.error('[v7-FIX] MedNav: html2pdf library not loaded!');
        alert('HATA: PDF kütüphanesi yüklenemedi. Lütfen internet bağlantınızı kontrol edip tekrar deneyin.');
        btnDownload.innerText = originalText;
        btnDownload.disabled = false;
        return;
      }

      html2pdf().set({
        margin: 0,
        filename: 'MedNav-Tibbi-Analiz-Raporu.pdf',
        image: { type: 'jpeg', quality: 1.0 },
        html2canvas: { 
          scale: 3, 
          useCORS: true, 
          logging: true,
          windowWidth: 1200,
          allowTaint: true
        },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      }).from(element).toPdf().outputPdf('blob').then((blob) => {
        console.log('[v7-FIX] MedNav: PDF Blob generated successfully.');
        
        try {
          // Force download via <a> tag within the printWindow's document
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = 'MedNav-Tibbi-Analiz-Raporu.pdf';
          link.style.display = 'none';
          
          document.body.appendChild(link);
          link.click();
          
          // Double force: set location for browsers that block click
          setTimeout(() => {
            if (document.body.contains(link)) {
              document.body.removeChild(link);
              URL.revokeObjectURL(url);
            }
            console.log('[v7-FIX] MedNav: PDF download sequence complete.');
          }, 500);
        } catch (downloadErr) {
          console.warn('[v7-FIX] Link download failed, trying standard .save() as fallback');
          html2pdf().from(element).save();
        }

        document.body.classList.remove('pdf-rendering');
        btnDownload.innerText = originalText;
        btnDownload.disabled = false;
      }).catch(err => {
        console.error('[v7-FIX] MedNav: html2pdf rendering failed:', err);
        alert('HATA: PDF oluşturulurken teknik bir sorun oluştu: ' + err.message);
        btnDownload.innerText = originalText;
        btnDownload.disabled = false;
      });
    });
  </script>
</body>
</html>`);
      printWindow.document.close();

      try {
        // PDF Window Generation...
        await new Promise(r => setTimeout(r, 100)); // Buffer
      } catch (err) {
        console.error('MedNav: PDF Export Prep Failed:', err);
        // Reset button state
        btn.innerHTML = originalContent;
        btn.disabled = false;
        return;
      }

      // Reset button state
      btn.innerHTML = originalContent;
      btn.disabled = false;
    });
  }

  render();
}

function showChatPanel() {
  const panel = document.getElementById('mn-chat-panel');
  if (panel) {
    panel.classList.add('active');
    state.chat.active = true;
  }
}

function hideChatPanel() {
  const panel = document.getElementById('mn-chat-panel');
  if (panel) {
    panel.classList.remove('active');
  }
}

function appendChatMsg(role, text) {
  const list = document.getElementById('chat-messages-list');
  if (!list) return;

  const msgDiv = document.createElement('div');
  msgDiv.className = `chat-msg ${role === 'user' ? 'chat-msg-user' : 'chat-msg-ai'}`;
  msgDiv.innerText = text;
  list.appendChild(msgDiv);
  list.scrollTop = list.scrollHeight;
}

function showChatTyping() {
  const list = document.getElementById('chat-messages-list');
  if (!list) return;
  const typingDiv = document.createElement('div');
  typingDiv.id = 'chat-typing-indicator';
  typingDiv.className = 'chat-msg chat-msg-ai';
  typingDiv.innerHTML = `<div class="chat-typing-dots"><span></span><span></span><span></span></div>`;
  list.appendChild(typingDiv);
  list.scrollTop = list.scrollHeight;
}

function hideChatTyping() {
  const indicator = document.getElementById('chat-typing-indicator');
  if (indicator) indicator.remove();
}

async function handleChatSubmit() {
  const input = document.getElementById('chat-user-input');
  const userText = input.value.trim();
  if (!userText || !state.chat.context) return;

  input.value = '';
  appendChatMsg('user', userText);
  showChatTyping();

  try {
    const aiResponse = await sendChatMessage(userText, state.chat.context, state.chat.history);
    hideChatTyping();
    appendChatMsg('ai', aiResponse);
    state.chat.history.push({ role: 'user', content: userText });
    state.chat.history.push({ role: 'assistant', content: aiResponse });
  } catch (err) {
    hideChatTyping();
    appendChatMsg('ai', 'Üzgünüm, şu an cevap veremiyorum. Lütfen tekrar deneyin.');
  }
}
