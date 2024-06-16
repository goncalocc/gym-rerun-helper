import React, { useEffect, useState, useTransition } from 'react';
import ViewTeamEditMember from './ViewTeamEditMember';
import { validateTeams } from './ValidateTeams';
import deleteMember  from './DeleteMember';
import AddMember from './AddMember';
import Svg from '../../components/Svg';

const ViewTeamEditMain = ({
  details: props,
  index: teamIndex,
  onClose: closeEdit,
  handleTeamsUpdate: handleTeamsUpdate,
}) => {
  const [teamData, setTeamData] = useState(props.team);
  const [subteamData, setSubteamData] = useState(props.subteam);
  const [selectedTeam, setSelectedTeam] = useState([]);
  const [selectedSubteam, setSelectedSubteam] = useState([]);
  const [isDisabled, setIsDisabled] = useState(true);
  const [indexUpdatedTeam, setIndexUpdatedTeam] = useState(0);
  const [isSaved, setIsSaved] = useState(false);
  const [errorData, setErrorData] = useState({});

  useEffect(() => {
    if (isSaved) {
      closeEdit();
    }
  }, [isSaved, errorData]);

  const handleMemberDetails = (selectedMembers, setSelectedMembers, index) => {
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

  const hasErrorMain = (errorData, index) => {
    if (
      errorData &&
      errorData.some(
        (element) => element.pokemon === index
      )
    ) {
      return true;
    }
  };

  const onFormChange = (teamIndex, pokeIndex, name, value, setTeamData) => {
    const [field, subfield] = name.split('.');
    setErrorData({});
    setTeamData((prevData) => {
      // Update state based on the name of the field
      const updatedTeam = [...prevData ];
      const updatedMember = { ...updatedTeam[pokeIndex] };

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

      updatedTeam[pokeIndex] = updatedMember;

      return updatedTeam;
    });
    setIndexUpdatedTeam(teamIndex);
  };

  const submitForm = (event) => {
    setErrorData({});
    event.preventDefault();
    try {
      //first, makes validations
      validateTeams(teamData, subteamData);;
      handleTeamsUpdate(teamData, subteamData, indexUpdatedTeam, null);
      setIsSaved(true);
      // }
    } catch (error) {
      // Handle validation errors
      alert(error.message);
      setErrorData(prevState => ({
        ...prevState,
        team: error.newErrorsTeam,
        subteam: error.newErrorsSubteam
      }));
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
            {teamData.map((member, index) => (
              <div key={index}>
                <div className="mb-4 flex justify-center">
                  <button
                    className={`w-56 rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-700 ${hasErrorMain(errorData.team, index) ? 'border-2 border-red-600' : ''}`}
                    onClick={() =>
                      handleMemberDetails(selectedTeam, setSelectedTeam, index)
                    }
                  >
                    {member.pokemon}
                  </button>
                  <button
                    onClick={() =>
                      deleteMember(
                        setTeamData,
                        index,
                        handleEnableButton,
                        false,
                      )
                    }
                  >
                    <Svg
                      key={index}
                      name="trash-grey"
                      size={40}
                      color="brown"
                    />
                  </button>
                </div>
                {selectedTeam.includes(index) && (
                  <ViewTeamEditMember
                    index={index}
                    teamIndex={teamIndex}
                    member={member}
                    onFormChange={onFormChange}
                    enable={handleEnableButton}
                    errorData={errorData.team}
                    setTeamData={setTeamData}
                  />
                )}
              </div>
            ))}
          </ul>
          <div className="mb-4 flex justify-center space-x-4">
            <AddMember teamData={teamData} setTeamData={setTeamData} />
          </div>
          {/* SUBTEAM ARRAY */}
          <div className="mb-4 flex justify-center space-x-4">
            <p>Sub-Team:</p>
          </div>
          {Array.isArray(subteamData) && subteamData.length ? (
            <ul>
              {subteamData.map((member, index) => (
                <div key={index}>
                  <div className="mb-4 flex justify-center">
                    <button
                      className={`w-56 rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-700 ${hasErrorMain(errorData.subteam, index) ? 'border-2 border-red-600' : ''}`}
                      onClick={() =>
                        handleMemberDetails(
                          selectedSubteam,
                          setSelectedSubteam,
                          index,
                        )
                      }
                    >
                      {member.pokemon}
                    </button>
                    <button
                      onClick={() =>
                        deleteMember(
                          subteamData,
                          setSubteamData,
                          index,
                          handleEnableButton,
                          true,
                        )
                      }
                    >
                      <Svg
                        key={index}
                        name="trash-grey"
                        size={40}
                        color="brown"
                      />
                    </button>
                  </div>
                  {selectedSubteam.includes(index) && (
                    <ViewTeamEditMember
                      index={index}
                      teamIndex={teamIndex}
                      member={member}
                      onFormChange={onFormChange}
                      enable={handleEnableButton}
                      errorData={errorData.subteam}
                      setTeamData={setSubteamData}
                    />
                  )}
                </div>
              ))}
            </ul>
          ) : null}
           <div className="mb-4 flex justify-center space-x-4">
            <AddMember teamData={subteamData} setTeamData={setSubteamData} />
          </div>
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

export default ViewTeamEditMain;
