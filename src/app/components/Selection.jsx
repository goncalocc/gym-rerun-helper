/* eslint-disable prettier/prettier */
import { TeamSelection } from './TeamSelection';
import { RouteSelection } from './RouteSelection';

export const Selection = () => {
  return (
    <div className="flex flex-col items-center">
      <TeamSelection />
      <RouteSelection />
      <button
        type="button"
        className="rounded-lg bg-blue-700 px-5 py-3 text-center text-base font-medium text-white hover:bg-blue-800 focus:outline-none 
focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
      >
        Start
      </button>
    </div>
  );
};

export default Selection;
