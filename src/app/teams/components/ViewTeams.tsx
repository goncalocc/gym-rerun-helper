import Icon from '../../components/Icon';
import React, { useState } from 'react';
import ViewTeamDetails from './ViewTeamDetails';
import Svg from '@/app/components/Svg';
import deleteTeam from './DeleteTeam';
import AddTeam from './AddTeam';
import { Teams, SetTeamsData } from '../../types/types';
import { HandleTeamsUpdate } from './ViewTeamsPreRenderData';
import NotificationBar from './NotificationBar';

interface ViewTeamsProps {
  localStorageData: Teams[];
  setTeamsData: SetTeamsData;
  handleTeamsUpdate: HandleTeamsUpdate;
}

export interface NotificationParams {
  message: string;
  type: string;
  visible: boolean;
}

export const ViewTeams: React.FC<ViewTeamsProps> = ({
  localStorageData: teamsData,
  setTeamsData: externalSetTeamsData,
  handleTeamsUpdate,
}) => {
  const [notification, setNotification] = useState<NotificationParams>({
    message: '',
    type: '',
    visible: false,
  });
  const [selectedTeam, setSelectedTeam] = useState<number | null>(null);

  const handleClickDetails = (index: number) => {
    setSelectedTeam(selectedTeam === index ? null : index);
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
        {teamsData.map((team, index) => (
          <div
            key={index}
            className="mt-12 flex flex-col items-center space-y-4"
          >
            <div className="text-center">{team.teamname}</div>
            <div className="flex flex-col items-center">
              <div className="mb-4 flex justify-center">
                <button
                  className="flex items-center justify-center rounded-md border border-transparent bg-blue-600 
                    px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 
                    focus:ring-blue-500 focus:ring-offset-2"
                  onClick={() => handleClickDetails(index)}
                >
                  {team.team.map((members, index) => (
                    <Icon
                      key={index}
                      name={members.pokemon.toLowerCase()}
                      size={70}
                      color="brown"
                    />
                  ))}
                </button>
                <button
                  onClick={() =>
                    deleteTeam({
                      teamsData,
                      setTeamsData: externalSetTeamsData,
                      index,
                      handleTeamsUpdate,
                      setNotification
                    })
                  }
                >
                  <Svg key={index} name="trash-grey" size={40} color="brown" />
                </button>
              </div>
              {selectedTeam === index && (
                <ViewTeamDetails
                  team={team}
                  index={index}
                  teams={teamsData}
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
