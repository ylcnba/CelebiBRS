/**
 * Veri İşleme Script'i
 * 
 * Bu script ham verileri alıp dashboard için uygun CSV formatına dönüştürür.
 * 
 * Kullanım:
 * node scripts/processData.js input.json output.csv
 */

const fs = require('fs');
const path = require('path');

// Flight kodundan Airline kodunu çıkarmak için mapping
// İlk 2 karakter genellikle airline kodunu verir
const airlineCodeMap = {
  'TK': 'Turkish Airlines',
  'PC': 'Pegasus Airlines',
  'XQ': 'SunExpress',
  'W6': 'Wizz Air',
  'FR': 'Ryanair',
  'LH': 'Lufthansa',
  'BA': 'British Airways',
  'AF': 'Air France',
  'KL': 'KLM',
  'EK': 'Emirates',
  'QR': 'Qatar Airways',
  // Daha fazla airline eklenebilir
};

// Saha kodları mapping
const airportMap = {
  'ADB': { code: 'ADB', name: 'Adnan Menderes Havalimanı' },
  'BJV': { code: 'BJV', name: 'Milas-Bodrum Havalimanı' },
  'COV': { code: 'COV', name: 'Çorlu Havalimanı' },
  'ESB': { code: 'ESB', name: 'Ankara Esenboğa Havalimanı' },
};

/**
 * Flight kodundan airline kodunu çıkarır
 */
function extractAirlineCode(flightNumber) {
  if (!flightNumber || typeof flightNumber !== 'string') {
    return 'UNKNOWN';
  }
  
  // İlk 2 karakteri al (bazen 3 karakter olabilir, örn: UAL)
  const code = flightNumber.substring(0, 2).toUpperCase();
  
  // Eğer mapping'de varsa kullan, yoksa direkt kodu döndür
  return airlineCodeMap[code] ? code : code;
}

/**
 * JSON string'i parse eder
 */
function parseJsonField(field) {
  try {
    if (typeof field === 'string') {
      return JSON.parse(field);
    }
    return field;
  } catch (e) {
    console.warn('JSON parse hatası:', e.message);
    return null;
  }
}

/**
 * Ham veriyi işler ve CSV formatına dönüştürür
 */
function processData(inputData) {
  const results = [];
  
  // Eğer inputData bir array değilse, array'e çevir
  const dataArray = Array.isArray(inputData) ? inputData : [inputData];
  
  dataArray.forEach((row, index) => {
    try {
      // 7. elementi al (index 6)
      const jsonField = row[6] || row['7'] || row[6];
      
      if (!jsonField) {
        console.warn(`Satır ${index + 1}: 7. element bulunamadı`);
        return;
      }
      
      // JSON'u parse et
      const flightData = parseJsonField(jsonField);
      
      if (!flightData) {
        return;
      }
      
      // Departure (saha) bilgisini al
      const departure = flightData.DEPARTURE || flightData.departure;
      if (!departure) {
        console.warn(`Satır ${index + 1}: DEPARTURE bilgisi bulunamadı`);
        return;
      }
      
      // Airport bilgisini al
      const airport = airportMap[departure];
      if (!airport) {
        console.warn(`Satır ${index + 1}: Bilinmeyen saha kodu: ${departure}`);
        return;
      }
      
      // Flight bilgisini al
      const outbound = flightData.OUTBOUND || flightData.outbound;
      if (!outbound || !outbound.FLIGHT) {
        console.warn(`Satır ${index + 1}: FLIGHT bilgisi bulunamadı`);
        return;
      }
      
      const flightNumber = outbound.FLIGHT || outbound.flight;
      const airlineCode = extractAirlineCode(flightNumber);
      const airlineName = airlineCodeMap[airlineCode] || airlineCode;
      
      // Sonuç objesi oluştur
      results.push({
        departure: departure,
        flight: flightNumber,
        airlineCode: airlineCode,
        airlineName: airlineName,
      });
      
    } catch (error) {
      console.error(`Satır ${index + 1} işlenirken hata:`, error.message);
    }
  });
  
  return results;
}

/**
 * Sonuçları CSV formatına dönüştürür
 */
function aggregateToCSV(results) {
  // Saha ve airline bazında grupla
  const grouped = {};
  
  results.forEach(result => {
    const key = `${result.departure}_${result.airlineCode}`;
    
    if (!grouped[key]) {
      grouped[key] = {
        sahaAdi: airportMap[result.departure].name,
        sahaKodu: result.departure,
        airlineCode: result.airlineCode,
        airlineName: result.airlineName,
        bagajSayisi: 0,
        ucusSayisi: new Set(),
      };
    }
    
    grouped[key].bagajSayisi += 1;
    grouped[key].ucusSayisi.add(result.flight);
  });
  
  // CSV satırlarına dönüştür
  const csvRows = [
    'Saha Adı,Saha Kodu,Havayolu Kodu,Havayolu Adı,Uçuş Sayısı,Bagaj Sayısı'
  ];
  
  Object.values(grouped).forEach(item => {
    csvRows.push(
      `${item.sahaAdi},${item.sahaKodu},${item.airlineCode},${item.airlineName},${item.ucusSayisi.size},${item.bagajSayisi}`
    );
  });
  
  return csvRows.join('\n');
}

// Main execution
function main() {
  const args = process.argv.slice(2);
  
  if (args.length < 1) {
    console.log('Kullanım: node scripts/processData.js <input-file> [output-file]');
    console.log('');
    console.log('Örnek:');
    console.log('  node scripts/processData.js data.json output.csv');
    console.log('  node scripts/processData.js data.csv output.csv');
    process.exit(1);
  }
  
  const inputFile = args[0];
  const outputFile = args[1] || 'public/data/data.csv';
  
  if (!fs.existsSync(inputFile)) {
    console.error(`Dosya bulunamadı: ${inputFile}`);
    process.exit(1);
  }
  
  console.log(`Dosya okunuyor: ${inputFile}`);
  
  let inputData;
  try {
    const fileContent = fs.readFileSync(inputFile, 'utf8');
    
    // JSON veya CSV olup olmadığını kontrol et
    if (inputFile.endsWith('.json')) {
      inputData = JSON.parse(fileContent);
    } else if (inputFile.endsWith('.csv')) {
      // CSV için basit bir parser (daha gelişmiş bir parser kullanılabilir)
      const lines = fileContent.split('\n');
      inputData = lines.map(line => line.split(','));
    } else {
      // JSON olarak dene
      inputData = JSON.parse(fileContent);
    }
  } catch (error) {
    console.error('Dosya okuma hatası:', error.message);
    process.exit(1);
  }
  
  console.log(`${inputData.length || Object.keys(inputData).length} satır bulundu`);
  console.log('Veriler işleniyor...');
  
  const processed = processData(inputData);
  console.log(`${processed.length} bagaj kaydı işlendi`);
  
  const csvContent = aggregateToCSV(processed);
  
  // Output dizinini oluştur
  const outputDir = path.dirname(outputFile);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  fs.writeFileSync(outputFile, csvContent, 'utf8');
  console.log(`✅ CSV dosyası oluşturuldu: ${outputFile}`);
  console.log(`📊 Toplam ${Object.keys(grouped).length} farklı saha-airline kombinasyonu`);
}

// Script çalıştırılıyorsa main'i çağır
if (require.main === module) {
  main();
}

module.exports = { processData, aggregateToCSV, extractAirlineCode };

