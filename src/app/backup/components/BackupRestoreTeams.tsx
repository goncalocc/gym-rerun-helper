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

const BackupRestoreTeams: React.FC = () => {
  const [teamsData, setTeamsData] = useState<Teams[]>();
  const [setText] = useState<string>(''); //all teams object in string
  const [formattedText, setFormattedText] = useState<string>(''); //all teams object in string

  useEffect(() => {
    const localStorageData = fetchLocalStorageTeams();
    if (localStorageData) {
      setTeamsData(localStorageData);
      //format evs and ivs
      const formatStats = (stats: { [key: string]: number }) => {
        return Object.entries(stats)
          .map(([key, value]) => `${key}: ${value}`)
          .join(', ');
      };

      // Format the data for display
    // Format the data for display
    const text = localStorageData.map((team, index) => {
      // Convert each team object to a formatted string
      const teamInfo = [
        `Team Name: ${team.teamname}`,
        `Team: ${team.team.map(t => `
  Pokemon: ${t.pokemon}
  Ability: ${t.ability}
  Nature: ${t.nature}
  Item: ${t.item}
  EVs: ${formatStats(t.evs)}
  IVs: ${formatStats(t.ivs)}
  Moveset: ${t.moveset.join(', ')}`).join('\n')}`,
        `Subteam: ${team.subteam.map(t => `
  Pokemon: ${t.pokemon}
  Ability: ${t.ability}
  Nature: ${t.nature}
  Item: ${t.item}
  EVs: ${formatStats(t.evs)}
  IVs: ${formatStats(t.ivs)}
  Moveset: ${t.moveset.join(', ')}`).join('\n')}`
      ].join('\n\n');
      
      return `Team ${index + 1}:\n${teamInfo}`;
    }).join('\n\n---------------------------------------------------------------------------------\n\n'); // Add separators between teams
      setFormattedText(text);
    }
  }, []);

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormattedText(event.target.value);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const entryToObject = (entry: string): Teams => {
      const obj: any = {};
      const properties = entry.split(', ').map((prop) => prop.trim());

      properties.forEach((prop) => {
        const [key, value] = prop.split(':').map((part) => part.trim());

        if (key === 'team' || key === 'subteam') {
          obj[key] = JSON.parse(value.replace(/'/g, '"'));
        } else {
          obj[key] = value;
        }
      });

      return obj as Teams;
    };
    return entryToObject;
    //localstorage update
    // localStorage.setItem('gymRerunTeam', JSON.stringify(teamsData));
  };

  // const handleCancel = () => {
  //   setText('');
  // };

  return (
    <div className="flex h-screen flex-col p-4">
      <form onSubmit={handleSave} className="flex flex-grow flex-col">
        <textarea
          className="w-full flex-grow resize-none rounded border p-2 text-lg text-black"
          value={formattedText}
          onChange={(e) => handleChange(e)}
        />
        <div className="mt-4 flex justify-end space-x-4">
          <button
            className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
            type="submit"
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
      </form>
    </div>
  );
};

export default BackupRestoreTeams;
