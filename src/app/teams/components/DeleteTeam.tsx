import { Teams, Team } from '../../types/types';
import { HandleTeamsUpdate } from './ViewTeamsPreRenderData';

type DeleteTeamProps = {
  teamsData: Teams[];
  setTeamsData: React.Dispatch<React.SetStateAction<Teams[]>>; // Define the setter type
  index: number;
  handleTeamsUpdate: HandleTeamsUpdate;
};

const deleteTeam = ({
  teamsData,
  setTeamsData,
  index,
  handleTeamsUpdate,
}: DeleteTeamProps)  => {
  const confirmWindow = window.confirm(
    'Are you sure you want to delete this team?',
  );

  if (confirmWindow) {
    const currentTeams = [...teamsData];
    if (currentTeams.length > 1) {
      currentTeams.splice(index, 1);

      setTeamsData(() => {
        console.log('array with deleted team: ', currentTeams);
        return [...currentTeams]; // Correctly return the new array without adding prevData
      });
      const defaultNewTeam: Team[] = [];
      const defaultNewSubteam: Team[] = [];
      const defaultIndexUpdatedTeam = -1;
      handleTeamsUpdate(defaultNewTeam, defaultNewSubteam, defaultIndexUpdatedTeam, currentTeams);
    }
  }
};

export default deleteTeam;
