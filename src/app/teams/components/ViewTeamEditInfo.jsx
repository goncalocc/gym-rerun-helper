import React, { useEffect, useState, useTransition } from 'react';
import ViewTeamEditInfoDetails from './ViewTeamEditInfoDetails';
import { validateTeams } from './ValidateTeams';
import Svg from '../../components/Svg';

const ViewTeamEditInfo = ({
  details: props,
  index: teamIndex,
  onClose: closeEdit,
  handleTeamsUpdate: handleTeamsUpdate,
}) => {
  const [teamData, setTeamData] = useState(props);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [isDisabled, setIsDisabled] = useState(true);
  const [indexUpdatedTeam, setIndexUpdatedTeam] = useState(0);
  const [isSaved, setIsSaved] = useState(false);
  const [errorData, setErrorData] = useState([]);

  useEffect(() => {
    if (isSaved) {
      closeEdit();
    }
  }, [isSaved, errorData]);

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
    setErrorData([]);
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
          [subfield]: isNaN(parseInt(value)) ? '' : parseInt(value),
        };
      } else {
        updatedMember[name] = value;
      }

      updatedMembers[pokeIndex] = updatedMember;
      updatedTeam.team = updatedMembers;

      return updatedTeam;
    });
    setIndexUpdatedTeam(teamIndex);
  };

  const submitForm = (event) => {
    setErrorData([]);
    event.preventDefault();
    try {
      //first, makes validations
      validateTeams(teamData, errorData);
      handleTeamsUpdate(teamData, indexUpdatedTeam);
      setIsSaved(true);
      // }
    } catch (error) {
      // Handle validation errors
      alert(error.message);
      const fieldsWithError = error.newErrors;
      setErrorData(fieldsWithError);
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
                    errorData={errorData}
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
