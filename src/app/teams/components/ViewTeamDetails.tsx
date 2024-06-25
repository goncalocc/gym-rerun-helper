import { useState } from 'react';
import ViewTeamDetailsInfo from './ViewTeamDetailsInfo';
import ViewTeamDetailOptions from './ViewTeamDetailOptions';
import ViewTeamEditMain from './ViewTeamEditMain';
import { Teams } from '../../types/types';
import { HandleTeamsUpdate } from './ViewTeamsPreRenderData';
import { NotificationParams } from './ViewTeams';

interface ViewTeamDetailsProps {
  team: Teams;
  index: number;
  teams: Teams[];
  handleTeamsUpdate: HandleTeamsUpdate;
  setSelectedTeam: React.Dispatch<React.SetStateAction<number | null>>;
  setNotification: React.Dispatch<React.SetStateAction<NotificationParams>>;
}

const ViewTeamDetails: React.FC<ViewTeamDetailsProps> = ({
  team: team,
  index: index,
  teams: teams,
  handleTeamsUpdate: handleTeamsUpdate,
  setSelectedTeam: setSelectedTeam,
  setNotification: setNotification,
}) => {
  const [editMode, setEditMode] = useState<boolean>(false);
  const [teamsData, setTeamsData] = useState<Teams[]>(teams);

  const closeEdit: () => void = () => {
    setEditMode(false);
  };

  const handleClickEdit: () => void = () => {
    setEditMode(true);
  };

  return (
    <div className="container mx-auto mt-4 px-4">
      {editMode ? (
        <>
          <ViewTeamEditMain
            details={team}
            index={index}
            onClose={closeEdit}
            handleTeamsUpdate={handleTeamsUpdate}
            setNotification={setNotification}
          />
        </>
      ) : (
        <>
          <ViewTeamDetailOptions
            handleClick={handleClickEdit}
            teamsData={teams}
            clonedTeam={team}
            externalSetTeamsData={setTeamsData}
            handleTeamsUpdate={handleTeamsUpdate}
            setSelectedTeam={setSelectedTeam}
            setNotification={setNotification}
          />
          <ViewTeamDetailsInfo team={team} />
        </>
      )}
    </div>
  );
};

export default ViewTeamDetails;
