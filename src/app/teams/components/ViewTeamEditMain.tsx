import React, { useEffect, useState } from 'react';
import ViewTeamEditMember from './ViewTeamEditMember';
import { validateTeams } from './ValidateTeams';
import deleteMember from './DeleteMember';
import AddMember from './AddMember';
import Svg from '../../utils/Svg';
import { Teams, Team, EVs, IVs } from '../../types/types';
import { HandleTeamsUpdate } from './ViewTeamsPreRenderData';
import { NotificationParams } from './ViewTeams';

interface ViewTeamEditMainProps {
  details: Teams;
  index: number;
  onClose: () => void;
  handleTeamsUpdate: HandleTeamsUpdate;
  setNotification: React.Dispatch<React.SetStateAction<NotificationParams>>;
}

export interface ErrorData {
  pokemon: number;
  field: string;
  message: string;
}

interface Error {
  message: string;
  team: ErrorData[];
  subteam: ErrorData[];
}

const initialErrorState: Error = {
  message: '',
  team: [],
  subteam: [],
};

export interface OnFormChangeProps {
  teamIndex: number;
  pokeIndex: number;
  name: string;
  value: string;
  setTeamData: React.Dispatch<React.SetStateAction<Team[]>>;
}

interface OnTitleChange {
  (
    params: {
      teamIndex: number;
    },
    event: React.ChangeEvent<HTMLInputElement>,
  ): void;
}

export type OnFormChange = (params: OnFormChangeProps) => void;

type TeamField = keyof Team;
type NestedField = keyof EVs | keyof IVs;

const ViewTeamEditMain: React.FC<ViewTeamEditMainProps> = ({
  details: props,
  index: teamIndex,
  onClose: closeEdit,
  handleTeamsUpdate: handleTeamsUpdate,
  setNotification: setNotification,
}) => {
  const [teamName, setTeamName] = useState<string>(props.teamName);
  const [teamData, setTeamData] = useState<Team[]>(props.team);
  const [subteamData, setSubteamData] = useState<Team[]>(props.subteam);
  const [selectedTeam, setSelectedTeam] = useState<number[]>([]);
  const [selectedSubteam, setSelectedSubteam] = useState<number[]>([]);
  const [isDisabled, setIsDisabled] = useState<boolean>(true);
  const [indexUpdatedTeam, setIndexUpdatedTeam] = useState<number>(0);
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [errorData, setErrorData] = useState<Error>(initialErrorState);

  useEffect(() => {
    if (isSaved) {
      closeEdit();
    }
  }, [isSaved, errorData]);

  const handleMemberDetails = ({
    selectedMembers,
    setSelectedMembers,
    index,
  }: {
    selectedMembers: number[];
    setSelectedMembers: (members: number[]) => void;
    index: number;
  }) => {
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

  const hasErrorMain = ({
    errorData,
    index,
  }: {
    errorData: ErrorData[];
    index: number;
  }): boolean => {
    if (
      errorData &&
      errorData.some((element: ErrorData) => element.pokemon === index)
    ) {
      return true;
    }
    return false;
  };

  const onTitleChange: OnTitleChange = ({ teamIndex }, event) => {
    const { name, value } = event.target;
    setTeamName(value);
    setIndexUpdatedTeam(teamIndex);
    handleEnableButton();
  };

  const onFormChange: OnFormChange = ({
    teamIndex,
    pokeIndex,
    name,
    value,
    setTeamData,
  }) => {
    const [field, subfield] = name.split('.');
    setErrorData(initialErrorState);
    setTeamData((prevData) => {
      // Update state based on the name of the field
      const updatedTeam = [...prevData];
      const updatedMember = { ...updatedTeam[pokeIndex] };

      if (field === 'moveset') {
        const movesetIndex = parseInt(subfield);
        updatedMember.moveset = [...updatedMember.moveset];
        updatedMember.moveset[movesetIndex] = value;
      } else if (subfield) {
        const mainField = field as TeamField;
        if (mainField === 'evs' || mainField === 'ivs') {
          // Type assertion to make TypeScript happy
          const nestedObject = updatedMember[mainField] as EVs | IVs;
          const parsedValue = isNaN(parseInt(value)) ? 0 : parseInt(value);
          nestedObject[subfield as NestedField] = parsedValue as any;
          updatedMember[mainField] = nestedObject;
        } else {
          updatedMember[mainField] = {
            ...(updatedMember[mainField] as any),
            [subfield]: value,
          };
        }
      } else {
        const mainField = name as TeamField;
        updatedMember[mainField] = value as any;
      }

      updatedTeam[pokeIndex] = updatedMember;

      return updatedTeam;
    });
    setIndexUpdatedTeam(teamIndex);
  };

  const submitForm = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    setErrorData(initialErrorState);
    event.preventDefault();
    try {
      //first, makes validations
      validateTeams({ teamData, subteamData });
      handleTeamsUpdate(
        teamData,
        subteamData,
        teamName,
        indexUpdatedTeam,
        null,
      );

      setNotification({
        message: 'Team edited successfully',
        type: 'success',
        visible: true,
      });

      setTimeout(() => {
        setNotification({ message: '', type: '', visible: false });
      }, 3000);

      setIsSaved(true);

      // }
    } catch (error: any) {
      // Handle validation errors
      alert(error.message);
      setErrorData((prevState) => ({
        ...prevState,
        team: error.newErrorsTeam,
        subteam: error.newErrorsSubteam,
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
          <div className="mb-4 flex justify-center">
            <input
              className="rounded border border-gray-300 p-2 text-center text-black"
              type="text"
              value={teamName}
              style={{ width: '160px', height: '35px' }}
              name="teamName"
              id="teamName"
              onChange={(e) => onTitleChange({ teamIndex }, e)}
              autoComplete="off"
            />
          </div>
          <ul>
            {teamData.map((member, index) => (
              <div key={index}>
                <div className="mb-4 flex justify-center">
                  <button
                    className={`w-56 rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-700 ${hasErrorMain({ errorData: errorData.team, index }) ? 'border-2 border-red-600' : ''}`}
                    onClick={() =>
                      handleMemberDetails({
                        selectedMembers: selectedTeam,
                        setSelectedMembers: setSelectedTeam,
                        index: index,
                      })
                    }
                  >
                    {member.pokemon}
                  </button>
                  <button
                    onClick={() =>
                      deleteMember({
                        setTeamData,
                        index,
                        handleEnableButton,
                        isSubteam: false,
                      })
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
                      className={`w-56 rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-700 ${hasErrorMain({ errorData: errorData.subteam, index }) ? 'border-2 border-red-600' : ''}`}
                      onClick={() =>
                        handleMemberDetails({
                          selectedMembers: selectedSubteam,
                          setSelectedMembers: setSelectedSubteam,
                          index: index,
                        })
                      }
                    >
                      {member.pokemon}
                    </button>
                    <button
                      onClick={() =>
                        deleteMember({
                          setTeamData: setSubteamData,
                          index,
                          handleEnableButton,
                          isSubteam: false,
                        })
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
