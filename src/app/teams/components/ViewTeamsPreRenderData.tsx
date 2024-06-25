import React, { useState, useEffect } from 'react';
import ViewTeams from './ViewTeams';
import { Teams, Team } from '../../types/types';

export type HandleTeamsUpdate = (
  updatedTeam: Team[],
  updatedSubteam: Team[],
  updatedTeamname: string,
  indexUpdatedTeam: number,
  newTeams: Teams[] | null,
) => void;

const fetchLocalStorageTeams = (): Teams[] | null => {
  try {
    const data = localStorage.getItem('gymRerunTeam');
    if (!data) {
      throw new Error('Data not found in localStorage');
    }
    return JSON.parse(data);
  } catch (error: any) {
    console.error('Error fetching data from localStorage:', error.message);
    return null;
  }
};

const ViewTeamsPreRenderData: React.FC = () => {
  const [teamsData, setTeamsData] = useState<Teams[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const localStorageData = fetchLocalStorageTeams();
    if (localStorageData) {
      setTeamsData(localStorageData);
    }
    setIsLoading(false);
  }, []);

  const handleTeamsUpdate: HandleTeamsUpdate = (
    updatedTeam,
    updatedSubteam,
    updatedTeamname,
    indexUpdatedTeam,
    newTeams,
  ) => {
    setTeamsData((prevTeams) => {
      if (newTeams) {
        console.log('updatedTeams: ', newTeams);
        // Return the updated state
        localStorage.setItem('gymRerunTeam', JSON.stringify(newTeams));
        return newTeams;
      }
      // Make a shallow copy of the previous state
      const updatedTeams = [...prevTeams];
      // Check if the teamIndex is valid
      if (
        !updatedTeams[indexUpdatedTeam] ||
        !Array.isArray(updatedTeams[indexUpdatedTeam].team) ||
        !Array.isArray(updatedTeams[indexUpdatedTeam].subteam)
      ) {
        console.error('Invalid team structure at teamIndex:', indexUpdatedTeam);
        throw new Error('Invalid team structure');
      }
      // Set the updated team array back to the updatedTeams object
      updatedTeams[indexUpdatedTeam] = {
        ...updatedTeams[indexUpdatedTeam],
        team: updatedTeam,
        subteam: updatedSubteam,
        teamname: updatedTeamname,
      };
      console.log('updatedTeams: ', updatedTeams);
      // Return the updated state
      localStorage.setItem('gymRerunTeam', JSON.stringify(updatedTeams));
      return updatedTeams;
    });
  };

  if (isLoading) {
    return <p>Loading teams data...</p>;
  }

  return (
    <main>
      <ViewTeams
        localStorageData={teamsData}
        setTeamsData={setTeamsData}
        handleTeamsUpdate={handleTeamsUpdate}
      />
    </main>
  );
};

export default ViewTeamsPreRenderData;
