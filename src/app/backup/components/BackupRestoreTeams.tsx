import React, { Dispatch, SetStateAction, useCallback, useState } from 'react';
import { Teams, SetTeamsData, Routes, SetRoutesData } from '../../types/types';
import { NotificationParams } from '../../teams/components/ViewTeams';
import Svg from '@/app/utils/Svg';
import Dropzone from '@/app/utils/Dropzone';
import { validateJSON } from './ValidateJSON';

interface BackupRestoreTeamsProps {
  setNotification: Dispatch<SetStateAction<NotificationParams>>;
  handleClose: () => void;
  teamsData: Teams[];
  routesData: Routes[];
  setTeamsData: SetTeamsData;
  setRoutesData: SetRoutesData;
}

const BackupRestoreTeams: React.FC<BackupRestoreTeamsProps> = ({
  setNotification,
  handleClose,
  teamsData,
  routesData,
  setTeamsData,
  setRoutesData,
}) => {
  const data = {
    teams: [...teamsData],
    routes: [...routesData],
  };

  const [file, setFile] = useState<File | null>(null);

  const handleExportFile = () => {
    if (!data) return;
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'teamsroutes_data.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleFileImport = (_event: React.MouseEvent<HTMLButtonElement>) => {
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data: { teams: Teams[]; routes: Routes[] } = JSON.parse(
          e.target?.result as string,
        );
        setTeamsData(data.teams);
        setRoutesData(data.routes);
        //Validations and then save in local storage
        validateJSON(data.teams, data.routes);
        localStorage.setItem('gymRerunTeam', JSON.stringify(data.teams));
        localStorage.setItem('gymRerunRoutes', JSON.stringify(data.routes));
        setNotification({
          message: 'Teams successfully imported',
          type: 'success',
          visible: true,
        });

        setTimeout(() => {
          setNotification({ message: '', type: '', visible: false });
        }, 3000);
        handleClose();
        console.log('Teams and routes imported:', data);
      } catch (error: any) {
        setNotification({
          message: error.message,
          type: 'error',
          visible: true,
        });
        setTimeout(() => {
          setNotification({ message: '', type: '', visible: false });
        }, 9000);
        handleClose();
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative flex h-2/4 w-full max-w-2xl flex-col items-center justify-center overflow-auto rounded bg-gray-600 p-8 shadow-lg">
        <button
          onClick={handleExportFile}
          className="absolute left-2 top-2 text-white hover:text-gray-300"
        >
          <Svg
            name="/objects/floppy-disk"
            width={50}
            height={50}
            color="brown"
          />
        </button>
        <button
          onClick={handleClose}
          className="absolute right-2 top-2 text-white hover:text-gray-300"
        >
          X
        </button>
        <div className="">
          <Dropzone
            handleFileImport={handleFileImport}
            file={file}
            setFile={setFile}
          />
        </div>
      </div>
    </div>
  );
};

export default BackupRestoreTeams;
