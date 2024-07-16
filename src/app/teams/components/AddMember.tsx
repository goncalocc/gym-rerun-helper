import { useState } from 'react';
import { Team } from '../../types/types';

interface AddMemberProps {
  teamData: Team[];
  setTeamData: React.Dispatch<React.SetStateAction<Team[]>>;
}

const AddMember = ({ teamData, setTeamData }: AddMemberProps) => {
  const [newMember] = useState({
    pokemon: '',
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
  });

  const handleAddMember = () => {
    setTeamData((prevData) => {
      const currentTeam = [...prevData ];
      currentTeam.push(newMember);
      console.log('Adding member ', currentTeam);
      return currentTeam;
    });
  };

  return (
    <div>
      {teamData && teamData.length <6 ?
      <button onClick={handleAddMember}>+</button>
      : <></>}
    </div>
  );
};

export default AddMember;
