import Link from 'next/link';

export const MainView: React.FC = () => {
  return (
    <div className="flex w-full max-w-xs flex-col items-center space-y-4 p-6 sm:max-w-sm md:max-w-md md:max-w-md">
      <Link
        href="/teams"
        type="button"
        className="w-full rounded-xl bg-blue-500 p-3 font-bold text-white transition-all duration-200 hover:bg-blue-600"
      >
        Check Teams & Routes
      </Link>
      <Link
        href="/variations"
        type="button"
        className="w-full rounded-xl bg-yellow-500 p-3 font-bold text-black transition-all duration-200 hover:bg-yellow-600"
      >
        View All Gyms
      </Link>
    </div>
  );
};

export default MainView;
