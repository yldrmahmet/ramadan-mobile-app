const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const port = process.env.PORT || 3000;

// CORS ayarları
app.use(cors({
    origin: '*', // Tüm originlere izin ver
    methods: ['GET', 'POST', 'OPTIONS'], // İzin verilen HTTP metodları
    allowedHeaders: ['Content-Type', 'Authorization'], // İzin verilen headerlar
    credentials: true, // Credentials'a izin ver
    //optionsSuccessStatus: 200 // OPTIONS istekleri için 200 döndür
}));

// Statik dosyalar için pages klasörünü kullan
app.use('/pages', (req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
}, express.static(path.join(__dirname, 'pages')));

// Desteklenen dosya formatları
const SUPPORTED_FORMATS = ['.png', '.jpg', '.jpeg'];

// Sayfa görüntüsünü bul
const findPageImage = (pageNumber) => {
    const paddedNumber = pageNumber.toString();
    const pagesDir = path.join(__dirname, 'pages');
    
    // Klasördeki tüm dosyaları kontrol et
    const files = fs.readdirSync(pagesDir);
    
    // Önce tam eşleşme ara (1.jpg, 2.jpg, vs.)
    const exactMatch = files.find(file => {
        const ext = path.extname(file).toLowerCase();
        const baseName = path.basename(file, ext);
        return SUPPORTED_FORMATS.includes(ext) && baseName === paddedNumber;
    });

    if (exactMatch) {
        return exactMatch;
    }

    // Tam eşleşme bulunamazsa, page001.png formatını kontrol et
    const paddedMatch = files.find(file => {
        const ext = path.extname(file).toLowerCase();
        const baseName = path.basename(file, ext);
        return SUPPORTED_FORMATS.includes(ext) && baseName === `page${paddedNumber.padStart(3, '0')}`;
    });

    return paddedMatch;
};

// Sayfa numarasına göre görüntü döndür
app.get('/api/page/:pageNumber', (req, res) => {
    const pageNumber = parseInt(req.params.pageNumber);
    
    // Sayfa numarası kontrolü
    if (pageNumber < 1 || pageNumber > 604) {
        return res.status(400).json({ 
            error: 'Geçersiz sayfa numarası. 1-604 arası bir sayfa numarası girin.' 
        });
    }

    const pageFile = findPageImage(pageNumber);
    
    if (!pageFile) {
        return res.status(404).json({ 
            error: `${pageNumber} numaralı sayfa bulunamadı.` 
        });
    }

    res.json({
        page: pageNumber,
        imageUrl: `/pages/${pageFile}`
    });
});

// Sure-sayfa eşleştirmelerini içeren obje
const surahPages = {
    1: 1,    // Fatiha
    2: 2,    // Bakara
    3: 50,   // Ali İmran
    4: 77,   // Nisa
    5: 106,  // Maide
    6: 128,  // Enam
    7: 151,  // Araf
    8: 177,  // Enfal
    9: 187,  // Tevbe
    10: 208, // Yunus
    11: 221, // Hud
    12: 235, // Yusuf
    13: 249, // Rad
    14: 255, // İbrahim
    15: 262, // Hicr
    16: 267, // Nahl
    17: 282, // İsra
    18: 293, // Kehf
    19: 305, // Meryem
    20: 312, // Taha
    21: 322, // Enbiya
    22: 332, // Hac
    23: 342, // Müminun
    24: 350, // Nur
    25: 359, // Furkan
    26: 367, // Şuara
    27: 377, // Neml
    28: 385, // Kasas
    29: 396, // Ankebut
    30: 404, // Rum
    31: 411, // Lokman
    32: 415, // Secde
    33: 418, // Ahzab
    34: 428, // Sebe
    35: 434, // Fatır
    36: 440, // Yasin
    37: 446, // Saffat
    38: 453, // Sad
    39: 458, // Zümer
    40: 467, // Mümin
    41: 477, // Fussilet
    42: 483, // Şura
    43: 489, // Zuhruf
    44: 496, // Duhan
    45: 499, // Casiye
    46: 502, // Ahkaf
    47: 507, // Muhammed
    48: 511, // Fetih
    49: 515, // Hucurat
    50: 518, // Kaf
    51: 520, // Zariyat
    52: 523, // Tur
    53: 526, // Necm
    54: 528, // Kamer
    55: 531, // Rahman
    56: 534, // Vakıa
    57: 537, // Hadid
    58: 542, // Mücadele
    59: 545, // Haşr
    60: 549, // Mümtehine
    61: 551, // Saf
    62: 553, // Cuma
    63: 554, // Münafikun
    64: 556, // Tegabün
    65: 558, // Talak
    66: 560, // Tahrim
    67: 562, // Mülk
    68: 564, // Kalem
    69: 566, // Hakka
    70: 568, // Mearic
    71: 570, // Nuh
    72: 572, // Cin
    73: 574, // Müzzemmil
    74: 575, // Müddessir
    75: 577, // Kıyame
    76: 578, // İnsan
    77: 580, // Mürselat
    78: 582, // Nebe
    79: 583, // Naziat
    80: 585, // Abese
    81: 586, // Tekvir
    82: 587, // İnfitar
    83: 587, // Mutaffifin
    84: 589, // İnşikak
    85: 590, // Büruc
    86: 591, // Tarık
    87: 591, // Ala
    88: 592, // Gaşiye
    89: 593, // Fecr
    90: 594, // Beled
    91: 595, // Şems
    92: 595, // Leyl
    93: 596, // Duha
    94: 596, // İnşirah
    95: 597, // Tin
    96: 597, // Alak
    97: 598, // Kadir
    98: 598, // Beyyine
    99: 599, // Zilzal
    100: 599, // Adiyat
    101: 600, // Karia
    102: 600, // Tekasür
    103: 601, // Asr
    104: 601, // Hümeze
    105: 601, // Fil
    106: 602, // Kureyş
    107: 602, // Maun
    108: 602, // Kevser
    109: 603, // Kafirun
    110: 603, // Nasr
    111: 603, // Tebbet
    112: 604, // İhlas
    113: 604, // Felak
    114: 604  // Nas
};

