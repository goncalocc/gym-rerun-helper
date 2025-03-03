import { ScrollDirection } from '@/app/hooks/UseHandleScroll';
import { FilteredGym } from '@/app/hooks/UseRouteAndTeamData';

interface NavigationRouteProps {
  handleNextGym: (route: FilteredGym[], direction: ScrollDirection) => void;
  filteredGymsVariations: FilteredGym[];
}
const NavigationRoute: React.FC<NavigationRouteProps> = ({
  handleNextGym,
  filteredGymsVariations,
}) => {
  return (
    <div className="nextprevious-container z-10">
      <div className="flex space-x-4">
        <button
          className="flex h-6 w-6 items-center justify-center  rounded-full bg-blue-500 text-white transition hover:bg-blue-600 md:h-12 md:w-12"
          onClick={() => handleNextGym(filteredGymsVariations, 'previous')}
        >
          ↑
        </button>
        <button
          className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-500 text-white transition hover:bg-blue-600 md:h-12 md:w-12"
          onClick={() => handleNextGym(filteredGymsVariations, 'next')}
        >
          ↓
        </button>
      </div>
    </div>
  );
};

export default NavigationRoute;
