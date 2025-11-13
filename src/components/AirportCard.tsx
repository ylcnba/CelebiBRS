import { Airport } from '../types';

interface AirportCardProps {
  airport: Airport;
}

export const AirportCard = ({ airport }: AirportCardProps) => {
  return (
    <div className="bg-white rounded-2xl shadow-2xl p-8 border-2 border-gray-200 transform hover:scale-[1.02] transition-transform duration-300">
      <div className="mb-6">
        <h3 className="text-3xl font-bold text-gray-900 mb-1">{airport.name}</h3>
        <p className="text-lg text-gray-500 font-medium">({airport.code})</p>
      </div>

      <div className="grid grid-cols-2 gap-6 mb-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border-2 border-blue-200">
          <p className="text-sm font-semibold text-blue-700 mb-2 uppercase tracking-wide">Total Flights</p>
          <p className="text-5xl font-extrabold text-blue-700 leading-none">{airport.totalFlights.toLocaleString('en-US')}</p>
        </div>
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-6 border-2 border-orange-200">
          <p className="text-sm font-semibold text-orange-700 mb-2 uppercase tracking-wide">Total Baggage</p>
          <p className="text-5xl font-extrabold text-orange-700 leading-none">{airport.totalBags.toLocaleString('en-US')}</p>
        </div>
      </div>

      <div className="border-t-2 border-gray-200 pt-6">
        <p className="text-lg font-bold text-gray-800 mb-4">
          Airlines Served <span className="text-2xl text-tav-blue">({airport.airlines.length})</span>
        </p>
        <div className="space-y-3">
          {airport.airlines.map((airline) => (
            <div 
              key={airline.code} 
              className="flex items-center justify-between bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-4 border border-gray-200 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center space-x-4">
                <div className="w-14 h-14 bg-gradient-to-br from-tav-blue to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-lg">{airline.code}</span>
                </div>
                <div>
                  <p className="font-bold text-gray-900 text-lg">{airline.name}</p>
                  <p className="text-sm text-gray-600 font-medium">
                    {airline.flights.toLocaleString('en-US')} flights • {airline.bags.toLocaleString('en-US')} bags
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};


