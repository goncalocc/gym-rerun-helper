import React, { useState } from 'react';
import { Teams, Team, SetTeamsData, Routes } from '../../types/types';
import { HandleTeamsUpdate } from './ViewTeamsPreRenderData';
import { NotificationParams } from './ViewTeams';
import Link from 'next/link';
import AddRoute from '@/app/routes/[routeId]/components/AddRoute';
import generateUniqueId from '@/app/utils/GenerateId';

interface ViewTeamDetailOptionsProps {
  handleClick: () => void;
  teamsData: Teams[];
  routesData: Routes[];
  setRoutesData: React.Dispatch<React.SetStateAction<Routes[]>>;
  clonedTeam: Teams;
  externalSetTeamsData: SetTeamsData;
  handleTeamsUpdate: HandleTeamsUpdate;
  setSelectedTeam: React.Dispatch<React.SetStateAction<string | null>>;
  setNotification: React.Dispatch<React.SetStateAction<NotificationParams>>;
}

interface HandleDuplicateTeamParams {
  (params: {
    teamsData: Teams[];
    externalSetTeamsData: SetTeamsData;
    handleTeamsUpdate: HandleTeamsUpdate;
    teamData: Teams;
  }): void;
}

interface HandleCopiedTeamRoutesParams {
  (params: { routesData: Routes[]; targetId: string; newId: string }): void;
}

const ViewTeamDetailOptions: React.FC<ViewTeamDetailOptionsProps> = ({
  handleClick: handleClickEdit,
  teamsData: teamsData,
  routesData: routesData,
  setRoutesData: setRoutesData,
  clonedTeam: teamData,
  externalSetTeamsData: setTeamsData,
  handleTeamsUpdate: handleTeamsUpdate,
  setSelectedTeam: setSelectedTeam,
  setNotification: setNotification,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleCopiedTeamRoutes: HandleCopiedTeamRoutesParams = ({
    routesData,
    targetId,
    newId,
  }) => {
    const matchingRoutes = routesData.filter(
      (route) => route.teamId === targetId,
    );
    const copiedRoutes: Routes[] = matchingRoutes.map((route) => ({
      ...route,
      teamId: newId,
      routeId: generateUniqueId(),
    }));

    setRoutesData((prevRoutes) => {
      const updatedRoutes = [...prevRoutes, ...copiedRoutes];
      localStorage.setItem('gymRerunRoutes', JSON.stringify(updatedRoutes));
      return updatedRoutes;
    });
  };

  const handleDuplicateTeam: HandleDuplicateTeamParams = ({
    teamsData,
    externalSetTeamsData,
    handleTeamsUpdate,
    teamData,
  }) => {
    const currentTeams = [...teamsData];
    const newTeam = { ...teamData };
    newTeam.teamId = generateUniqueId();
    currentTeams.push(newTeam);
    externalSetTeamsData((prevData) => {
      const newArray = [...prevData, newTeam];
      console.log('Duplicating team ', newArray);
      return newArray;
    });
    // Default placeholder values to satisfy the function signature
    const defaultNewTeam: Team[] = [];
    const defaultNewSubteam: Team[] = [];
    const defaultIndexUpdatedTeam = -1;
    const defaultTeamName = 'placeholder string';
    handleTeamsUpdate(
      defaultNewTeam,
      defaultNewSubteam,
      defaultTeamName,
      defaultIndexUpdatedTeam,
      currentTeams,
    );
    handleCopiedTeamRoutes({
      routesData,
      targetId: teamData.teamId,
      newId: newTeam.teamId,
    });
    setSelectedTeam(null);

    setNotification({
      message: 'Team copied successfully',
      type: 'success',
      visible: true,
    });

    setTimeout(() => {
      setNotification({ message: '', type: '', visible: false });
    }, 3000);
  };

  const filteredRoutes = routesData.filter(
    (routes) => routes.teamId === teamData.teamId,
  );

  return (
    <main>
      <div className="mb-4 flex justify-center">
        <div className="relative inline-block space-x-2 text-center">
          <button
            onClick={toggleDropdown}
            className="rounded bg-gray-500 px-4 py-2 text-white hover:bg-gray-700"
          >
            Choose Route
          </button>

          {isDropdownOpen && (
            <div className="absolute left-1/2 z-10 mt-2 w-48 -translate-x-1/2 transform rounded-md bg-white shadow-lg">
              {filteredRoutes.map((route, index) => (
                <Link
                  className="block px-4 py-2 text-gray-800 hover:bg-gray-200"
                  key={index}
                  href={`/routes/${route.routeId}`}
                >
                  {route.routeName}
                </Link>
              ))}
            </div>
          )}
          <AddRoute teamId={teamData.teamId} routesData={routesData} />
        </div>
      </div>
      <div className="mb-4 flex justify-center space-x-4">
        <button
          onClick={handleClickEdit}
          className="btn-edit rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-700"
        >
          Edit
        </button>
        <button
          className="btn-copyteam rounded bg-green-500 px-4 py-2 text-white hover:bg-green-700"
          onClick={() =>
            handleDuplicateTeam({
              teamsData,
              externalSetTeamsData: setTeamsData,
              handleTeamsUpdate,
              teamData,
            })
          }
        >
          Duplicate Team
        </button>
      </div>
    </main>
  );
};

export default ViewTeamDetailOptions;
