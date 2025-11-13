import { Header } from '../components/Header';
import { StatsCard } from '../components/StatsCard';
import { useState, useEffect } from 'react';

interface FiveYearData {
  summary: {
    totalSites: number;
    totalAirlines: number;
    years: string[];
  };
  sites: Array<{
    code: string;
    name: string;
    airlineCount: number;
    airlines: string[];
    years: string[];
  }>;
}

export const OverviewPage = () => {
  const [fiveYearData, setFiveYearData] = useState<FiveYearData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const basePath = import.meta.env.BASE_URL || '/';
    fetch(`${basePath}data/5year_summary.json`)
      .then(res => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then(data => {
        setFiveYearData(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error loading 5-year data:', err);
        setLoading(false);
      });
  }, []);

  if (loading || !fiveYearData) {
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
      
      <main className="w-full px-6 lg:px-12 py-12">
        {/* Page Title */}
        <div className="text-center mb-16">
          <h1 className="text-6xl md:text-7xl font-extrabold text-gray-900 mb-8 bg-gradient-to-r from-tav-blue to-tav-orange bg-clip-text text-transparent leading-[1.1] block pb-2">
            TAV BRS Usage Report
          </h1>
          <p className="text-2xl text-gray-600 font-medium">
            5-Year Overview: Çelebi Holding's TAV BRS Implementation
          </p>
        </div>

        {/* Key Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <StatsCard
            title="Active Sites"
            value={fiveYearData.summary.totalSites}
            icon="🏢"
            color="blue"
          />
          <StatsCard
            title="Total Airlines Served"
            value={fiveYearData.summary.totalAirlines}
            icon="✈️"
            color="orange"
          />
          <StatsCard
            title="Years of Operation"
            value="5"
            icon="📅"
            color="green"
          />
        </div>

        {/* Sites Overview */}
        <div className="bg-white rounded-2xl shadow-2xl p-10 mb-12">
          <h2 className="text-4xl font-extrabold text-gray-900 mb-10">
            Active Sites & Airlines Served
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {fiveYearData.sites.map((site) => (
              <div
                key={site.code}
                className="bg-gradient-to-br from-blue-50 via-white to-orange-50 rounded-2xl p-8 border-4 border-gray-200 shadow-xl transform hover:scale-[1.02] transition-transform duration-300"
              >
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-3xl font-extrabold text-gray-900 mb-2">{site.name}</h3>
                    <p className="text-lg text-gray-600 font-semibold">({site.code})</p>
                  </div>
                  <div className="text-right bg-gradient-to-br from-tav-blue to-blue-600 rounded-xl p-6 shadow-lg">
                    <p className="text-6xl font-extrabold text-white leading-none">{site.airlineCount}</p>
                    <p className="text-sm text-blue-100 font-bold uppercase tracking-wide mt-2">Airlines</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-3">
                  {site.airlines.slice(0, 10).map((airline) => (
                    <span
                      key={airline}
                      className="px-4 py-2 bg-white rounded-xl text-base font-bold text-gray-800 border-2 border-gray-300 shadow-md hover:shadow-lg transition-shadow"
                    >
                      {airline}
                    </span>
                  ))}
                  {site.airlines.length > 10 && (
                    <span className="px-4 py-2 bg-gradient-to-r from-gray-300 to-gray-400 rounded-xl text-base font-bold text-gray-800 border-2 border-gray-400 shadow-md">
                      +{site.airlines.length - 10} more
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Summary Box */}
        <div className="bg-gradient-to-r from-tav-blue via-tav-orange to-tav-blue rounded-2xl p-10 text-white shadow-2xl transform hover:scale-[1.01] transition-transform duration-300">
          <h3 className="text-4xl font-extrabold mb-6">Partnership Summary</h3>
          <p className="text-xl opacity-95 leading-relaxed font-medium">
            Over the past 5 years, Çelebi Holding has successfully implemented TAV BRS across{' '}
            <strong>{fiveYearData.summary.totalSites} strategic locations</strong> in Turkey, 
            serving <strong>{fiveYearData.summary.totalAirlines} different airlines</strong>. 
            This comprehensive deployment demonstrates Çelebi's commitment to operational 
            excellence and technological innovation in ground handling services.
          </p>
        </div>
      </main>
    </div>
  );
};

