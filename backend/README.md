# Kuran-ı Kerim Sayfa API'si

Basit bir Kuran-ı Kerim sayfa görüntüleri API'si.

## Kurulum

1. Gerekli paketleri yükleyin:
```bash
npm install
```

2. `pages` klasörü oluşturun ve içine Kuran-ı Kerim sayfa görüntülerini ekleyin:
- Görüntü isimleri: `page001.png`, `page002.png`, ... şeklinde olmalı
- PNG formatında olmalı
- Toplam 604 sayfa

3. API'yi başlatın:
```bash
npm start
```

## API Endpointleri

1. Sayfa Görüntüsü Al:
```
GET /api/page/:pageNumber
```

2. Sure Başlangıç Sayfası Al:
```
GET /api/surah/:surahNumber
```

3. API Durumu Kontrol Et:
```
GET /api/status
```

## Örnek Kullanım

```javascript
// Sayfa görüntüsü al
fetch('http://localhost:3000/api/page/1')
  .then(response => response.json())
  .then(data => console.log(data));

// Sure başlangıç sayfası al
fetch('http://localhost:3000/api/surah/1')
  .then(response => response.json())
  .then(data => console.log(data));
```

## Not
- Sayfa numaraları 1-604 arasında olmalıdır
- Sure numaraları 1-114 arasında olmalıdır
- Görüntüler `pages` klasöründe olmalıdır
