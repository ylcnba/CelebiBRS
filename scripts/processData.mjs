/**
 * Veri İşleme Script'i
 * 
 * Bu script ham verileri alıp dashboard için uygun CSV formatına dönüştürür.
 * 
 * Kullanım:
 * npm run process-data <input-file> [output-file]
 * veya
 * node scripts/processData.mjs <input-file> [output-file]
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Flight kodundan Airline kodunu çıkarmak için mapping
// IATA kodları ve tam isimleri
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
  'MS': 'EgyptAir',
  'SU': 'Aeroflot',
  'VF': 'Vueling',
  'XC': 'Corendon Airlines',
  'J2': 'Azerbaijan Airlines',
  'FH': 'Freebird Airlines',
  'DL': 'Delta Air Lines',
  'AA': 'American Airlines',
  'UA': 'United Airlines',
  // IATA kodları
  '8Q': 'Onur Air',
  '8U': 'Afriqiyah Airways',
  'TF': 'Braathens Regional Airways',
  'DE': 'Condor',
  'Z4': 'Zoom Airlines',
  'IA': 'Iraqi Airways',
  'IP': 'Apsara International Air',
  'JN': 'Livingston',
  'KK': 'AtlasGlobal',
  'TM': 'LAM Mozambique Airlines',
  'M9': 'Motor Sich Airlines',
  'NG': 'Lauda Air',
  'QW': 'Qingdao Airlines',
  'SV': 'Saudia',
  'TI': 'Tailwind Airlines',
  'UG': 'Tuninter',
  'X3': 'TUI fly Deutschland',
  'UD': 'Hex\'Air',
  '3G': 'Gambia Bird',
  '3Z': 'Travel Service Polska',
  '6D': 'Pelita Air',
  'A3': 'Aegean Airlines',
  'AB': 'Air Berlin',
  'AL': 'Air Leisure',
  'DP': 'Pobeda',
  'EP': 'Iran Aseman Airlines',
  'G9': 'Air Arabia',
  'HF': 'Air Côte d\'Ivoire',
  'HQ': 'Harmony Airways',
  'LG': 'Luxair',
  'LX': 'Swiss International Air Lines',
  'MP': 'Martinair',
  'MT': 'Thomas Cook Airlines',
  'NN': 'VIM Airlines',
  'OR': 'TUI fly Netherlands',
  'OU': 'Croatia Airlines',
  'QS': 'SmartWings',
  'QU': 'East African Safari Air',
  'RV': 'Air Canada Rouge',
  'SE': 'XL Airways France',
  'ST': 'Germania',
  'TB': 'TUI fly Belgium',
  'XY': 'Flynas',
  'Y9': 'Kish Air',
  'ZT': 'Titan Airways',
  'ZF': 'Azur Air',
  'KC': 'Air Astana',
  'SN': 'Brussels Airlines',
  'KU': 'Kuwait Airways',
  'BY': 'TUI Airways',
  'DK': 'Sunclass Airlines',
  'YC': 'Yamal Airlines',
  'HY': 'Uzbekistan Airways',
  'DV': 'SCAT Airlines',
  'A2': 'Astra Airlines',
  '7R': 'RusLine',
  '4Y': 'Discover Airlines',
  'UZ': 'Buraq Air',
  '5W': 'Wizz Air Abu Dhabi',
  'TR': 'Scoot',
  'AT': 'Royal Air Maroc',
  'F3': 'Flyadeal',
  'IS': 'AIS Airlines',
  '4M': 'Mavi Gok Airlines',
  // ICAO kodları (IATA yok)
  'AAN': 'Al Ain International Airlines',
  'GTC': 'GTC Airlines',
  'BST': 'Best Air',
  'HCC': 'Heli Charter',
  'YAP': 'Yap Airways',
  'AHY': 'Azerbaijan Airlines (ICAO)',
  'TOM': 'TUI Airways (ICAO)',
  'MGH': 'Meghna Aviation',
  'FAD': 'Flyadeal (ICAO)',
  'BUR': 'Buraq Air (ICAO)',
  'LMZ': 'LAM Mozambique Airlines (ICAO)',
  'BRJ': 'Braathens Regional Airways (ICAO)',
};

// Saha kodları mapping
const airportMap = {
  'ADB': { code: 'ADB', name: 'Adnan Menderes Havalimanı' },
  'BJV': { code: 'BJV', name: 'Milas-Bodrum Havalimanı' },
  'COV': { code: 'COV', name: 'Çukurova Havalimanı' },
  'ESB': { code: 'ESB', name: 'Ankara Esenboğa Havalimanı' },
  'IST': { code: 'IST', name: 'İstanbul Havalimanı' },
  'SAW': { code: 'SAW', name: 'Sabiha Gökçen Havalimanı' },
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
 * Tek bir satırı işler
 */
