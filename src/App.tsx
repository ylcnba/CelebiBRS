import { useState } from 'react';
import { OverviewPage } from './pages/OverviewPage';
import { DetailPage } from './pages/DetailPage';

function App() {
  const [currentPage, setCurrentPage] = useState<'overview' | 'detail'>('overview');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex space-x-8">
              <button
                onClick={() => setCurrentPage('overview')}
                className={`px-4 py-2 rounded-md font-medium transition-colors ${
                  currentPage === 'overview'
                    ? 'bg-tav-blue text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                5-Year Overview
              </button>
              <button
                onClick={() => setCurrentPage('detail')}
                className={`px-4 py-2 rounded-md font-medium transition-colors ${
                  currentPage === 'detail'
                    ? 'bg-tav-blue text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                2025 Details
              </button>
            </div>
            <div className="text-sm text-gray-500">
              TAV BRS Dashboard
            </div>
          </div>
        </div>
      </nav>

      {/* Page Content */}
      {currentPage === 'overview' ? <OverviewPage /> : <DetailPage />}
    </div>
  );
}

export default App;
