import Icon from '../../utils/Icon';
import React, { useEffect, useState } from 'react';
import ViewTeamDetails from './ViewTeamDetails';
import Svg from '@/app/utils/Svg';
import deleteTeam from './DeleteTeam';
import AddTeam from './AddTeam';
import { Teams, SetTeamsData, Routes, SetRoutesData } from '../../types/types';
import { HandleTeamsUpdate } from './ViewTeamsPreRenderData';
import NotificationBar from '../../utils/NotificationBar';
import BackupRestoreTeams from '@/app/backup/components/BackupRestoreTeams';

interface ViewTeamsProps {
  localStorageTeams: Teams[];
  setTeamsData: SetTeamsData;
  localStorageRoutes: Routes[];
  setRoutesData: SetRoutesData;
  handleTeamsUpdate: HandleTeamsUpdate;
  notification: NotificationParams;
  selectedTeam: string | null;
}

export interface NotificationParams {
  message: string;
  type: string;
  visible: boolean;
}

export const ViewTeams: React.FC<ViewTeamsProps> = ({
  localStorageTeams: teamsData,
  setTeamsData: externalSetTeamsData,
  localStorageRoutes: routesData,
  setRoutesData: externalSetRoutesData,
  handleTeamsUpdate,
  notification: propsNotification,
  selectedTeam: propsSelectedTeam,
}) => {
  const [notification, setNotification] = useState<NotificationParams>({
    message: '',
    type: '',
    visible: false,
  });
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);
  const [showBackupRestore, setShowBackupRestore] = useState<boolean>(false);

  useEffect(() => {
    if (propsNotification) {
      setNotification(propsNotification);
    }
  }, [propsNotification]);

  // Update selectedTeam state when propsSelectedTeam changes
  useEffect(() => {
    if (propsSelectedTeam) {
      setSelectedTeam(propsSelectedTeam);
    }
  }, [propsSelectedTeam]);

  const handleClickDetails = (id: string) => {
    setSelectedTeam(selectedTeam === id ? null : id);
  };

  if (!Array.isArray(teamsData) || teamsData.length === 0) {
    return <p>No teams data available.</p>;
  }

  const closeNotification = () => {
    setNotification({ message: '', type: '', visible: false });
  };

  return (
    <main>
      <div>
        <div className="relative">
          {notification.visible && (
            <NotificationBar
              message={notification.message}
              type={notification.type}
              onClose={closeNotification}
            />
          )}
        </div>
        <div className="justify-left mb-4 ml-80 mt-12 flex space-x-4">
          <button
            className="btn-backup rounded bg-green-500 px-4 py-2 text-white hover:bg-green-700"
            onClick={() => setShowBackupRestore(!showBackupRestore)}
          >
            Import/Export Teams
          </button>
        </div>
        {showBackupRestore && (
          <BackupRestoreTeams
            setNotification={setNotification}
            handleClose={() => setShowBackupRestore(false)}
            teamsData={teamsData}
            routesData={routesData}
            setRoutesData={externalSetRoutesData}
            setTeamsData={externalSetTeamsData}
          />
        )}
        {teamsData.map((team, index) => (
          <div
            key={index}
            className="mt-12 flex flex-col items-center space-y-4"
          >
            <div className="text-center">{team.teamName}</div>
            <div className="flex flex-col items-center">
              <div className="mb-4 flex justify-center">
                <button
                  className="flex items-center justify-center rounded-md border border-transparent bg-blue-600 
                    px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 
                    focus:ring-blue-500 focus:ring-offset-2"
                  onClick={() => handleClickDetails(team.teamId)}
                >
                  {team.team.map((members, index) => (
                    <Icon
                      key={index}
                      name={members.pokemon.toLowerCase()}
                      width={60}
                      height={60}
                    />
                  ))}
                </button>
                <button
                  onClick={() =>
                    deleteTeam({
                      teamsData,
                      routesData,
                      setTeamsData: externalSetTeamsData,
                      setRoutesData: externalSetRoutesData,
                      deletedTeamId: team.teamId,
                      handleTeamsUpdate,
                      setNotification,
                    })
                  }
                >
                  <Svg
                    key={index}
                    name="trash-grey"
                    height={40}
                    width={40}
                    color="brown"
                  />
                </button>
              </div>
              {selectedTeam === team.teamId && (
                <ViewTeamDetails
                  team={team}
                  index={index}
                  teams={teamsData}
                  routes={routesData}
                  setRoutesData={externalSetRoutesData}
                  handleTeamsUpdate={handleTeamsUpdate}
                  setSelectedTeam={setSelectedTeam}
                  setNotification={setNotification}
                />
              )}
            </div>
          </div>
        ))}
        <div className="mb-4 flex justify-center space-x-4">
          <AddTeam
            teamsData={teamsData}
            externalSetTeamsData={externalSetTeamsData}
            handleTeamsUpdate={handleTeamsUpdate}
            setNotification={setNotification}
          />
        </div>
      </div>
    </main>
  );
};

export default ViewTeams;
