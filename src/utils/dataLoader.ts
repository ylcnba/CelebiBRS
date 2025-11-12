import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import { DashboardData, Airport, Airline } from '../types';

export const loadDataFromCSV = async (filePath: string): Promise<DashboardData> => {
  const response = await fetch(filePath);
  const text = await response.text();
  
  return new Promise((resolve, reject) => {
    Papa.parse(text, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        try {
          const data = parseCSVData(results.data as any[]);
          resolve(data);
        } catch (error) {
          reject(error);
        }
      },
      error: (error) => reject(error),
    });
  });
};

export const loadDataFromExcel = async (filePath: string): Promise<DashboardData> => {
  const response = await fetch(filePath);
  const arrayBuffer = await response.arrayBuffer();
  const workbook = XLSX.read(arrayBuffer, { type: 'array' });
  
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  const jsonData = XLSX.utils.sheet_to_json(worksheet);
  
  return parseCSVData(jsonData as any[]);
};

const parseCSVData = (rows: any[]): DashboardData => {
  const airportMap = new Map<string, Airport>();
  
  rows.forEach((row) => {
    const sahaAdi = row['Saha Adı'] || row['SahaAdi'] || row['saha_adi'];
    const sahaKodu = row['Saha Kodu'] || row['SahaKodu'] || row['saha_kodu'];
    const airlineCode = row['Havayolu Kodu'] || row['HavayoluKodu'] || row['havayolu_kodu'];
    const airlineName = row['Havayolu Adı'] || row['HavayoluAdi'] || row['havayolu_adi'];
    const flights = parseInt(row['Uçuş Sayısı'] || row['UcusSayisi'] || row['ucus_sayisi'] || '0');
    const bags = parseInt(row['Bagaj Sayısı'] || row['BagajSayisi'] || row['bagaj_sayisi'] || '0');
    
    if (!sahaAdi || !sahaKodu || !airlineCode) {
      return; // Skip invalid rows
    }
    
    const airportId = sahaKodu.toLowerCase();
    
    if (!airportMap.has(airportId)) {
      airportMap.set(airportId, {
        id: airportId,
        name: sahaAdi,
        code: sahaKodu,
        airlines: [],
        totalFlights: 0,
        totalBags: 0,
      });
    }
    
    const airport = airportMap.get(airportId)!;
    
    airport.airlines.push({
      code: airlineCode,
      name: airlineName || airlineCode,
      flights,
      bags,
    });
    
    airport.totalFlights += flights;
    airport.totalBags += bags;
  });
  
  const airports = Array.from(airportMap.values());
  const totalFlights = airports.reduce((sum, apt) => sum + apt.totalFlights, 0);
  const totalBags = airports.reduce((sum, apt) => sum + apt.totalBags, 0);
  
  return {
    totalAirports: airports.length,
    airports,
    totalFlights,
    totalBags,
  };
};

export const detectFileType = (fileName: string): 'csv' | 'xlsx' | 'xls' | null => {
  const ext = fileName.toLowerCase().split('.').pop();
  if (ext === 'csv') return 'csv';
  if (ext === 'xlsx') return 'xlsx';
  if (ext === 'xls') return 'xls';
  return null;
};

