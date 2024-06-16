const deleteTeam = (teamsData, setTeamsData, index, handleTeamsUpdate) => {
  const confirmWindow = window.confirm('Are you sure you want to delete this team?');

  if (confirmWindow) {
    setTeamsData((prevData) => {
      const currentTeam = [...prevData];
      if (currentTeam.length > 1) {
        currentTeam.splice(index, 1);
        console.log('deleted team: ', currentTeam);
        handleTeamsUpdate('', '', '', currentTeam);
        return currentTeam;
      }
    });
  }
};

export default deleteTeam;