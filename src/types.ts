export interface Airport {
  id: string;
  name: string;
  code: string;
  airlines: Airline[];
  totalFlights: number;
  totalBags: number;
}

export interface Airline {
  code: string;
  name: string;
  flights: number;
  bags: number;
}

export interface DashboardData {
  totalAirports: number;
  airports: Airport[];
  totalFlights: number;
  totalBags: number;
}


