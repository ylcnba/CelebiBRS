/**
 * Saha isimlerini İngilizce'ye çevirme script'i
 */

import fs from 'fs';
import Papa from 'papaparse';

const airportNameMap = {
  'Çukurova Havalimanı': 'Çukurova Airport',
  'Adnan Menderes Havalimanı': 'Adnan Menderes Airport',
  'Milas-Bodrum Havalimanı': 'Milas-Bodrum Airport',
  'Ankara Esenboğa Havalimanı': 'Ankara Esenboğa Airport',
};

function translateCSVFile(filePath) {
  console.log(`\n📂 Translating: ${filePath}`);
  
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  File not found: ${filePath}`);
    return;
  }
  
  const content = fs.readFileSync(filePath, 'utf8');
  const parsed = Papa.parse(content, {
    header: true,
    skipEmptyLines: true,
  });
  
  let updated = false;
  const updatedRows = parsed.data.map(row => {
    const currentName = row['Saha Adı'] || row['SahaAdi'] || '';
    
    if (currentName && airportNameMap[currentName]) {
      updated = true;
      return {
        ...row,
        'Saha Adı': airportNameMap[currentName],
      };
    }
    return row;
  });
  
  if (updated) {
    const csvRows = [
      'Saha Adı,Saha Kodu,Havayolu Kodu,Havayolu Adı,Uçuş Sayısı,Bagaj Sayısı'
    ];
    
    updatedRows.forEach(row => {
      csvRows.push(
        `${row['Saha Adı'] || ''},${row['Saha Kodu'] || ''},${row['Havayolu Kodu'] || ''},${row['Havayolu Adı'] || ''},${row['Uçuş Sayısı'] || '0'},${row['Bagaj Sayısı'] || '0'}`
      );
    });
    
    fs.writeFileSync(filePath, csvRows.join('\n'), 'utf8');
    console.log(`✅ Updated: ${filePath}`);
  } else {
    console.log(`ℹ️  No changes needed: ${filePath}`);
  }
}

const csvFiles = [
  'public/data/data.csv',
  'public/data/COV_celebi_filtered.csv',
  'public/data/ADB_celebi_filtered.csv',
  'public/data/BJV_celebi_filtered.csv',
  'public/data/ESB_celebi_filtered.csv',
];

console.log('🔄 Translating airport names to English...');
csvFiles.forEach(translateCSVFile);
console.log('\n✅ All files updated!');

