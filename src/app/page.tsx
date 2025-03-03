'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Selection } from '@/app/home/Selection';
import jsonTeams from './data/default-team.json';
import jsonRoutes from './data/default-routes.json';
import { Teams, Routes } from './types/types';
import NavigationBar from './utils/NavigationBar';
import Container from './utils/Container';

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
    <main className="relative flex min-h-screen items-center bg-gray-900 p-4 text-white">
      <NavigationBar />
      <Container>
        {teams ? (
          <div className="w-full max-w-md rounded-2xl bg-gray-800 p-6 text-center shadow-lg">
            <h1 className="mb-4 text-2xl font-bold text-customNaplesYellow">
              Gym Rerun
            </h1>
            <Selection teamsData={teams} routesData={routes} />
          </div>
        ) : (
          <p>Loading...</p>
        )}
      </Container>
    </main>
  );
};

export default Home;
