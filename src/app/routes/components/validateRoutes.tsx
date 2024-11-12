import pokemonData from '@/app/data/PokemonDictionary';
import { Leads } from '@/app/types/types';

interface ValidateRouteProps {
  gymName: string;
  leads: Leads[];
}

export interface NewErrorsLayout {
  gym: string;
  index: number;
  message: string;
}

export const validateRoutes = ({ gymName, leads }: ValidateRouteProps) => {
  const pokemonNames = pokemonData.map((p) => p.pokemon);
  const newErrors: NewErrorsLayout[] = [];

  leads.forEach((lead, index) => {
    const allNamesValid = lead.pokemon.every((pokemon) =>
      pokemonNames.includes(pokemon),
    );
    if (!allNamesValid) {
      console.log(
        `Error in ${gymName} Gym. Lead ${index + 1}: Some Pokémon names are invalid.`,
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
