"use client";

import { useSearchParams } from 'next/navigation';
import ViewRoute from './components/ViewRoute';

const RoutesPage: React.FC = () => {
  const searchParams = useSearchParams()
 
  const idProps = searchParams.get('idProps')

  return (
    <main>
      {idProps ? <ViewRoute idProps={idProps} /> : <p>Loading...</p>}
    </main>
  );
};

export default RoutesPage;