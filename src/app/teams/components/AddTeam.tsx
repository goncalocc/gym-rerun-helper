import { HandleTeamsUpdate } from './ViewTeamsPreRenderData';
import { Teams, Team, SetTeamsData } from '../../types/types';
import { NotificationParams } from './ViewTeams';

interface AddTeamProps {
  teamsData: Teams[];
  externalSetTeamsData: SetTeamsData;
  handleTeamsUpdate: HandleTeamsUpdate;
  setNotification: React.Dispatch<React.SetStateAction<NotificationParams>>;
}

export const AddTeam: React.FC<AddTeamProps> = ({
  teamsData,
  externalSetTeamsData,
  handleTeamsUpdate,
  setNotification,
}) => {
  const generateUniqueId = () => {
    return Date.now() + Math.random().toString(36).substring(2);
  };

  const newTeam = {
    teamId: generateUniqueId(),
    teamName: `Team #${teamsData.length + 1}`,
    team: [
      {
        pokemon: 'Abra',
        nickname: '',
        ability: '',
        nature: '',
        item: '',
        evs: {
          attack: 0,
          defense: 0,
          hp: 0,
          specialAttack: 0,
          specialDefense: 0,
          speed: 0,
        },
        ivs: {
          attack: 0,
          defense: 0,
          hp: 0,
          specialAttack: 0,
          specialDefense: 0,
          speed: 0,
        },
        moveset: ['', '', '', ''],
      },
    ],
    subteam: [],
  };

  const handleAddTeam = () => {
    const currentTeams = [...teamsData];
    const teamToAdd: Teams = structuredClone(newTeam);
    currentTeams.push(teamToAdd);
    externalSetTeamsData((prevData) => {
      const newArray = [...prevData, teamToAdd];
      console.log('Adding team ', newArray);
      return newArray;
    });
    // Default placeholder values to satisfy the function signature
    const defaultNewTeam: Team[] = [];
    const defaultNewSubteam: Team[] = [];
    const defaultIndexUpdatedTeam = -1;
    const defaultTeamName = 'placeholder string';
    handleTeamsUpdate(
      defaultNewTeam,
      defaultNewSubteam,
      defaultTeamName,
      defaultIndexUpdatedTeam,
      currentTeams,
    );
    setNotification({
      message: 'New Team Added successfully',
      type: 'success',
      visible: true,
    });

    setTimeout(() => {
      setNotification({ message: '', type: '', visible: false });
    }, 3000);
  };

  return (
    <div>
      {teamsData.length < 10 ? (
        <button onClick={() => handleAddTeam()}>+</button>
      ) : (
        <></>
      )}
    </div>
  );
};

export default AddTeam;
