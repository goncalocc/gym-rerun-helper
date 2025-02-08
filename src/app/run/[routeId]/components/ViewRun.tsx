import BookmarksRoute from '@/app/routes/[routeId]/components/BookmarksRoute';
import { getPokemonNumber } from '@/app/routes/[routeId]/components/ViewRoute';
import HamburgerMenu from '@/app/utils/HamburgerMenu';
import TooltipRoute from '@/app/routes/[routeId]/components/TooltipRoute';
import RouteVariationPokemon from '@/app/routes/[routeId]/components/RouteVariationPokemon';
import getItemColor from '@/app/utils/ColorDefiner';
import ActionsRoute from '@/app/routes/[routeId]/components/ActionsRoute';
import useHandleScroll from '@/app/hooks/UseHandleScroll';
import useEditModeAndSidebar from '@/app/hooks/UseEditModeAndSidebar';
import useRouteAndTeamData from '@/app/hooks/UseRouteAndTeamData';
import { useEffect, useRef, useState } from 'react';
import { Route } from '@/app/types/types';
import Icon from '@/app/utils/Icon';

const ViewRun: React.FC<{ idProps: string }> = ({ idProps }) => {
  const {
    assignedRoute,
    assignedTeam,
    gymsByRegion,
    filteredGymsVariations,
    isLoading,
    currentGym,
  } = useRouteAndTeamData(idProps);
  const { isSidebarVisible, handleToggleSidebar } = useEditModeAndSidebar();
  const { handleNextGym, elementsRef } = useHandleScroll();

  const [selectedVariations, setSelectedVariations] = useState<
    Map<number, number | null>
  >(new Map());

  const handleClickVariation = (gymIndex: number, variationId: number) => {
    setSelectedVariations((prev) => {
      const newMap = new Map(prev);
      const currentSelection = newMap.get(gymIndex);

      newMap.set(
        gymIndex,
        currentSelection === variationId ? null : variationId,
      );
      return newMap;
    });
  };

  if (isLoading) return <div>Loading...</div>;

  if (!assignedRoute) {
    return <div>Route Not Found</div>;
  }

  return (
    <div className="screen-container flex">
      <div className="toggle-button-container md:hidden">
        <HamburgerMenu handleToggleSidebar={handleToggleSidebar} />
      </div>
      <div
        className={`sidebar left-0 top-0 flex h-screen flex-col space-y-4 bg-gray-800 p-4 text-white md:block md:w-1/5 lg:w-[17%] xl:w-[20%] 2xl:w-[15%] ${isSidebarVisible ? 'block' : 'hidden'}`}
      >
        <div>Next Lead in {currentGym?.gym} Gym:</div>
        <div className="flex flex-row items-center space-x-4">
          {currentGym?.leads[0].pokemon.slice(0, 2).map((entries, index) => {
            const [nameOnly, nickname] = entries.split('(');
            const pokemonItem = assignedTeam?.team.find((member) => {
              if (typeof nickname === 'string') {
                return (
                  member.nickname === nickname.replace(/\)$/, '') &&
                  member.pokemon === nameOnly
                );
              }
              return member.pokemon === nameOnly;
            });
            return (
              <div key={index} className="flex flex-col items-center 2xl:mx-6">
                <Icon
                  key={index}
                  name={nameOnly.toLowerCase()}
                  width={60}
                  height={60}
                />
                <div className="m-1 w-[80px] bg-white text-center text-[6px] text-black sm:w-[80px] sm:text-[8px] md:w-[80px] md:text-[10px] lg:w-[80px] lg:text-[12px]">
                  {nickname ? nickname.replace(')', '') : nameOnly}
                </div>
                <div className="m-1 w-[80px] bg-white text-center text-[6px] text-black sm:w-[80px] sm:text-[8px] md:w-[80px] md:text-[10px] lg:w-[80px] lg:text-[12px]">
                  {pokemonItem?.item ? pokemonItem.item : '--'}
                </div>
              </div>
            );
          })}
        </div>
        <BookmarksRoute gymsByRegion={gymsByRegion} />
      </div>
      {/* Main Content Area */}
      <div className="main-container flex flex-1 flex-col">
        <div className="title-center text-center">
          Route Name: {assignedRoute.routeName}
        </div>
        <div className="flex-1">
          {filteredGymsVariations.map((gym, gymIndex) => (
            <div
              key={gymIndex}
              id={gym.id?.toString()}
              className="margin-end p-3"
              ref={(el) => {
                elementsRef.current[gymIndex] = el;
              }}
            >
              <div className="gym-container rounded-lg bg-gray-900">
                <div className="flex flex-row items-center justify-between">
                  <p className="w-[55%] justify-center">
                    {gym.gym} - {gym.type}
                  </p>
                  <div className="w-[45%]">
                    <TooltipRoute gym={gym} />
                  </div>
                </div>
                {selectedVariations.has(gymIndex) &&
                selectedVariations.get(gymIndex) !== null ? (
                  <div className="flex flex-col">
                    {(() => {
                      const matchingVariation = gym.variations?.find(
                        (variation) =>
                          variation.variationId ===
                          selectedVariations.get(gymIndex),
                      );

                      return matchingVariation ? (
                        <div
                          key={matchingVariation.variationId}
                          onClick={() =>
                            handleClickVariation(
                              gymIndex,
                              matchingVariation.variationId,
                            )
                          }
                          className={`leads-variants my-2 cursor-pointer rounded-lg shadow transition-transform hover:scale-105 ${
                            (gym.variations?.indexOf(matchingVariation) ?? -1) %
                              2 ===
                            0
                              ? 'bg-gray-800 text-white'
                              : 'bg-gray-600 text-gray-200'
                          }`}
                        >
                          <div className="flex w-[55%] flex-row">
                            {matchingVariation.pokemons.map((pokemon) => (
                              <div
                                key={pokemon.pokemonid}
                                className="my-2 flex flex-col items-center 2xl:mx-6"
                              >
                                <RouteVariationPokemon
                                  getPokemonNumber={getPokemonNumber}
                                  name={pokemon.name}
                                  pokemonKey={pokemon.pokemonid}
                                />
                                <span
                                  className={`pokemon-stats ${getItemColor(pokemon.ability ?? '--')}`}
                                >
                                  {pokemon.ability ?? '--'}
                                </span>
                                <span
                                  className={`pokemon-stats text-center ${getItemColor(pokemon.item ?? '--')}`}
                                >
                                  {pokemon.item ?? '--'}
                                </span>
                              </div>
                            ))}
                          </div>
                          <div className="w-full">
                            {/* Action Content Area */}
                            <ActionsRoute
                              leads={gym.leads}
                              variation={matchingVariation}
                            />
                          </div>
                        </div>
                      ) : null;
                    })()}
                  </div>
                ) : (
                  <div className="flex flex-col">
                    {gym.variations?.map((variation, index) => (
                      <div
                        key={variation.variationId}
                        onClick={() =>
                          handleClickVariation(gymIndex, variation.variationId)
                        }
                        className={`leads-variants my-2 cursor-pointer rounded-lg shadow transition-transform hover:scale-105 ${
                          index % 2 === 0
                            ? 'bg-gray-800 text-white'
                            : 'bg-gray-600 text-gray-200'
                        }`}
                      >
                        <div className="flex w-[55%] flex-row">
                          {variation.pokemons.map((pokemon) => (
                            <div
                              key={pokemon.pokemonid}
                              className="my-2 flex flex-col items-center 2xl:mx-6"
                            >
                              <RouteVariationPokemon
                                getPokemonNumber={getPokemonNumber}
                                name={pokemon.name}
                                pokemonKey={pokemon.pokemonid}
                              />
                              <span
                                className={`pokemon-stats ${getItemColor(pokemon.ability ?? '--')}`}
                              >
                                {pokemon.ability ?? '--'}
                              </span>
                              <span
                                className={`pokemon-stats text-center ${getItemColor(pokemon.item ?? '--')}`}
                              >
                                {pokemon.item ?? '--'}
                              </span>
                            </div>
                          ))}
                        </div>
                        <div className="w-full">
                          {/* Action Content Area */}
                          <ActionsRoute
                            leads={gym.leads}
                            variation={variation}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
          {/* Buttons Container */}
          <div className="nextprevious-container z-10">
            <div className="flex space-x-4">
              <button
                className="flex h-6 w-6 items-center justify-center  rounded-full bg-blue-500 text-white transition hover:bg-blue-600 md:h-12 md:w-12"
                onClick={() =>
                  handleNextGym(filteredGymsVariations, 'previous')
                }
              >
                ↑
              </button>
              <button
                className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-500 text-white transition hover:bg-blue-600 md:h-12 md:w-12"
                onClick={() => handleNextGym(filteredGymsVariations, 'next')}
              >
                ↓
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewRun;
