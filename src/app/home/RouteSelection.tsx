import { useState } from 'react';
import { Routes } from '../types/types';

type RouteSelectionProps = {
  routesData: Routes[]; // Define your actual type for teamsData
  state: {
    selectedTeam: string | null;
    selectedTeamId: string | null;
    selectedRoute: string | null;
    selectedRouteId: string | null;
  };
  setState: React.Dispatch<
    React.SetStateAction<{
      selectedTeam: string | null;
      selectedTeamId: string | null;
      selectedRoute: string | null;
      selectedRouteId: string | null;
    }>
  >;
};

export const RouteSelection: React.FC<RouteSelectionProps> = ({
  routesData,
  state,
  setState,
}) => {
  const routesFromTeam = routesData.filter(
    (route) => route.teamId === state.selectedTeamId,
  );

  const [open, setOpen] = useState<boolean>(false);

  const handleRouteChange = (route: string, routeId: string) => {
    setState((prev) => ({
      ...prev,
      selectedRoute: route,
      selectedRouteId: routeId,
    }));
    setOpen(false);
  };

  const handleRouteOpen = () => {
    setOpen(!open);
  };

  return (
    <div className="flex flex-col items-center">
      <button
        id="dropdownDefaultButton"
        data-dropdown-toggle="dropdown"
        className="inline-flex items-center rounded-lg bg-blue-700 px-5 py-2.5 
text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:cursor-not-allowed disabled:bg-gray-400 dark:bg-blue-600 
dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        type="button"
        onClick={handleRouteOpen}
        disabled={state.selectedTeam === null}
      >
        {state.selectedRoute ? state.selectedRoute : 'Choose Route'}
        <svg
          className="ms-3 h-2.5 w-2.5"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 10 6"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="m1 1 4 4 4-4"
          />
        </svg>
      </button>
      {open ? (
        <ul className="menu">
          {routesFromTeam.map((route, index) => (
            <li
              key={index}
              onClick={() => handleRouteChange(route.routeName, route.routeId)}
            >
              {route.routeName}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
};

export default RouteSelection;
