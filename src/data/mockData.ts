import { DashboardData } from '../types';

export const dashboardData: DashboardData = {
  totalAirports: 4,
  totalFlights: 45230,
  totalBags: 892450,
  airports: [
    {
      id: '1',
      name: 'İstanbul Havalimanı',
      code: 'IST',
      totalFlights: 18500,
      totalBags: 365000,
      airlines: [
        { code: 'TK', name: 'Turkish Airlines', flights: 12000, bags: 240000 },
        { code: 'PC', name: 'Pegasus Airlines', flights: 4500, bags: 90000 },
        { code: 'W6', name: 'Wizz Air', flights: 1500, bags: 30000 },
        { code: 'FR', name: 'Ryanair', flights: 500, bags: 5000 },
      ],
    },
    {
      id: '2',
      name: 'Sabiha Gökçen Havalimanı',
      code: 'SAW',
      totalFlights: 15200,
      totalBags: 298000,
      airlines: [
        { code: 'PC', name: 'Pegasus Airlines', flights: 10000, bags: 200000 },
        { code: 'TK', name: 'Turkish Airlines', flights: 3500, bags: 70000 },
        { code: 'W6', name: 'Wizz Air', flights: 1200, bags: 20000 },
        { code: 'FR', name: 'Ryanair', flights: 500, bags: 8000 },
      ],
    },
    {
      id: '3',
      name: 'Antalya Havalimanı',
      code: 'AYT',
      totalFlights: 7800,
      totalBags: 156000,
      airlines: [
        { code: 'TK', name: 'Turkish Airlines', flights: 4000, bags: 80000 },
        { code: 'PC', name: 'Pegasus Airlines', flights: 2500, bags: 50000 },
        { code: 'W6', name: 'Wizz Air', flights: 800, bags: 16000 },
        { code: 'LH', name: 'Lufthansa', flights: 500, bags: 10000 },
      ],
    },
    {
      id: '4',
      name: 'Ankara Esenboğa Havalimanı',
      code: 'ESB',
      totalFlights: 3730,
      totalBags: 73450,
      airlines: [
        { code: 'TK', name: 'Turkish Airlines', flights: 2500, bags: 50000 },
        { code: 'PC', name: 'Pegasus Airlines', flights: 1000, bags: 20000 },
        { code: 'W6', name: 'Wizz Air', flights: 230, bags: 3450 },
      ],
    },
  ],
};


