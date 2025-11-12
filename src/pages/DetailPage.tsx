import { Header } from '../components/Header';
import { StatsCard } from '../components/StatsCard';
import { AirportCard } from '../components/AirportCard';
import { useDataLoader } from '../hooks/useDataLoader';

export const DetailPage = () => {
  const { data: dashboardData, loading, error } = useDataLoader();

  const formatNumber = (num: number) => {
    return num.toLocaleString('en-US');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-tav-blue mx-auto mb-4"></div>
          <p className="text-gray-600">Loading data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Header />
      
      {error && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
            <p className="text-yellow-700">{error}</p>
          </div>
        </div>
      )}
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Page Title */}
        <div className="text-center mb-16">
          <h1 className="text-6xl md:text-7xl font-extrabold text-gray-900 mb-6 bg-gradient-to-r from-tav-blue to-tav-orange bg-clip-text text-transparent">
            2025 Performance Report
          </h1>
          <p className="text-2xl text-gray-600 font-medium">
            Detailed Statistics: Flights & Baggage Handled via TAV BRS
          </p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <StatsCard
            title="Active Sites"
            value={dashboardData.totalAirports}
            icon="🏢"
            color="blue"
          />
          <StatsCard
            title="Total Flights"
            value={formatNumber(dashboardData.totalFlights)}
            icon="✈️"
            color="orange"
          />
          <StatsCard
            title="Total Baggage"
            value={formatNumber(dashboardData.totalBags)}
            icon="🧳"
            color="green"
          />
        </div>

        {/* Site Details */}
        <div className="mb-10">
          <h2 className="text-4xl font-extrabold text-gray-900 mb-4">
            Site-by-Site Performance
          </h2>
          <p className="text-xl text-gray-600 mb-8 font-medium">
            Detailed breakdown of TAV BRS operations across all Çelebi sites in 2025
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {dashboardData.airports.map((airport) => (
            <AirportCard key={airport.id} airport={airport} />
          ))}
        </div>

        {/* Executive Summary */}
        <div className="bg-gradient-to-r from-tav-blue via-tav-orange to-tav-blue rounded-2xl p-10 text-white shadow-2xl transform hover:scale-[1.01] transition-transform duration-300">
          <h3 className="text-4xl font-extrabold mb-6">2025 Executive Summary</h3>
          <p className="text-xl opacity-95 leading-relaxed font-medium">
            In 2025, Çelebi Holding processed <strong>{formatNumber(dashboardData.totalBags)} bags</strong> across{' '}
            <strong>{formatNumber(dashboardData.totalFlights)} unique flights</strong> (flight number + date combinations) 
            using TAV BRS at <strong>{dashboardData.totalAirports} strategic locations</strong>. 
            This represents a significant operational achievement, demonstrating the scalability and reliability 
            of TAV BRS technology in handling high-volume ground operations across multiple airports.
          </p>
        </div>
      </main>
    </div>
  );
};

