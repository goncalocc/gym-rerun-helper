import { NotificationParams } from '@/app/teams/components/ViewTeams';
import { Routes } from '@/app/types/types';

type DeleteRouteProps = {
  routeId: string;
  setRoutesData: React.Dispatch<React.SetStateAction<Routes[]>>;
  routesData: Routes[];
  setNotification: React.Dispatch<React.SetStateAction<NotificationParams>>;
};

const deleteRoute = ({
  routeId,
  setRoutesData,
  routesData,
  setNotification,
}: DeleteRouteProps) => {
  const confirmWindow = window.confirm(
    'Are you sure you want to delete this team?',
  );

  if (confirmWindow) {
    const currentRoutes = [...routesData];
    if (currentRoutes.length > 1) {
      currentRoutes.filter((route) => route.routeId !== routeId);

      setRoutesData(() => {
        console.log('array with deleted team: ', currentRoutes);
        return [...currentRoutes]; // Correctly return the new array without adding prevData
      });
      //   const defaultNewTeam: Team[] = [];
      //   const defaultNewSubteam: Team[] = [];
      //   const defaultIndexUpdatedTeam = -1;
      //   const defaultTeamName = 'placeholder string';
      //   handleTeamsUpdate(
      //     defaultNewTeam,
      //     defaultNewSubteam,
      //     defaultTeamName,
      //     defaultIndexUpdatedTeam,
      //     currentTeams,
      //   );
      setNotification({
        message: 'Team deleted successfully',
        type: 'success',
        visible: true,
      });

      setTimeout(() => {
        setNotification({ message: '', type: '', visible: false });
      }, 3000);
    }
  }
};

export default deleteRoute;
