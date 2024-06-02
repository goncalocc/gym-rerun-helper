import React, { useEffect, useState } from 'react';

const ViewTeamEditInfoDetails = ({
  index: pokeIndex,
  teamIndex: teamIndex,
  member: props,
  onFormChange: onFormChange,
  enable: handleEnableButton,
  fieldErrors: fieldErrors,
}) => {
  const handleChange = (event) => {
    const { name, value } = event.target;

    // Call onFormChange with the updated state
    onFormChange(teamIndex, pokeIndex, name, value);
    handleEnableButton();
  };

  const hasError = (errorType, index, subType = null) => {
    if (subType || typeof subType === 'number') {
      const error = fieldErrors[errorType][subType];
      return errorType in fieldErrors && error.includes(index);
    }
    const error = fieldErrors[errorType];
    return errorType in fieldErrors && error.includes(index);
  };

  return (
    <form>
      <div className="mb-2 grid grid-cols-2 gap-4">
        <div className="flex items-center">
          <label htmlFor="pokemon" className="mr-4 w-24 text-right">
            Name:
          </label>
          <input
            type="text"
            value={props.pokemon}
            className={`rounded border ${hasError('pokemonErrors', pokeIndex) ? 'border-2 border-red-600' : 'border-gray-300'} p-2 text-center text-black`}
            style={{ width: '160px', height: '35px' }}
            name="pokemon"
            onChange={(e) => handleChange(e)}
            id="pokemon"
          />
        </div>
        <div className="flex items-center">
          <label htmlFor="item" className="mr-4 w-24 text-right">
            Item:
          </label>
          <input
            type="text"
            value={props.item}
            className={`rounded border ${hasError('itemErrors', pokeIndex) ? 'border-2 border-red-600' : 'border-gray-300'} p-2 text-center text-black`}
            style={{ width: '160px', height: '35px' }}
            name="item"
            onChange={(e) => handleChange(e)}
            id="item"
          />
        </div>
      </div>
      <div className="mb-4 grid grid-cols-2 gap-4">
        <div className="flex items-center">
          <label htmlFor="nature" className="mr-4 w-24 text-right">
            Nature:
          </label>
          <input
            type="text"
            value={props.nature}
            className={`rounded border ${hasError('natureErrors', pokeIndex) ? 'border-2 border-red-600' : 'border-gray-300'} p-2 text-center text-black`}
            style={{ width: '160px', height: '35px' }}
            name="nature"
            onChange={(e) => handleChange(e)}
            id="nature"
          />
        </div>
        <div className="flex items-center">
          <label htmlFor="ability" className="mr-4 w-24 text-right">
            Ability:
          </label>
          <input
            type="text"
            value={props.ability}
            className={`rounded border ${hasError('abilityErrors', pokeIndex) ? 'border-2 border-red-600' : 'border-gray-300'} p-2 text-center text-black`}
            style={{ width: '160px', height: '35px' }}
            name="ability"
            onChange={(e) => handleChange(e)}
            id="ability"
          />
        </div>
      </div>
      <div className="mb-4 grid grid-cols-2 gap-4">
        <div>
          {/* ------------------------------------------------------------------------------------------IV PART------------------------------------------------------------------------------------------ */}
          <p className="text-center">IVs:</p>
          <div>
            <p>
              <label htmlFor="ivs.hp">HP</label>
            </p>
            <input
              type="number"
              value={props.ivs.hp}
              className={`rounded border ${hasError('ivsErrors', pokeIndex, 'hp') ? 'border-2 border-red-600' : 'border-gray-300'} p-2 text-center text-black`}
              style={{ width: '60px', height: '35px' }}
              name="ivs.hp"
              onChange={(e) => handleChange(e)}
              max="31"
              min="0"
              id="ivs.hp"
            />
            <p>
              <label htmlFor="ivs.attack">Atk</label>
            </p>
            <input
              type="number"
              value={props.ivs.attack}
              className={`rounded border ${hasError('ivsErrors', pokeIndex, 'attack') ? 'border-2 border-red-600' : 'border-gray-300'} p-2 text-center text-black`}
              style={{ width: '60px', height: '35px' }}
              name="ivs.attack"
              onChange={(e) => handleChange(e)}
              max="31"
              min="0"
              id="ivs.attack"
            />
            <p>
              <label htmlFor="ivs.defense">Def</label>
            </p>
            <input
              type="number"
              value={props.ivs.defense}
              className={`rounded border ${hasError('ivsErrors', pokeIndex, 'defense') ? 'border-2 border-red-600' : 'border-gray-300'} p-2 text-center text-black`}
              style={{ width: '60px', height: '35px' }}
              name="ivs.defense"
              onChange={(e) => handleChange(e)}
              max="31"
              min="0"
              id="ivs.defense"
            />
            <p>
              <label htmlFor="ivs.specialAttack">SpAtk</label>
            </p>
            <input
              type="number"
              value={props.ivs.specialAttack}
              className={`rounded border ${hasError('ivsErrors', pokeIndex, 'specialAttack') ? 'border-2 border-red-600' : 'border-gray-300'} p-2 text-center text-black`}
              style={{ width: '60px', height: '35px' }}
              name="ivs.specialAttack"
              onChange={(e) => handleChange(e)}
              max="31"
              min="0"
              id="ivs.specialAttack"
            />
            <p>
              <label htmlFor="ivs.specialDefense">SpDef</label>
            </p>
            <input
              type="number"
              value={props.ivs.specialDefense}
              className={`rounded border ${hasError('ivsErrors', pokeIndex, 'specialDefense') ? 'border-2 border-red-600' : 'border-gray-300'} p-2 text-center text-black`}
              style={{ width: '60px', height: '35px' }}
              name="ivs.specialDefense"
              onChange={(e) => handleChange(e)}
              max="31"
              min="0"
              id="ivs.specialDefense"
            />
            <p>
              <label htmlFor="ivs.speed">Spd</label>
            </p>
            <input
              type="number"
              value={props.ivs.speed}
              className={`rounded border ${hasError('ivsErrors', pokeIndex, 'speed') ? 'border-2 border-red-600' : 'border-gray-300'} p-2 text-center text-black`}
              style={{ width: '60px', height: '35px' }}
              name="ivs.speed"
              onChange={(e) => handleChange(e)}
              max="31"
              min="0"
              id="ivs.speed"
            />
          </div>
        </div>
        <div>
          {/* ------------------------------------------------------------------------------------------EV PART------------------------------------------------------------------------------------------ */}
          <p className="text-center">EVs:</p>
          <div>
            <p>
              <label htmlFor="evs.hp">HP</label>
            </p>
            <input
              type="number"
              value={props.evs.hp}
              className={`rounded border ${hasError('evsErrors', pokeIndex, 'hp') ? 'border-2 border-red-600' : 'border-gray-300'} p-2 text-center text-black
              [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none
              `}
              style={{ width: '60px', height: '35px' }}
              name="evs.hp"
              onChange={(e) => handleChange(e)}
              id="evs.hp"
            />
            <p>
              <label htmlFor="evs.attack">Atk</label>
            </p>
            <input
              type="number"
              value={props.evs.attack}
              className={`rounded border ${hasError('evsErrors', pokeIndex, 'attack') ? 'border-2 border-red-600' : 'border-gray-300'} p-2 text-center text-black
              [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none
              `}
              style={{ width: '60px', height: '35px' }}
              name="evs.attack"
              onChange={(e) => handleChange(e)}
              id="evs.hp"
            />
            <p>
              <label htmlFor="evs.defense">Def</label>
            </p>
            <input
              type="number"
              value={props.evs.defense}
              className={`rounded border ${hasError('evsErrors', pokeIndex, 'defense') ? 'border-2 border-red-600' : 'border-gray-300'} p-2 text-center text-black
              [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none
              `}
              style={{ width: '60px', height: '35px' }}
              name="evs.defense"
              onChange={(e) => handleChange(e)}
              id="evs.defense"
            />
            <p>
              <label htmlFor="evs.specialAttack">SpAtk</label>
            </p>
            <input
              type="number"
              value={props.evs.specialAttack}
              className={`rounded border ${hasError('evsErrors', pokeIndex, 'specialAttack') ? 'border-2 border-red-600' : 'border-gray-300'} p-2 text-center text-black
              [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none
              `}
              style={{ width: '60px', height: '35px' }}
              name="evs.specialAttack"
              onChange={(e) => handleChange(e)}
              id="evs.specialAttack"
            />
            <p>
              <label htmlFor="evs.specialDefense">SpDef</label>
            </p>
            <input
              type="number"
              value={props.evs.specialDefense}
              className={`rounded border ${hasError('evsErrors', pokeIndex, 'specialDefense') ? 'border-2 border-red-600' : 'border-gray-300'} p-2 text-center text-black
              [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none
              `}
              style={{ width: '60px', height: '35px' }}
              name="evs.specialDefense"
              onChange={(e) => handleChange(e)}
              id="evs.specialDefense"
            />
            <p>
              <label htmlFor="evs.speed">Spd</label>
            </p>
            <input
              type="number"
              value={props.evs.speed}
              className={`rounded border ${hasError('evsErrors', pokeIndex, 'speed') ? 'border-2 border-red-600' : 'border-gray-300'} p-2 text-center text-black
              [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none
              `}
              style={{ width: '60px', height: '35px' }}
              name="evs.speed"
              onChange={(e) => handleChange(e)}
              id="evs.speed"
            />
          </div>
        </div>
      </div>
      <div>
        Moves:
        <ul className="grid grid-cols-2 gap-4">
          {Array.isArray(props.moveset) &&
            props.moveset.map((move, moveIndex) => (
              <li key={moveIndex}>
                <div>
                  <label
                    htmlFor={`move-${moveIndex}`}
                    className="col-span-1 mr-4 w-24 text-right"
                  >
                    Move {moveIndex + 1}:
                  </label>
                  <input
                    type="text"
                    value={move}
                    className={`col-span-1 rounded border ${hasError('moveErrors', pokeIndex, moveIndex) ? 'border-2 border-red-600' : 'border-gray-300'} p-2 text-center text-black`}
                    style={{ width: '160px', height: '35px' }}
                    name={`moveset.${moveIndex}`}
                    id={`move-${moveIndex}`}
                    onChange={(e) => handleChange(e)}
                  />
                </div>
              </li>
            ))}
        </ul>
      </div>
      <hr className="border-white-300 mb-10 mt-40" />
    </form>
  );
};
export default ViewTeamEditInfoDetails;
