# GitHub Pages Deployment Guide

## Adım 1: GitHub Actions'ı Aktifleştir

1. Repository'ye gidin: https://github.com/ylcnba/CelebiBRS
2. **Settings** → **Actions** → **General** sekmesine gidin
3. **"Allow all actions and reusable workflows"** seçeneğinin seçili olduğundan emin olun
4. **Save** butonuna tıklayın

## Adım 2: GitHub Pages'i Aktifleştir

1. **Settings** → **Pages** sekmesine gidin
2. **Source** bölümünde:
   - **"Deploy from a branch"** yerine **"GitHub Actions"** seçin
   - Eğer "GitHub Actions" seçeneği görünmüyorsa, önce Actions'ı çalıştırın
3. **Save** butonuna tıklayın

## Adım 3: Actions'ı Kontrol Et

1. **Actions** sekmesine gidin
2. En son workflow'u kontrol edin
3. Eğer hata varsa, detaylarına bakın

## Alternatif: Manuel Deploy (Eğer Actions çalışmazsa)

Eğer GitHub Actions çalışmazsa, manuel olarak deploy edebilirsiniz:

```bash
# Local'de build yapın
npm run build

# dist klasörünü GitHub'a push edin
git add dist
git commit -m "Deploy to GitHub Pages"
git subtree push --prefix dist origin gh-pages
```

Veya `gh-pages` branch'i oluşturup dist klasörünü oraya push edin.

## Sorun Giderme

### Actions çalışmıyor
- Settings → Actions → General'de "Allow all actions" seçili olmalı
- Actions sekmesinde workflow'lar görünmeli

### 404 hatası
- Base path'in `/CelebiBRS/` olduğundan emin olun
- URL'nin doğru olduğunu kontrol edin: `https://ylcnba.github.io/CelebiBRS/`

### Build hatası
- Actions sekmesinde build loglarını kontrol edin
- `npm ci` ve `npm run build` komutlarının başarılı olduğundan emin olun