function processSingleRow(row, fileName = '') {
  // Dosya adından saha kodunu çıkar (örn: COV.csv -> COV)
  let defaultAirportCode = '';
  if (fileName) {
    const match = fileName.match(/([A-Z]{3})\.csv$/i);
    if (match) {
      defaultAirportCode = match[1].toUpperCase();
    }
  }
  
  try {
    // Bagajın işlendiği sahayı bul (satırdaki saha bilgisi veya dosya adından)
    let airportCode = defaultAirportCode;
    
    if (Array.isArray(row)) {
      // Satırdaki saha bilgisini bul (genellikle 4. veya 5. kolon)
      // Önce 4. kolonu dene, sonra 5. kolonu
      if (row[4] && airportMap[row[4].toUpperCase()]) {
        airportCode = row[4].toUpperCase();
      } else if (row[3] && airportMap[row[3].toUpperCase()]) {
        airportCode = row[3].toUpperCase();
      }
    }
    
    if (!airportCode || !airportMap[airportCode]) {
      return null; // Saha kodu bulunamadı
    }
      
    // 7. elementi al (index 6) - JSON field
    let jsonField;
    
    if (Array.isArray(row)) {
      jsonField = row[6];
    } else if (typeof row === 'object') {
      jsonField = row[6] || row['7'] || row['field7'] || row['json'] || row['data'];
    } else {
      return null; // Beklenmeyen format
    }
    
    if (!jsonField) {
      return null; // JSON field bulunamadı
    }
      
    // JSON'u parse et
    const flightData = parseJsonField(jsonField);
    
    if (!flightData) {
      return null;
    }
    
    // Flight bilgisini al (INBOUND veya OUTBOUND - hangisi varsa)
    const inbound = flightData.INBOUND || flightData.inbound;
    const outbound = flightData.OUTBOUND || flightData.outbound;
    
    let flightNumber = null;
    let flightDate = null;
    
    if (inbound && inbound.FLIGHT) {
      flightNumber = inbound.FLIGHT || inbound.flight;
      flightDate = inbound.DATE || inbound.date;
    } else if (outbound && outbound.FLIGHT) {
      flightNumber = outbound.FLIGHT || outbound.flight;
      flightDate = outbound.DATE || outbound.date;
    }
    
    if (!flightNumber) {
      return null; // Flight bilgisi yok
    }
    
    // Tarihi normalize et
    let normalizedDate = '';
    if (flightDate) {
      try {
        const dateObj = new Date(flightDate);
        if (!isNaN(dateObj.getTime())) {
          const year = dateObj.getFullYear();
          const month = String(dateObj.getMonth() + 1).padStart(2, '0');
          const day = String(dateObj.getDate()).padStart(2, '0');
          normalizedDate = `${year}-${month}-${day}`;
        } else {
          normalizedDate = String(flightDate).substring(0, 10);
        }
      } catch (e) {
        normalizedDate = String(flightDate).substring(0, 10);
      }
    }
    
    const airlineCode = extractAirlineCode(flightNumber);
    const airlineName = airlineCodeMap[airlineCode] || airlineCode;
    
    return {
      airport: airportCode,
      flight: flightNumber,
      flightDate: normalizedDate,
      flightKey: `${flightNumber}_${normalizedDate}`,
      airlineCode: airlineCode,
      airlineName: airlineName,
    };
  } catch (error) {
    return null; // Hata durumunda null döndür
  }
}

/**
 * Ham veriyi işler ve CSV formatına dönüştürür (eski fonksiyon, geriye uyumluluk için)
 */
