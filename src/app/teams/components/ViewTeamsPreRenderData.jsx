'use client';

import React, { useState, useEffect } from 'react';
import ViewTeams from './ViewTeams';

const fetchLocalStorageTeams = () => {
  try {
    const data = localStorage.getItem('gymRerunTeam');
    if (!data) {
      throw new Error('Data not found in localStorage');
    }
    return JSON.parse(data);
  } catch (error) {
    console.error('Error fetching data from localStorage:', error.message);
    return null;
  }
};

const ViewTeamsPreRenderData = () => {
  const [teamsData, setTeamsData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const localStorageData = fetchLocalStorageTeams();
    setTeamsData(localStorageData);
    setIsLoading(false);
  }, []);

  const handleTeamsUpdate = (newData, indexUpdatedTeam) => {
    setTeamsData((prevTeams) => {
      // Make a shallow copy of the previous state
      const updatedTeams = [...prevTeams];
      // Check if the teamIndex is valid
      if (
        !updatedTeams[indexUpdatedTeam] ||
        !Array.isArray(updatedTeams[indexUpdatedTeam].team)
      ) {
        console.error(
          'Invalid team structure at teamIndex:',
          indexUpdatedTeam,
        );
        throw new Error('Invalid team structure');
      }
      // Set the updated team array back to the updatedTeams object
      updatedTeams[indexUpdatedTeam] = {
        ...updatedTeams[indexUpdatedTeam],
        team: newData.team,
      };
      console.log('updatedTeams: ', updatedTeams);
      // Return the updated state
      localStorage.setItem('gymRerunTeam', JSON.stringify(updatedTeams));
      return updatedTeams;
    });
  }

  if (isLoading) {
    return <p>Loading teams data...</p>;
  }

  return (
    <main>
      <ViewTeams localStorageData={teamsData} handleTeamsUpdate={handleTeamsUpdate} />
    </main>
  );
};

export default ViewTeamsPreRenderData;
