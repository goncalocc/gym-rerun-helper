import { Leads, SwapItem, Teams } from '@/app/types/types';

interface ValidateRouteProps {
  gymName: string;
  leads: Leads[];
  assignedTeam: Teams;
  itemChanges: SwapItem[];
}

export interface NewErrorsLayout {
  gym: string;
  index?: number;
  message: string;
}

export const validateRoutes = ({
  gymName,
  leads,
  assignedTeam,
  itemChanges,
}: ValidateRouteProps) => {
  const teamNames = [
    ...assignedTeam.team.map(({ pokemon, nickname }) =>
      nickname ? `${pokemon}(${nickname})` : pokemon,
    ),
    ...assignedTeam.subteam.map(({ pokemon, nickname }) =>
      nickname ? `${pokemon}(${nickname})` : pokemon,
    ),
  ];

  const newErrors: NewErrorsLayout[] = [];

  leads.forEach((lead, index) => {
    const allNamesValid =
      lead.pokemon.length > 0 &&
      lead.pokemon.every((pokemon) => teamNames.includes(pokemon));
    if (!allNamesValid) {
      console.log(
        `Error in ${gymName} Gym. Lead ${index + 1}: Some Pokémon names are not on your team.`,
      );
      newErrors.push({
        gym: gymName,
        index: index + 1,
        message: `Error in ${gymName} Gym. Lead ${index + 1}: Some Pokémon names are not on your team.`,
      });
    }
  });

  const hasInvalidSwap = itemChanges.some((value) =>
    Object.values(value).some(
      (value) => value === '' || value === null || value === undefined,
    ),
  );
  if (hasInvalidSwap) {
    console.log(
      `Error in ${gymName} Gym. Please fill the incomplete Item Swaps.`,
    );
    newErrors.push({
      gym: gymName,
      message: `Error in ${gymName} Gym. Please fill the incomplete Item Swaps.`,
    });
  }

  return newErrors;
};
