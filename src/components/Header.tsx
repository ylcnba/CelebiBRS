const tavLogo = '/tav-logo.png';
const celebiLogo = '/celebi-logo.png';

export const Header = () => {
  return (
    <header className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <img 
              src={tavLogo} 
              alt="TAV Technologies" 
              className="h-12 object-contain"
            />
            <div className="h-12 w-px bg-gray-300"></div>
            <img 
              src={celebiLogo} 
              alt="Çelebi Holding" 
              className="h-12 object-contain"
            />
          </div>
          <div className="text-right">
            <h1 className="text-2xl font-bold text-gray-800">TAV BRS Dashboard</h1>
            <p className="text-sm text-gray-600">Çelebi Holding Performance Report</p>
          </div>
        </div>
      </div>
    </header>
  );
};

