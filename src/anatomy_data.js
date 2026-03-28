// anatomy_data.js

export const anatomyMap = {
    // --- BAŞ VE BOYUN ---
    brain: { top: '4%', left: '51%' },          // Beyin
    eyes: { top: '7%', left: '51%' },          // Gözler
    throat: { top: '15%', left: '51%' },        // Boğaz / Bademcik
    thyroid: { top: '18%', left: '50%' },       // Tiroid

    // --- GÖĞÜS KAFESİ ---
    heart: { top: '26%', left: '51%' },         // Kalp (Sola dönük)
    lungs: { top: '28%', left: '50%' },         // Akciğerler (Genel)
    lung_right: { top: '27%', left: '46%' },    // Sağ Akciğer
    lung_left: { top: '27%', left: '56%' },     // Sol Akciğer

    // --- KARIN BÖLGESİ (ÜST) ---
    liver: { top: '33%', left: '47%' },         // Karaciğer (Sağ üst)
    stomach: { top: '36%', left: '53%' },       // Mide (Sol üst)
    pancreas: { top: '42%', left: '50%' },      // Pankreas (Mide arkası)
    gallbladder: { top: '35%', left: '45%' },   // Safra Kesesi (Karaciğer altı)

    // --- KARIN BÖLGESİ (ALT) ---
    kidneys: { top: '38%', left: '50%' },       // Böbrekler (Genel)
    kidney_right: { top: '38%', left: '44%' },  // Sağ Böbrek
    kidney_left: { top: '38%', left: '58%' },   // Sol Böbrek
    intestines: { top: '43%', left: '50%' },    // İnce Bağırsaklar
    colon: { top: '40%', left: '50%' },         // Kalın Bağırsak 
    appendix: { top: '46%', left: '46%' },      // Apandisit (Sağ alt kadran)

    // --- PELVİS VE ÜREME ---
    bladder: { top: '49%', left: '50%' },       // Mesane
    pelvis: { top: '43%', left: '50%' },        // Pelvis / Leğen Kemiği
    uterus: { top: '47%', left: '50%' },        // Rahim
    prostate: { top: '51%', left: '50%' },      // Prostat

    // --- İSKELET VE EKLEMLER ---
    spine: { top: '19%', left: '50.5%' },         // Omurga (Merkez)
    left_shoulder: { top: '21%', left: '70%' }, // Sol Omuz
    right_shoulder: { top: '21%', left: '31%' },// Sağ Omuz
    left_knee: { top: '78%', left: '60%' },     // Sol Diz
    right_knee: { top: '78%', left: '37%' }     // Sağ Diz
};

export const anatomyNamesTr = {
    brain: "BEYİN",
    eyes: "GÖZLER",
    throat: "BOĞAZ / BADEMCİK",
    thyroid: "TİROİD",
    heart: "KALP",
    lungs: "AKCİĞERLER",
    lung_right: "SAĞ AKCİĞER",
    lung_left: "SOL AKCİĞER",
    liver: "KARACİĞER",
    stomach: "MİDE",
    pancreas: "PANKREAS",
    gallbladder: "SAFRA KESESİ",
    kidneys: "BÖBREKLER",
    kidney_right: "SAĞ BÖBREK",
    kidney_left: "SOL BÖBREK",
    intestines: "İNCE BAĞIRSAKLAR",
    colon: "KOLON",
    appendix: "APANDİSİT",
    bladder: "MESANE",
    pelvis: "PELVİS / LEĞEN KEMİĞİ",
    uterus: "RAHİM",
    prostate: "PROSTAT",
    spine: "OMURGA",
    left_shoulder: "SOL OMUZ",
    right_shoulder: "SAĞ OMUZ",
    left_knee: "SOL DİZ",
    right_knee: "SAĞ DİZ",
    general: "GENEL"
};

// Yapay zeka bilinmeyen bir organ döndürürse hata vermemesi için güvenli (fallback) fonksiyon
export function getCoordinates(organKey) {
    if (!organKey) return { top: '10%', left: '50%' };
    
    // Normalizasyon (küçük harf ve boşluk temizleme)
    const normalizedKey = organKey.toLowerCase().trim();
    const coords = anatomyMap[normalizedKey];

    if (!coords) {
        // Hatalı veya bilinmeyen bir anahtar gelirse konsola bas ve güvenli bir noktaya (baş bölgesi) odaklan
        console.warn("Organ key not found in map: " + organKey);
        return { top: '10%', left: '50%' }; 
    }

    return coords;
}