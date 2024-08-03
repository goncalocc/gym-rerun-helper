import { TooltipProps } from './ViewRoute';

export interface TooltipRouteProps {
  tooltip: TooltipProps;
  index: number;
}

const TooltipRoute: React.FC<TooltipRouteProps> = ({ tooltip, index }) => {
  return (
    <div>
      {tooltip.visible && tooltip.index === index && (
        <div
          id="tooltip"
          className="absolute z-50 whitespace-nowrap rounded bg-gray-800 p-2 text-white"
          style={{ top: tooltip.y, left: tooltip.x }}
        >
          <div>
            <strong>Steps before entering this Gym:</strong>
            <p>
              {tooltip.content.swapItems && (
                <>
                  <strong>Change Items: </strong> {tooltip.content.swapItems}
                </>
              )}
            </p>
            <p>
              {tooltip.content.channelTP && (
                <>
                  <strong>Change channel </strong> to leave the gym
                </>
              )}
            </p>
            <p>
              {tooltip.content.swapTeams && (
                <>
                  <strong>Change Teams </strong>{' '}
                </>
              )}
            </p>
            <p>
              {tooltip.content.heal && (
                <>
                  <strong>Heal: </strong> is necessary
                </>
              )}
            </p>
            <p>
              {tooltip.content.provisionalHeal && (
                <>
                  <strong>Heal: </strong> if needed
                </>
              )}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default TooltipRoute;
