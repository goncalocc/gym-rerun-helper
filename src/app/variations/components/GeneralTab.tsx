import Svg from '@/app/components/Svg';
import gyms from '../../data/gym-variations.json';
import '../../styles/PokemonVariationStyles.css';
import pokemonData from '../../data/PokemonDictionary';
import { useState } from 'react';

type GeneralTabProps = {
  navItems: string;
};

export const GeneralTab: React.FC<GeneralTabProps> = (props) => {
  const { navItems } = props;
  const [activeGym, setActiveGym] = useState<number | null>(null);

  const handleGymClick = (gymId: number) => {
    setActiveGym(gymId);
    const gymElement = document.getElementById(gymId.toString());
    console.log(gymElement);
    if (gymElement) {
      gymElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const getPokemonNumber = (pokemonName: string): string => {
    const pokemon = pokemonData.find((p) => p.pokemon === pokemonName);
    return pokemon ? pokemon.number : '0';
  };

  const filteredGyms = gyms.filter((gym) => gym.region === navItems);

  return (
    <div className="container flex p-4">
      {/* Sidebar for Gyms */}
      <div className="w-1/5 pr-4 sticky top-16 h-[calc(100vh-5rem)] overflow-y-auto z-10 -mt-16">
        <ol className="rounded-lg bg-gray-800 p-2">
          {filteredGyms.map((gym) => (
            <li
              key={gym.id}
              onClick={() => handleGymClick(gym.id)}
              className={`rounded px-4 py-2 hover:bg-gray-700 ${
                activeGym === gym.id ? 'bg-gray-600' : ''
              }`}
            >
              {gym.gym}
            </li>
          ))}
        </ol>
      </div>
      {/* Main Content */}
      <div className="flex-1">
        {filteredGyms.map((gym) => (
          <div key={gym.id} id={gym.id.toString()} className="mb-10">
              <div className="gym-container rounded-lg bg-blue-900 p-3 shadow">
                <div className="mb-3 text-center text-xl">
                  <p>
                    {gym.gym} - {gym.gymtype}
                  </p>
                </div>
                <div className="mt-4 flex flex-col items-center">
                  {gym.variations.map((variation) => (
                    <div
                      key={variation.variationid}
                      className="variation-container mb-4 w-full p-1 sm:w-1/2 md:w-1/3 lg:w-1/4"
                    >
                      {variation.pokemons.map((pokemon) => (
                        <div
                          key={pokemon.pokemonid}
                          className="pokemon-container bg-black-100 mb-1 rounded-lg px-1 py-0.5 shadow"
                        >
                          <div className="pokemon-bg mb-2">
                            <Svg
                              key={pokemon.pokemonid}
                              name={getPokemonNumber(pokemon.name)}
                              size={50}
                              color="brown"
                            />
                          </div>
                          <span className="pokemon-stats w-32">
                            {pokemon.name}
                          </span>
                          <span className="pokemon-stats w-28 text-sm ">
                            {pokemon.ability ? pokemon.ability : '--'}
                          </span>
                          <span className="pokemon-stats w-28 text-sm">
                            {pokemon.item ? pokemon.item : '--'}
                          </span>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GeneralTab;
