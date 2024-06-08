import { useState } from 'react';

const AddMember = ({ teamData, setTeamData }) => {
  const [newMember] = useState({
    pokemon: '',
    ability: '',
    nature: '',
    item: '',
    evs: {
      attack: '',
      defense: '',
      hp: '',
      specialAttack: '',
      specialDefense: '',
      speed: '',
    },
    ivs: {
      attack: '',
      defense: '',
      hp: '',
      specialAttack: '',
      specialDefense: '',
      speed: '',
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
