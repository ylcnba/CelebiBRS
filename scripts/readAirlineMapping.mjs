/**
 * Excel'den Saha-Airline Mapping Okuma Script'i
 * 
 * Bu script Excel dosyasından Çelebi'nin hangi sahada hangi airline'lara
 * hizmet verdiği bilgisini okur ve JSON formatında kaydeder.
 * 
 * Kullanım:
 * node scripts/readAirlineMapping.mjs <excel-file> [output-json]
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import * as XLSX from 'xlsx';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Airline kodları mapping (tam isimler için)
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
 * Excel dosyasını oku ve saha-airline mapping'i çıkar
 */
function readAirlineMapping(excelFile) {
  console.log(`📂 Excel dosyası okunuyor: ${excelFile}`);
  
  const fileContent = fs.readFileSync(excelFile);
  const workbook = XLSX.read(fileContent, { type: 'buffer' });
  
  console.log(`📊 Bulunan sheet'ler: ${workbook.SheetNames.join(', ')}`);
  
  // İlk sheet'i oku
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  
  // Excel'i JSON formatına çevir (header ile)
  const jsonData = XLSX.utils.sheet_to_json(worksheet, { 
    header: 1, // İlk satır header olarak kullanılacak
    defval: '',
    raw: false
  });
  
  if (jsonData.length === 0) {
    throw new Error('Excel dosyası boş görünüyor');
  }
  
  // İlk satırı header olarak al
  const headers = jsonData[0].map(h => String(h).trim());
  console.log(`📋 Kolonlar: ${headers.join(', ')}`);
  
  // Header'lardan saha ve airline kolonlarını bul
  let sahaKoduIndex = -1;
  let sahaAdiIndex = -1;
  let airlineKoduIndex = -1;
  let airlineAdiIndex = -1;
  
  headers.forEach((header, index) => {
    const headerLower = header.toLowerCase();
    if (headerLower.includes('saha') && headerLower.includes('kod')) {
      sahaKoduIndex = index;
    } else if (headerLower.includes('saha') && (headerLower.includes('ad') || headerLower.includes('isim'))) {
      sahaAdiIndex = index;
    } else if (headerLower.includes('havayolu') && headerLower.includes('kod')) {
      airlineKoduIndex = index;
    } else if (headerLower.includes('havayolu') && (headerLower.includes('ad') || headerLower.includes('isim'))) {
      airlineAdiIndex = index;
    }
  });
  
  // Alternatif kolon isimlerini dene
  if (sahaKoduIndex === -1) {
    headers.forEach((header, index) => {
      const headerLower = header.toLowerCase();
      if (headerLower.includes('airport') || headerLower.includes('havaalani')) {
        sahaKoduIndex = index;
      }
    });
  }
  
  if (airlineKoduIndex === -1) {
    headers.forEach((header, index) => {
      const headerLower = header.toLowerCase();
      if (headerLower.includes('airline') || headerLower.includes('iata') || headerLower.includes('code')) {
        airlineKoduIndex = index;
      }
    });
  }
  
  console.log(`\n📍 Bulunan kolonlar:`);
  console.log(`  Saha Kodu: ${sahaKoduIndex >= 0 ? headers[sahaKoduIndex] : 'BULUNAMADI'}`);
  console.log(`  Saha Adı: ${sahaAdiIndex >= 0 ? headers[sahaAdiIndex] : 'BULUNAMADI'}`);
  console.log(`  Airline Kodu: ${airlineKoduIndex >= 0 ? headers[airlineKoduIndex] : 'BULUNAMADI'}`);
  console.log(`  Airline Adı: ${airlineAdiIndex >= 0 ? headers[airlineAdiIndex] : 'BULUNAMADI'}`);
  
  if (sahaKoduIndex === -1 || airlineKoduIndex === -1) {
    throw new Error('Saha kodu veya Airline kodu kolonu bulunamadı. Lütfen Excel dosyasının formatını kontrol edin.');
  }
  
  // Verileri işle
  const mapping = {};
  
  for (let i = 1; i < jsonData.length; i++) {
    const row = jsonData[i];
    const sahaKodu = String(row[sahaKoduIndex] || '').trim().toUpperCase();
    const airlineKodu = String(row[airlineKoduIndex] || '').trim().toUpperCase();
    
    if (!sahaKodu || !airlineKodu || sahaKodu === '' || airlineKodu === '') {
      continue; // Boş satırları atla
    }
    
    // Saha bilgisini al
    let sahaAdi = '';
    if (sahaAdiIndex >= 0 && row[sahaAdiIndex]) {
      sahaAdi = String(row[sahaAdiIndex]).trim();
    } else if (airportMap[sahaKodu]) {
      sahaAdi = airportMap[sahaKodu].name;
    } else {
      sahaAdi = sahaKodu;
    }
    
    // Airline bilgisini al
    let airlineAdi = '';
    if (airlineAdiIndex >= 0 && row[airlineAdiIndex]) {
      airlineAdi = String(row[airlineAdiIndex]).trim();
    } else if (airlineCodeMap[airlineKodu]) {
      airlineAdi = airlineCodeMap[airlineKodu];
    } else {
      airlineAdi = airlineKodu;
    }
    
    // Mapping'e ekle
    if (!mapping[sahaKodu]) {
      mapping[sahaKodu] = {
        code: sahaKodu,
        name: sahaAdi,
        airlines: []
      };
    }
    
    // Airline'ı ekle (duplicate kontrolü)
    const existingAirline = mapping[sahaKodu].airlines.find(a => a.code === airlineKodu);
    if (!existingAirline) {
      mapping[sahaKodu].airlines.push({
        code: airlineKodu,
        name: airlineAdi
      });
    }
  }
  
  return mapping;
}

