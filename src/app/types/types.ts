import { Dispatch, SetStateAction } from 'react';

export type Teams = {
  teamId: string;
  teamName: string;
  team: Team[];
  subteam: Team[];
};

// Define the EVs type
export type EVs = {
  [key: string]: number;
  attack: number;
  defense: number;
  hp: number;
  specialAttack: number;
  specialDefense: number;
  speed: number;
};

// Define the IVs type
export type IVs = {
  [key: string]: number;
  attack: number;
  defense: number;
  hp: number;
  specialAttack: number;
  specialDefense: number;
  speed: number;
};

// Define the Team type
export type Team = {
  pokemon: string;
  nickname: string;
  ability: string;
  nature: string;
  item: string;
  evs: EVs;
  ivs: IVs;
  moveset: string[];
};

//for the Gym Variations:
export type Gym = {
  gym: string;
  gymtype: string;
  id: number;
  region: string;
  variations: Variation[];
}

export type Variation = {
pokemons: gymPokemon[];
variationId: number;
}

export type gymPokemon = {
  name: string;
  level: number | string;
  item: string;
  ability: string;
  moveset: string[];
  pokemonid: number
}

//for the Gym Routes
export type Routes = {
  teamId: string;
  routeName: string;
  routeId: string;
  route: Route[];
}

export type Route = {
  gym: string;
  id: number;
  region: string;
  type: string;
  observations: string;
  leads: Leads[];
  swapItems: string;
  heal: boolean;
  provisionalHeal: boolean;
  swapTeams: boolean
  channelTP: boolean;
}

export type Leads = {
  pokemon: string[];
  attacks: string;
  isOrderMandatory: boolean;
  variationId: number;
}

export type SetTeamsData = Dispatch<SetStateAction<Teams[]>>;
export type SetRoutesData = Dispatch<SetStateAction<Routes[]>>;
