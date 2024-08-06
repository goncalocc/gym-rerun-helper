import React, { useState, useEffect, Dispatch, SetStateAction } from 'react';
import { Teams, Team, SetTeamsData } from '../../types/types';
import { validateTeams } from '@/app/teams/components/ValidateTeams';
import { NotificationParams } from '../../teams/components/ViewTeams';

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
          teamId: '',
          teamName: '',
          team: [],
          subteam: [],
        };
        let currentSection: 'team' | 'subteam' | null = null;
        let currentPokemon: Team | null = null;

        details.forEach((field) => {
          if (field.startsWith('Team Name:')) {
            obj.teamName = field.split(':')[1].trim();
          }
          if (field.startsWith('Team Id:')) {
            obj.teamId = field.split(':')[1].trim();
          }
          else if (field === 'Team:' || field === 'Subteam:') {
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
              nickname: '',
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

interface BackupRestoreTeamsProps {
  setNotification: Dispatch<SetStateAction<NotificationParams>>;
  handleClose: () => void;
  teamsData: Teams[];
  setTeamsData: SetTeamsData;
}

const BackupRestoreTeams: React.FC<BackupRestoreTeamsProps> = ({
  setNotification,
  handleClose,
  teamsData,
  setTeamsData,
}) => {
  const [formattedText, setFormattedText] = useState<string>(''); //all teams object in string

  useEffect(() => {
    if (teamsData) {
      //format evs and ivs
      const formatStats = (stats: { [key: string]: number }) => {
        return Object.entries(stats)
          .map(([key, value]) => `${key}: ${value}`)
          .join(', ');
      };

      // Format the data for display
      const text = teamsData
        .map((team, index) => {
          // Convert each team object to a formatted string
          const teamInfo = [
            `Team Name: ${team.teamName}`,
            `Team Id: ${team.teamId}`,
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
            team.subteam &&
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
      setNotification({
        message: 'Teams successfully imported',
        type: 'success',
        visible: true,
      });

      setTimeout(() => {
        setNotification({ message: '', type: '', visible: false });
      }, 3000);
      handleClose();
    } catch (error: any) {
      setNotification({
        message: 'Error while importing ',
        type: 'error',
        visible: true,
      });
      setTimeout(() => {
        setNotification({ message: '', type: '', visible: false });
      }, 3000);
      alert('Invalid Team Data');
      handleClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="h-3/4 w-full max-w-5xl overflow-auto rounded bg-white p-8 shadow-lg">
        <form onSubmit={handleSave} className="flex h-full flex-col">
          <textarea
            className="mb-4 w-full flex-grow resize-none rounded border p-2 text-lg text-black"
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
              type="button"
              onClick={handleClose}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BackupRestoreTeams;
