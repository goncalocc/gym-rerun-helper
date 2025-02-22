import { FilteredGym } from '@/app/hooks/UseRouteAndTeamData';
import { MutableRefObject } from 'react';
import TooltipRoute from './TooltipRoute';
import RouteVariationPokemon from './RouteVariationPokemon';
import { getPokemonNumber } from './ViewRoute';
import getItemColor from '@/app/utils/ColorDefiner';
import ActionsRoute from './ActionsRoute';
import ObservationsBar from './ObservationsBar';

interface RouteGymListProps {
  filteredGymsVariations: FilteredGym[];
  elementsRef: MutableRefObject<(HTMLDivElement | null)[]>;
}

const RouteGymList: React.FC<RouteGymListProps> = ({
  filteredGymsVariations: filteredGymsVariations,
  elementsRef: elementsRef,
}) => {
  return (
    <div>
      {filteredGymsVariations.map((gym, index) => (
        <div
          key={index}
          id={gym.id?.toString()}
          className="margin-end p-3"
          ref={(el) => {
            elementsRef.current[index] = el;
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
            <div className="flex flex-col">
              {gym.variations?.map((variation, index) => (
                <div
                  key={variation.variationId}
                  className={`leads-variants my-2 rounded-lg shadow ${
                    index % 2 === 0
                      ? 'bg-gray-800 text-white'
                      : 'bg-gray-600 text-gray-200'
                  }`}
                >
                  <div className="flex w-[55%] flex-row">
                    {variation.pokemons.map((pokemon) => (
                      <div
                        key={pokemon.pokemonid}
                        className="my-2 flex flex-col items-center justify-center 2xl:mx-6"
                      >
                        <RouteVariationPokemon
                          getPokemonNumber={getPokemonNumber}
                          name={pokemon.name}
                          pokemonKey={pokemon.pokemonid}
                        />
                        <span
                          className={`pokemon-stats ${getItemColor(pokemon.ability ? pokemon.ability : '--')}`}
                        >
                          {pokemon.ability ? pokemon.ability : '--'}
                        </span>
                        <span
                          className={`pokemon-stats text-center ${getItemColor(pokemon.item ? pokemon.item : '--')}`}
                        >
                          {pokemon.item ? pokemon.item : '--'}
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
          </div>
        </div>
      ))}
    </div>
  );
};

export default RouteGymList;
