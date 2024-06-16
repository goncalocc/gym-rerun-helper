import { useState, useEffect } from 'react';

const [newTeam] = useState(
    {
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
            }
        ]
    }
);

function AddTeam({ externalSetTeamsData }) {
    console.log('Add Team button clicked');
    externalSetTeamsData((prevData) => {
        console.log('Updating teams data...');
        const currentTeams = [...prevData];
        const teamToAdd = structuredClone(newTeam);
        currentTeams.push(teamToAdd);
        console.log('Adding member ', currentTeams);
        return currentTeams;
    });
};

export default AddTeam;
