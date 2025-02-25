import { Dispatch, useState } from 'react';
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
    <div className="flex flex-col items-center">
      <button
        id="dropdownDefaultButton"
        data-dropdown-toggle="dropdown"
        className="inline-flex items-center rounded-lg bg-blue-700 
px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 
dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        type="button"
        onClick={handleTeamOpen}
      >
        {state.selectedTeam ? state.selectedTeam : 'Choose Team'}
        <svg
          className="ms-3 h-2.5 w-2.5"
          aria-hidden="true"
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
        <ul className="absolute top-12 w-48 rounded-lg bg-white shadow-lg ring-1 ring-gray-300 dark:bg-gray-800 dark:ring-gray-600">
          {teamsData.map((team, index) => (
            <li
              className="cursor-pointer px-4 py-2 text-gray-700 hover:bg-gray-200 dark:text-gray-200 dark:hover:bg-gray-700"
              key={index}
              onClick={() => handleTeamChange(team.teamName, team.teamId)}
            >
              {team.teamName}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
};

export default TeamSelection;
