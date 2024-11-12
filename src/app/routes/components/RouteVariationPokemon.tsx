import Svg from '@/app/utils/Svg';
import React from 'react';

export interface RouteVariationPokemonProps {
  getPokemonNumber: (pokemonName: string) => string;
  name: string;
  pokemonKey: number;
}

const RouteVariationPokemon: React.FC<RouteVariationPokemonProps> = ({
  getPokemonNumber,
  name,
  pokemonKey,
}) => {
  return (
    <>
      {' '}
      <div className="image-container flex items-center justify-center overflow-hidden rounded-full bg-gray-300">
        <Svg
          key={pokemonKey}
          name={getPokemonNumber(name)}
          width={50}
          height={50}
          color="brown"
        />
      </div>
      <span className="pokemon-stats bg-white text-center">{name}</span>
    </>
  );
};

export default RouteVariationPokemon;
