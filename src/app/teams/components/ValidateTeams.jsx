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

  const errorMessage = [];

  const data = teamData;
  const dataDetails = [...data.team];

  const updateErrorMessage = (message) => {
    errorMessage.push(message);
  };

  const updateDetectionError = (index, parameter) => {
    parameter.push(index);
  };

  const validateEvs = (dataDetails, input) => {
    const sumValues = Object.values(input.evs).reduce(
      (a, b) => parseInt(a) + parseInt(b),
      0,
    );
    if (sumValues > 510) {
      console.log('sumvalues : ', sumValues);
      Object.keys(dictionary).forEach((key) => {
        const attributeName = dictionary[key];
        if (input.evs.hasOwnProperty(attributeName)) {
          updateDetectionError(
            dataDetails.indexOf(input),
            fieldErrors.evsErrors[attributeName],
          );
        }
      });
      updateErrorMessage(
        `The total number of EVS of a pokemon cannot be superior than 510. Error at entry #${dataDetails.indexOf(input) + 1}`,
      );
    } else {
      Object.keys(dictionary).forEach((key) => {
        const attributeName = dictionary[key];
        if (input.evs.hasOwnProperty(attributeName)) {
          if (input.evs[attributeName] > 252 || input.evs[attributeName] < 0) {
            updateDetectionError(
              dataDetails.indexOf(input),
              fieldErrors.evsErrors[attributeName],
            );
            updateErrorMessage(
              `EVs must be between 0 and 252. Error at entry #${dataDetails.indexOf(input) + 1}`,
            );
          }
        }
      });
    }
  };

  const validateIvs = (dataDetails, input) => {
    Object.keys(dictionary).forEach((key) => {
      const attributeName = dictionary[key];
      if (input.ivs.hasOwnProperty(attributeName)) {
        if (input.ivs[attributeName] > 31 || input.ivs[attributeName] < 0) {
          updateDetectionError(
            dataDetails.indexOf(input),
            fieldErrors.ivsErrors[attributeName],
          );
          updateErrorMessage(
            `IVs must be between 0 and 31. Error at entry #${dataDetails.indexOf(input) + 1}`,
          );
        }
      }
    });
  };

  const validateMoveset = (dataDetails, input) => {
    input.moveset.forEach((move, index) => {
      if (!movesData.some((element) => element === move || move === '')) {
        updateDetectionError(
          dataDetails.indexOf(input),
          fieldErrors.moveErrors[index],
        );
        updateErrorMessage(
          `Move does not exist. Error at entry #${dataDetails.indexOf(input) + 1}`,
        );
      }
    });
  };

  dataDetails.forEach((input) => {
    if (!pokemonData.some((element) => element === input.pokemon)) {
      updateDetectionError(
        dataDetails.indexOf(input),
        fieldErrors.pokemonErrors,
      );
      updateErrorMessage(
        `Pokemon does not exist. Error at entry #${dataDetails.indexOf(input) + 1}`,
      );
    }
    if (!naturesData.some((element) => element === input.nature)) {
      updateDetectionError(
        dataDetails.indexOf(input),
        fieldErrors.natureErrors,
      );
      updateErrorMessage(
        `Nature does not exist. Error at entry #${dataDetails.indexOf(input) + 1}`,
      );
    }
    if (!itemsData.some((element) => element === input.item)) {
      updateDetectionError(dataDetails.indexOf(input), fieldErrors.itemErrors);
      updateErrorMessage(
        `Item does not exist. Error at entry #${dataDetails.indexOf(input) + 1}`,
      );
    }
    if (!abilitiesData.some((element) => element === input.ability)) {
      updateDetectionError(
        dataDetails.indexOf(input),
        fieldErrors.abilityErrors,
      );
      updateErrorMessage(
        `Ability does not exist. Error at entry #${dataDetails.indexOf(input) + 1}`,
      );
    }
    validateEvs(dataDetails, input);
    validateIvs(dataDetails, input);
    validateMoveset(dataDetails, input);
  });
  if (errorMessage.length > 0) {
    throw { message: errorMessage.join('\n'), fieldErrors };
  }
};
