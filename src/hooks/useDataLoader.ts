import { useState, useEffect } from 'react';
import { DashboardData } from '../types';
import { loadDataFromCSV, loadDataFromExcel, detectFileType } from '../utils/dataLoader';
import { dashboardData as mockData } from '../data/mockData';

export const useDataLoader = () => {
  const [data, setData] = useState<DashboardData>(mockData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Try to load from CSV first
        try {
          const csvData = await loadDataFromCSV('/data/data.csv');
          setData(csvData);
          setLoading(false);
          return;
        } catch (csvError) {
          console.log('CSV not found, trying Excel...');
        }

        // Try Excel files
        const excelFiles = ['/data/data.xlsx', '/data/data.xls'];
        for (const filePath of excelFiles) {
          try {
            const excelData = await loadDataFromExcel(filePath);
            setData(excelData);
            setLoading(false);
            return;
          } catch (excelError) {
            console.log(`Excel file ${filePath} not found`);
          }
        }

        // If no data file found, use mock data
        console.log('No data file found, using mock data');
        setData(mockData);
        setLoading(false);
      } catch (err) {
        console.error('Error loading data:', err);
        setError('Veri yüklenirken bir hata oluştu. Mock veriler kullanılıyor.');
        setData(mockData);
        setLoading(false);
      }
    };

    loadData();
  }, []);

  return { data, loading, error };
};

