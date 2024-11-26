import { Leads, Teams } from '@/app/types/types';

interface ValidateRouteProps {
  gymName: string;
  leads: Leads[];
  assignedTeam: Teams;
}

export interface NewErrorsLayout {
  gym: string;
  index: number;
  message: string;
}

export const validateRoutes = ({
  gymName,
  leads,
  assignedTeam,
}: ValidateRouteProps) => {
  const teamNames = assignedTeam.team.map(
    (element: { pokemon: string; nickname: string }) =>
      element.nickname
        ? `${element.pokemon}(${element.nickname})`
        : element.pokemon,
  );

  console.log('teamnames: ' + teamNames);

  const newErrors: NewErrorsLayout[] = [];

  leads.forEach((lead, index) => {
    const allNamesValid = lead.pokemon.every((pokemon) =>
      teamNames.includes(pokemon),
    );
    if (!allNamesValid) {
      console.log(
        `Error in ${gymName} Gym. Lead ${index + 1}: Some Pokémon names are not on your team.`,
      );
      newErrors.push({
        gym: gymName,
        index: index + 1,
        message: `Error in ${gymName} Gym. Lead ${index + 1}: Some Pokémon names are invalid.`,
      });
    }
  });

  return newErrors;
};
