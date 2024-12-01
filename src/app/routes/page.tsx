'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import ViewRoute from './components/ViewRoute';
import { useEffect } from 'react';

const RoutesPage: React.FC = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const idProps = searchParams.get('idProps');

  useEffect(() => {
    if (!idProps) {
      // Navigate to a fallback route, like an error page or the home page
      router.push('/error'); // TypeScript knows that `router.push` is available
    }
  }, [idProps, router]);

  return (
    <main>
      {idProps ? (
        <ViewRoute idProps={idProps} router={router} />
      ) : (
        <p>Loading...</p>
      )}
    </main>
  );
};

export default RoutesPage;
