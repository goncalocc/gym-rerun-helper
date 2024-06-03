import pokemonData from '../../data/PokemonDictionary';
import itemsData from '../../data/ItemsDictionary';
import movesData from '../../data/MovesDictionary';
import abilitiesData from '../../data/AbilityDictionary';
import naturesData from '../../data/NatureDictionary';

export const validateTeams = (teamData, fieldErrors) => {
  const dictionary = {
    0: 'hp',
    1: 'attack',
    2: 'defense',
    3: 'specialAttack',
    4: 'specialDefense',
    5: 'speed',
  };

  const newErrors = [];

  const data = teamData;
  const dataDetails = [...data.team];

  const validateEvs = (dataDetails, input) => {
    const sumValues = Object.values(input.evs).reduce(
      (a, b) => parseInt(a) + parseInt(b),
      0,
    );
    if (sumValues > 510) {
      newErrors.push({
        pokemon: dataDetails.indexOf(input),
        field: `evs`,
        message: `The total number of EVS of a pokemon cannot be superior than 510. Error at entry #${dataDetails.indexOf(input) + 1}`,
      });
    } else {
      Object.keys(dictionary).forEach((key) => {
        const attributeName = dictionary[key];
        if (input.evs.hasOwnProperty(attributeName)) {
          if (
            (input.evs[attributeName] > 252 || input.evs[attributeName] < 0) &&
            input.evs[attributeName] !== ''
          ) {
            newErrors.push({
              pokemon: dataDetails.indexOf(input),
              field: `evs-${attributeName}`,
              message: `EVs must be between 0 and 252. Error at entry #${dataDetails.indexOf(input) + 1}`,
            });
          }
        }
      });
    }
  };

  const validateIvs = (dataDetails, input) => {
    Object.keys(dictionary).forEach((key) => {
      const attributeName = dictionary[key];
      if (input.ivs.hasOwnProperty(attributeName)) {
        if (
          (input.ivs[attributeName] > 31 || input.ivs[attributeName] < 0) &&
          input.ivs[attributeName] !== ''
        ) {
          newErrors.push({
            pokemon: dataDetails.indexOf(input),
            field: `ivs-${attributeName}`,
            message: `IVs must be between 0 and 31. Error at entry #${dataDetails.indexOf(input) + 1}`,
          });
        }
      }
    });
  };

  const validateMoveset = (dataDetails, input) => {
    input.moveset.forEach((move, index) => {
      if (!movesData.some((element) => element === move || move === '')) {
        newErrors.push({
          pokemon: dataDetails.indexOf(input),
          field: `move-${index}`,
          message: `Move does not exist. Error at entry #${dataDetails.indexOf(input) + 1}`,
        });
      }
    });
  };

  dataDetails.forEach((input) => {
    if (
      !pokemonData.some(
        (element) => element === input.pokemon || input.nature === '',
      )
    ) {
      newErrors.push({
        pokemon: dataDetails.indexOf(input),
        field: 'pokemon',
        message: `Pokemon does not exist. Error at entry #${dataDetails.indexOf(input) + 1}`,
      });
    }
    if (
      !naturesData.some(
        (element) => element === input.nature || input.nature === '',
      )
    ) {
      newErrors.push({
        pokemon: dataDetails.indexOf(input),
        field: 'nature',
        message: `Nature does not exist. Error at entry #${dataDetails.indexOf(input) + 1}`,
      });
    }
    if (
      !itemsData.some((element) => element === input.item || input.item === '')
    ) {
      newErrors.push({
        pokemon: dataDetails.indexOf(input),
        field: 'item',
        message: `Item does not exist. Error at entry #${dataDetails.indexOf(input) + 1}`,
      });
    }
    if (
      !abilitiesData.some(
        (element) => element === input.ability || input.nature === '',
      )
    ) {
      newErrors.push({
        pokemon: dataDetails.indexOf(input),
        field: 'ability',
        message: `Ability does not exist. Error at entry #${dataDetails.indexOf(input) + 1}`,
      });
    }
    validateEvs(dataDetails, input);
    validateIvs(dataDetails, input);
    validateMoveset(dataDetails, input);
  });

  if (newErrors.length > 0) {
    const errorMessage = newErrors.map((error) => error.message).join('\n');
    throw { message: errorMessage, newErrors };
  }
};
