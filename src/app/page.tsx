"use client";

import React, { useState, useEffect } from 'react';
import { MainView } from '@/app/home/MainView';
import { Selection } from '@/app/home/Selection';
import jsonTeams from './data/default-team.json';
import { Teams } from './types/types'; 

const Home: React.FC = () => {
  const [teams, setTeams] = useState<Teams[]>([]); 

  const createTeamToLocalStorage = () => {
    localStorage.setItem('gymRerunTeam', JSON.stringify(jsonTeams));
  };

  const loadTeamsFromLocalStorage = () => {
    const storedTeams = localStorage.getItem('gymRerunTeam');
    if (storedTeams) {
      try {
        setTeams(JSON.parse(storedTeams) as Teams[]); 
      } catch (error) {
        console.error('Error parsing stored teams:', error);
        createTeamToLocalStorage();
      }
    } else {
      createTeamToLocalStorage();
    }
  };

  useEffect(() => {
    loadTeamsFromLocalStorage();
  }, []);

  return (
    <main className="flex flex-col items-center">
      <h1>Gym Rerun-&gt;</h1>
      <Selection />
      <MainView />
    </main>
  );
};

export default Home;
