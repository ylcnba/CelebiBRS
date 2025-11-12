/**
 * Çelebi Mapping'e göre verileri filtreleme script'i
 * 
 * Bu script, işlenmiş CSV verilerini Çelebi'nin hizmet verdiği
 * airline'lara göre filtreler ve gerçek rakamları çıkarır.
 * 
 * Kullanım:
 * node scripts/filterCelebiData.mjs <processed-csv> <mapping-json> [output-csv]
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Papa from 'papaparse';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function filterCelebiData(csvFile, mappingFile, outputFile) {
  console.log(`📂 CSV dosyası okunuyor: ${csvFile}`);
  console.log(`📂 Mapping dosyası okunuyor: ${mappingFile}`);
  
  // Mapping dosyasını oku
  const mappingContent = fs.readFileSync(mappingFile, 'utf8');
  const mapping = JSON.parse(mappingContent);
  
  // CSV dosyasını oku
  const csvContent = fs.readFileSync(csvFile, 'utf8');
  const parsed = Papa.parse(csvContent, {
    header: true,
    skipEmptyLines: true,
  });
  
  const rows = parsed.data;
  console.log(`📊 Toplam ${rows.length} satır bulundu`);
  
  // Her saha için Çelebi'nin hizmet verdiği airline'ları al
  const celebiAirlinesByAirport = {};
  
  Object.keys(mapping).forEach(airportCode => {
    const airport = mapping[airportCode];
    celebiAirlinesByAirport[airportCode] = new Set(
      airport.airlines.map(a => a.code.toUpperCase())
    );
    console.log(`\n📍 ${airportCode} (${airport.name}): ${airport.airlines.length} airline`);
    airport.airlines.forEach(airline => {
      console.log(`   - ${airline.code}: ${airline.name}`);
    });
  });
  
  // CSV verilerini filtrele
  const filteredRows = [];
  let totalFilteredBags = 0;
  let totalFilteredFlights = 0;
  
  rows.forEach(row => {
    const sahaKodu = (row['Saha Kodu'] || row['SahaKodu'] || '').trim().toUpperCase();
    const airlineKodu = (row['Havayolu Kodu'] || row['HavayoluKodu'] || '').trim().toUpperCase();
    const bagajSayisi = parseInt(row['Bagaj Sayısı'] || row['BagajSayisi'] || '0');
    const ucusSayisi = parseInt(row['Uçuş Sayısı'] || row['UcusSayisi'] || '0');
    
    // Bu saha için Çelebi'nin hizmet verdiği airline'ları kontrol et
    const celebiAirlines = celebiAirlinesByAirport[sahaKodu];
    
    if (celebiAirlines && celebiAirlines.has(airlineKodu)) {
      // Bu airline Çelebi'nin hizmet verdiği airline'lardan biri
      filteredRows.push(row);
      totalFilteredBags += bagajSayisi;
      totalFilteredFlights += ucusSayisi;
    }
  });
  
  console.log(`\n✅ Filtreleme tamamlandı:`);
  console.log(`   Toplam satır: ${rows.length}`);
  console.log(`   Filtrelenmiş satır: ${filteredRows.length}`);
  console.log(`   Toplam bagaj (filtrelenmiş): ${totalFilteredBags.toLocaleString('tr-TR')}`);
  console.log(`   Toplam uçuş (filtrelenmiş): ${totalFilteredFlights.toLocaleString('tr-TR')}`);
  
  // CSV formatına çevir
  const csvRows = [
    'Saha Adı,Saha Kodu,Havayolu Kodu,Havayolu Adı,Uçuş Sayısı,Bagaj Sayısı'
  ];
  
  filteredRows.forEach(row => {
    csvRows.push(
      `${row['Saha Adı'] || ''},${row['Saha Kodu'] || ''},${row['Havayolu Kodu'] || ''},${row['Havayolu Adı'] || ''},${row['Uçuş Sayısı'] || '0'},${row['Bagaj Sayısı'] || '0'}`
    );
  });
  
  // Output dizinini oluştur
  const outputDir = path.dirname(outputFile);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  // Dosyaya yaz
  fs.writeFileSync(outputFile, csvRows.join('\n'), 'utf8');
  console.log(`\n✅ Filtrelenmiş CSV dosyası oluşturuldu: ${outputFile}`);
  
  // Saha bazlı özet
  console.log(`\n📊 Saha Bazlı Özet:`);
  const summaryByAirport = {};
  
  filteredRows.forEach(row => {
    const sahaKodu = (row['Saha Kodu'] || '').trim();
    const airlineKodu = (row['Havayolu Kodu'] || '').trim();
    const bagajSayisi = parseInt(row['Bagaj Sayısı'] || '0');
    const ucusSayisi = parseInt(row['Uçuş Sayısı'] || '0');
    
    if (!summaryByAirport[sahaKodu]) {
      summaryByAirport[sahaKodu] = {
        name: row['Saha Adı'] || sahaKodu,
        airlines: [],
        totalBags: 0,
        totalFlights: 0,
      };
    }
    
    summaryByAirport[sahaKodu].airlines.push({
      code: airlineKodu,
      name: row['Havayolu Adı'] || airlineKodu,
      bags: bagajSayisi,
      flights: ucusSayisi,
    });
    
    summaryByAirport[sahaKodu].totalBags += bagajSayisi;
    summaryByAirport[sahaKodu].totalFlights += ucusSayisi;
  });
  
  Object.keys(summaryByAirport).forEach(airportCode => {
    const summary = summaryByAirport[airportCode];
    console.log(`\n  ${airportCode} - ${summary.name}:`);
    console.log(`    Toplam: ${summary.totalBags.toLocaleString('tr-TR')} bagaj, ${summary.totalFlights.toLocaleString('tr-TR')} uçuş`);
    summary.airlines.forEach(airline => {
      console.log(`    ${airline.code} (${airline.name}): ${airline.bags.toLocaleString('tr-TR')} bagaj, ${airline.flights.toLocaleString('tr-TR')} uçuş`);
    });
  });
}

// Main execution
function main() {
  const args = process.argv.slice(2);
  
  if (args.length < 2) {
    console.log('Kullanım: node scripts/filterCelebiData.mjs <processed-csv> <mapping-json> [output-csv]');
    console.log('');
    console.log('Örnek:');
    console.log('  node scripts/filterCelebiData.mjs public/data/COV_processed.csv public/data/celebi_mapping.json');
    console.log('  node scripts/filterCelebiData.mjs public/data/COV_processed.csv public/data/celebi_mapping.json public/data/COV_celebi_filtered.csv');
    process.exit(1);
  }
  
  const csvFile = args[0];
  const mappingFile = args[1];
  const outputFile = args[2] || csvFile.replace('.csv', '_celebi_filtered.csv');
  
  if (!fs.existsSync(csvFile)) {
    console.error(`❌ CSV dosyası bulunamadı: ${csvFile}`);
    process.exit(1);
  }
  
  if (!fs.existsSync(mappingFile)) {
    console.error(`❌ Mapping dosyası bulunamadı: ${mappingFile}`);
    process.exit(1);
  }
  
  try {
    filterCelebiData(csvFile, mappingFile, outputFile);
  } catch (error) {
    console.error(`❌ Hata: ${error.message}`);
    console.error(error.stack);
    process.exit(1);
  }
}

// Script çalıştırılıyorsa main'i çağır
main();

