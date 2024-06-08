import pokemonData from '../../data/PokemonDictionary';
import itemsData from '../../data/ItemsDictionary';
import movesData from '../../data/MovesDictionary';
import abilitiesData from '../../data/AbilityDictionary';
import naturesData from '../../data/NatureDictionary';

export const validateTeams = (teamData, subteamData) => {
  const dictionary = {
    0: 'hp',
    1: 'attack',
    2: 'defense',
    3: 'specialAttack',
    4: 'specialDefense',
    5: 'speed',
  };

  const newErrors = {
    team: [],
    subteam: [],
  };
  const data = {
    team: teamData,
    subteam: subteamData,
  };

  const validateEvs = (data, input, arrayName, teamData) => {
    const sumValues = Object.values(input.evs).reduce(
      (accumulator, currentValue) => {
        const parsedValue = parseInt(currentValue, 10);
        if (isNaN(parsedValue)) {
          return accumulator;
        }
        return accumulator + parsedValue;
      },
      0,
    );
    if (sumValues > 510) {
      newErrors[arrayName].push({
        pokemon: data.indexOf(input),
        field: `evs`,
        message: `The total number of EVS of a pokemon cannot be superior than 510. Error at entry #${arrayName === 'team' ? data.indexOf(input) + 1 : data.indexOf(input) + 1 + teamData.length}`,
      });
    } else {
      Object.keys(dictionary).forEach((key) => {
        const attributeName = dictionary[key];
        if (input.evs.hasOwnProperty(attributeName)) {
          if (
            (input.evs[attributeName] > 252 || input.evs[attributeName] < 0) &&
            input.evs[attributeName] !== ''
          ) {
            newErrors[arrayName].push({
              pokemon: data.indexOf(input),
              field: `evs.${attributeName}`,
              message: `EVs must be between 0 and 252. Error at entry #${arrayName === 'team' ? data.indexOf(input) + 1 : data.indexOf(input) + 1 + teamData.length}`,
            });
          }
        }
      });
    }
  };

  const validateIvs = (data, input, arrayName, teamData) => {
    Object.keys(dictionary).forEach((key) => {
      const attributeName = dictionary[key];
      if (input.ivs.hasOwnProperty(attributeName)) {
        if (
          (input.ivs[attributeName] > 31 || input.ivs[attributeName] < 0) &&
          input.ivs[attributeName] !== ''
        ) {
          newErrors[arrayName].push({
            pokemon: data.indexOf(input),
            field: `ivs.${attributeName}`,
            message: `IVs must be between 0 and 31. Error at entry #${arrayName === 'team' ? data.indexOf(input) + 1 : data.indexOf(input) + 1 + teamData.length}`,
          });
        }
      }
    });
  };

  const validateMoveset = (data, input, arrayName, teamData) => {
    input.moveset.forEach((move, index) => {
      if (!movesData.some((element) => element === move || move === '')) {
        newErrors[arrayName].push({
          pokemon: data.indexOf(input),
          field: `move-${index}`,
          message: `Move does not exist. Error at entry #${arrayName === 'team' ? data.indexOf(input) + 1 : data.indexOf(input) + 1 + teamData.length}`,
        });
      }
    });
  };

  for (const [key, value] of Object.entries(data)) {
    value.forEach((input, index) => {
      if (!pokemonData.some((element) => element === input.pokemon)) {
        newErrors[key].push({
          pokemon: index,
          field: 'pokemon',
          message: `Pokemon does not exist. Error at entry #${key === 'team' ? index + 1 : index + 1 + teamData.length}`,
        });
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
      validateEvs(value, input, key, data.team);
      validateIvs(value, input, key, data.team);
      validateMoveset(value, input, key, data.team);
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
