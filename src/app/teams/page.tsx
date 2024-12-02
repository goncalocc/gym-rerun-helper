'use client';

import { useEffect, useState } from 'react';
import { NotificationParams } from './components/ViewTeams';
import ViewTeamsPreRenderData from './components/ViewTeamsPreRenderData';

const ViewTeamsPage: React.FC = () => {
  const [notification, setNotification] = useState<NotificationParams>({
    message: '',
    type: '',
    visible: false,
  });
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);

  useEffect(() => {
    const notificationString = localStorage.getItem('notification');
    const selectedTeamString = localStorage.getItem('selectedTeam');

    if (notificationString) {
      try {
        const parsedNotification = JSON.parse(notificationString);
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
    return () => {
      localStorage.removeItem('notification');
      localStorage.removeItem('selectedTeam');
    };
  }, []);

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
