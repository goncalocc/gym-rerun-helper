import { Dispatch, SetStateAction } from 'react';
import BookmarksRoute from './BookmarksRoute';
import { Routes, Teams } from '@/app/types/types';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import deleteRoute from './DeleteRoute';
import { GymsByRegion } from '@/app/hooks/UseRouteAndTeamData';

interface RouteSideBarProps {
  handleClickEdit: () => void;
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
  setRoutesData,
  assignedRoute,
  setAssignedRoute,
  router,
  assignedTeam,
  gymsByRegion,
  isSidebarVisible,
}) => {
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
      </div>
      <BookmarksRoute gymsByRegion={gymsByRegion} />
    </div>
  );
};

export default RouteSideBar;
