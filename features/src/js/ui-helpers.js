export function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function escapeRegex(s) {
  return String(s).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Özet içinde terimleri vurgular; açıklama için title (hover) kullanır.
 */
export function wrapTermsInSummary(ozet, terimler) {
  let html = ozet; // AI provides HTML tooltips now
  const sorted = [...terimler].sort((a, b) => b.terim.length - a.terim.length);
  for (const { terim, aciklama } of sorted) {
    if (!terim) continue;
    const re = new RegExp(escapeRegex(terim), 'gi');
    html = html.replace(
      re,
      (m) =>
        `<span class="mn-term" title="${escapeHtml(aciklama)}">${escapeHtml(m)}</span>`,
    );
  }
  return html;
}
