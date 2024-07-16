import { Dispatch, SetStateAction } from 'react';

export type Teams = {
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

export type SetTeamsData = Dispatch<SetStateAction<Teams[]>>;
