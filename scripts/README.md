# Veri İşleme Script'i

Bu script, ham verilerinizi dashboard için uygun CSV formatına dönüştürür.

## Veri Formatı

Girdi dosyanız şu formatta olmalı:

### JSON Formatı
```json
[
  ["...", "...", "...", "...", "...", "...", "{\"DEPARTURE\":\"ADB\",\"OUTBOUND\":{\"FLIGHT\":\"XQ894\",\"DEST\":\"BCN\",\"CLASS\":\"Y\",\"DATE\":\"Sun Oct 05 00:00:00 UTC 2025\"},\"ONWARDLIST\":[]}"],
  ...
]
```

Her satırın 7. elementi (index 6) JSON formatında şu bilgileri içermelidir:
- `DEPARTURE`: Saha kodu (ADB, BJV, COV, ESB)
- `OUTBOUND.FLIGHT`: Uçuş numarası (örn: XQ894, TK123)

### CSV Formatı
CSV dosyasında her satırın 7. kolonu JSON string içermelidir.

## Kullanım

```bash
# JSON dosyasından
npm run process-data raw-data.json

# CSV dosyasından
npm run process-data raw-data.csv

# Çıktı dosyası belirtme
npm run process-data raw-data.json output.csv
```

## Çıktı

Script, `public/data/data.csv` dosyasını oluşturur (veya belirttiğiniz çıktı dosyasını).

Çıktı formatı:
```csv
Saha Adı,Saha Kodu,Havayolu Kodu,Havayolu Adı,Uçuş Sayısı,Bagaj Sayısı
Adnan Menderes Havalimanı,ADB,XQ,SunExpress,150,3000
...
```

## Airline Mapping

Script, flight kodunun ilk 2 karakterinden airline kodunu çıkarır. 
Yeni airline'lar eklemek için `scripts/processData.mjs` dosyasındaki `airlineCodeMap` objesini güncelleyin.

