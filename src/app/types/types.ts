import { Dispatch, SetStateAction } from 'react';

export type Teams = {
  teamid: string;
  teamname: string;
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
pokemon: gymPokemon[];
variationid: number;
}

export type gymPokemon = {
  name: string;
  level: number;
  item: string;
  ability: string;
  moveset: string[];
  pokemonid: number
}

//for the Gym Routes
export type Routes = {
  teamid: number;
  routename: string;
  route: Route[];
}

export type Route = {
  gym: string;
  region: string;
  type: string;
  observations: string;
  lead: Lead[];
  swapitems: string;
  heal: boolean;
  provisionalheal: boolean;
  swapteams: boolean
  channelTP: boolean;
}

export type Lead = {
  pokemon: string[];
  attacks: string;
  isOrderMandatory: boolean;
  variationid: number;
}

export type SetTeamsData = Dispatch<SetStateAction<Teams[]>>;
export type SetRoutesData = Dispatch<SetStateAction<Routes[]>>;
