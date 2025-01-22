import React, { useState, useEffect, Dispatch, SetStateAction } from 'react';
import {
  Teams,
  Team,
  SetTeamsData,
  Routes,
  SetRoutesData,
  Route,
  Leads,
} from '../../types/types';
import { validateTeams } from '@/app/teams/components/ValidateTeams';
import { NotificationParams } from '../../teams/components/ViewTeams';

type ParsedTeams = {
  teams: Teams[];
  routes: Routes[];
};

const parseTeams = (textareaValue: string): ParsedTeams => {
  try {
    const teams: Teams[] = [];
    const routes: Routes[] = [];

    const [teamsText, routesText] = textareaValue
      .split('Gym Routes:')
      .map((part) => part.trim());

    const teamSections = teamsText
      .split(
        '---------------------------------------------------------------------------------',
      )
      .map((teamString) => teamString.trim());

    teamSections.forEach((teamString) => {
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

    if (routesText) {
      const routeSections = routesText
        .split(
          '---------------------------------------------------------------------------------',
        )
        .map((routeString) => routeString.trim());

      routeSections.forEach((routeString) => {
        const lines = routeString
          .split('\n')
          .map((line) => line.trim())
          .filter((line) => line);

        if (lines.length > 0) {
          const routeObj: Routes = {
            teamId: '',
            routeName: '',
            routeId: '',
            route: [],
          };
          lines.forEach((line, index) => {
            if (line.startsWith('Route Id:')) {
              routeObj.routeId = line.split(':')[1].trim();
            } else if (line.startsWith('Route Name:')) {
              const indexOfColon = line.indexOf(':');
              routeObj.routeName =
                indexOfColon !== -1 ? line.slice(indexOfColon + 1).trim() : '';
            } else if (line.startsWith('Team Id:')) {
              routeObj.teamId = line.split(':')[1].trim();
            } else if (line === 'Route:') {
              let currentRoute: Route | null = null;
              let currentLeads: Leads[] = [];

              // Start processing nested Route structure
              for (let i = index + 1; i < lines.length; i++) {
                const nestedLine = lines[i];

                // Check for new route or end of current one
                if (nestedLine.startsWith('gym:')) {
                  if (currentRoute) {
                    currentRoute.leads = currentLeads; // Add Leads before pushing
                    routeObj.route.push(currentRoute);
                  }
                  currentRoute = {
                    gym: nestedLine.split(':')[1].trim(),
                    id: 0,
                    region: '',
                    type: '',
                    observations: '',
                    leads: [],
                    swapItems: '',
                    heal: false,
                    provisionalHeal: false,
                    swapTeams: false,
                    channelTP: false,
                  };
                  currentLeads = []; // Reset leads for the new Route
                } else if (nestedLine.startsWith('id:')) {
                  currentRoute!.id = parseInt(
                    nestedLine.split(':')[1].trim(),
                    10,
                  );
                } else if (nestedLine.startsWith('region:')) {
                  currentRoute!.region = nestedLine.split(':')[1].trim();
                } else if (nestedLine.startsWith('type:')) {
                  currentRoute!.type = nestedLine.split(':')[1].trim();
                } else if (nestedLine.startsWith('observations:')) {
                  const indexOfColon = nestedLine.indexOf(':');
                  currentRoute!.observations =
                    indexOfColon !== -1
                      ? nestedLine.slice(indexOfColon + 1).trim()
                      : '';
                } else if (nestedLine.startsWith('swapItems:')) {
                  const indexOfColon = nestedLine.indexOf(':');
                  currentRoute!.swapItems =
                    indexOfColon !== -1
                      ? nestedLine.slice(indexOfColon + 1).trim()
                      : '';
                } else if (nestedLine.startsWith('heal:')) {
                  currentRoute!.heal =
                    nestedLine.split(':')[1].trim() === 'true';
                } else if (nestedLine.startsWith('provisionalHeal:')) {
                  currentRoute!.provisionalHeal =
                    nestedLine.split(':')[1].trim() === 'true';
                } else if (nestedLine.startsWith('swapTeams:')) {
                  currentRoute!.swapTeams =
                    nestedLine.split(':')[1].trim() === 'true';
                } else if (nestedLine.startsWith('channelTP:')) {
                  currentRoute!.channelTP =
                    nestedLine.split(':')[1].trim() === 'true';
                } else if (nestedLine.startsWith('pokemon:')) {
                  // Parsing Leads
                  const lead: Leads = {
                    pokemon: nestedLine.split(':')[1].trim().split(', '),
                    attacks: '',
                    isOrderMandatory: false,
                    variationId: 0,
                  };
                  currentLeads.push(lead);
                } else if (nestedLine.startsWith('attacks:')) {
                  const indexOfColon = nestedLine.indexOf(':');
                  currentLeads[currentLeads.length - 1].attacks =
                    indexOfColon !== -1
                      ? nestedLine.slice(indexOfColon + 1).trim()
                      : '';
                  // currentLeads[currentLeads.length - 1].attacks = nestedLine
                  //   .split(':')[1]
                  //   .trim();
                } else if (nestedLine.startsWith('isOrderMandatory:')) {
                  currentLeads[currentLeads.length - 1].isOrderMandatory =
                    nestedLine.split(':')[1].trim() === 'true';
                } else if (nestedLine.startsWith('variationId:')) {
                  currentLeads[currentLeads.length - 1].variationId = parseInt(
                    nestedLine.split(':')[1].trim(),
                    10,
                  );
                } else if (nestedLine === '') {
                  // Empty line indicates end of current Route or Leads section
                  continue;
                }

                // If it's the last line, ensure the currentRoute is added
                if (i === lines.length - 1 && currentRoute) {
                  currentRoute.leads = currentLeads; // Finalize Leads for the last Route
                  routeObj.route.push(currentRoute);
                }
              }
            }
          });
          routes.push(routeObj);
        }
      });
    }
    return { teams, routes };
  } catch (error: any) {
    throw new Error('Invalid team data');
  }
};

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
  const [formattedText, setFormattedText] = useState<string>(''); //all teams object in string

  useEffect(() => {
    let combinedText = '';

    if (teamsData) {
      //format evs and ivs
      const formatStats = (stats: { [key: string]: number }) => {
        return Object.entries(stats)
          .map(([key, value]) => `${key}: ${value}`)
          .join(', ');
      };

      // Format the data for display
      const teamsText = teamsData
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
      combinedText += teamsText;
    }

    if (routesData) {
      const routeText = routesData
        .map((route, index) => {
          // Convert each team object to a formatted string
          const routeInfo = [
            `Route Name: ${route.routeName}`,
            `Route Id: ${route.routeId}`,
            `Team Id: ${route.teamId}`,
            `Route: ${route.route
              .map(
                (r) => `
  gym: ${r.gym}
  id: ${r.id}
  region: ${r.region}
  type: ${r.type}
  observations: ${r.observations}
  swapItems: ${r.swapItems}
  heal: ${r.heal}
  provisionalHeal: ${r.provisionalHeal}
  swapTeams: ${r.swapTeams}
  channelTP: ${r.channelTP}
  Leads: ${r.leads
    .map(
      (lead) => `
  pokemon: ${lead.pokemon.join(', ')}
  attacks: ${lead.attacks}
  isOrderMandatory: ${lead.isOrderMandatory}
  variationId: ${lead.variationId}`,
    )
    .join('')}`,
              )
              .join('\n\n')}`,
          ].join('\n');

          return `Route ${index + 1}:\n${routeInfo}`;
        })
        .join(
          '\n\n---------------------------------------------------------------------------------\n\n',
        ); // Add separators between routes

      combinedText += `\n\n===========================\n\n\Gym Routes:\n${routeText}`;
    }
    setFormattedText(combinedText);
  }, [teamsData, routesData]);

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormattedText(event.target.value);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const strToObj = parseTeams(formattedText);
      const { teams, routes } = strToObj;
      setTeamsData(teams);
      setRoutesData(routes);
      localStorage.setItem('gymRerunTeam', JSON.stringify(teams));
      localStorage.setItem('gymRerunRoutes', JSON.stringify(routes));
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
