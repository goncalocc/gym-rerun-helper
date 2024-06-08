const deleteMember = (setTeamData, index, handleEnableButton, isSubteam) => {
    setTeamData((prevData) => {
      const currentTeam = [ ...prevData ];
      if (currentTeam.length > 1 || isSubteam) {
        currentTeam.splice(index, 1);
        handleEnableButton();
        console.log('deleted member in ', currentTeam);
        return currentTeam;
      }
    });
};

export default deleteMember;
