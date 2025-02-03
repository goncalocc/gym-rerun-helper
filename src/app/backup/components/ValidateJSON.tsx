import {
  NewErrorsLayout,
  validateRoutes,
} from '@/app/routes/components/validateRoutes';
import { validateTeams } from '@/app/teams/components/ValidateTeams';
import { Routes, Teams } from '@/app/types/types';

export const validateJSON = (teams: Teams[], routes: Routes[]) => {
  for (const members of teams) {
    validateTeams({ teamData: members.team, subteamData: members.subteam });
  }
  for (const route of routes) {
    const allErrors: NewErrorsLayout[] = [];
    for (let i = 0; i < route.route.length; i++) {
      const foundTeam = teams.find((team) => team.teamId === route.teamId);
      if (!foundTeam) throw new Error('Team not found');
      const errors = validateRoutes({
        gymName: route.route[i].gym,
        leads: route.route[i].leads,
        assignedTeam: foundTeam,
      });
      if (errors.length > 0) {
        allErrors.push(...errors);
      }
    }
    if (allErrors.length > 0) {
      const errorMessage = allErrors.map((err) => err.message).join(', ');
      throw new Error(`Validation errors: ${errorMessage}`);
    }
  }
  return;
};