// Main execution
function main() {
  const args = process.argv.slice(2);
  
  if (args.length < 1) {
    console.log('Kullanım: node scripts/readAirlineMapping.mjs <excel-file> [output-json]');
    console.log('');
    console.log('Örnek:');
    console.log('  node scripts/readAirlineMapping.mjs airline_mapping.xlsx');
    console.log('  node scripts/readAirlineMapping.mjs airline_mapping.xlsx output.json');
    process.exit(1);
  }
  
  const excelFile = args[0];
  const outputFile = args[1] || 'public/data/airline_mapping.json';
  
  if (!fs.existsSync(excelFile)) {
    console.error(`❌ Dosya bulunamadı: ${excelFile}`);
    process.exit(1);
  }
  
  if (!excelFile.endsWith('.xlsx') && !excelFile.endsWith('.xls')) {
    console.error(`❌ Dosya Excel formatında olmalı (.xlsx veya .xls)`);
    process.exit(1);
  }
  
  try {
    const mapping = readAirlineMapping(excelFile);
    
    // JSON formatına çevir
    const jsonContent = JSON.stringify(mapping, null, 2);
    
    // Output dizinini oluştur
    const outputDir = path.dirname(outputFile);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    // Dosyaya yaz
    fs.writeFileSync(outputFile, jsonContent, 'utf8');
    
    console.log(`\n✅ Mapping dosyası oluşturuldu: ${outputFile}`);
    console.log(`\n📊 Özet:`);
    
    Object.keys(mapping).forEach(sahaKodu => {
      const saha = mapping[sahaKodu];
      console.log(`  ${sahaKodu} (${saha.name}): ${saha.airlines.length} airline`);
      saha.airlines.forEach(airline => {
        console.log(`    - ${airline.code}: ${airline.name}`);
      });
    });
    
  } catch (error) {
    console.error(`❌ Hata: ${error.message}`);
    process.exit(1);
  }
}

// Script çalıştırılıyorsa main'i çağır
main();

