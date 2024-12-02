import { Routes, Teams } from '@/app/types/types';
import { HandleRoutesUpdate } from './ViewRoute';
import { useRouter } from 'next/navigation';

type DeleteRouteProps = {
  handleRoutesUpdate: HandleRoutesUpdate;
  assignedRoute: Routes;
  router: ReturnType<typeof useRouter>;
  assignedTeam: Teams | undefined;
};

const deleteRoute = async ({
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
    console.log('Array with deleted Route: ', assignedRoute);

    const data = {
      notification: {
        message: 'Route deleted successfully',
        type: 'success',
        visible: true,
      },
      selectedTeam: assignedTeam ? assignedTeam.teamId : '',
    };

    // Store the data in localStorage directly
    localStorage.setItem('notification', JSON.stringify(data.notification));
    localStorage.setItem('selectedTeam', data.selectedTeam);

    // Optionally, redirect to another page
    router.push('/teams');
  }
};

export default deleteRoute;