function processData(inputData, fileName = '') {
  const results = [];
  const dataArray = Array.isArray(inputData) ? inputData : [inputData];
  
  dataArray.forEach((row) => {
    const result = processSingleRow(row, fileName);
    if (result) {
      results.push(result);
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
    const key = `${result.airport}_${result.airlineCode}`;
    
    if (!grouped[key]) {
      grouped[key] = {
        sahaAdi: airportMap[result.airport].name,
        sahaKodu: result.airport,
        airlineCode: result.airlineCode,
        airlineName: result.airlineName,
        bagajSayisi: 0,
        ucusSayisi: new Set(), // Uçuş numarası + tarih kombinasyonları
      };
    }
    
    grouped[key].bagajSayisi += 1;
    // Uçuş numarası + tarih kombinasyonunu ekle (eşsiz uçuş)
    grouped[key].ucusSayisi.add(result.flightKey || `${result.flight}_${result.flightDate}`);
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
  
  return { csvContent: csvRows.join('\n'), grouped };
}

// Main execution
function main() {
  const args = process.argv.slice(2);
  
  if (args.length < 1) {
    console.log('Kullanım: node scripts/processData.mjs <input-file> [output-file]');
    console.log('veya: npm run process-data <input-file> [output-file]');
    console.log('');
    console.log('Örnek:');
    console.log('  node scripts/processData.mjs data.json output.csv');
    console.log('  node scripts/processData.mjs data.csv output.csv');
    console.log('  npm run process-data raw-data.json');
    process.exit(1);
  }
  
  const inputFile = args[0];
  const outputFile = args[1] || 'public/data/data.csv';
  
  if (!fs.existsSync(inputFile)) {
    console.error(`❌ Dosya bulunamadı: ${inputFile}`);
    process.exit(1);
  }
  
  console.log(`📂 Dosya okunuyor: ${inputFile}`);
  
  // Büyük CSV dosyaları için streaming kullan
  if (inputFile.endsWith('.csv')) {
    console.log('📊 CSV dosyası streaming modunda okunuyor...');
    const fileStream = fs.createReadStream(inputFile);
    const processedResults = [];
    let rowCount = 0;
    
    Papa.parse(fileStream, {
      header: false,
      skipEmptyLines: true,
      delimiter: ',',
      step: (result) => {
        rowCount++;
        // Her satırı işle ve sonuçları biriktir
        const row = result.data;
        try {
          const rowResult = processSingleRow(row, inputFile);
          if (rowResult) {
            processedResults.push(rowResult);
          }
        } catch (error) {
          // Hatalı satırları atla
        }
        
        // İlerleme göster
        if (rowCount % 100000 === 0) {
          console.log(`  İşlenen satır: ${rowCount.toLocaleString('tr-TR')}`);
        }
      },
      complete: () => {
        console.log(`✅ ${rowCount.toLocaleString('tr-TR')} satır okundu, ${processedResults.length.toLocaleString('tr-TR')} bagaj kaydı işlendi`);
        const { csvContent, grouped } = aggregateToCSV(processedResults);
        
        // Output dizinini oluştur
        const outputDir = path.dirname(outputFile);
        if (!fs.existsSync(outputDir)) {
          fs.mkdirSync(outputDir, { recursive: true });
        }
        
        fs.writeFileSync(outputFile, csvContent, 'utf8');
        console.log(`✅ CSV dosyası oluşturuldu: ${outputFile}`);
        console.log(`📊 Toplam ${Object.keys(grouped).length} farklı saha-airline kombinasyonu`);
        
        // Özet istatistikler
        console.log('\n📈 Özet İstatistikler:');
        Object.values(grouped).forEach(item => {
          console.log(`  ${item.sahaKodu} - ${item.airlineCode}: ${item.bagajSayisi.toLocaleString('tr-TR')} bagaj, ${item.ucusSayisi.size.toLocaleString('tr-TR')} farklı uçuş`);
        });
      },
      error: (error) => {
        console.error('❌ CSV parse hatası:', error.message);
        process.exit(1);
      }
    });
  } else {
    // Diğer formatlar için normal okuma
    let inputData;
    try {
      const fileContent = fs.readFileSync(inputFile, 'utf8');
      
      if (inputFile.endsWith('.json')) {
        inputData = JSON.parse(fileContent);
      } else if (inputFile.endsWith('.xlsx') || inputFile.endsWith('.xls')) {
        // Excel dosyası için XLSX kullan
        const workbook = XLSX.read(fileContent, { type: 'buffer' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        inputData = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: '' });
        console.log(`📊 Excel dosyası okundu: ${sheetName} sheet'i`);
      } else {
        try {
          inputData = JSON.parse(fileContent);
        } catch {
          console.error('❌ Dosya formatı tanınamadı. JSON, CSV veya Excel formatında olmalı.');
          process.exit(1);
        }
      }
      
      processCSVData(inputData, inputFile, outputFile);
    } catch (error) {
      console.error('❌ Dosya okuma hatası:', error.message);
      process.exit(1);
    }
  }
}

function processCSVData(inputData, inputFile, outputFile) {
  const dataLength = Array.isArray(inputData) ? inputData.length : Object.keys(inputData).length;
  console.log(`📊 ${dataLength} satır bulundu`);
  console.log('🔄 Veriler işleniyor...');
  
  const processed = processData(inputData, inputFile);
  console.log(`✅ ${processed.length} bagaj kaydı işlendi`);
  
  const { csvContent, grouped } = aggregateToCSV(processed);
  
  // Output dizinini oluştur
  const outputDir = path.dirname(outputFile);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  fs.writeFileSync(outputFile, csvContent, 'utf8');
  console.log(`✅ CSV dosyası oluşturuldu: ${outputFile}`);
  console.log(`📊 Toplam ${Object.keys(grouped).length} farklı saha-airline kombinasyonu`);
  
  // Özet istatistikler
  console.log('\n📈 Özet İstatistikler:');
  Object.values(grouped).forEach(item => {
    console.log(`  ${item.sahaKodu} - ${item.airlineCode}: ${item.bagajSayisi.toLocaleString('tr-TR')} bagaj, ${item.ucusSayisi.size.toLocaleString('tr-TR')} farklı uçuş`);
  });
}

// Script çalıştırılıyorsa main'i çağır
main();
