import pokemonData from '../../data/PokemonDictionary';
import itemsData from '../../data/ItemsDictionary';
import movesData from '../../data/MovesDictionary';
import abilitiesData from '../../data/AbilityDictionary';
import naturesData from '../../data/NatureDictionary';

export const validateTeams = (teamData) => {
  const errorsIndex = {
    abilityErrors: [],
    evsErrors: [],
    ivsErrors: [],
    itemErrors: [],
    moveErrors: [],
    natureErrors: [],
    pokemonErrors: []
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
    const sumValues = Object.values(input.evs).reduce((a, b) => a + b, 0);
    if (sumValues > 510) {
      console.log('sumvalues : ', sumValues);
      updateDetectionError(dataDetails.indexOf(input), errorsIndex.evsErrors);
      updateErrorMessage(
        `The total number of EVS of a pokemon cannot be superior than 510. Error at entry #${dataDetails.indexOf(input) + 1}`,
      );
    }
    if (
      Object.values(input.evs).some((element) => element > 252 || element < 0)
    ) {
      updateDetectionError(dataDetails.indexOf(input), errorsIndex.evsErrors);
      updateErrorMessage(
        `EVs must be between 0 and 252. Error at entry #${dataDetails.indexOf(input) + 1}`,
      );
    }
  };

  const validateIvs = (dataDetails, input) => {
    if (
      Object.values(input.ivs).some((element) => element > 31 || element < 0)
    ) {
      updateDetectionError(dataDetails.indexOf(input), errorsIndex.ivsErrors);
      updateErrorMessage(
        `IVs must be between 0 and 31. Error at entry #${dataDetails.indexOf(input) + 1}`,
      );
    }
  };

  const validateMoveset = (dataDetails, input) => {
    input.moveset.forEach((move) => {
      if (!movesData.some((element) => element === move || move === '')) {
        updateDetectionError(dataDetails.indexOf(input), errorsIndex.moveErrors);
        updateErrorMessage(
          `Move does not exist. Error at entry #${dataDetails.indexOf(input) + 1}`,
        );
      }
    });
  };

  dataDetails.forEach((input) => {
    if (!pokemonData.some((element) => element === input.pokemon)) {
      updateDetectionError(dataDetails.indexOf(input), errorsIndex.pokemonErrors);
      updateErrorMessage(
        `Pokemon does not exist. Error at entry #${dataDetails.indexOf(input) + 1}`,
      );
    }
    if (!naturesData.some((element) => element === input.nature)) {
      updateDetectionError(dataDetails.indexOf(input), errorsIndex.natureErrors);
      updateErrorMessage(
        `Nature does not exist. Error at entry #${dataDetails.indexOf(input) + 1}`,
      );
    }
    if (!itemsData.some((element) => element === input.item)) {
      updateDetectionError(dataDetails.indexOf(input), errorsIndex.itemErrors);
      updateErrorMessage(
        `Item does not exist. Error at entry #${dataDetails.indexOf(input) + 1}`,
      );
    }
    if (!abilitiesData.some((element) => element === input.ability)) {
      updateDetectionError(dataDetails.indexOf(input), errorsIndex.abilityErrors);
      updateErrorMessage(
        `Ability does not exist. Error at entry #${dataDetails.indexOf(input) + 1}`,
      );
    }
    validateEvs(dataDetails, input);
    validateIvs(dataDetails, input);
    validateMoveset(dataDetails, input);
  });
  if (errorMessage.length > 0) {
    throw { message: errorMessage.join('\n'), errorsIndex };
  }
};
