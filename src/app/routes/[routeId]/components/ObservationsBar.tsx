import { FilteredGym } from '@/app/hooks/UseRouteAndTeamData';

export interface TooltipRouteProps {
  observations: string;
}

const ObservationsBar: React.FC<TooltipRouteProps> = ({ observations }) => {
  return (
    <div className="h-full w-full flex-grow">
      {observations && (
        <div className="h-full w-full rounded-lg bg-lime-800 text-white shadow">
          Observations: {observations}
        </div>
      )}
    </div>
  );
};

export default ObservationsBar;
