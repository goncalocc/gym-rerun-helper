'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { MainView } from '@/app/home/MainView';
import { Selection } from '@/app/home/Selection';
import jsonTeams from './data/default-team.json';
import jsonRoutes from './data/default-routes.json';
import { Teams, Routes } from './types/types';

const Home: React.FC = () => {
  const [teams, setTeams] = useState<Teams[]>([]);
  const [routes, setRoutes] = useState<Routes[]>([]);

  const createTeamToLocalStorage = () => {
    localStorage.setItem('gymRerunTeam', JSON.stringify(jsonTeams));
  };

  const createRoutesToLocalStorage = () => {
    localStorage.setItem('gymRerunRoutes', JSON.stringify(jsonRoutes));
  };

  const loadRoutesFromLocalStorage = useCallback(() => {
    const storedRoutes = localStorage.getItem('gymRerunRoutes');
    if (storedRoutes) {
      try {
        setRoutes(JSON.parse(storedRoutes) as Routes[]);
      } catch (error) {
        console.error('Error parsing stored teams:', error);
        createRoutesToLocalStorage();
      }
    } else {
      createRoutesToLocalStorage();
    }
  }, []);

  const loadTeamsFromLocalStorage = useCallback(() => {
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
  }, []);

  useEffect(() => {
    loadTeamsFromLocalStorage();
    loadRoutesFromLocalStorage();
  }, [loadTeamsFromLocalStorage, loadRoutesFromLocalStorage]);

  return (
    <main className="flex flex-col items-center">
      <h1>Gym Rerun-&gt;</h1>
      <Selection teamsData={teams} routesData={routes} />
      <MainView />
    </main>
  );
};

export default Home;
