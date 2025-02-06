import { useState, useEffect } from 'react';

const useEditModeAndSidebar = () => {
  const [editMode, setEditMode] = useState<boolean>(false);
  const [isSidebarVisible, setIsSidebarVisible] = useState<boolean>(false);

  useEffect(() => {
    if (editMode) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }

    return () => {
      document.body.classList.remove('overflow-hidden');
    };
  }, [editMode]);

  const handleToggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible);
  };

  const closeEdit = () => {
    setEditMode(false);
  };

  const handleClickEdit = () => {
    setEditMode(true);
  };

  return {
    editMode,
    isSidebarVisible,
    handleToggleSidebar,
    closeEdit,
    handleClickEdit,
  };
};

export default useEditModeAndSidebar;
