import Icon from '../../components/Icon'
import React, { useState, useEffect } from 'react';
import ViewTeamDetails from './ViewTeamDetails';

export const ViewTeams = ({ localStorageData: teamsData }) => {
    const [selectedTeam, setSelectedTeam] = useState(null);

    const handleClickDetails = (index) => {
        setSelectedTeam(selectedTeam === index ? null : index);
        console.log(selectedTeam)
    }

    if (!Array.isArray(teamsData) || teamsData.length === 0) {
        return <p>No teams data available.</p>;
    }
    return (
        <main>
            <div>
                {teamsData.map((team, index) => (
                    <div key={index} className="flex items-center space-x-8 mt-12">
                        <div className="w-52">
                            Team: {team.teamname}
                        </div>
                        <div>
                            <button className="flex items-center justify-center rounded-md border border-transparent bg-blue-600 
                            px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 
                            focus:ring-blue-500 focus:ring-offset-2 mb-4"
                                onClick={() => handleClickDetails(index)}
                            >
                                {team.team.map((members, index) => (
                                    <Icon key={index} name={members.pokemon.toLowerCase()} size={70} color="brown" />
                                ))}
                            </button>
                            {/*<button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                                Details
                            </button> */}
                            {selectedTeam === index && (
                                <ViewTeamDetails details={team}/>
                            )}
                        </div>
                    </div>

                ))}
            </div>

        </main >
    );
};

export default ViewTeams;
