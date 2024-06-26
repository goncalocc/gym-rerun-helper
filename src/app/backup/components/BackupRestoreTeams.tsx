'use client';

import { useState, useEffect } from 'react';
import { Teams, Team } from '../../types/types';

const fetchLocalStorageTeams = (): Teams[] | null => {
  try {
    const data = localStorage.getItem('gymRerunTeam');
    if (!data) {
      throw new Error('Data not found in localStorage');
    }
    return JSON.parse(data);
  } catch (error: any) {
    console.error('Error fetching data from localStorage:', error.message);
    return null;
  }
};

const convertStringToObject = (stringData: string[], teamsData: Teams[]) =>{
  //desconstruir o Teams Data e usar regex para fazer set em cada campo específico
  return teamsData;
}

const convertObjectToString = (localStorageData: Teams[]) =>{
 let stringData
  const objectData = [...localStorageData];
 for(let i=0; i < objectData.length; i++) {

 }
}

const BackupRestoreTeams: React.FC = () => {
  const [text, setText] = useState<string>('Hello World'); //all teams object in string
  const [teamsData, setTeamsData] = useState<Teams[]>(); 

  useEffect(() => {
    const localStorageData = fetchLocalStorageTeams();
    if (localStorageData) {
      setTeamsData(localStorageData);
    }
    // const stringTeamsData = convertObjectToString(localStorageData);
  }, []);

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(event.target.value);
  }

  const handleSave = () => {
    console.log("teams object gets updated in the string here")
    //localstorage update
    // teamsData = convertStringToObject(); 
    localStorage.setItem('gymRerunTeam', JSON.stringify(teamsData));
  }

  const handleCancel = () => {
    setText('');
  }

  return (
    <div className="flex h-screen flex-col p-4">
      <textarea
        className="w-full flex-grow resize-none rounded border p-2 text-lg text-black"
        value={text}
        onChange={(e) => handleChange(e)}
      />
      <div className="mt-4 flex justify-end space-x-4">
        <button
          className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
          //   onClick={handleSave}
        >
          Save
        </button>
        <button
          className="rounded bg-gray-500 px-4 py-2 text-white hover:bg-gray-600"
          //   onClick={handleCancel}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default BackupRestoreTeams;
