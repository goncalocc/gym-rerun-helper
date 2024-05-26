import { useState } from 'react';
import ViewTeamDetailsInfo from './ViewTeamDetailsInfo';
import ViewTeamDetailOptions from './ViewTeamDetailOptions';
import ViewTeamEditInfo from './ViewTeamEditInfo';

const ViewTeamDetails = ({ details: team, index: index }) => {
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
          <ViewTeamEditInfo
            details={team}
            index={index}
            onClose={closeEdit}
          />
        </>
      ) : (
        <>
          <ViewTeamDetailOptions handleClick={handleClickEdit} />
          <ViewTeamDetailsInfo details={team} />
        </>
      )}
    </div>
  );
};

export default ViewTeamDetails;