// Sure numarasına göre başlangıç sayfasını döndür
app.get('/api/surah/:surahNumber', (req, res) => {
    const surahNumber = parseInt(req.params.surahNumber);
    
    // Sure numarası kontrolü
    if (surahNumber < 1 || surahNumber > 114) {
        return res.status(400).json({ 
            error: 'Geçersiz sure numarası. 1-114 arası bir sure numarası girin.' 
        });
    }

    const startPage = surahPages[surahNumber];
    if (!startPage) {
        return res.status(404).json({ 
            error: `${surahNumber} numaralı sure bulunamadı.` 
        });
    }

    const pageFile = findPageImage(startPage);
    
    if (!pageFile) {
        return res.status(404).json({ 
            error: `Sure ${surahNumber} için sayfa ${startPage} bulunamadı.` 
        });
    }

    res.json({
        surah: surahNumber,
        startPage: startPage,
        imageUrl: `/pages/${pageFile}`
    });
});

// Ayet zaman damgaları için veri
const verseTimings = {
    1: [ // Fatiha suresi
        { start: 0, end: 4.5, verse: 1, box: { x: 380, y: 120, width: 200, height: 40 } },
        { start: 4.5, end: 8.2, verse: 2, box: { x: 320, y: 170, width: 260, height: 40 } },
        { start: 8.2, end: 12.8, verse: 3, box: { x: 300, y: 220, width: 280, height: 40 } },
        { start: 12.8, end: 16.5, verse: 4, box: { x: 280, y: 270, width: 300, height: 40 } },
        { start: 16.5, end: 21.2, verse: 5, box: { x: 260, y: 320, width: 320, height: 40 } },
        { start: 21.2, end: 25.8, verse: 6, box: { x: 240, y: 370, width: 340, height: 40 } },
        { start: 25.8, end: 29.5, verse: 7, box: { x: 220, y: 420, width: 360, height: 40 } }
    ],
    // Diğer sureler için benzer şekilde eklenebilir
};

// Ayet zaman damgalarını döndür
app.get('/api/verse-timings/:surahNumber', (req, res) => {
    const surahNumber = parseInt(req.params.surahNumber);
    
    if (!verseTimings[surahNumber]) {
        return res.status(404).json({ 
            error: `${surahNumber} numaralı sure için zaman damgaları bulunamadı.` 
        });
    }

    res.json({
        surah: surahNumber,
        timings: verseTimings[surahNumber]
    });
});

// API durumu endpoint'i
app.get('/api/status', (req, res) => {
    res.json({
        status: 'active',
        version: '1.0.0',
        timestamp: new Date().toISOString()
    });
});

app.listen(port, () => {
    console.log(`Quran API çalışıyor: http://localhost:${port}`);
    console.log('Desteklenen formatlar:', SUPPORTED_FORMATS.join(', '));
});
