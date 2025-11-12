/**
 * Tüm filtrelenmiş verileri birleştirme script'i
 */

import fs from 'fs';
import path from 'path';
import Papa from 'papaparse';

const files = [
  'public/data/COV_celebi_filtered.csv',
  'public/data/ADB_celebi_filtered.csv',
  'public/data/BJV_celebi_filtered.csv',
  'public/data/ESB_celebi_filtered.csv',
];

const allRows = [];
const header = 'Saha Adı,Saha Kodu,Havayolu Kodu,Havayolu Adı,Uçuş Sayısı,Bagaj Sayısı';

files.forEach(file => {
  if (fs.existsSync(file)) {
    const content = fs.readFileSync(file, 'utf8');
    const parsed = Papa.parse(content, { header: true, skipEmptyLines: true });
    allRows.push(...parsed.data);
    console.log(`✅ ${file}: ${parsed.data.length} satır eklendi`);
  } else {
    console.log(`⚠️  ${file} bulunamadı, atlanıyor`);
  }
});

const csvRows = [header];
allRows.forEach(row => {
  csvRows.push(
    `${row['Saha Adı'] || ''},${row['Saha Kodu'] || ''},${row['Havayolu Kodu'] || ''},${row['Havayolu Adı'] || ''},${row['Uçuş Sayısı'] || '0'},${row['Bagaj Sayısı'] || '0'}`
  );
});

fs.writeFileSync('public/data/data.csv', csvRows.join('\n'), 'utf8');
console.log(`\n✅ Tüm veriler birleştirildi: public/data/data.csv`);
console.log(`📊 Toplam ${allRows.length} satır`);

// Özet
const totalBags = allRows.reduce((sum, row) => sum + parseInt(row['Bagaj Sayısı'] || '0'), 0);
const totalFlights = allRows.reduce((sum, row) => sum + parseInt(row['Uçuş Sayısı'] || '0'), 0);
const airports = new Set(allRows.map(row => row['Saha Kodu']));

console.log(`\n📈 Toplam İstatistikler:`);
console.log(`  Sahalar: ${airports.size}`);
console.log(`  Toplam Bagaj: ${totalBags.toLocaleString('tr-TR')}`);
console.log(`  Toplam Uçuş: ${totalFlights.toLocaleString('tr-TR')}`);

