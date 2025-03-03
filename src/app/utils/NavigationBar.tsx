import Link from 'next/link';

export const NavigationBar: React.FC = () => {
  return (
    <div className="fixed left-0 top-0 z-50 w-full bg-black py-3">
      {/* Restrict content to align with Container */}
      <div className="mx-auto w-full max-w-screen-2xl px-4">
        <div className="flex items-center">
          {/* Left-aligned Home button */}
          <div className="flex-shrink-0">
            <Link
              href="/"
              className="rounded-xl bg-black px-4 py-2 font-bold text-customNaplesYellow transition-all duration-200 hover:bg-yellow-500 hover:text-black"
            >
              Home
            </Link>
          </div>

          {/* Divider Line */}
          <div className="mx-4 h-10 w-px bg-gray-500 py-3"></div>

          {/* Navigation buttons aligned with Container */}
          <div className="flex space-x-4 overflow-x-auto whitespace-nowrap">
            <Link
              href="/teams"
              className="rounded-xl bg-black px-4 py-2 font-bold text-customBlueMunsell transition-all duration-200 hover:bg-customBlueMunsell hover:text-black"
            >
              Teams & Routes
            </Link>
            <Link
              href="/variations"
              className="rounded-xl bg-black px-4 py-2 font-bold text-customBlueMunsell transition-all duration-200 hover:bg-customBlueMunsell hover:text-black"
            >
              Gym Variations
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NavigationBar;
