/* eslint-disable prettier/prettier */
import { TeamSelection } from './TeamSelection';
import { RouteSelection } from './RouteSelection';
import { Routes, Teams } from '../types/types';
import { useState } from 'react';
import Link from 'next/link';

export interface SelectionProps {
  teamsData: Teams[];
  routesData: Routes[];
}

export const Selection: React.FC<SelectionProps> = ({
  teamsData: teamsData,
  routesData: routesData,
}) => {
  const [state, setState] = useState({
    selectedTeam: null as string | null,
    selectedTeamId: null as string | null,
    selectedRoute: null as string | null,
    selectedRouteId: null as string | null,
  });

  return (
    <div className="flex flex-col items-center">
      <TeamSelection teamsData={teamsData} state={state} setState={setState} />
      <RouteSelection
        routesData={routesData}
        state={state}
        setState={setState}
      />
      <Link
        href={state.selectedRouteId ? `/run/${state.selectedRouteId}` : '#'}
        passHref
      >
        <button
          type="button"
          className={`rounded-lg px-5 py-3 text-center text-base font-medium text-white 
      ${
        state.selectedRouteId
          ? 'bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800'
          : 'cursor-not-allowed bg-gray-400'
      }`} // Disabled styles
          disabled={!state.selectedRouteId} // Disable button if no route is selected
        >
          Start
        </button>
      </Link>
    </div>
  );
};

export default Selection;
