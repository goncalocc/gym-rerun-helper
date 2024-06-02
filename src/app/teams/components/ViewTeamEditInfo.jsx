import React, { useEffect, useState, useTransition } from 'react';
import ViewTeamEditInfoDetails from './ViewTeamEditInfoDetails';
import { validateTeams } from './ValidateTeams';
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
  const [indexCopiedTeam, setIndexCopiedTeam] = useState(0);
  const [errorMessage, setErrorMessage] = useState([]);
  const [fieldErrors, setfieldErrors] = useState({
    abilityErrors: [],
    evsErrors:{
      hp: [],
      attack: [],
      defense: [],
      specialAttack: [],
      specialDefense: [],
      speed: []
    },
    ivsErrors:{
      hp: [],
      attack: [],
      defense: [],
      specialAttack: [],
      specialDefense: [],
      speed: []
    },
    itemErrors: [],
    moveErrors: {
      0: [],
      1: [],
      2: [],
      3: []
    },
    natureErrors: [],
    pokemonErrors: [],
  });

  useEffect(() => {
    console.log('warnings:', fieldErrors);
    console.log('messages from the errors:', errorMessage);
  }, [errorMessage, fieldErrors]);

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

  const onFormChange = (teamIndex, pokeIndex, name, value) => {
    const [field, subfield] = name.split('.');

    setTeamData((prevData) => {
      // Update state based on the name of the field
      const updatedTeam = { ...prevData };
      const updatedMembers = [...updatedTeam.team];
      const updatedMember = { ...updatedMembers[pokeIndex] };

      if (field.startsWith('moveset')) {
        const movesetIndex = parseInt(name.split('.')[1]);
        updatedMember.moveset = [...updatedMember.moveset];
        updatedMember.moveset[movesetIndex] = value;
      } else if (subfield) {
        updatedMember[field] = {
          ...updatedMember[field],
          [subfield]: value,
        };
      } else {
        updatedMember[name] = value;
      }

      updatedMembers[pokeIndex] = updatedMember;
      updatedTeam.team = updatedMembers;

      return updatedTeam;
    });
    setIndexCopiedTeam(teamIndex);
  };

  const submitForm = async () => {
    try {
      //first, makes validations
      validateTeams(teamData, fieldErrors);
      if (!(errorMessage.length === 0)) {
        // Prevent form submission
        alert(errorMessage);
        return false;
      } else {
        // Ensure the team at teamIndex exists
        setTeamsData((prevTeams) => {
          // Make a shallow copy of the previous state
          const updatedTeams = [...prevTeams];
          // Check if the teamIndex is valid
          if (
            !updatedTeams[indexCopiedTeam] ||
            !Array.isArray(updatedTeams[indexCopiedTeam].team)
          ) {
            console.error(
              'Invalid team structure at teamIndex:',
              indexCopiedTeam,
            );
            throw new Error('Invalid team structure');
          }
          // Set the updated team array back to the updatedTeams object
          updatedTeams[indexCopiedTeam] = {
            ...updatedTeams[indexCopiedTeam],
            team: teamData.team,
          };
          console.log('updatedTeams: ', updatedTeams);
          // Return the updated state
          return updatedTeams;
        });
        localStorage.setItem('gymRerunTeam', JSON.stringify(teamsData));
      }
    } catch (error) {
      // Handle validation errors
      setErrorMessage(error.message);
      alert(error.message);

      const fieldsWithError = error.fieldErrors;
      setfieldErrors(fieldsWithError);
    }
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
                    fieldErrors={fieldErrors}
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
