import { Routes } from '@/app/types/types';

interface HandleRoutesUpdateProps {
  updatedRoute: Routes;
  isDelete: boolean;
  setRoutesData: React.Dispatch<React.SetStateAction<Routes[]>>;
  setAssignedRoute?: React.Dispatch<React.SetStateAction<Routes | undefined>>; // Optional
}

const handleRoutesUpdate = ({
  updatedRoute,
  isDelete,
  setRoutesData,
  setAssignedRoute,
}: HandleRoutesUpdateProps) => {
  setRoutesData((prevData) => {
    let updatedRoutes;
    if (isDelete) {
      updatedRoutes = prevData.filter(
        (route) => route.routeId !== updatedRoute.routeId,
      );
    } else {
      updatedRoutes = prevData.map((route) =>
        route.routeId === updatedRoute.routeId
          ? { ...route, ...updatedRoute } // Merge updatedRoute into the existing route
          : route,
      );
    }
    localStorage.setItem('gymRerunRoutes', JSON.stringify(updatedRoutes));
    return updatedRoutes;
  });
  if (setAssignedRoute) {
    if (isDelete) {
      setAssignedRoute((prevData) =>
        prevData?.routeId === updatedRoute.routeId ? undefined : prevData,
      );
    } else {
      setAssignedRoute((prevData) => ({
        ...prevData,
        ...updatedRoute,
      }));
    }
  }
};

export default handleRoutesUpdate;
