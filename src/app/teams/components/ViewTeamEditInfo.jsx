import React, { useState } from 'react';
import ViewTeamEditInfoDetails from './ViewTeamEditInfoDetails';
import Svg from '../../components/Svg';

const ViewTeamEditInfo = ({
  details: props,
  index: teamIndex,
  onClose: closeEdit,
}) => {
  const [teamData, setTeamData] = useState(props);
  const [selectedMembers, setSelectedMembers] = useState([]);

  const handleMemberDetails = (index) => {
    console.log(index, ' index');
    if (selectedMembers.includes(index)) {
      setSelectedMembers(
        selectedMembers.filter((selectedIndex) => selectedIndex !== index),
      );
    } else {
      setSelectedMembers([...selectedMembers, index]);
    }
  };

  const handleChangeForm = (updatedForm, teamIndex, index) => {
    console.log(
      'see updatedForm: ',
      updatedForm,
      ' and teamid: ',
      teamIndex,
      ' and id: ',
      index,
    );
    setTeamData((prevData) => {
      const updatedTeams = {...prevData};
      const updatedTeam = { ...updatedTeams[teamIndex] };
      const updatedMember = {...updatedTeam.team};

      updatedMember[index] = { ...updatedMember[index], ...updatedForm };

      updatedTeam.team = updatedMember;
      updatedTeams[teamIndex] = updatedTeam;

      return updatedTeams;
    });
  };

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
              <div>
                <div className="mb-4 flex justify-center" key={index}>
                  <button
                    className="w-56 rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-700"
                    onClick={() => handleMemberDetails(index)}
                  >
                    {member.pokemon}
                  </button>
                  <Svg key={index} name="trash-grey" size={40} color="brown" />
                </div>
                {selectedMembers.includes(index) && (
                  <ViewTeamEditInfoDetails
                    index={index}
                    teamIndex={teamIndex}
                    member={member}
                    onFormChange={handleChangeForm}
                  />
                )}
              </div>
            ))}
          </ul>
          <div className="mb-4 flex justify-center space-x-4">
            <button className="btn-edit rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-700">
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewTeamEditInfo;
