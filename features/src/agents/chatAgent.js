import { chatWithGroq } from '../js/api.js';

/**
 * Health Assistant Chat Agent
 * Handles follow-up questions by providing Groq with the patient's medical context.
 * 
 * @param {string} userMessage - The user's question.
 * @param {Object} medicalContext - The analyzed report data (diagnosis, findings, etc).
 * @param {Array} history - Previous messages in this session.
 */
export async function sendChatMessage(userMessage, medicalContext, history = []) {
  const contextString = `
    HASTA ANALİZ RAPORU:
    - Teşhis: ${medicalContext.on_teshis}
    - Bulgular: ${medicalContext.detayli_bulgular}
    - Rapor Kategorisi: ${medicalContext.kategori || 'Genel'}
    - Risk Seviyesi: ${medicalContext.risk_level || 'Bilinmiyor'}
  `;

  const systemPrompt = `
    Sen 'Med-Nav' akıllı sağlık asistanısın. Kullanıcıya kendi tıbbi raporu hakkında yardımcı oluyorsun.
    
    KURALLAR:
    1. Sadece sana verilen ANALİZ RAPORU bağlamında konuş.
    2. Kesin tıbbi teşhis koyma, her zaman "doktorunuzla görüşün" tavsiyesini hatırla.
    3. Dilin profesyonel, şefkatli ve sade olmalı. 
    4. Kullanıcının sorularını tıbbi raporundaki bulgularla ilişkilendirerek cevapla.
    
    ${contextString}
  `.trim();

  const messages = [
    { role: "system", content: systemPrompt },
    ...history,
    { role: "user", content: userMessage }
  ];

  try {
    const response = await chatWithGroq({ messages });
    return response;
  } catch (err) {
    console.error('Chat Agent Error:', err);
    throw err;
  }
}
