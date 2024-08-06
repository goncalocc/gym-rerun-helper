import React, { useState, useEffect } from 'react';
import ViewTeams from './ViewTeams';
import { Teams, Team, Routes } from '../../types/types';

export type HandleTeamsUpdate = (
  updatedTeam: Team[],
  updatedSubteam: Team[],
  updatedTeamName: string,
  indexUpdatedTeam: number,
  newTeams: Teams[] | null,
) => void;

const fetchLocalStorageTeams = (): Teams[] | null => {
  try {
    const data = localStorage.getItem('gymRerunTeam');
    if (!data) {
      throw new Error('Teams not found in localStorage');
    }
    return JSON.parse(data);
  } catch (error: any) {
    console.error('Error fetching Teams from localStorage:', error.message);
    return null;
  }
};

const fetchLocalStorageRoutes = (): Routes[] | null => {
  try {
    const data = localStorage.getItem('gymRerunRoutes');
    if (!data) {
      throw new Error('Routes not found in localStorage');
    }
    return JSON.parse(data);
  } catch (error: any) {
    console.error('Error fetching Routes from localStorage:', error.message);
    return null;
  }
};

const ViewTeamsPreRenderData: React.FC = () => {
  const [teamsData, setTeamsData] = useState<Teams[]>([]);
  const [routesData, setRoutesData] = useState<Routes[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const localStorageTeams = fetchLocalStorageTeams();
    if (localStorageTeams) {
      setTeamsData(localStorageTeams);
    }
    const localStorageRoutes = fetchLocalStorageRoutes();
    if (localStorageRoutes) {
      setRoutesData(localStorageRoutes);
    }
    setIsLoading(false);
  }, []);

  const handleTeamsUpdate: HandleTeamsUpdate = (
    updatedTeam,
    updatedSubteam,
    updatedTeamName,
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
        teamName: updatedTeamName,
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
        localStorageTeams={teamsData}
        setTeamsData={setTeamsData}
        localStorageRoutes={routesData}
        setRoutesData={setRoutesData}
        handleTeamsUpdate={handleTeamsUpdate}
      />
    </main>
  );
};

export default ViewTeamsPreRenderData;
