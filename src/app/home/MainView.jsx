import Link from 'next/link';

export const MainView = () => {
  return (
    <div className="flex flex-col items-center">
      <Link
        href="/teams"
        type="button"
        className="rounded-lg bg-blue-700 px-5 py-3 text-center text-base font-medium text-white hover:bg-blue-800 focus:outline-none 
    focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
      >
        Check Teams & Routes
      </Link>
      <Link
        href="/variations"
        type="button"
        className="rounded-lg bg-blue-700 px-5 py-3 text-center text-base font-medium text-white hover:bg-blue-800 focus:outline-none 
    focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
      >
        View All Gyms
      </Link>
    </div>
  );
};

export default MainView;
