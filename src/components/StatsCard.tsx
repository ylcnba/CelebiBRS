interface StatsCardProps {
  title: string;
  value: string | number;
  icon: string;
  color: 'blue' | 'orange' | 'green';
}

export const StatsCard = ({ title, value, icon, color }: StatsCardProps) => {
  const colorClasses = {
    blue: 'bg-gradient-to-br from-blue-500 to-blue-600 border-blue-400 text-white shadow-xl',
    orange: 'bg-gradient-to-br from-orange-500 to-orange-600 border-orange-400 text-white shadow-xl',
    green: 'bg-gradient-to-br from-green-500 to-green-600 border-green-400 text-white shadow-xl',
  };

  return (
    <div className={`rounded-2xl border-4 p-8 transform hover:scale-105 transition-transform duration-300 ${colorClasses[color]}`}>
      <div className="flex flex-col items-center text-center">
        <div className="text-6xl mb-4 opacity-90">{icon}</div>
        <p className="text-lg font-semibold opacity-95 mb-4 uppercase tracking-wide">{title}</p>
        <p className="text-6xl md:text-7xl font-extrabold leading-none">{value}</p>
      </div>
    </div>
  );
};


