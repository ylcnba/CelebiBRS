/**
 * Mevcut CSV dosyalarındaki airline isimlerini güncelleme script'i
 */

import fs from 'fs';
import Papa from 'papaparse';

// Airline kodları mapping
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

function updateCSVFile(filePath) {
  console.log(`\n📂 Updating: ${filePath}`);
  
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
    const airlineCode = (row['Havayolu Kodu'] || row['HavayoluKodu'] || '').trim().toUpperCase();
    const currentName = row['Havayolu Adı'] || row['HavayoluAdi'] || '';
    
    if (airlineCode && airlineCodeMap[airlineCode]) {
      const correctName = airlineCodeMap[airlineCode];
      if (currentName !== correctName) {
        updated = true;
        return {
          ...row,
          'Havayolu Adı': correctName,
        };
      }
    }
    return row;
  });
  
  if (updated) {
    // CSV'ye geri yaz
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

// Tüm CSV dosyalarını güncelle
const csvFiles = [
  'public/data/data.csv',
  'public/data/COV_celebi_filtered.csv',
  'public/data/ADB_celebi_filtered.csv',
  'public/data/BJV_celebi_filtered.csv',
  'public/data/ESB_celebi_filtered.csv',
];

console.log('🔄 Updating airline names in CSV files...');
csvFiles.forEach(updateCSVFile);
console.log('\n✅ All files updated!');

