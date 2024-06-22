import { HandleTeamsUpdate } from './ViewTeamsPreRenderData';
import { Teams, Team, SetTeamsData } from '../../types/types';

interface AddTeamProps {
  teamsData: Teams[];
  externalSetTeamsData: SetTeamsData;
  handleTeamsUpdate: HandleTeamsUpdate;
}

export const AddTeam: React.FC<AddTeamProps> = ({
  teamsData,
  externalSetTeamsData,
  handleTeamsUpdate,
}) => {
  const newTeam = {
    teamname: 'testing',
    team: [
      {
        pokemon: 'Abra',
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
    handleTeamsUpdate(
      defaultNewTeam,
      defaultNewSubteam,
      defaultIndexUpdatedTeam,
      currentTeams,
    );
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
