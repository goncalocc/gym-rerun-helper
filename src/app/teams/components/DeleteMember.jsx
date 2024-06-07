const deleteMember = (teamData, setTeamData, index, handleEnableButton) => {
  if (teamData.length > 1) {
    setTeamData((prevData) => {
      const currentTeam = { ...prevData };
      const currentMembers = [...currentTeam.team];
      if (currentMembers.length > 1) {
        currentMembers.splice(index, 1);
        currentTeam.team = currentMembers;
        handleEnableButton();
        return currentTeam;
      }
    });
  }
};

export default deleteMember;
