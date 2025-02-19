import BookmarksRoute from '@/app/routes/[routeId]/components/BookmarksRoute';
import HamburgerMenu from '@/app/utils/HamburgerMenu';
import useHandleScroll from '@/app/hooks/UseHandleScroll';
import useEditModeAndSidebar from '@/app/hooks/UseEditModeAndSidebar';
import useRouteAndTeamData from '@/app/hooks/UseRouteAndTeamData';
import LeadSummary from './LeadSummary';
import RunGymList from './RunGymList';
import NavigationRoute from '@/app/routes/[routeId]/NavigationRoute';

const ViewRun: React.FC<{ idProps: string }> = ({ idProps }) => {
  const {
    assignedRoute,
    assignedTeam,
    gymsByRegion,
    filteredGymsVariations,
    isLoading,
    currentGym,
    nextGym,
    pokemonItemsRoute,
  } = useRouteAndTeamData(idProps);
  const { isSidebarVisible, handleToggleSidebar } = useEditModeAndSidebar();
  const { handleNextGym, elementsRef } = useHandleScroll();
  const currentGymIndex =
    assignedRoute?.route.findIndex((element) => element === currentGym) ?? -1;

  if (isLoading) return <div>Loading...</div>;

  if (!assignedRoute) {
    return <div>Route Not Found</div>;
  }

  return (
    <div className="screen-container flex">
      <div className="toggle-button-container md:hidden">
        <HamburgerMenu handleToggleSidebar={handleToggleSidebar} />
      </div>
      <div
        className={`sidebar left-0 top-0 flex h-screen flex-col space-y-4 bg-gray-800 p-4 text-white md:block md:w-1/5 lg:w-[17%] xl:w-[20%] 2xl:w-[15%] ${isSidebarVisible ? 'block' : 'hidden'}`}
      >
        <LeadSummary
          currentGym={currentGym}
          nextGym={nextGym}
          assignedTeam={assignedTeam}
          leadItems={pokemonItemsRoute[currentGymIndex]}
        />
        <BookmarksRoute gymsByRegion={gymsByRegion} />
      </div>
      {/* Main Content Area */}
      <div className="main-container flex flex-1 flex-col">
        <div className="title-center text-center">
          Route Name: {assignedRoute.routeName}
        </div>
        <div className="flex-1">
          <RunGymList
            filteredGymsVariations={filteredGymsVariations}
            elementsRef={elementsRef}
          />
          {/* Buttons Container */}
          <NavigationRoute
            handleNextGym={handleNextGym}
            filteredGymsVariations={filteredGymsVariations}
          />
        </div>
      </div>
    </div>
  );
};

export default ViewRun;
