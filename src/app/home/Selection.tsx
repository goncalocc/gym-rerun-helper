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
        className="my-2 mb-8 w-[70%]"
        href={state.selectedRouteId ? `/run/${state.selectedRouteId}` : '#'}
        passHref
      >
        <button
          className={`w-full overflow-hidden text-ellipsis whitespace-nowrap rounded-xl p-3 transition-all duration-200
          ${
            state.selectedRouteId
              ? 'bg-customBlueMunsell hover:bg-customBlueMunsellHover'
              : 'cursor-not-allowed bg-gray-400'
          }`}
          disabled={!state.selectedRouteId}
        >
          <span className="max-w-[80%] truncate">Start</span>
        </button>
      </Link>
    </div>
  );
};

export default Selection;
