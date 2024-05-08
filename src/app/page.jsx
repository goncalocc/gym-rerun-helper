'use client';

import React, { useState, useEffect } from 'react';

import { MainView } from '@/app/components/MainView';
import { Selection } from '@/app/components/Selection';

import jsonTeams from './data/default-team.json';

export default function Home() {

  const createTeamToLocalStorage = () => {
    localStorage.setItem('gymRerunTeam', JSON.stringify(jsonTeams));
  };
  
  const loadTeamsFromLocalStorage = () => {
   const storedTeams = localStorage.getItem('gymRerunTeam');
    if(storedTeams){
      setTeams(storedTeams);
    }
    else createTeamToLocalStorage();
  };

useEffect(() => {
    loadTeamsFromLocalStorage();
  }, []);

const [teams, setTeams] = useState([]);

  return (
    <main className="flex flex-col items-center">
      <h1>Gym Rerun-&gt;</h1>
      <Selection />
      <MainView />
    </main>
  );
}
