import React, { useState, useTransition } from 'react';
import ViewTeamEditInfoDetails from './ViewTeamEditInfoDetails';
import Svg from '../../components/Svg';

const ViewTeamEditInfo = ({
  details: props,
  index: teamIndex,
  onClose: closeEdit,
  teams: teams,
}) => {
  const [teamsData, setTeamsData] = useState(teams);
  const [teamData, setTeamData] = useState(props);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [isDisabled, setIsDisabled] = useState(true);
  const [copyTeamData, setCopyTeamData] = useState(teamData);
  const [copyTeamsData, setCopyTeamsData] = useState(teamsData);
  const [indexCopiedTeam, setIndexCopiedTeam] = useState(0);

  const handleMemberDetails = (index) => {
    if (selectedMembers.includes(index)) {
      setSelectedMembers(
        selectedMembers.filter((selectedIndex) => selectedIndex !== index),
      );
    } else {
      setSelectedMembers([...selectedMembers, index]);
    }
  };

  const handleEnableButton = () => {
    setIsDisabled(false);
  };

  const onFormChange = (updatedForm, teamIndex, pokemonIndex) => {
    console.log(
      'see updatedForm: ',
      updatedForm,
      ' and teamid: ',
      teamIndex,
      ' and id: ',
      pokemonIndex,
    );
    setCopyTeamData((prevData) => {
      // Create a shallow copy of the team object
      const updatedTeamObject = { ...prevData };
      // Create a shallow copy of the team array
      const updatedTeam = [...updatedTeamObject.team];

      // Ensure the pokemon at pokemonIndex exists
      if (!updatedTeam[pokemonIndex]) {
        console.error('Invalid pokemon index:', pokemonIndex);
        return prevData;
      }

      // Create a copy of the member to be updated and update with updatedForm
      const updatedMember = { ...updatedTeam[pokemonIndex], ...updatedForm };

      // Update the specific member in the copied team array
      updatedTeam[pokemonIndex] = { ...updatedMember };
      //update to the whole object (put in the specific team part)
      updatedTeamObject.team = [...updatedTeam];
      //deep copy
      // updatedTeamObject.team = updatedTeam.map(item=> ({...item}));
      setIndexCopiedTeam(teamIndex);
      return updatedTeamObject;
    });
  };

  const submitForm = () => {
    // Ensure the team at teamIndex exists
    setCopyTeamsData((prevTeams) => {
      // Make a shallow copy of the previous state
      const updatedTeams = [...prevTeams];

      // Check if the teamIndex is valid
      if (
        !updatedTeams[indexCopiedTeam] ||
        !Array.isArray(updatedTeams[indexCopiedTeam].team)
      ) {
        console.error('Invalid team structure at teamIndex:', indexCopiedTeam);
        throw new Error('Invalid team structure');
      }

      // Set the updated team array back to the updatedTeams object
      updatedTeams[indexCopiedTeam] = {
        ...updatedTeams[indexCopiedTeam],
        team: copyTeamData.team,
      };
      console.log('updated: ', updatedTeams);
      // Return the updated state
      localStorage.setItem('gymRerunTeam', JSON.stringify(updatedTeams));
      return updatedTeams;
    });
  };

  //created modal to perform edits on pokemon
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-600 bg-opacity-50">
      <div className="relative max-h-[80vh] w-full max-w-xl overflow-y-auto rounded-lg bg-black p-6 sm:max-w-2xl md:max-w-3xl lg:max-w-4xl">
        <button
          onClick={closeEdit}
          className="text-white-500 absolute right-4 top-4 hover:text-gray-700"
        >
          X
        </button>
        <div className="max-h-[70vh] overflow-y-auto">
          <ul>
            {teamData.team.map((member, index) => (
              <div key={index}>
                <div className="mb-4 flex justify-center">
                  <button
                    className="w-56 rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-700"
                    onClick={() => handleMemberDetails(index)}
                  >
                    {member.pokemon}
                  </button>
                  <div>
                    <Svg
                      key={index}
                      name="trash-grey"
                      size={40}
                      color="brown"
                    />
                  </div>
                </div>
                {selectedMembers.includes(index) && (
                  <ViewTeamEditInfoDetails
                    index={index}
                    teamIndex={teamIndex}
                    member={member}
                    onFormChange={onFormChange}
                    enable={handleEnableButton}
                  />
                )}
              </div>
            ))}
          </ul>
          <div className="mb-4 flex justify-center space-x-4">
            <button
              className={`rounded px-4 py-2 font-semibold text-white 
        ${isDisabled ? 'cursor-not-allowed bg-gray-400' : 'bg-blue-500 hover:bg-blue-700'}`}
              disabled={isDisabled}
              onClick={submitForm}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewTeamEditInfo;
