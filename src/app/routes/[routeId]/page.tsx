'use client';

import { useParams, useRouter } from 'next/navigation';
import ViewRoute from './components/ViewRoute';
import { useEffect } from 'react';

const RoutePage: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const routeId = params.routeId as string;

  useEffect(() => {
    if (!routeId) {
      router.push('/error');
    }
  }, [routeId, router]);

  return (
    <main>
      {routeId ? (
        <ViewRoute idProps={routeId} router={router} />
      ) : (
        <p>Loading...</p>
      )}
    </main>
  );
};

export default RoutePage;
