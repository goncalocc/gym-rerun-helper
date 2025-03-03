import { useEffect, useRef, useState } from 'react';
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
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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

  //        className="flex w-full items-center justify-between truncate rounded-lg bg-gray-700 px-4 py-2 text-white
  // transition-all duration-200 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:bg-gray-700 disabled:text-gray-400"

  return (
    <div ref={dropdownRef} className="relative my-2 w-[70%]">
      <button
        className="flex w-full items-center justify-between overflow-hidden text-ellipsis whitespace-nowrap rounded-lg bg-gray-700 
  px-4 py-2 text-white transition-all duration-200 hover:bg-gray-600 
  focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:bg-gray-700 disabled:text-gray-400"
        onClick={handleRouteOpen}
        disabled={state.selectedTeam === null}
      >
        <span className="max-w-[80%] truncate">
          {state.selectedRoute ? state.selectedRoute : 'Choose Route'}
        </span>
        <svg
          className="ml-2 h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 10 6"
        >
          <path
            stroke="currentColor"
            strokeLinejoin="round"
            strokeWidth="2"
            d="m1 1 4 4 4-4"
          />
        </svg>
      </button>
      {open ? (
        <ul className="absolute mt-2 w-full rounded-lg bg-white shadow-md ring-1 ring-gray-300 dark:bg-gray-800 dark:ring-gray-600">
          {routesFromTeam.map((route, index) => (
            <li
              className="cursor-pointer px-4 py-3 text-gray-700 transition-all duration-150 
          hover:bg-gray-200 dark:text-gray-200 dark:hover:bg-gray-700"
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
