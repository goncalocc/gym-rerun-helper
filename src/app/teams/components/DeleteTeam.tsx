import { Teams, Team, Routes } from '../../types/types';
import { HandleTeamsUpdate } from './ViewTeamsPreRenderData';
import { NotificationParams } from './ViewTeams';
import handleRoutesUpdate from '../../routes/components/HandleRoutesUpdate';

type DeleteTeamProps = {
  teamsData: Teams[];
  routesData: Routes[];
  setTeamsData: React.Dispatch<React.SetStateAction<Teams[]>>;
  setRoutesData: React.Dispatch<React.SetStateAction<Routes[]>>;
  deletedTeamId: string;
  handleTeamsUpdate: HandleTeamsUpdate;
  setNotification: React.Dispatch<React.SetStateAction<NotificationParams>>;
};

const deleteTeam = ({
  teamsData,
  routesData,
  setTeamsData,
  setRoutesData,
  deletedTeamId,
  handleTeamsUpdate,
  setNotification,
}: DeleteTeamProps) => {
  const confirmWindow = window.confirm(
    'Are you sure you want to delete this team?',
  );

  if (confirmWindow) {
    const currentTeams = [...teamsData];
    const currentRoutes = [...routesData];
    if (currentTeams.length > 1) {
      const updatedTeams = currentTeams.filter(
        (team) => team.teamId !== deletedTeamId,
      );

      //find all routes by team id
      const updatedRoutes = currentRoutes.filter(
        (route) => route.teamId !== deletedTeamId,
      );
      const deletedRoutes = currentRoutes.filter(
        (route) => route.teamId == deletedTeamId,
      );
      //one by one delete them
      for (const route of deletedRoutes) {
        handleRoutesUpdate({
          updatedRoute: route,
          isDelete: true,
          setRoutesData,
        });
      }

      setRoutesData(() => {
        console.log('Routes that will bes: ', updatedRoutes);
        return [...updatedRoutes];
      });

      setTeamsData(() => {
        console.log('array without deleted team: ', updatedTeams);
        return [...updatedTeams];
      });
      const defaultNewTeam: Team[] = [];
      const defaultNewSubteam: Team[] = [];
      const defaultIndexUpdatedTeam = -1;
      const defaultTeamName = 'placeholder string';

      handleTeamsUpdate(
        defaultNewTeam,
        defaultNewSubteam,
        defaultTeamName,
        defaultIndexUpdatedTeam,
        updatedTeams,
      );
      setNotification({
        message: 'Team deleted successfully',
        type: 'success',
        visible: true,
      });

      setTimeout(() => {
        setNotification({ message: '', type: '', visible: false });
      }, 3000);
    }
  }
};

export default deleteTeam;
