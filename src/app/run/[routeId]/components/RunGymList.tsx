import { FilteredGym } from '@/app/hooks/UseRouteAndTeamData';
import { MutableRefObject, useEffect, useState } from 'react';
import TooltipRoute from '@/app/routes/[routeId]/components/TooltipRoute';
import RouteVariationPokemon from '@/app/routes/[routeId]/components/RouteVariationPokemon';
import { getPokemonNumber } from '@/app/routes/[routeId]/components/ViewRoute';
import getItemColor from '@/app/utils/ColorDefiner';
import ActionsRoute from '@/app/routes/[routeId]/components/ActionsRoute';
import ObservationsBar from '@/app/routes/[routeId]/components/ObservationsBar';

interface RunGymListProps {
  filteredGymsVariations: FilteredGym[];
  elementsRef: MutableRefObject<(HTMLDivElement | null)[]>;
}

const RunGymList: React.FC<RunGymListProps> = ({
  filteredGymsVariations: filteredGymsVariations,
  elementsRef: elementsRef,
}) => {
  const [selectedVariations, setSelectedVariations] = useState<
    Map<number, number | null>
  >(new Map());
  const [disableHover, setDisableHover] = useState(false);

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      const screenHeight = window.innerHeight;
      const cursorY = event.clientY;
      if (screenHeight - cursorY < 80) {
        setDisableHover(true);
      } else {
        setDisableHover(false);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

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

  return (
    <div>
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
            <p className="justify-center">
              {gym.gym} - {gym.type}
            </p>
            <div className="flex w-full items-stretch space-x-4">
              <div className="w-[54%]">
                <ObservationsBar observations={gym.observations} />
              </div>
              <div className="w-[46%]">
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
                      className={`leads-variants hover:scale-102 my-2 cursor-pointer rounded-lg shadow transition-transform ${
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
                    className={`leads-variants my-2 cursor-pointer rounded-lg shadow transition-transform ${
                      disableHover ? '' : 'hover:scale-105'
                    } ${
                      index % 2 === 0
                        ? 'bg-gray-800 text-white'
                        : 'bg-gray-600 text-gray-200'
                    }`}
                    title="Click to Focus on this single Gym Variation"
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
                            className={`pokemon-stats ${getItemColor(pokemon.ability?.trim() || '--')}`}
                          >
                            {pokemon.ability?.trim() || '--'}
                          </span>
                          <span
                            className={`pokemon-stats text-center ${getItemColor(pokemon.item?.trim() || '--')}`}
                          >
                            {pokemon.item?.trim() || '--'}
                          </span>
                        </div>
                      ))}
                    </div>
                    <div className="w-full">
                      {/* Action Content Area */}
                      <ActionsRoute leads={gym.leads} variation={variation} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default RunGymList;
