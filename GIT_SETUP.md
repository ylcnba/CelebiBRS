# Git Setup Instructions

## Büyük CSV Dosyalarını Git'ten Kaldırma

Eğer ham CSV dosyaları daha önce Git'e eklenmişse, şu komutları çalıştırın:

```bash
# Git repository'yi başlat (eğer yoksa)
git init

# Ham CSV dosyalarını Git'ten kaldır (cache'den sil ama dosyaları yerel olarak tut)
git rm --cached public/data/ADB.csv
git rm --cached public/data/BJV.csv
git rm --cached public/data/ESB.csv
git rm --cached public/data/COV.csv
git rm --cached public/data/ADB_processed.csv
git rm --cached public/data/BJV_processed.csv
git rm --cached public/data/ESB_processed.csv
git rm --cached public/data/COV_processed.csv
git rm --cached public/data/ADB_celebi_filtered.csv
git rm --cached public/data/BJV_celebi_filtered.csv
git rm --cached public/data/ESB_celebi_filtered.csv
git rm --cached public/data/COV_celebi_filtered.csv

# Değişiklikleri commit et
git add .gitignore
git commit -m "Exclude large CSV files from git"
```

## GitHub'a Push

```bash
# Remote repository ekle (eğer yoksa)
git remote add origin <your-repo-url>

# Push yap
git push -u origin main
# veya
git push -u origin master
```

## Notlar

- `data.csv` dosyası Git'e eklenecek (dashboard bunu kullanıyor)
- Ham CSV dosyaları (`ADB.csv`, `BJV.csv`, `ESB.csv`, `COV.csv`) Git'e eklenmeyecek
- İşlenmiş ve filtrelenmiş CSV dosyaları da Git'e eklenmeyecek
- `5year_summary.json`, `celebi_mapping.json` ve `CelebiSites.xlsx` Git'e eklenecek

