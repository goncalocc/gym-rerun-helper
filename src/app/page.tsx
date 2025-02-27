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
    setTeams(jsonTeams);
  };

  const createRoutesToLocalStorage = () => {
    localStorage.setItem('gymRerunRoutes', JSON.stringify(jsonRoutes));
    setRoutes(jsonRoutes as Routes[]);
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
      setRoutes(jsonRoutes as Routes[]);
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
      setTeams(jsonTeams);
    }
  }, []);

  useEffect(() => {
    loadTeamsFromLocalStorage();
    loadRoutesFromLocalStorage();
  }, [loadTeamsFromLocalStorage, loadRoutesFromLocalStorage]);

  return (
    <main className="flex flex-col items-center">
      {teams ? (
        <>
          <h1>Gym Rerun-&gt;</h1>

          <Selection teamsData={teams} routesData={routes} />
          <MainView />
        </>
      ) : (
        <>Loading...</>
      )}
    </main>
  );
};

export default Home;
