export async function simulateAnalysis(text) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        risk_level: 'High',
        affected_organ_id: 'liver',
        diagnosis_summary: 'Test summary',
        key_findings: ['High AST', 'High ALT'],
        doctor_questions: [
          'Karaciğer yağlanmamın evresi tam olarak nedir ve diğer organlarımı etkileyebilir mi?',
          'Beslenme ve egzersiz dışında bu tabloyu iyileştirmek için ilaç tedavisi gerekli mi?',
          'Bir sonraki kontrol tetkikimi ne zaman yaptırmalıyım ve hangi değerleri takip etmeliyiz?'
        ]
      });
    }, 2000);
  });
}
