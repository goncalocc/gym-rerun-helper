'use client';

import { useParams } from 'next/navigation';
import ViewRun from './components/ViewRun';

export default function RunPage() {
  const { routeId } = useParams() as { routeId: string };

  return (
    <main className="">
      <ViewRun idProps={routeId} />
    </main>
  );
}
