import { Dispatch, SetStateAction } from 'react';
import { Routes } from '@/app/types/types';
import generateUniqueId from '@/app/utils/GenerateId';
import { useRouter } from 'next/navigation';

const useCloneRoute = () => {
  return (
    setRoutesData: Dispatch<SetStateAction<Routes[]>>,
    assignedRoute: Routes,
    router: ReturnType<typeof useRouter>,
  ) => {
    const newRoute: Routes = {
      teamId: assignedRoute.teamId,
      routeName: `${assignedRoute.routeName} Copy`,
      routeId: generateUniqueId(),
      route: assignedRoute.route,
    };

    const confirmWindow = window.confirm(
      'Are you sure you want to clone this Route?',
    );

    if (confirmWindow) {
      setRoutesData((prevRoutes) => {
        const updatedRoutes = [...prevRoutes, newRoute];
        localStorage.setItem('gymRerunRoutes', JSON.stringify(updatedRoutes));
        return updatedRoutes;
      });

      const data = {
        notification: {
          message: 'Route cloned successfully',
          type: 'success',
          visible: true,
        },
      };

      localStorage.setItem('notification', JSON.stringify(data.notification));

      router.push(`/teams`);
    }
  };
};

export default useCloneRoute;
