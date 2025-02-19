import { Dispatch, SetStateAction } from 'react';
import BookmarksRoute from './BookmarksRoute';
import { Routes, Teams } from '@/app/types/types';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import deleteRoute from './DeleteRoute';
import { GymsByRegion } from '@/app/hooks/UseRouteAndTeamData';
import useCloneRoute from './DuplicateRoute';

interface RouteSideBarProps {
  handleClickEdit: () => void;
  routesData: Routes[];
  setRoutesData: Dispatch<SetStateAction<Routes[]>>;
  assignedRoute: Routes;
  setAssignedRoute: Dispatch<SetStateAction<Routes | undefined>>;
  router: AppRouterInstance;
  assignedTeam: Teams | undefined;
  gymsByRegion: GymsByRegion;
  isSidebarVisible: boolean;
}

const RouteSideBar: React.FC<RouteSideBarProps> = ({
  handleClickEdit,
  routesData,
  setRoutesData,
  assignedRoute,
  setAssignedRoute,
  router,
  assignedTeam,
  gymsByRegion,
  isSidebarVisible,
}) => {
  const duplicateRoute = useCloneRoute();

  return (
    <div
      className={`sidebar left-0 top-0 flex h-screen flex-col space-y-4 bg-gray-800 p-4 text-white md:block md:w-1/5 lg:w-[17%] xl:w-[20%] 2xl:w-[15%] ${isSidebarVisible ? 'block' : 'hidden'}`}
    >
      <div className="button-container">
        <button
          className="button edit-button"
          onClick={() => handleClickEdit()}
        >
          Edit
        </button>
        <button
          className="button delete-button"
          onClick={() =>
            deleteRoute({
              setRoutesData,
              assignedRoute,
              setAssignedRoute,
              router,
              assignedTeam,
            })
          }
        >
          Delete
        </button>
        <button
          className="button my-2 w-1/2 bg-green-500 hover:bg-green-600"
          onClick={() => duplicateRoute(setRoutesData, assignedRoute, router)}
        >
          Clone Route
        </button>
      </div>
      <BookmarksRoute gymsByRegion={gymsByRegion} />
    </div>
  );
};

export default RouteSideBar;
