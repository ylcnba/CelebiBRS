/**
 * CelebiSites.xlsx'den 5 yıllık veriyi çıkarma script'i
 */

import fs from 'fs';
import path from 'path';
import * as XLSX from 'xlsx';

const excelFile = 'public/data/CelebiSites.xlsx';

console.log(`📂 Excel dosyası okunuyor: ${excelFile}`);

const fileContent = fs.readFileSync(excelFile);
const workbook = XLSX.read(fileContent, { type: 'buffer' });

console.log(`📊 Bulunan sheet'ler: ${workbook.SheetNames.join(', ')}`);

// Tüm sheet'leri oku
const allData = {};

workbook.SheetNames.forEach(sheetName => {
  const worksheet = workbook.Sheets[sheetName];
  const jsonData = XLSX.utils.sheet_to_json(worksheet, { 
    header: 1,
    defval: '',
    raw: false
  });
  
  console.log(`\n📋 Sheet: ${sheetName}`);
  console.log(`   Toplam satır: ${jsonData.length}`);
  
  if (jsonData.length > 0) {
    console.log(`   İlk satır: ${JSON.stringify(jsonData[0])}`);
  }
  
  allData[sheetName] = jsonData;
});

// Veriyi analiz et ve JSON'a çevir
const summary = {
  totalSites: 0,
  sites: [],
  totalAirlines: 0,
  airlines: new Set(),
  years: new Set(),
};

// COMPANY, AIRPORT, AIRLINE kolonlarını bul
const mainSheet = workbook.SheetNames[0];
const worksheet = workbook.Sheets[mainSheet];
const jsonData = XLSX.utils.sheet_to_json(worksheet, { 
  header: 1,
  defval: '',
});

const headers = jsonData[0] || [];
console.log(`\n📋 Kolonlar: ${headers.join(', ')}`);

// COMPANY, AIRPORT, AIRLINE kolonlarını bul
let companyIndex = -1;
let airportIndex = -1;
let airlineIndex = -1;
let yearIndex = -1;

headers.forEach((header, index) => {
  const headerLower = String(header).toLowerCase();
  if (headerLower.includes('company') || headerLower.includes('şirket')) {
    companyIndex = index;
  } else if (headerLower.includes('airport') || headerLower.includes('saha') || headerLower.includes('havaalani')) {
    airportIndex = index;
  } else if (headerLower.includes('airline') || headerLower.includes('havayolu')) {
    airlineIndex = index;
  } else if (headerLower.includes('year') || headerLower.includes('yıl')) {
    yearIndex = index;
  }
});

console.log(`\n📍 Bulunan kolonlar:`);
console.log(`  Company: ${companyIndex >= 0 ? headers[companyIndex] : 'BULUNAMADI'}`);
console.log(`  Airport: ${airportIndex >= 0 ? headers[airportIndex] : 'BULUNAMADI'}`);
console.log(`  Airline: ${airlineIndex >= 0 ? headers[airlineIndex] : 'BULUNAMADI'}`);
console.log(`  Year: ${yearIndex >= 0 ? headers[yearIndex] : 'BULUNAMADI'}`);

if (airportIndex === -1 || airlineIndex === -1) {
  console.error('❌ Airport veya Airline kolonu bulunamadı!');
  process.exit(1);
}

// Verileri işle
const siteMap = new Map();
const airlineSet = new Set();
const yearSet = new Set();

for (let i = 1; i < jsonData.length; i++) {
  const row = jsonData[i];
  const airport = String(row[airportIndex] || '').trim().toUpperCase();
  const airline = String(row[airlineIndex] || '').trim().toUpperCase();
  const year = yearIndex >= 0 ? String(row[yearIndex] || '').trim() : '';
  
  if (!airport || !airline) continue;
  
  airlineSet.add(airline);
  if (year) yearSet.add(year);
  
  const key = airport;
  if (!siteMap.has(key)) {
    siteMap.set(key, {
      code: airport,
      name: getAirportName(airport),
      airlines: new Set(),
      years: new Set(),
    });
  }
  
  const site = siteMap.get(key);
  site.airlines.add(airline);
  if (year) site.years.add(year);
}

// Sonuçları hazırla
const result = {
  summary: {
    totalSites: siteMap.size,
    totalAirlines: airlineSet.size,
    years: Array.from(yearSet).sort(),
  },
  sites: Array.from(siteMap.values()).map(site => ({
    code: site.code,
    name: site.name,
    airlineCount: site.airlines.size,
    airlines: Array.from(site.airlines).sort(),
    years: Array.from(site.years).sort(),
  })),
};

function getAirportName(code) {
  const airportNames = {
    'ADB': 'Adnan Menderes Airport',
    'BJV': 'Milas-Bodrum Airport',
    'COV': 'Çukurova Airport',
    'ESB': 'Ankara Esenboğa Airport',
    'IST': 'Istanbul Airport',
    'SAW': 'Sabiha Gökçen Airport',
  };
  return airportNames[code] || code;
}

// JSON'a kaydet
const outputFile = 'public/data/5year_summary.json';
fs.writeFileSync(outputFile, JSON.stringify(result, null, 2), 'utf8');

console.log(`\n✅ 5 yıllık özet oluşturuldu: ${outputFile}`);
console.log(`\n📊 Özet:`);
console.log(`  Toplam Sahalar: ${result.summary.totalSites}`);
console.log(`  Toplam Airline: ${result.summary.totalAirlines}`);
console.log(`  Yıllar: ${result.summary.years.join(', ')}`);

console.log(`\n📍 Saha Detayları:`);
result.sites.forEach(site => {
  console.log(`  ${site.code} (${site.name}): ${site.airlineCount} airline, ${site.years.length} yıl`);
});

