'use client';

import { useState, useEffect } from 'react';
import { Teams, Team } from '../../types/types';
import { validateTeams } from '@/app/teams/components/ValidateTeams';

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

const parseTeams = (textareaValue: string): Teams[] => {
  try {
    const teams: Teams[] = [];
    const teamStrings = textareaValue
      .split(
        '---------------------------------------------------------------------------------',
      )
      .map((teamString) => teamString.trim());

    teamStrings.forEach((teamString) => {
      const lines = teamString
        .split('\n')
        .map((line) => line.trim())
        .filter((line) => line);
      if (lines.length > 0) {
        const details = lines.slice(1);
        const obj: Teams = {
          teamname: '',
          team: [],
          subteam: [],
        };
        let currentSection: 'team' | 'subteam' | null = null;
        let currentPokemon: Team | null = null;

        details.forEach((field) => {
          if (field.startsWith('Team Name:')) {
            obj.teamname = field.split(':')[1].trim();
          } else if (field === 'Team:' || field === 'Subteam:') {
            if (currentPokemon && currentSection) {
              obj[currentSection].push(currentPokemon);
            }
            currentSection = field === 'Team:' ? 'team' : 'subteam';
            currentPokemon = null;
          } else if (field.startsWith('Pokemon:')) {
            if (currentPokemon && currentSection) {
              obj[currentSection].push(currentPokemon);
            }
            currentPokemon = {
              pokemon: field.split(':')[1].trim(),
              ability: '',
              nature: '',
              item: '',
              evs: {
                attack: 0,
                defense: 0,
                hp: 0,
                specialAttack: 0,
                specialDefense: 0,
                speed: 0,
              },
              ivs: {
                attack: 0,
                defense: 0,
                hp: 0,
                specialAttack: 0,
                specialDefense: 0,
                speed: 0,
              },
              moveset: [],
            };
          } else if (currentPokemon) {
            if (field.startsWith('Ability:')) {
              currentPokemon.ability = field.split(':')[1].trim();
            } else if (field.startsWith('Nature:')) {
              currentPokemon.nature = field.split(':')[1].trim();
            } else if (field.startsWith('Item:')) {
              currentPokemon.item = field.split(':')[1].trim();
            } else if (field.startsWith('EVs:')) {
              const evsString = field.slice(field.indexOf(':') + 1).trim();
              const evsArray = evsString
                .split(',')
                .map((ev) => ev.split(':').map((part) => part.trim()));
              evsArray.forEach((ev) => {
                if (currentPokemon) {
                  const value = ev[1] ? parseInt(ev[1]) : 0;
                  currentPokemon.evs[ev[0]] = value;
                }
              });
            } else if (field.startsWith('IVs:')) {
              const ivsString = field.slice(field.indexOf(':') + 1).trim();
              const ivsArray = ivsString
                .split(',')
                .map((iv) => iv.split(':').map((part) => part.trim()));
              ivsArray.forEach((iv) => {
                if (currentPokemon) {
                  const value = iv[1] ? parseInt(iv[1]) : 0;
                  currentPokemon.ivs[iv[0]] = value;
                }
              });
            } else if (field.startsWith('Moveset:')) {
              currentPokemon.moveset = field
                .split(':')[1]
                .split(',')
                .map((move) => move.trim());
            }
          }
        });

        if (currentPokemon && currentSection) {
          (obj[currentSection] as Team[]).push(currentPokemon);
        }
        // Pass the object to the function
        validateTeams({ teamData: obj.team, subteamData: obj.subteam });
        teams.push(obj);
      }
    });

    return teams;
  } catch (error: any) {
    throw new Error('Invalid team data');
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
      const text = localStorageData
        .map((team, index) => {
          // Convert each team object to a formatted string
          const teamInfo = [
            `Team Name: ${team.teamname}`,
            `Team: ${team.team
              .map(
                (t) => `
  Pokemon: ${t.pokemon}
  Ability: ${t.ability}
  Nature: ${t.nature}
  Item: ${t.item}
  EVs: ${formatStats(t.evs)}
  IVs: ${formatStats(t.ivs)}
  Moveset: ${t.moveset.join(', ')}`,
              )
              .join('\n')}`,
            `Subteam: ${team.subteam
              .map(
                (t) => `
  Pokemon: ${t.pokemon}
  Ability: ${t.ability}
  Nature: ${t.nature}
  Item: ${t.item}
  EVs: ${formatStats(t.evs)}
  IVs: ${formatStats(t.ivs)}
  Moveset: ${t.moveset.join(', ')}`,
              )
              .join('\n')}`,
          ].join('\n\n');

          return `Team ${index + 1}:\n${teamInfo}`;
        })
        .join(
          '\n\n---------------------------------------------------------------------------------\n\n',
        ); // Add separators between teams
      setFormattedText(text);
    }
  }, []);

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormattedText(event.target.value);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const strToObj = parseTeams(formattedText);
      setTeamsData(strToObj);
      localStorage.setItem('gymRerunTeam', JSON.stringify(strToObj));
    } catch (error: any) {
      alert('Invalid Team Data');
    }
  };

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
