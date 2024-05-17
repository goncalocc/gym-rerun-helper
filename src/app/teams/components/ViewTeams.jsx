export const ViewTeams = ({ localStorageData: teamsData }) => {
    // const teamsData = props.localStorageData;

    if (!Array.isArray(teamsData) || teamsData.length === 0) {
        return <p>No teams data available.</p>;
    }

    return (
        <main>
            <div>
                {teamsData.map((team, index) => (
                    <div key={index}>
                        Team: {team.teamname}
                        <button className="flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                            {team.team.map((members, index) => (
                                <div key={index}>{members.pokemon}</div>
                            ))}
                        </button>
                    </div>
                ))}
            </div>
        </main>
    );
};

export default ViewTeams;
