import { useState } from 'react';

const AddMember = ({ teamData, setTeamData }) => {
  const [newMember, setNewMember] = useState({
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
    console.log('team data ao inicio ', teamData);
    setTeamData((prevData) => {
      const currentTeam = { ...prevData };
      const currentMembers = [...currentTeam.team];
      currentMembers.push(newMember);
      console.log('Adding member ', currentMembers);
      currentTeam.team = currentMembers;
      return currentTeam;
    });
  };

  return (
    <div>
      <button onClick={handleAddMember}>+</button>
    </div>
  );
};

export default AddMember;
