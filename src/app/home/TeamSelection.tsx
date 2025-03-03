import { Dispatch, useEffect, useRef, useState } from 'react';
import { Teams } from '../types/types';

type TeamSelectionProps = {
  teamsData: Teams[]; // Define your actual type for teamsData
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

export const TeamSelection: React.FC<TeamSelectionProps> = ({
  teamsData,
  state,
  setState,
}) => {
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

  const handleTeamChange = (team: string | null, teamId: string | null) => {
    setState((prev) => ({
      ...prev,
      selectedTeam: team,
      selectedTeamId: teamId,
      selectedRoute: null,
      selectedRouteId: null,
    }));
    setOpen(false);
  };

  const handleTeamOpen = () => {
    setOpen(!open);
  };
  return (
    <div ref={dropdownRef} className="relative my-2 w-[70%]">
      {/* Button to Open Dropdown */}
      <button
        className="flex w-full items-center justify-between overflow-hidden text-ellipsis whitespace-nowrap rounded-lg bg-gray-700 
  px-4 py-2 text-white transition-all duration-200 hover:bg-gray-600 
  focus:outline-none focus:ring-2 focus:ring-gray-500"
        onClick={handleTeamOpen}
      >
        <span className="max-w-[80%] truncate">
          {state.selectedTeam ? state.selectedTeam : 'Choose Team'}
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

      {/* Dropdown Menu */}
      {open && (
        <ul className="absolute left-0 z-10 mt-2 w-full rounded-lg bg-white shadow-md ring-1 ring-gray-300 dark:bg-gray-800 dark:ring-gray-600">
          {teamsData.map((team, index) => (
            <li
              key={index}
              className="cursor-pointer px-4 py-3 text-gray-700 transition-all duration-200
          hover:bg-gray-200 dark:text-gray-200 dark:hover:bg-gray-700"
              onClick={() => handleTeamChange(team.teamName, team.teamId)}
            >
              {team.teamName}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TeamSelection;
