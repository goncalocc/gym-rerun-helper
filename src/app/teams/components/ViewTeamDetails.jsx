import { useState } from 'react';
import ViewTeamDetailsInfo from './ViewTeamDetailsInfo';
import ViewTeamDetailOptions from './ViewTeamDetailOptions';
import ViewTeamEditInfo from './ViewTeamEditInfo';
import ViewTeamEditOptions from './ViewTeamEditOptions';

const ViewTeamDetails = ({ details: team }) => {
  const [editMode, setEditMode] = useState(false);
  
  const openEdit = () => setEditMode(true);
  const closeEdit = () => {
    setEditMode(false)
    console.log("boas");
  }


  const handleClickEdit = () => {
    setEditMode(true);
  };

  const handleClickSave = () => {
    setEditMode(false);
    // onchange(inputValue);
  };

  return (
    <div className="container mx-auto mt-4 px-4">
      {editMode ? (
        <>
          <ViewTeamEditOptions handleClick={handleClickSave} />
          <ViewTeamEditInfo details={team} isOpen={editMode} onClose={closeEdit} />
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
