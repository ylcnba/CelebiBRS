/**
 * celebi_mapping.json dosyasındaki airline isimlerini güncelleme script'i
 */

import fs from 'fs';

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

const mappingFile = 'public/data/celebi_mapping.json';

console.log(`📂 Updating: ${mappingFile}`);

const mapping = JSON.parse(fs.readFileSync(mappingFile, 'utf8'));

let updated = false;

Object.keys(mapping).forEach(airportCode => {
  const airport = mapping[airportCode];
  airport.airlines.forEach(airline => {
    const code = airline.code.toUpperCase();
    if (airlineCodeMap[code] && airline.name !== airlineCodeMap[code]) {
      airline.name = airlineCodeMap[code];
      updated = true;
    }
  });
});

if (updated) {
  fs.writeFileSync(mappingFile, JSON.stringify(mapping, null, 2), 'utf8');
  console.log(`✅ Updated: ${mappingFile}`);
} else {
  console.log(`ℹ️  No changes needed: ${mappingFile}`);
}

