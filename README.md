# Çelebi BRS Dashboard

Çelebi Holding'e TAV Technologies BRS ürününü tanıtmak için hazırlanmış interaktif dashboard uygulaması.

## Özellikler

- 📊 2025 yılı BRS kullanım istatistikleri
- 🏢 4 saha bazlı detaylı veriler
- ✈️ Havayolu bazlı kullanım analizi
- 🧳 Toplam uçuş ve bagaj sayıları
- 📱 Responsive tasarım
- 📁 CSV ve Excel dosya desteği

## Veri Yükleme

Gerçek verilerinizi yüklemek için:

1. **CSV Formatı**: `public/data/data.csv` dosyasına verilerinizi koyun
2. **Excel Formatı**: `public/data/data.xlsx` veya `public/data/data.xls` dosyasına verilerinizi koyun

### CSV/Excel Dosya Formatı

Dosyanız şu kolonları içermelidir:
- `Saha Adı` veya `SahaAdi` veya `saha_adi`
- `Saha Kodu` veya `SahaKodu` veya `saha_kodu`
- `Havayolu Kodu` veya `HavayoluKodu` veya `havayolu_kodu`
- `Havayolu Adı` veya `HavayoluAdi` veya `havayolu_adi` (opsiyonel)
- `Uçuş Sayısı` veya `UcusSayisi` veya `ucus_sayisi`
- `Bagaj Sayısı` veya `BagajSayisi` veya `bagaj_sayisi`

Örnek format için `data-template.csv` dosyasına bakabilirsiniz.

## Kurulum

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Teknolojiler

- React 18
- TypeScript
- Vite
- Tailwind CSS
- PapaParse (CSV parsing)
- xlsx (Excel parsing)
