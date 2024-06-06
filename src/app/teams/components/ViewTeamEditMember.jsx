import React, { useState, useRef, useEffect } from 'react';
import SuggestionBox from './form/SuggestionBox';
import pokemonData from '../../data/PokemonDictionary';
import itemsData from '../../data/ItemsDictionary';
import movesData from '../../data/MovesDictionary';
import abilitiesData from '../../data/AbilityDictionary';
import naturesData from '../../data/NatureDictionary';
import EvsForm from './form/EvsForms';
import IvsForm from './form/IvsForm';

const ViewTeamEditMember = ({
  index: pokeIndex,
  teamIndex: teamIndex,
  member: props,
  onFormChange: onFormChange,
  enable: handleEnableButton,
  errorData: errorData,
}) => {
  const dictionaries = {
    pokemon: pokemonData,
    item: itemsData,
    move: movesData,
    ability: abilitiesData,
    nature: naturesData,
  };

  const statsDictionaries = [
    {
      stat: 'hp',
      title: 'HP',
      type1: 'evs',
      type2: 'ivs',
    },
    {
      stat: 'attack',
      title: 'Atk',
      type1: 'evs',
      type2: 'ivs',
    },
    {
      stat: 'defense',
      title: 'Def',
      type1: 'evs',
      type2: 'ivs',
    },
    {
      stat: 'specialAttack',
      title: 'SpAtk',
      type1: 'evs',
      type2: 'ivs',
    },
    {
      stat: 'specialDefense',
      title: 'SpDef',
      type1: 'evs',
      type2: 'ivs',
    },
    {
      stat: 'speed',
      title: 'Spd',
      type1: 'evs',
      type2: 'ivs',
    },
  ];
  const itemRefs = useRef([]);

  const [state, setState] = useState({
    activeItem: 0,
    filteredItems: [],
    displayItems: false,
    inputName: '',
  });

  useEffect(() => {
    // Scroll the active item into view
    if (itemRefs.current[state.activeItem]) {
      itemRefs.current[state.activeItem].scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      });
    }
  }, [state.activeItem]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    //Filter the suggestions while changing the form
    let filteredItems = [];
    if (name.startsWith('moveset')) {
      //for the 4 moves of a pokemon
      filteredItems = dictionaries['move'].filter(
        (optionName) =>
          optionName.toLowerCase().indexOf(value.toLowerCase()) > -1,
      );
    } else if (!(name.startsWith('evs') || name.startsWith('ivs'))) {
      (filteredItems = dictionaries[name].filter(
        (optionName) =>
          optionName.toLowerCase().indexOf(value.toLowerCase()) > -1,
      )) || [];
    }

    setState((prevState) => ({
      ...prevState,
      activeItem: 0,
      filteredItems,
      displayItems: true,
      inputName: name,
    }));

    // Call onFormChange with the updated state
    onFormChange(teamIndex, pokeIndex, name, value);
    handleEnableButton();
  };

  const handleClick = (event) => {
    const value = event.target.innerText;
    setState({
      activeItem: 0,
      filteredItems: [],
      displayItems: false,
    });

    onFormChange(teamIndex, pokeIndex, state.inputName, value);
  };

  const handleKeyDown = (e) => {
    const { name } = e.target;
    const { activeItem, filteredItems } = state;

    if (e.keyCode === 13) {
      // if press "enter" key
      setState((prevState) => ({
        ...prevState,
        activeItem: 0,
        filteredItems: [],
        displayItems: false,
        inputName: name,
      }));
      onFormChange(teamIndex, pokeIndex, name, filteredItems[activeItem]);
    } else if (e.keyCode === 27) {
      // if press "esc" key
      setState((prevState) => ({
        ...prevState,
        activeItem: 0,
        filteredItems: [],
        displayItems: false,
      }));
    } else if (e.keyCode === 38) {
      //if press up arrow key
      e.preventDefault();
      if (activeItem === 0) {
        return;
      }
      setState((prevState) => ({
        ...prevState,
        activeItem: prevState.activeItem - 1,
        filteredItems: prevState.filteredItems,
        displayItems: true,
      }));
    } else if (e.keyCode === 40) {
      //if press down arrow key
      e.preventDefault();
      if (
        (filteredItems && activeItem === filteredItems.length - 1) ||
        activeItem >= 9
      ) {
        return;
      }
      setState((prevState) => ({
        ...prevState,
        activeItem: prevState.activeItem + 1,
        filteredItems: prevState.filteredItems,
        displayItems: true,
      }));
    }
  };

  const handleBlur = (event) => {
    const { name, value } = event.target;
    const trimmedValue = value.trim();

    setState((prevState) => ({
      ...prevState,
      activeItem: 0,
      filteredItems: [],
      displayItems: false,
    }));

    onFormChange(teamIndex, pokeIndex, name, trimmedValue);
  };

  const hasError = (field, index) => {
    if (
      errorData.some(
        (element) => element.pokemon === index && field.includes(element.field),
      )
    ) {
      return true;
    }
  };

  return (
    <form>
      <div className="mb-2 grid grid-cols-2 gap-4">
        <div className="flex items-center">
          <label htmlFor="pokemon" className="mr-4 w-24 text-right">
            Name:
          </label>
          <div className="relative">
            <input
              type="text"
              value={props.pokemon}
              className={`rounded border ${hasError('pokemon', pokeIndex) ? 'border-2 border-red-600' : 'border-gray-300'} p-2 text-center text-black`}
              style={{ width: '160px', height: '35px' }}
              name="pokemon"
              onChange={(e) => handleChange(e)}
              onBlur={handleBlur}
              id="pokemon"
              onKeyDown={handleKeyDown}
              autoComplete="off"
            />
            {state.displayItems &&
            state.inputName === 'pokemon' &&
            props.pokemon.length &&
            state.filteredItems.length ? (
              <SuggestionBox
                filteredItems={state.filteredItems}
                itemRefs={itemRefs}
                activeItem={state.activeItem}
                handleClick={handleClick}
              />
            ) : null}
          </div>
        </div>
        <div className="flex items-center">
          <label htmlFor="item" className="mr-4 w-24 text-right">
            Item:
          </label>
          <div className="relative">
            <input
              type="text"
              value={props.item}
              className={`rounded border ${hasError('item', pokeIndex) ? 'border-2 border-red-600' : 'border-gray-300'} p-2 text-center text-black`}
              style={{ width: '160px', height: '35px' }}
              name="item"
              onChange={(e) => handleChange(e)}
              onBlur={handleBlur}
              id="item"
              onKeyDown={handleKeyDown}
              autoComplete="off"
            />

            {state.displayItems &&
            state.inputName === 'item' &&
            props.item.length &&
            state.filteredItems.length ? (
              <SuggestionBox
                filteredItems={state.filteredItems}
                itemRefs={itemRefs}
                activeItem={state.activeItem}
                handleClick={handleClick}
              />
            ) : null}
          </div>
        </div>
      </div>
      <div className="mb-4 grid grid-cols-2 gap-4">
        <div className="flex items-center">
          <label htmlFor="nature" className="mr-4 w-24 text-right">
            Nature:
          </label>
          <div className="relative">
            <input
              type="text"
              value={props.nature}
              className={`rounded border ${hasError('nature', pokeIndex) ? 'border-2 border-red-600' : 'border-gray-300'} p-2 text-center text-black`}
              style={{ width: '160px', height: '35px' }}
              name="nature"
              onChange={(e) => handleChange(e)}
              onBlur={handleBlur}
              id="nature"
              onKeyDown={handleKeyDown}
              autoComplete="off"
            />
            {state.displayItems &&
            state.inputName === 'nature' &&
            props.nature.length &&
            state.filteredItems.length ? (
              <SuggestionBox
                filteredItems={state.filteredItems}
                itemRefs={itemRefs}
                activeItem={state.activeItem}
                handleClick={handleClick}
              />
            ) : null}
          </div>
        </div>
        <div className="flex items-center">
          <label htmlFor="ability" className="mr-4 w-24 text-right">
            Ability:
          </label>
          <div className="relative">
            <input
              type="text"
              value={props.ability}
              className={`rounded border ${hasError('ability', pokeIndex) ? 'border-2 border-red-600' : 'border-gray-300'} p-2 text-center text-black`}
              style={{ width: '160px', height: '35px' }}
              name="ability"
              onChange={(e) => handleChange(e)}
              onBlur={handleBlur}
              id="ability"
              onKeyDown={handleKeyDown}
              autoComplete="off"
            />
            {state.displayItems &&
            state.inputName === 'ability' &&
            props.ability.length &&
            state.filteredItems.length ? (
              <SuggestionBox
                filteredItems={state.filteredItems}
                itemRefs={itemRefs}
                activeItem={state.activeItem}
                handleClick={handleClick}
              />
            ) : null}
          </div>
        </div>
      </div>
      <div className="mb-4 grid grid-cols-2 gap-4">
        <div>
          {/* ------------------------------------------------------------------------------------------IV PART------------------------------------------------------------------------------------------ */}
          <p className="text-center">IVs:</p>
          <div>
            {statsDictionaries.map((element, index) => (
              <div key={index}>
                <IvsForm
                  title={element.title}
                  value={props.ivs[element.stat]}
                  nameId={`${element.type2}.${element.stat}`}
                  pokeIndex={pokeIndex}
                  handleChange={handleChange}
                  handleBlur={handleBlur}
                  hasError={hasError}
                />
              </div>
            ))}
          </div>
        </div>
        <div>
          {/* ------------------------------------------------------------------------------------------EV PART------------------------------------------------------------------------------------------ */}
          <p className="text-center">EVs:</p>
          <div>
            {statsDictionaries.map((element, index) => (
              <div key={index}>
                <EvsForm
                  title={element.title}
                  value={props.evs[element.stat]}
                  nameId={`${element.type1}.${element.stat}`}
                  pokeIndex={pokeIndex}
                  handleChange={handleChange}
                  handleBlur={handleBlur}
                  hasError={hasError}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
        {/* ------------------------------------------------------------------------------------------MOVES------------------------------------------------------------------------------------------ */}
      <div>
        Moves:
        <ul className="grid grid-cols-2 gap-4">
          {props.moveset.map((move, moveIndex) => (
            <li key={moveIndex}>
              <div>
                <label
                  htmlFor={`move-${moveIndex}`}
                  className="col-span-1 mr-4 w-24 text-right"
                >
                  Move {moveIndex + 1}:
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={move}
                    className={`col-span-1 rounded border ${hasError(`move-${moveIndex}`, pokeIndex) ? 'border-2 border-red-600' : 'border-gray-300'} p-2 text-center text-black`}
                    style={{ width: '160px', height: '35px' }}
                    name={`moveset.${moveIndex}`}
                    onChange={(e) => handleChange(e)}
                    onBlur={handleBlur}
                    id={`move-${moveIndex}`}
                    onKeyDown={handleKeyDown}
                    autoComplete="off"
                  />
                  {state.displayItems &&
                  state.inputName === `moveset.${moveIndex}` &&
                  move.length &&
                  state.filteredItems.length ? (
                    <SuggestionBox
                      filteredItems={state.filteredItems}
                      itemRefs={itemRefs}
                      activeItem={state.activeItem}
                      handleClick={handleClick}
                    />
                  ) : null}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <hr className="border-white-300 mb-10 mt-40" />
    </form>
  );
};
export default ViewTeamEditMember;
