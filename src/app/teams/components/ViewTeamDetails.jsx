import { useState } from 'react';
import ViewTeamDetailsInfo from './ViewTeamDetailsInfo';
import ViewTeamDetailOptions from './ViewTeamDetailOptions';
import ViewTeamEditMain from './ViewTeamEditMain';

const ViewTeamDetails = ({
  team: team,
  index: index,
  teams: teams,
  handleTeamsUpdate: handleTeamsUpdate,
}) => {
  const [editMode, setEditMode] = useState(false);

  const closeEdit = () => {
    setEditMode(false);
  };

  const handleClickEdit = () => {
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
            teams={teams}
            handleTeamsUpdate={handleTeamsUpdate}
          />
        </>
      ) : (
        <>
          <ViewTeamDetailOptions handleClick={handleClickEdit} />
          <ViewTeamDetailsInfo team={team}/>
        </>
      )}
    </div>
  );
};

export default ViewTeamDetails;
