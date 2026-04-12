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
    pancreas: { top: '37%', left: '52%' },      // Pankreas (Mide arkası)
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
    right_knee: { top: '78%', left: '37%' },


    // --- SİNİR SİSTEMİ ---
    spinal_cord: { top: '130px', left: '180px' },     // Omurilik  

    // --- İSKELET VE GÖVDE EKLEMELERİ ---
    neck_cervical: { top: '121px', left: '179px' },   // Boyun Omurları
    clavicle: { top: '137px', left: '180px' },        // Köprücük Kemiği
    ribcage: { top: '217px', left: '180px' },         // Göğüs Kafesi / Kaburgalar
    hip_left: { top: '371px', left: '230px' },        // Sol Kalça Eklemi
    hip_right: { top: '371px', left: '126px' },       // Sağ Kalça Eklemi

    // --- KOLLAR VE ELLER ---
    elbow_left: { top: '273px', left: '269px' },      // Sol Dirsek
    elbow_right: { top: '89px', left: '269px' },     // Sağ Dirsek
    wrist_left: { top: '374px', left: '269px' },      // Sol El Bileği
    wrist_right: { top: '374px', left: '81px' },     // Sağ El Bileği
    hand_left: { top: '406px', left: '265px' },       // Sol El
    hand_right: { top: '406px', left: '84px' },      // Sağ El

    // --- BACAKLAR VE AYAKLAR ---
    femur_left: { top: '441px', left: '217px' },      // Sol Uyluk Kemiği
    femur_right: { top: '441px', left: '128px' },     // Sağ Uyluk Kemiği
    ankle_left: { top: '666px', left: '266px' },      // Sol Ayak Bileği
    ankle_right: { top: '666px', left: '134px' },     // Sağ Ayak Bileği
    foot_left: { top: '707px', left: '353px' },       // Sol Ayak
    foot_right: { top: '686px', left: '134px' },      // Sağ Ayak
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
    spinal_cord: "OMURİLİK",
    sciatic_nerve: "SİYATİK SİNİRİ",
    neck_cervical: "BOYUN OMURLARI",
    clavicle: "KÖPRÜCÜK KEMİĞİ",
    ribcage: "GÖĞÜS KAFESİ / KABURGALAR",
    hip_left: "SOL KALÇA EKLEMİ",
    hip_right: "SAĞ KALÇA EKLEMİ",
    elbow_left: "SOL DİRSEK",
    elbow_right: "SAĞ DİRSEK",
    wrist_left: "SOL EL BİLEĞİ",
    wrist_right: "SAĞ EL BİLEĞİ",
    hand_left: "SOL EL",
    hand_right: "SAĞ EL",
    femur_left: "SOL UYLUK KEMİĞİ",
    femur_right: "SAĞ UYLUK KEMİĞİ",
    ankle_left: "SOL AYAK BİLEĞİ",
    ankle_right: "SAĞ AYAK BİLEĞİ",
    foot_left: "SOL AYAK",
    foot_right: "SAĞ AYAK",
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
        return { top: '4%', left: '51%' };
    }

    return coords;
}