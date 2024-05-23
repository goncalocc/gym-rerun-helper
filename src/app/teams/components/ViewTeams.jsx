import Icon from '../../components/Icon';
import React, { useState } from 'react';
import ViewTeamDetails from './ViewTeamDetails';

export const ViewTeams = ({ localStorageData: teamsData }) => {
  const [selectedTeam, setSelectedTeam] = useState(null);

  const handleClickDetails = (index) => {
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
              {selectedTeam === index && <ViewTeamDetails details={team} />}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
};

export default ViewTeams;
