import pokemonData from '../../data/PokemonDictionary';
import itemsData from '../../data/ItemsDictionary';
import movesData from '../../data/MovesDictionary';
import abilitiesData from '../../data/AbilityDictionary';
import naturesData from '../../data/NatureDictionary';
import { Team } from '../../types/types';

interface ValidateTeamsProps {
  teamData: Team[];
  subteamData: Team[];
}

interface ValidateStats {
  data: Team[];
  input: Team;
  arrayName: string;
}

interface ValidateNicks {
  data: Team[];
  occurrences: Map<
    string,
    {
      indices: number[];
      count: number;
    }
  >;
  arrayName: string;
}

interface NewErrorsLayout {
  [key: string]: {
    pokemon: number;
    field: string;
    message: string;
  }[];
}

interface dictionaryLayout {
  [key: number | string]: string;
}

export const validateTeams = ({
  teamData,
  subteamData,
}: ValidateTeamsProps) => {
  const dictionary: dictionaryLayout = {
    0: 'hp',
    1: 'attack',
    2: 'defense',
    3: 'specialAttack',
    4: 'specialDefense',
    5: 'speed',
  };

  const newErrors: NewErrorsLayout = {
    team: [],
    subteam: [],
  };
  const data = {
    team: teamData,
    subteam: subteamData,
  };

  const trackTeamOccurrences = ({
    occurrences,
    input,
    index,
  }: {
    occurrences: Map<
      string,
      {
        indices: number[];
        count: number;
      }
    >;
    input: Team;
    index: number;
  }) => {
    //track Pokémon occurrences for duplicate checks
    if (!occurrences.has(input.pokemon)) {
      occurrences.set(input.pokemon, { indices: [index], count: 1 });
    } else {
      const entry = occurrences.get(input.pokemon)!;
      entry.indices.push(index);
      entry.count += 1;
    }
  };

  const validateNicknameDuplicates = ({
    data,
    occurrences,
    arrayName,
  }: ValidateNicks) => {
    occurrences.forEach((entry, pokemon) => {
      if (entry.count > 1) {
        entry.indices.forEach((index) => {
          const { nickname } = data[index];
          if (!nickname || nickname.trim() === '') {
            newErrors[arrayName].push({
              pokemon: index,
              field: 'nickname',
              message: `Duplicate Pokémon "${pokemon}" detected. Nickname is required for entry #${arrayName === 'team' ? index + 1 : index + 1 + teamData.length}.`,
            });
          }
        });
      }
    });
  };

  const validateEvs = ({ data, input, arrayName }: ValidateStats) => {
    Object.keys(input.evs).forEach((key) => {
      let parsedValue = parseInt(String(input.evs[key]), 10);
      input.evs[key] = isNaN(parsedValue) ? 0 : parsedValue;
    });
    const sumValues = Object.values(input.evs).reduce(
      (accumulator, currentValue) => accumulator + currentValue,
      0,
    );
    if (sumValues > 510) {
      newErrors[arrayName].push({
        pokemon: data.indexOf(input),
        field: `evs`,
        message: `The total number of EVS of a pokemon cannot be superior than 510. Error at entry #${arrayName === 'team' ? data.indexOf(input) + 1 : data.indexOf(input) + 1 + data.length}`,
      });
    } else {
      Object.keys(dictionary).forEach((key) => {
        const attributeName = dictionary[key];
        if (input.evs.hasOwnProperty(attributeName)) {
          if (
            (input.evs[attributeName] > 252 || input.evs[attributeName] < 0) &&
            input.evs[attributeName] !== null
          ) {
            newErrors[arrayName].push({
              pokemon: data.indexOf(input),
              field: `evs.${attributeName}`,
              message: `EVs must be between 0 and 252. Error at entry #${arrayName === 'team' ? data.indexOf(input) + 1 : data.indexOf(input) + 1 + data.length}`,
            });
          }
        }
      });
    }
  };

  // const validateIvs = ({ data, input, arrayName }: ValidateStats) => {
  //   Object.keys(dictionary).forEach((key) => {
  //     const attributeName = dictionary[key];
  //     if (input.ivs.hasOwnProperty(attributeName)) {
  //       if (
  //         (input.ivs[attributeName] > 31 || input.ivs[attributeName] < 0) &&
  //         input.ivs[attributeName] !== null
  //       ) {
  //         newErrors[arrayName].push({
  //           pokemon: data.indexOf(input),
  //           field: `ivs.${attributeName}`,
  //           message: `IVs must be between 0 and 31. Error at entry #${arrayName === 'team' ? data.indexOf(input) + 1 : data.indexOf(input) + 1 + data.length}`,
  //         });
  //       }
  //     }
  //   });
  // };

  const validateMoveset = ({ data, input, arrayName }: ValidateStats) => {
    input.moveset.forEach((move, index) => {
      if (!movesData.some((element) => element === move || move === '')) {
        newErrors[arrayName].push({
          pokemon: data.indexOf(input),
          field: `move-${index}`,
          message: `Move does not exist (${move}). Error at entry #${arrayName === 'team' ? data.indexOf(input) + 1 : data.indexOf(input) + 1 + data.length}`,
        });
      }
    });
  };

  for (const [key, value] of Object.entries(data)) {
    const pokemonOccurrences = new Map<
      string,
      { indices: number[]; count: number }
    >();
    value.forEach((input: Team, index: number) => {
      const pokemonNames = pokemonData.map((p) => p.pokemon);
      if (!pokemonNames.some((element) => element === input.pokemon)) {
        newErrors[key].push({
          pokemon: index,
          field: 'pokemon',
          message: `Pokemon does not exist. Error at entry #${key === 'team' ? index + 1 : index + 1 + teamData.length}`,
        });
      }
      if (input.nickname.length > 0) {
        if (!/^[a-zA-Z0-9]+$/.test(input.nickname)) {
          newErrors[key].push({
            pokemon: index,
            field: 'nickname',
            message: `Nickname must consist of alphanumeric characters (letters and numbers) only. Error at entry #${key === 'team' ? index + 1 : index + 1 + teamData.length}`,
          });
        }
      }
      if (
        !naturesData.some(
          (element) => element === input.nature || input.nature === '',
        )
      ) {
        newErrors[key].push({
          pokemon: index,
          field: 'nature',
          message: `Nature does not exist. Error at entry #${key === 'team' ? index + 1 : index + 1 + teamData.length}`,
        });
      }
      if (
        !itemsData.some(
          (element) => element === input.item || input.item === '',
        )
      ) {
        newErrors[key].push({
          pokemon: index,
          field: 'item',
          message: `Item does not exist. Error at entry #${key === 'team' ? index + 1 : index + 1 + teamData.length}`,
        });
      }
      if (
        !abilitiesData.some(
          (element) => element === input.ability || input.ability === '',
        )
      ) {
        newErrors[key].push({
          pokemon: index,
          field: 'ability',
          message: `Ability does not exist. Error at entry #${key === 'team' ? index + 1 : index + 1 + teamData.length}`,
        });
      }
      validateEvs({ data: value, input: input, arrayName: key });
      // validateIvs({ data: value, input: input, arrayName: key });
      validateMoveset({ data: value, input: input, arrayName: key });
      trackTeamOccurrences({
        occurrences: pokemonOccurrences,
        input,
        index,
      });
    });
    //Validate nicknames for duplicates
    validateNicknameDuplicates({
      data: value,
      occurrences: pokemonOccurrences,
      arrayName: key,
    });
  }

  if (newErrors.team.length > 0 || newErrors.subteam.length > 0) {
    const newErrorsTeam = newErrors.team;
    const newErrorsSubteam = newErrors.subteam;
    let errorMessage = Object.values(newErrors)
      .flatMap((value) => value.map((error) => error.message))
      .join('\n');

    console.log(errorMessage);

    throw { message: errorMessage, newErrorsTeam, newErrorsSubteam };
  }
};
