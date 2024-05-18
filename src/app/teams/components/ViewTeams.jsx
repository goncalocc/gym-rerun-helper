import Icon from '../../components/Icon'

export const ViewTeams = ({ localStorageData: teamsData }) => {

    if (!Array.isArray(teamsData) || teamsData.length === 0) {
        return <p>No teams data available.</p>;
    }
    return (
        <main>
            <div>
                {teamsData.map((team, index) => (
                    <div key={index} className="flex items-center space-x-4">
                        <div className="w-52">
                            Team: {team.teamname}
                        </div>
                        <div className="flex items-center space-x-4">
                            <button className="flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                                {team.team.map((members, index) => (
                                    <Icon key={index} name={members.pokemon.toLowerCase()} size={70} color="brown" />
                                ))}
                            </button>
                            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Edit</button>
                        </div>
                    </div>
                ))}
            </div>

        </main >
    );
};

export default ViewTeams;
