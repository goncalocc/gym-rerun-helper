const deleteTeam = (teamsData, setTeamsData, index, handleTeamsUpdate) => {
  const confirmWindow = window.confirm('Are you sure you want to delete this team?');

  if (confirmWindow) {
    const currentTeams = [...teamsData];
    if (currentTeams.length > 1) {
      currentTeams.splice(index, 1);
    
      setTeamsData((prevData) => {
        
         const newArray = [...prevData, currentTeams]
          console.log('array with deleted team: ', newArray);
          return newArray;
        });
        handleTeamsUpdate('', '', '', currentTeams);
    }
  }
};

export default deleteTeam;