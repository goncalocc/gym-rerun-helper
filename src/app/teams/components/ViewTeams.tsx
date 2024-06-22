import Icon from '../../components/Icon';
import React, { useState } from 'react';
import ViewTeamDetails from './ViewTeamDetails';
import Svg from '@/app/components/Svg';
import deleteTeam from './DeleteTeam';
import AddTeam from './AddTeam';
import { Teams, SetTeamsData } from '../../types/types';
import { HandleTeamsUpdate } from './ViewTeamsPreRenderData';

interface ViewTeamsProps {
  localStorageData: Teams[];
  setTeamsData: SetTeamsData;
  handleTeamsUpdate: HandleTeamsUpdate;
}


export const ViewTeams: React.FC<ViewTeamsProps> = ({
  localStorageData: teamsData,
  setTeamsData: externalSetTeamsData,
  handleTeamsUpdate,
}) => {
  const [selectedTeam, setSelectedTeam] = useState<number | null>(null);

  const handleClickDetails = (index: number) => {
    setSelectedTeam(selectedTeam === index ? null : index);
  };

  if (!Array.isArray(teamsData) || teamsData.length === 0) {
    return <p>No teams data available.</p>;
  }

  return (
    <main>
      <div>
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
          />
        </div>
      </div>
    </main>
  );
};

export default ViewTeams;
