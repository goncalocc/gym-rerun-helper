import { Routes, Teams } from '@/app/types/types';
import { useRouter } from 'next/navigation';
import { SetStateAction } from 'react';
import handleRoutesUpdate from './HandleRoutesUpdate';

type DeleteRouteProps = {
  setRoutesData: React.Dispatch<SetStateAction<Routes[]>>;
  assignedRoute: Routes;
  setAssignedRoute: React.Dispatch<SetStateAction<Routes | undefined>>;
  router: ReturnType<typeof useRouter>;
  assignedTeam: Teams | undefined;
};

const deleteRoute = async ({
  setRoutesData,
  assignedRoute,
  setAssignedRoute,
  router,
  assignedTeam,
}: DeleteRouteProps) => {
  const confirmWindow = window.confirm(
    'Are you sure you want to delete this Route?',
  );

  if (confirmWindow) {
    handleRoutesUpdate({
      updatedRoute: assignedRoute,
      isDelete: true,
      setRoutesData,
      setAssignedRoute,
    });
    console.log('Array with deleted Route: ', assignedRoute);

    const data = {
      notification: {
        message: 'Route deleted successfully',
        type: 'success',
        visible: true,
      },
      selectedTeam: assignedTeam ? assignedTeam.teamId : '',
    };

    localStorage.setItem('notification', JSON.stringify(data.notification));
    localStorage.setItem('selectedTeam', data.selectedTeam);

    router.push('/teams');
  }
};

export default deleteRoute;
