import { Team } from '../../types/types';

interface DeleteMemberProps {
  setTeamData: React.Dispatch<React.SetStateAction<Team[]>>;
  index: number;
  handleEnableButton: () => void;
  isSubteam: boolean;
}

const deleteMember = ({
  setTeamData,
  index,
  handleEnableButton,
  isSubteam,
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
};

export default deleteMember;
