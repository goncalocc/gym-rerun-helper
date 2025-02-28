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
    <div className="flex flex-col items-center p-8 sm:p-4">
      <TeamSelection teamsData={teamsData} state={state} setState={setState} />
      <RouteSelection
        routesData={routesData}
        state={state}
        setState={setState}
      />
      <Link
        className="mb-8 w-full max-w-xs p-3 sm:max-w-sm md:max-w-md"
        href={state.selectedRouteId ? `/run/${state.selectedRouteId}` : '#'}
        passHref
      >
        <button
          className={`w-full rounded-xl p-3 transition-all duration-200
      ${
        state.selectedRouteId
          ? 'bg-red-500 hover:bg-red-600'
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
