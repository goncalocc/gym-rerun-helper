import { FilteredGym } from '@/app/hooks/UseRouteAndTeamData';

export interface TooltipRouteProps {
  gym: FilteredGym;
}

const TooltipRoute: React.FC<TooltipRouteProps> = ({ gym }) => {
  return (
    <div>
      {(gym?.swapItems ||
        gym?.channelTP ||
        gym?.swapTeams ||
        gym?.heal ||
        gym?.provisionalHeal) && (
        <div
          id="tooltip"
          className="w-full rounded-lg bg-purple-950 text-white shadow"
        >
          <div>
            <strong>Steps after completing this Gym:</strong>
            <div>
              {gym.swapItems && (
                <>
                  <strong>Change Items: </strong> {gym.swapItems}
                </>
              )}
            </div>
            <div>
              {gym.channelTP && (
                <>
                  <strong>Change channel </strong> to leave the gym
                </>
              )}
            </div>
            <div>
              {gym.swapTeams && (
                <>
                  <strong>Change Teams </strong>{' '}
                </>
              )}
            </div>
            <div>
              {gym.heal && (
                <>
                  <strong>Heal: </strong> is necessary
                </>
              )}
            </div>
            <div>
              {gym.provisionalHeal && (
                <>
                  <strong>Heal: </strong> if needed
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TooltipRoute;
