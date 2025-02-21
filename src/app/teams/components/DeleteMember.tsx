import { Team } from '../../types/types';

interface DeleteMemberProps {
  setTeamData: React.Dispatch<React.SetStateAction<Team[]>>;
  index: number;
  handleEnableButton: () => void;
  isSubteam: boolean;
  setIndexUpdatedTeam: React.Dispatch<React.SetStateAction<number>>;
  teamIndex: number;
}

const deleteMember = ({
  setTeamData,
  index,
  handleEnableButton,
  isSubteam,
  setIndexUpdatedTeam,
  teamIndex,
}: DeleteMemberProps): void => {
  setTeamData((prevData) => {
    const currentTeam = [...prevData];
    if (currentTeam.length > 1 || isSubteam) {
      currentTeam.splice(index, 1);
      handleEnableButton();
      console.log('deleted member in ', currentTeam);
      return currentTeam;
    }
    return prevData;
  });
  setIndexUpdatedTeam(teamIndex);
};

export default deleteMember;
