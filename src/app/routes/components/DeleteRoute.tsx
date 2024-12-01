import { Routes, Teams } from '@/app/types/types';
import { HandleRoutesUpdate } from './ViewRoute';
import { useRouter } from 'next/navigation';

type DeleteRouteProps = {
  handleRoutesUpdate: HandleRoutesUpdate;
  assignedRoute: Routes;
  router: ReturnType<typeof useRouter>;
  assignedTeam: Teams | undefined;
};

const deleteRoute = ({
  handleRoutesUpdate,
  assignedRoute,
  router,
  assignedTeam,
}: DeleteRouteProps) => {
  const confirmWindow = window.confirm(
    'Are you sure you want to delete this Route?',
  );

  if (confirmWindow) {
    handleRoutesUpdate(assignedRoute, true);
    console.log('array with deleted Route: ', assignedRoute);

    const queryString = new URLSearchParams({
      notification: JSON.stringify({
        message: 'Route deleted successfully',
        type: 'success',
        visible: true,
      }),
      selectedTeam: assignedTeam ? assignedTeam.teamId : '',
    }).toString();
    router.push(`/teams?${queryString}`);
  }
};

export default deleteRoute;
