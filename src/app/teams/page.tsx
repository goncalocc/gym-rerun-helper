'use client';

import { useEffect, useState } from 'react';
import NotificationBar from '../utils/NotificationBar';
import { NotificationParams } from './components/ViewTeams';
import ViewTeamsPreRenderData from './components/ViewTeamsPreRenderData';
import { useSearchParams } from 'next/navigation';

const ViewTeamsPage: React.FC = () => {
  const notificationString = useSearchParams().get('notification');
  const selectedTeamString = useSearchParams().get('selectedTeam');

  const [notification, setNotification] = useState<NotificationParams>({
    message: '',
    type: '',
    visible: false,
  });
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);

  useEffect(() => {
    if (notificationString) {
      try {
        const parsedNotification: NotificationParams =
          JSON.parse(notificationString);
        setNotification(parsedNotification);

        setTimeout(() => {
          setNotification({ message: '', type: '', visible: false });
        }, 3000);
      } catch (error) {
        console.error('Error parsing notification:', error);
      }
    }
    if (selectedTeamString) {
      try {
        setSelectedTeam(selectedTeamString);
      } catch (error) {
        console.error('Error parsing selected team:', error);
      }
    }
  }, [notificationString, selectedTeamString]);

  const closeNotification = () => {
    setNotification({ message: '', type: '', visible: false });
  };

  return (
    <main>
      <ViewTeamsPreRenderData
        notification={notification}
        selectedTeam={selectedTeam}
      />
    </main>
  );
};

export default ViewTeamsPage;
