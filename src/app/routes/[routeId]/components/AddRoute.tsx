import { Routes } from '@/app/types/types';
import generateUniqueId from '@/app/utils/GenerateId';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface AddRouteProps {
  teamId: string;
  teamRoutes: Routes[];
}

export const AddRoute: React.FC<AddRouteProps> = ({ teamId, teamRoutes }) => {
  const [routes, setRoutes] = useState<Routes[]>(teamRoutes);
  const router = useRouter();

  const handleAddRoute = () => {
    const newRoute: Routes = {
      teamId: teamId,
      routeName: `Route #${routes.length + 1}`,
      routeId: generateUniqueId(),
      route: [],
    };
    setRoutes((prevRoutes) => {
      const updatedRoutes = [...prevRoutes, newRoute];
      localStorage.setItem('gymRerunRoutes', JSON.stringify(updatedRoutes));
      return updatedRoutes;
    });

    router.push(`/routes/${newRoute.routeId}`);
  };

  return (
    <div>
      <button
        onClick={(e) => {
          e.preventDefault(); // Prevent default navigation temporarily
          handleAddRoute();
        }}
        className="
        items-center
        justify-center rounded-full 
        bg-gray-500
        text-white shadow-lg transition 
        duration-200 hover:bg-gray-700 focus:outline-none
        focus:ring-2 focus:ring-blue-400 focus:ring-offset-2
        sm:h-6 sm:w-6 sm:text-lg
        md:h-6 md:w-6 md:text-lg
        lg:h-8 lg:w-8 lg:text-2xl
      "
        aria-label="Add"
      >
        <span className="font-bold">+</span>
      </button>
    </div>
  );
};

export default AddRoute;
