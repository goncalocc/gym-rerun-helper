import React, { useRef } from 'react';

export const AddTeam = ({
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
      },
    ],
    subteam: [],
  };

//   const isAddingTeamRef = useRef(false); // To prevent double addition in Strict Mode

  const handleAddTeam = (
    teamsData,
    externalSetTeamsData,
    handleTeamsUpdate,
  ) => {
    const currentTeams = [...teamsData];
    const teamToAdd = structuredClone(newTeam);
    currentTeams.push(teamToAdd);
    externalSetTeamsData((prevData) => {
      const newArray = [...prevData, currentTeams];
      console.log('Adding team ', newArray);
      return newArray;
    });
    handleTeamsUpdate('', '', '', currentTeams);
  };

  return (
    <div>
      {teamsData.length < 10 ? (
        <button
          onClick={() => handleAddTeam(teamsData, externalSetTeamsData, handleTeamsUpdate)}
        >
          +
        </button>
      ) : (
        <></>
      )}
    </div>
  );
};

export default AddTeam;
