import { Gym, Leads, Route, SwapItem, Teams } from '@/app/types/types';
import Svg from '@/app/utils/Svg';
import { getPokemonNumber } from '../ViewRoute';
import { ChangeEvent, useRef, useState } from 'react';
import { OnFormChange } from '@/app/routes/[routeId]/components/ViewRouteEditMain';
import { NewErrorsLayout } from '../validateRoutes';
import gymsJson from '../../../../data/gym-variations.json';
import SuggestionBox from '@/app/teams/components/form/SuggestionBox';
import { State } from '@/app/teams/components/ViewTeamEditMember';
import SortSuggestionList from '@/app/utils/SortSuggestionList';
import itemsData from '../../../../data/ItemsDictionary';

export interface ViewRouteEditGymProps {
  routeGym: Route;
  assignedTeam: Teams;
  onFormChange: OnFormChange;
  errorData: NewErrorsLayout[];
  isAutofillChecked: boolean;
}

const ViewRouteEditGym: React.FC<ViewRouteEditGymProps> = ({
  routeGym: routeGym,
  assignedTeam: assignedTeam,
  onFormChange: onFormChange,
  errorData: errorData,
  isAutofillChecked: isAutofillChecked,
}) => {
  const filteredGym = gymsJson.find((gym) => gym.id === routeGym.id);
  const [swapItems, setSwapItems] = useState<SwapItem[]>(routeGym.swapItems);

  const [state, setState] = useState<State>({
    activeItem: 0,
    filteredItems: [],
    displayItems: false,
    inputName: '',
  });

  const itemRefs = useRef<(HTMLLIElement | null)[]>(
    Array(state.filteredItems.length).fill(null),
  );

  const stringToBoolean = (value: string): boolean => {
    return value === 'true';
  };

  const addSwapItem = () => {
    if (swapItems.length < 4) {
      setSwapItems((prev) => [...prev, { pokemon: '', item: '' }]);
    }
  };

  const removeSwapItem = (index: number, id: number) => {
    setSwapItems((prev) => {
      const updatedSwapItems = prev.filter((_, i) => i !== index);
      onFormChange({
        name: 'swapItems' as keyof Route,
        value: updatedSwapItems,
        id,
      });

      return updatedSwapItems;
    });
  };

  const handleClickSuggestion = (
    event: React.MouseEvent<HTMLLIElement>,
    id: number,
    inputElement: HTMLInputElement,
  ): void => {
    const value = event.currentTarget.innerText;

    const inputLead = inputElement.value;

    const cursorPosition = inputElement.selectionStart ?? inputLead.length;

    const prefix = inputLead.slice(0, cursorPosition);
    const sufix = inputLead.slice(cursorPosition, inputLead.length);
    const prefixWords = prefix.split(' ');
    const sufixWords = sufix.split(' ');
    const wordIndex = prefixWords.length - 1;
    let inputArray: String[] = [];
    if (sufix === '') {
      inputArray = prefixWords;
    } else {
      inputArray = prefixWords.concat(sufixWords);
    }

    inputArray[wordIndex] = value;

    const newValue = inputArray.join(' ').trim();

    if (isAutofillChecked) {
      for (let i = 0; i < filteredGym!.variations.length; i++) {
        const generalName = state.inputName.split('.')[0];
        onFormChange({
          name: `${generalName}.${i}` as keyof Route,
          value: newValue,
          id,
        });
      }
    } else {
      setState((prevState) => ({
        activeItem: 0,
        filteredItems: [],
        inputName: prevState.inputName,
        displayItems: false,
      }));
      onFormChange({
        name: state.inputName as keyof Route,
        value: newValue,
        id,
      });
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    id: number,
    inputElement: HTMLInputElement | null,
  ) => {
    const { name, value: currentInputValue } = e.currentTarget;
    const { activeItem, filteredItems } = state;

    if (e.key === 'Enter') {
      // if press "enter" key
      if (inputElement) {
        const inputLead = inputElement.value;

        const cursorPosition = inputElement.selectionStart ?? inputLead.length;

        const prefix = inputLead.slice(0, cursorPosition);
        const sufix = inputLead.slice(cursorPosition, inputLead.length);
        const prefixWords = prefix.split(' ');
        const sufixWords = sufix.split(' ');
        const wordIndex = prefixWords.length - 1;
        let inputArray: String[] = [];
        if (sufix === '') {
          inputArray = prefixWords;
        } else {
          inputArray = prefixWords.concat(sufixWords);
        }

        inputArray[wordIndex] = filteredItems[activeItem];

        const newValue = inputArray.join(' ').trim();

        setState((prevState) => ({
          activeItem: 0,
          filteredItems: [],
          inputName: prevState.inputName,
          displayItems: false,
        }));

        onFormChange({
          name: state.inputName as keyof Route,
          value: newValue,
          id,
        });
      } else {
        setState((prevState) => ({
          ...prevState,
          activeItem: 0,
          filteredItems: [],
          displayItems: false,
          inputName: name,
        }));

        onFormChange({
          name: name as keyof Route,
          value: currentInputValue,
          id,
        });
      }
    } else if (e.key === 'Esc') {
      // if press "esc" key
      setState((prevState) => ({
        ...prevState,
        activeItem: 0,
        filteredItems: [],
        displayItems: false,
      }));
    } else if (e.key === 'ArrowUp') {
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
    } else if (e.key === 'ArrowDown') {
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

  const handleBlurSuggestion = (
    event: React.FocusEvent<HTMLInputElement>,
    id: number,
  ) => {
    const { name, value } = event.target;
    const trimmedValue = value.trim();

    setState((prevState) => ({
      ...prevState,
      activeItem: 0,
      filteredItems: [],
      displayItems: false,
    }));

    onFormChange({ name: name as keyof Route, value: value, id });
  };

  const handleChange = (
    event: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>,
    id: number,
  ) => {
    const { name, value, type, selectionStart } = event.target;
    // For other input types or fields
    let filteredItems: string[] = [];
    const processedValue = type === 'radio' ? stringToBoolean(value) : value;

    // Form change for radio buttons
    if (type === 'radio' && name === 'heal') {
      const mappings: Record<
        string,
        { heal: boolean; provisionalHeal: boolean }
      > = {
        ifneeded: { heal: false, provisionalHeal: true },
        yes: { heal: true, provisionalHeal: false },
        no: { heal: false, provisionalHeal: false },
      };

      const selectedOption = mappings[value];
      if (selectedOption) {
        onFormChange({ name: 'heal', value: selectedOption.heal, id });
        onFormChange({
          name: 'provisionalHeal',
          value: selectedOption.provisionalHeal,
          id,
        });
      }

      return; // Exit early since the form change has been handled
    }

    // Handling suggestions for 'pokemon'
    if (name.includes('pokemon')) {
      filteredItems = getSuggestionList(value, selectionStart ?? 0);
      setState((prevState) => ({
        ...prevState,
        activeItem: 0,
        filteredItems,
        displayItems: true,
        inputName: name,
      }));
    }

    // Form change for Lead and Attacks when Autofill is on
    if (
      (name.includes('pokemon') || name.includes('attacks')) &&
      isAutofillChecked
    ) {
      for (let i = 0; i < filteredGym!.variations.length; i++) {
        const generalName = name.split('.')[0];
        onFormChange({
          name: `${generalName}.${i}` as keyof Route,
          value: processedValue,
          id,
        });
      }
    } else {
      onFormChange({ name: name as keyof Route, value: processedValue, id });
    }
  };

  const handlePokemonChange = (
    e: React.ChangeEvent<HTMLSelectElement>,
    index: number,
    id: number,
  ) => {
    const fieldName = e.target.name;
    const pokemonName = e.target.value;
    const updatedSwapItems = [...swapItems];
    updatedSwapItems[index].pokemon = pokemonName;
    const processedValue = updatedSwapItems.filter(
      (item) => item.pokemon !== '' || item.item !== '',
    );
    onFormChange({
      name: fieldName as keyof Route,
      value: processedValue,
      id,
    });
  };

  const handleItemChange = (
    e: React.ChangeEvent<HTMLSelectElement>,
    index: number,
    id: number,
  ) => {
    const fieldName = e.target.name;
    const itemName = e.target.value;
    const updatedSwapItems = [...swapItems];
    updatedSwapItems[index].item = itemName;
    const processedValue = updatedSwapItems.filter(
      (item) => item.pokemon !== '' || item.item !== '',
    );
    onFormChange({
      name: fieldName as keyof Route,
      value: processedValue,
      id,
    });
  };

  const handleCheckboxChange = (
    event: ChangeEvent<HTMLInputElement>,
    id: number,
  ) => {
    const { name, checked } = event.target;
    onFormChange({ name: name as keyof Route, value: checked, id });
  };

  //in the future change teamUsed .team to a variable to it can read between ['team'] and ['subteam']
  const getSuggestionList = (value: string, position: number) => {
    let fragment = '';
    const teamUsed = assignedTeam.team.map((member) => {
      if (member.nickname && member.nickname.trim() !== '') {
        return `${member.pokemon}(${member.nickname})`;
      } else {
        return member.pokemon;
      }
    });

    const missingElements = teamUsed.filter(
      (element) => !value.includes(element),
    );
    if (position !== null) {
      fragment = getFragment(value, position);
    }
    const matchingSuggestions = missingElements.filter((element) =>
      [...fragment].every((char) =>
        element.toLowerCase().includes(char.toLowerCase()),
      ),
    );

    return SortSuggestionList(matchingSuggestions, fragment);
  };

  const getFragment = (text: string, position: number): string => {
    let start = position;

    // Expand to the left to find the start of the word
    while (start > 0 && /[\w()]/.test(text[start - 1])) {
      start -= 1;
    }
    // Expand to the right to find the end of the word
    // while (end < text.length && /\w/.test(text[end])) {
    //   end += 1;
    // }
    return text.slice(start, position);
  };

  const hasError = (gym: string, index: number): boolean => {
    if (
      errorData &&
      errorData.some(
        (element) => element.index === index && element.gym === gym,
      )
    ) {
      return true;
    } else return false;
  };

  return (
    <form className="rounded-lg">
      <div className="rounded-lg bg-gray-600 shadow">
        <div className="flex flex-col">
          {filteredGym?.variations?.map((variation, index) => {
            {
              /* Shows the variation of the teams of the gym leaders */
            }
            const lead = routeGym.leads.find(
              (element: Leads) => element.variationId === variation.variationId,
            );
            return (
              <div
                key={variation.variationId}
                className={`leads-variants my-2 w-full ${index !== 0 ? 'border-t-4 border-gray-300' : ''}`}
              >
                <div className="my-4 flex w-full flex-row items-center">
                  {variation.pokemons.map((pokemon) => (
                    <div
                      key={pokemon.pokemonid}
                      className="flex w-full flex-col items-center rounded-lg 2xl:mx-6"
                    >
                      <div className="image-container flex items-center justify-center overflow-hidden rounded-full bg-gray-300">
                        <Svg
                          key={pokemon.pokemonid}
                          name={getPokemonNumber(pokemon.name)}
                          width={50}
                          height={50}
                          color="brown"
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mb-2 w-full">
                  <div className="flex flex-col space-y-2 md:ml-24 md:mt-4 md:flex-row md:items-center md:justify-start md:space-x-2 md:space-y-0">
                    <input
                      id={`isOrderMandatory.${variation.variationId - 1}`}
                      type="checkbox"
                      name={`isOrderMandatory.${variation.variationId - 1}`}
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 sm:h-3 sm:w-3 md:h-4 md:w-4 lg:h-5 lg:w-5"
                      checked={lead?.isOrderMandatory}
                      onChange={(e) => handleCheckboxChange(e, routeGym.id)}
                    />
                    <label className="text-sm" htmlFor="order-checkbox">
                      Order is mandatory
                    </label>
                  </div>
                  <div className="relative flex w-full flex-col items-start md:mt-4 md:flex-row md:justify-start">
                    <label
                      htmlFor="lead"
                      className="mb-2 text-center font-bold md:mr-4 md:w-[8vh] md:text-right"
                    >
                      Lead:
                    </label>
                    <input
                      id={`pokemon.${variation.variationId - 1}`}
                      name={`pokemon.${variation.variationId - 1}`}
                      type="text"
                      value={lead ? lead.pokemon.join(' ') : ''}
                      className={`mx-2 h-[5vh] w-[80%] rounded border ${
                        hasError(routeGym.gym, variation.variationId)
                          ? 'border-2 border-red-600'
                          : 'border-gray-300'
                      } p-2 text-xs text-black md:h-[4vh] md:text-sm`}
                      onChange={(e) => handleChange(e, routeGym.id)}
                      autoComplete="off"
                      onBlur={(e) => handleBlurSuggestion(e, routeGym.id)}
                      onKeyDown={(e) => {
                        const inputElement = document.getElementById(
                          `pokemon.${variation.variationId - 1}`,
                        ) as HTMLInputElement;
                        handleKeyDown(e, routeGym.id, inputElement);
                      }}
                    />
                    {state.displayItems &&
                    state.inputName ===
                      `pokemon.${variation.variationId - 1}` &&
                    lead!.pokemon.join(' ') &&
                    state.filteredItems.length ? (
                      <div className="absolute left-24 top-full z-40 border border-gray-300 bg-red-500 text-black shadow-md">
                        <SuggestionBox
                          filteredItems={state.filteredItems}
                          itemRefs={itemRefs}
                          activeItem={state.activeItem}
                          handleClick={(e) => {
                            const inputElement = document.getElementById(
                              `pokemon.${variation.variationId - 1}`,
                            ) as HTMLInputElement;
                            handleClickSuggestion(e, routeGym.id, inputElement);
                          }}
                        />
                      </div>
                    ) : (
                      <></>
                    )}
                  </div>
                  <div className="mt-4 flex w-full flex-col items-start md:flex-row md:justify-start">
                    <label
                      htmlFor="attacks"
                      className="mb-2 text-center font-bold md:mr-4 md:w-[8vh] md:text-right"
                    >
                      Attacks:
                    </label>
                    <textarea
                      id="attacks"
                      name={`attacks.${variation.variationId - 1}`}
                      value={lead ? lead.attacks : ''}
                      className="mx-2 h-[14vh] w-[80%] rounded border p-2 text-xs text-black md:h-[10vh] md:text-sm"
                      onChange={(e) => handleChange(e, routeGym.id)}
                      autoComplete="off"
                    />
                  </div>
                </div>
                {/* Action Content Area */}
              </div>
            );
          })}
        </div>
        <div className="p-4">
          <div className="mb-4">
            <label className="space-y-4 text-base font-bold md:text-lg">
              Next steps:
            </label>
          </div>
          <div className="flex flex-col space-y-4">
            <div className="flex flex-row">
              <label className="mr-2 w-[20%] justify-center text-xs font-bold md:text-sm">
                Swap Items:
              </label>
              {swapItems.map((swapItem, index) => (
                <div key={index} className="mr-6 flex items-center">
                  {/* Pokémon Selection */}
                  <select
                    id={`pokemonSelect-${index}`}
                    name="swapItems"
                    value={swapItem.pokemon}
                    onChange={(e) => handlePokemonChange(e, index, routeGym.id)}
                    className="rounded border text-xs text-black focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Pokémon</option>
                    {assignedTeam.team.map((pokemon, pokemonIndex) => (
                      <option key={pokemonIndex} value={pokemon.pokemon}>
                        {pokemon.pokemon}
                      </option>
                    ))}
                  </select>

                  {/* Item Selection */}
                  <select
                    id={`itemSelect-${index}`}
                    name="swapItems"
                    value={swapItem.item}
                    onChange={(e) => handleItemChange(e, index, routeGym.id)}
                    className="rounded border text-xs text-black focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Item</option>
                    {itemsData.map((item, itemIndex) => (
                      <option key={itemIndex} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => removeSwapItem(index, routeGym.id)}
                    className="ml-2 rounded bg-red-500 p-1 text-sm text-white transition duration-200 hover:bg-red-600"
                  >
                    ✖
                  </button>
                </div>
              ))}
              {/* Button to Add More Pairs */}
              <div className="">
                <button
                  type="button"
                  onClick={addSwapItem}
                  className="rounded bg-blue-500 p-2 text-sm text-white transition duration-200 hover:bg-blue-600"
                  disabled={swapItems.length >= 4}
                >
                  +
                </button>
              </div>
            </div>
            <div className="flex flex-row">
              <label className="mr-2 w-[20%] text-xs font-bold md:text-sm">
                Swap Teams:
              </label>
              <label
                htmlFor="yes-swapTeams"
                className="text-xs font-medium  text-gray-900 md:text-sm dark:text-gray-300"
              >
                Yes
              </label>
              <input
                id="yes-swapTeams"
                type="radio"
                value="true"
                name="swapTeams"
                className="ms-2 h-4 w-4 border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600"
                checked={routeGym.swapTeams}
                onChange={(e) => handleChange(e, routeGym.id)}
              />
              <label
                htmlFor="no-swapTeams"
                className="ms-4 text-xs font-medium  text-gray-900 md:text-sm dark:text-gray-300"
              >
                No
              </label>
              <input
                id="no-swapTeams"
                type="radio"
                value="false"
                name="swapTeams"
                className="ms-2 h-4 w-4 border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600"
                checked={!routeGym.swapTeams}
                onChange={(e) => handleChange(e, routeGym.id)}
              />
            </div>
            <div className="flex flex-row">
              <label className=" mr-2 w-[20%] text-xs font-bold md:text-sm">
                Change Channel:
              </label>
              <label
                htmlFor="changeChannel"
                className="text-xs font-medium  text-gray-900 md:text-sm dark:text-gray-300"
              >
                Yes
              </label>
              <input
                id="yes-channelTP"
                type="radio"
                value="true"
                name="channelTP"
                className="ms-2 h-4 w-4 border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600"
                checked={routeGym.channelTP}
                onChange={(e) => handleChange(e, routeGym.id)}
              />
              <label
                htmlFor="no-changeChannel"
                className="ms-4 text-xs font-medium text-gray-900 md:text-sm dark:text-gray-300"
              >
                No
              </label>
              <input
                id="no-channelTP"
                type="radio"
                value="false"
                name="channelTP"
                className="ms-2 h-4 w-4 border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600"
                checked={!routeGym.channelTP}
                onChange={(e) => handleChange(e, routeGym.id)}
              />
            </div>
            <div className="flex flex-row">
              <label className="mr-2 w-[20%] text-xs font-bold md:text-sm">
                Heal:
              </label>
              <label
                htmlFor="heal"
                className="text-xs font-medium text-gray-900 md:text-sm dark:text-gray-300"
              >
                Yes
              </label>
              <input
                id="yes-heal"
                type="radio"
                value="yes"
                name="heal"
                className="ms-2 h-4 w-4 border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600"
                checked={routeGym.heal && !routeGym.provisionalHeal}
                onChange={(e) => handleChange(e, routeGym.id)}
              />
              <label
                htmlFor="no-heal"
                className="ms-4 text-xs font-medium text-gray-900 md:text-sm dark:text-gray-300"
              >
                No
              </label>
              <input
                id="no-heal"
                type="radio"
                value="no"
                name="heal"
                className="ms-2 h-4 w-4 border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600"
                checked={!routeGym.heal && !routeGym.provisionalHeal}
                onChange={(e) => handleChange(e, routeGym.id)}
              />
              <label
                htmlFor="ifneeded-heal"
                className="ml-2 text-xs font-medium text-gray-900 md:ms-4 md:text-sm dark:text-gray-300"
              >
                If needed
              </label>
              <input
                id="ifneeded-heal"
                type="radio"
                value="ifneeded"
                name="heal"
                className="ms-2 h-4 w-4 border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600"
                checked={routeGym.provisionalHeal && !routeGym.heal}
                onChange={(e) => handleChange(e, routeGym.id)}
              />
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

export default ViewRouteEditGym;
