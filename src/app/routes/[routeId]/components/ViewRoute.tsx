import '../../../styles/PokemonVariationStyles.css';
import ViewRouteEditMain from './ViewRouteEditMain';
import pokemonData from '@/app/data/PokemonDictionary';
import NotificationBar from '@/app/utils/NotificationBar';
import { useRouter } from 'next/navigation';
import HamburgerMenu from '@/app/utils/HamburgerMenu';
import useRouteAndTeamData from '@/app/hooks/UseRouteAndTeamData';
import useEditModeAndSidebar from '@/app/hooks/UseEditModeAndSidebar';
import useHandleScroll from '@/app/hooks/UseHandleScroll';
import useNotification from '@/app/hooks/UseNotification';
import RouteSideBar from './RouteSidebar';
import RouteGymList from './RouteGymList';
import NavigationRoute from '../NavigationRoute';

export interface ViewRouteProps {
  idProps: string;
  router: ReturnType<typeof useRouter>;
}

export const getPokemonNumber = (pokemonName: string): string => {
  const pokemon = pokemonData.find((p) => p.pokemon === pokemonName);
  return pokemon ? pokemon.number : '0';
};

const ViewRoute: React.FC<ViewRouteProps> = ({ idProps, router }) => {
  const {
    assignedRoute,
    assignedTeam,
    gymsByRegion,
    filteredGymsVariations,
    setRoutesData,
    setAssignedRoute,
    isLoading,
  } = useRouteAndTeamData(idProps);
  const {
    editMode,
    isSidebarVisible,
    handleToggleSidebar,
    closeEdit,
    handleClickEdit,
  } = useEditModeAndSidebar();
  const { notification, setNotification, closeNotification } =
    useNotification();
  const { handleNextGym, elementsRef } = useHandleScroll();

  if (isLoading) return <div>Loading...</div>;

  if (!assignedRoute) {
    return <div>Route Not Found</div>;
  }

  return (
    <div className="screen-container flex">
      <div className="relative">
        {notification.visible && (
          <NotificationBar
            message={notification.message}
            type={notification.type}
            onClose={closeNotification}
          />
        )}
      </div>
      <div className="toggle-button-container md:hidden">
        <HamburgerMenu handleToggleSidebar={handleToggleSidebar} />
      </div>
      <RouteSideBar
        handleClickEdit={handleClickEdit}
        setRoutesData={setRoutesData}
        assignedRoute={assignedRoute}
        setAssignedRoute={setAssignedRoute}
        router={router}
        assignedTeam={assignedTeam}
        gymsByRegion={gymsByRegion}
        isSidebarVisible={isSidebarVisible}
      />
      {editMode && assignedTeam ? (
        <>
          <ViewRouteEditMain
            assignedRoute={assignedRoute}
            assignedTeam={assignedTeam}
            setAssignedRoute={setAssignedRoute}
            setRoutesData={setRoutesData}
            onClose={closeEdit}
            routeWithVariations={filteredGymsVariations}
            setNotification={setNotification}
          />
        </>
      ) : (
        <></>
      )}
      {/* Main Content Area */}
      <div className="main-container flex flex-1 flex-col">
        <div className="title-center text-center">
          Route Name: {assignedRoute.routeName}
        </div>
        <div className="flex-1">
          <RouteGymList
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

export default ViewRoute;
