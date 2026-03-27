import { escapeHtml } from './ui-helpers.js';

/**
 * Basit anatomi haritası (SVG). Kodlar prompts.js içindeki izin listesiyle uyumludur.
 */
export function renderBodyMap(activeOrganKodu, kategori) {
  const isImaging = kategori === 'goruntuleme';
  const active = isImaging && activeOrganKodu ? String(activeOrganKodu).trim() : '';

  const dimClass = !isImaging ? 'mn-map-wrap--dim' : '';
  const generalGlow = isImaging && active === 'genel' ? 'mn-map-wrap--glow' : '';

  const hit = (id) =>
    active && id === active ? 'mn-organ mn-organ--active' : 'mn-organ';

  return `
    <div class="mn-map-wrap mn-glass mn-holo-surface mn-holo-surface--map ${dimClass} ${generalGlow}">
      <p class="mn-map-caption">
        ${
          isImaging
            ? 'Raporla ilişkili bölge vurgulanır'
            : 'Görsel harita görüntüleme raporları için anlamlıdır'
        }
      </p>
      <svg viewBox="0 0 200 360" class="mx-auto h-[70vh] w-full max-w-[400px]" role="img" aria-label="İnsan silüeti anatomi haritası">
        <defs>
          <linearGradient id="mn-organ-holo" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#2dd4bf" />
            <stop offset="45%" stop-color="#38bdf8" />
            <stop offset="100%" stop-color="#a78bfa" />
          </linearGradient>
          <filter id="mn-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <ellipse cx="100" cy="38" rx="28" ry="32" class="${hit('bas')}" data-organ="bas" />
        <rect x="78" y="62" width="44" height="36" rx="10" class="${hit('gogus')}" data-organ="gogus" />
        <ellipse cx="88" cy="78" rx="14" ry="22" transform="rotate(-8 88 78)" class="${hit('sol_akciger')}" data-organ="sol_akciger" />
        <ellipse cx="112" cy="78" rx="14" ry="22" transform="rotate(8 112 78)" class="${hit('sag_akciger')}" data-organ="sag_akciger" />
        <path d="M100 98 L100 175" class="mn-organ-spine" />
        <rect x="82" y="98" width="36" height="28" rx="8" class="${hit('kalp')}" data-organ="kalp" />
        <rect x="76" y="118" width="48" height="40" rx="10" class="${hit('karin')}" data-organ="karin" />
        <rect x="82" y="130" width="36" height="22" rx="6" class="${hit('karaciger')}" data-organ="karaciger" />
        <circle cx="88" cy="168" r="10" class="${hit('bobrek_sol')}" data-organ="bobrek_sol" />
        <circle cx="112" cy="168" r="10" class="${hit('bobrek_sag')}" data-organ="bobrek_sag" />
        <rect x="88" y="175" width="24" height="18" rx="6" class="${hit('kalca')}" data-organ="kalca" />
        <rect x="86" y="192" width="12" height="44" rx="5" class="${hit('diz_sol')}" data-organ="diz_sol" />
        <rect x="102" y="192" width="12" height="44" rx="5" class="${hit('diz_sag')}" data-organ="diz_sag" />
        <ellipse cx="92" cy="248" rx="10" ry="8" class="${hit('ayak')}" data-organ="ayak" />
        <ellipse cx="108" cy="248" rx="10" ry="8" class="${hit('ayak')}" data-organ="ayak" />
      </svg>
      ${
        active
          ? `<p class="mn-map-code">Vurgu: <code>${escapeHtml(active)}</code></p>`
          : ''
      }
    </div>
  `;
}
