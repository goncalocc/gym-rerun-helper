import { Leads, Route, SwapItem, Team, Teams } from '@/app/types/types';
import Svg from '@/app/utils/Svg';
import { getPokemonNumber } from '../ViewRoute';
import { ChangeEvent, useEffect, useState } from 'react';
import { OnFormChange } from '@/app/routes/[routeId]/components/ViewRouteEditMain';
import { NewErrorsLayout } from '../validateRoutes';
import gymsJson from '../../../../data/gym-variations.json';
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from '@hello-pangea/dnd';
import NextStepsEditGym from './NextStepsEditGym';

export interface ViewRouteEditGymProps {
  routeGym: Route;
  assignedTeam: Teams;
  onFormChange: OnFormChange;
  errorData: NewErrorsLayout[];
  isAutofillChecked: boolean;
  handleEnableSaveButton: () => void;
}
const ViewRouteEditGym: React.FC<ViewRouteEditGymProps> = ({
  routeGym,
  assignedTeam,
  handleEnableSaveButton,
  onFormChange,
  errorData,
  isAutofillChecked,
}) => {
  const filteredGym = gymsJson.find((gym) => gym.id === routeGym.id);
  const [swapItems, setSwapItems] = useState<SwapItem[]>(routeGym.swapItems);
  const [showDropdown, setShowDropdown] = useState<number | null>(null);
  const stringToBoolean = (value: string): boolean => {
    return value === 'true';
  };

  useEffect(() => {
    setSwapItems(routeGym.swapItems);
  }, [routeGym.swapItems]);

  const handleChange = (
    event: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>,
    id: number,
  ) => {
    const { name, value, type } = event.target;
    const processedValue = type === 'radio' ? stringToBoolean(value) : value;

    if (type === 'radio' && name === 'heal') {
      const mappings: Record<
        string,
        {
          heal: boolean;
          provisionalHeal: boolean;
          provisionalHealObs?: string;
        }
      > = {
        ifneeded: { heal: false, provisionalHeal: true },
        yes: { heal: true, provisionalHeal: false, provisionalHealObs: '' },
        no: { heal: false, provisionalHeal: false, provisionalHealObs: '' },
      };

      const selectedOption = mappings[value];
      if (selectedOption) {
        onFormChange({ name: 'heal', value: selectedOption.heal, id });
        onFormChange({
          name: 'provisionalHeal',
          value: selectedOption.provisionalHeal,
          id,
        });
        onFormChange({
          name: 'provisionalHealObs',
          value: selectedOption.provisionalHealObs ?? '',
          id,
        });
      }

      return; // Exit early since the form change has been handled
    }
    // Form change for Lead and Attacks when Autofill is on
    if (name.includes('attacks')) {
      const baseField = name.split('[')[0];
      const variation = parseInt(name.split('[')[1].split(']')[0]);
      const subfield = name.split(']')[1].substring(1);
      if (isAutofillChecked) {
        for (let i = 0; i < 5; i++) {
          onFormChange({
            name: baseField as keyof Route,
            value: processedValue,
            id,
            subfield: subfield as keyof Leads,
            variation: i,
          });
        }
      } else {
        onFormChange({
          name: baseField as keyof Route,
          value: processedValue,
          id,
          subfield: subfield as keyof Leads,
          variation,
        });
      }
    } else {
      onFormChange({ name: name as keyof Route, value: processedValue, id });
    }
  };

  const handleCheckboxChange = (
    event: ChangeEvent<HTMLInputElement>,
    id: number,
    variationId: number,
  ) => {
    const { name, checked } = event.target;
    const leadIndex = routeGym.leads.findIndex(
      (lead) => lead.variationId === variationId,
    );
    if (leadIndex === -1) return;

    // Clone leads array and update the pokemon list
    const updatedLeads = [...routeGym.leads];

    if (isAutofillChecked) {
      updatedLeads.forEach((lead, index) => {
        updatedLeads[index] = {
          ...lead,
          isOrderMandatory: checked,
        };
      });
    } else {
      updatedLeads[leadIndex] = {
        ...updatedLeads[leadIndex],
        isOrderMandatory: checked,
      };
    }

    onFormChange({ name: 'leads', value: updatedLeads, id });
  };

  // const hasError = (gym: string, index: number): boolean => {
  //   if (
  //     errorData &&
  //     errorData.some(
  //       (element) => element.index === index && element.gym === gym,
  //     )
  //   ) {
  //     return true;
  //   } else return false;
  // };

  const onDragEnd = (result: DropResult, variationId: number): void => {
    const { source, destination } = result;

    if (!destination || source.index === destination.index) return;

    const leadIndex = routeGym.leads.findIndex(
      (lead) => lead.variationId === variationId,
    );
    if (leadIndex === -1) return;

    // Clone leads array and update the pokemon list
    const updatedLeads = [...routeGym.leads];
    const updatedPokemonList = [...updatedLeads[leadIndex].pokemon];
    const [reorderedItem] = updatedPokemonList.splice(source.index, 1);
    updatedPokemonList.splice(destination.index, 0, reorderedItem);

    if (isAutofillChecked) {
      // Update all leads
      updatedLeads.forEach((lead, index) => {
        updatedLeads[index] = {
          ...lead,
          pokemon: updatedPokemonList,
        };
      });
    } else {
      updatedLeads[leadIndex] = {
        ...updatedLeads[leadIndex],
        pokemon: updatedPokemonList,
      };
    }
    onFormChange({
      name: 'leads',
      value: updatedLeads,
      id: routeGym.id,
    });
    handleEnableSaveButton();
  };

  // Toggle dropdown visibility
  const toggleDropdown = (variationId: number) => {
    setShowDropdown((prev) => (prev === variationId ? null : variationId));
  };

  // Handle Pokémon selection
  const handlePokemonSelect = (pokemon: string, variationId: number) => {
    const variation = routeGym.leads.find((v) => v.variationId === variationId);
    if (!variation) return;

    const currentPokemon = variation.pokemon ?? [];
    if (currentPokemon.includes(pokemon)) return;
    const updatedPokemonList = [...currentPokemon, pokemon];

    const updatedLeads = routeGym.leads.map((lead) => {
      if (isAutofillChecked) {
        // Apply the updated list to all leads
        return {
          ...lead,
          pokemon: updatedPokemonList,
        };
      } else if (lead.variationId === variationId) {
        // Apply only to the specific lead
        return {
          ...lead,
          pokemon: updatedPokemonList,
        };
      }
      return lead;
    });

    onFormChange({
      name: 'leads' as keyof Route,
      value: updatedLeads,
      id: routeGym.id,
    });

    setShowDropdown(null);
  };

  // Handle Pokémon removal
  const removePokemon = (pokemonRemoved: string, variationId: number) => {
    const variation = routeGym.leads.find((v) => v.variationId === variationId);
    if (!variation) return;

    const currentPokemon = variation.pokemon ?? [];

    const updatedPokemonList = currentPokemon.filter(
      (p) => p !== pokemonRemoved,
    );

    const updatedLeads = routeGym.leads.map((lead) => {
      if (isAutofillChecked) {
        // Apply the updated list to all leads
        return {
          ...lead,
          pokemon: updatedPokemonList,
        };
      } else if (lead.variationId === variationId) {
        // Apply only to the specific lead
        return {
          ...lead,
          pokemon: updatedPokemonList,
        };
      }
      return lead;
    });

    onFormChange({
      name: 'leads' as keyof Route,
      value: updatedLeads,
      id: routeGym.id,
    });
  };

  return (
    <form className="rounded-lg">
      <div className="rounded-lg bg-gray-600 shadow">
        <div className="flex flex-col">
          {filteredGym?.variations?.map((variation, index) => {
            const lead = routeGym.leads.find(
              (element: Leads) => element.variationId === variation.variationId,
            );
            return (
              <div
                key={variation.variationId}
                className={`leads-variants my-2 w-full ${
                  index !== 0 ? 'border-t-4 border-gray-300' : ''
                }`}
              >
                <div className="my-4 flex flex-row items-center">
                  {variation.pokemons.map((pokemon) => (
                    <div
                      key={pokemon.pokemonid}
                      className="flex w-full flex-col items-center rounded-lg 2xl:mx-4"
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
                  {/* Order Mandatory Checkbox */}
                  <div className="flex flex-col space-y-2 md:ml-24 md:mt-4 md:flex-row md:items-center md:justify-start md:space-x-2 md:space-y-0">
                    <input
                      id={`isOrderMandatory.${variation.variationId - 1}`}
                      type="checkbox"
                      name={`isOrderMandatory.${variation.variationId - 1}`}
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 sm:h-3 sm:w-3 md:h-4 md:w-4 lg:h-5 lg:w-5"
                      checked={lead?.isOrderMandatory}
                      onChange={(e) =>
                        handleCheckboxChange(
                          e,
                          routeGym.id,
                          variation.variationId,
                        )
                      }
                    />
                    <label className="text-sm" htmlFor="order-checkbox">
                      Order is mandatory
                    </label>
                  </div>

                  <div className="relative flex w-full flex-col items-start md:mt-4 md:flex-row md:justify-start">
                    <label className="mb-2 text-center font-bold md:mr-2 md:w-[8vh] md:text-right">
                      Lead:
                    </label>

                    {/* Pokémon Display */}
                    <div className="flex w-full max-w-full flex-row items-center space-x-2 rounded-md border p-2">
                      {lead && lead.pokemon.length > 0 ? (
                        <DragDropContext
                          onDragEnd={(result) =>
                            onDragEnd(result, variation.variationId)
                          }
                        >
                          <Droppable
                            droppableId={`droppable-${variation.variationId}`}
                            direction="horizontal"
                          >
                            {(provided) => (
                              <div
                                className="flex flex-row space-x-2"
                                {...provided.droppableProps}
                                ref={provided.innerRef}
                              >
                                {lead.pokemon.map((poke, pokeIndex) => (
                                  <Draggable
                                    key={poke}
                                    draggableId={`draggable-${poke}`}
                                    index={pokeIndex}
                                  >
                                    {(provided) => (
                                      <div
                                        className="flex items-center space-x-1 rounded bg-gray-200 px-2 py-1 text-xs font-semibold text-black"
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                      >
                                        {/* Draggable Handle */}
                                        <div {...provided.dragHandleProps}>
                                          {poke}
                                        </div>

                                        <button
                                          className="ml-1 text-red-500 hover:text-red-700"
                                          onClick={(e) => {
                                            e.preventDefault();
                                            removePokemon(
                                              poke,
                                              variation.variationId,
                                            );
                                          }}
                                        >
                                          ✕
                                        </button>
                                      </div>
                                    )}
                                  </Draggable>
                                ))}
                                {provided.placeholder}
                              </div>
                            )}
                          </Droppable>
                        </DragDropContext>
                      ) : (
                        <span className="text-xs text-gray-500">
                          No Pokémon selected
                        </span>
                      )}
                    </div>

                    <button
                      type="button"
                      className="ml-2 h-[5vh] rounded bg-blue-500 px-3 text-white hover:bg-blue-700"
                      onClick={() => toggleDropdown(variation.variationId)}
                    >
                      +
                    </button>

                    {showDropdown === variation.variationId &&
                      (() => {
                        const leadPokemonSet = new Set(lead?.pokemon || []); // O(m)

                        const filterAvailable = (list: Team[]) =>
                          list.filter((pokemon) => {
                            const pokemonName = pokemon.nickname
                              ? `${pokemon.pokemon}(${pokemon.nickname})`
                              : pokemon.pokemon;

                            return !leadPokemonSet.has(pokemonName); // O(1) lookup
                          });

                        const availableMembers = [
                          ...filterAvailable(assignedTeam.team),
                          ...filterAvailable(assignedTeam.subteam),
                        ];

                        return (
                          <div className="absolute left-24 top-full z-40 w-40 border border-gray-300 bg-white text-black shadow-md">
                            {availableMembers.map((pokemon, index) => (
                              <div
                                key={index}
                                className="cursor-pointer p-2 hover:bg-gray-200"
                                onClick={() =>
                                  handlePokemonSelect(
                                    (() => {
                                      return pokemon.nickname
                                        ? `${pokemon.pokemon}(${pokemon.nickname})`
                                        : pokemon.pokemon;
                                    })(),
                                    variation.variationId,
                                  )
                                }
                              >
                                {pokemon.nickname
                                  ? `${pokemon.pokemon}(${pokemon.nickname})`
                                  : pokemon.pokemon}
                              </div>
                            ))}
                          </div>
                        );
                      })()}
                  </div>

                  {/* Attacks Section */}
                  <div className="mt-4 flex w-full flex-col items-start md:flex-row md:justify-start">
                    <label
                      htmlFor="attacks"
                      className="mb-2 text-center font-bold md:text-right"
                    >
                      Attacks:
                    </label>
                    <textarea
                      id={`leads[${variation.variationId - 1}].attacks`}
                      name={`leads[${variation.variationId - 1}].attacks`}
                      value={lead ? lead.attacks : ''}
                      className="mx-2 h-[14vh] w-full resize-none rounded border p-2 text-xs text-black md:h-[10vh] md:text-sm"
                      onChange={(e) => handleChange(e, routeGym.id)}
                      autoComplete="off"
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div className="flex flex-col p-4">
          <label htmlFor="observations" className="mb-2 text-lg font-semibold">
            Observations:
          </label>
          <textarea
            id="observations"
            name="observations"
            value={routeGym.observations}
            className="h-16 w-full resize-none rounded-lg border border-gray-300 p-3 text-xs text-black shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 md:text-sm"
            onChange={(e) => handleChange(e, routeGym.id)}
            autoComplete="off"
            placeholder="Enter your observations here..."
          />
        </div>
        {/* Next Steps Content */}
        <NextStepsEditGym
          swapItems={swapItems}
          routeGym={routeGym}
          assignedTeam={assignedTeam}
          onFormChange={onFormChange}
          handleChange={handleChange}
        />
      </div>
    </form>
  );
};

export default ViewRouteEditGym;
