import { useState } from 'react';
import ViewTeamDetailsInfo from './ViewTeamDetailsInfo';
import ViewTeamDetailOptions from './ViewTeamDetailOptions';
import ViewTeamEditMain from './ViewTeamEditMain';
import { Teams, Team } from '../../types/types';
import { HandleTeamsUpdate } from './ViewTeamsPreRenderData';

interface ViewTeamDetailsProps {
  team: Teams;
  index: number;
  teams: Teams[];
  handleTeamsUpdate: HandleTeamsUpdate;
}

const ViewTeamDetails: React.FC<ViewTeamDetailsProps> = ({
  team: team,
  index: index,
  teams: teams,
  handleTeamsUpdate: handleTeamsUpdate,
}) => {
  const [editMode, setEditMode] = useState<boolean>(false);

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
          />
        </>
      ) : (
        <>
          <ViewTeamDetailOptions handleClick={handleClickEdit} />
          <ViewTeamDetailsInfo team={team} />
        </>
      )}
    </div>
  );
};

export default ViewTeamDetails;
