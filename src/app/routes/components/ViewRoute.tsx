import React, { useEffect, useState } from 'react';
import { Routes, Route, Gym, Variation, Leads } from '../../types/types';
import gymsJson from '../../data/gym-variations.json';
import Icon from '@/app/utils/Icon';
import Svg from '@/app/utils/Svg';
import '../../styles/PokemonVariationStyles.css';
import pokemonData from '@/app/data/PokemonDictionary';
import getItemColor from '@/app/utils/ColorDefiner';

export interface ViewRouteProps {
  idProps: string;
}

interface RouteWithId extends Route {
  id: number;
}

interface GymsByRegion {
  [region: string]: RouteWithId[];
}

interface FilteredGym {
  leads?: Leads[];
  gym: string;
  gymtype: string;
  region?: string;
  variations?: Variation[]; // Assuming Variation is a defined type
  id?: number;
}

const ViewRoute: React.FC<ViewRouteProps> = ({ idProps }) => {
  const [routesData, setRoutesData] = useState<Routes[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedRegion, setSelectedRegion] = useState<number | null>(null);
  const [activeGym, setActiveGym] = useState<number | null>(null);
  const [activeRegion, setActiveRegion] = useState<number | null>(null);
  // const gymsData = useState<Gym>(JSON.parse(gymsJson);

  const fetchLocalStorageRoutes = (): Routes[] | null => {
    try {
      const data = localStorage.getItem('gymRerunRoutes');
      if (!data) {
        throw new Error('Routes not found in localStorage');
      }
      return JSON.parse(data);
    } catch (error: any) {
      console.error('Error fetching Routes from localStorage:', error.message);
      return null;
    }
  };

  useEffect(() => {
    const localStorageRoutes = fetchLocalStorageRoutes();
    if (localStorageRoutes) {
      setRoutesData(localStorageRoutes);
    }
    setIsLoading(false);
  }, []);

  const handleClickRegion = (index: number) => {
    setSelectedRegion(selectedRegion === index ? null : index);
  };

  const handleClickGym = (gymId: number) => {
    setActiveGym(gymId);
    const gymElement = document.getElementById(gymId.toString());
    if (gymElement) {
      gymElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const assignedRoute: Routes | undefined = routesData.find(
    (route) => route.routeid === idProps,
  );

  const getPokemonNumber = (pokemonName: string): string => {
    const pokemon = pokemonData.find((p) => p.pokemon === pokemonName);
    return pokemon ? pokemon.number : '0';
  };

  const gyms: Gym[] = gymsJson as Gym[]; // Explicitly cast gymsJson to Gym[]

  // Group gyms by region only if assignedRoute is defined
  const gymsByRegion: GymsByRegion = assignedRoute
    ? assignedRoute.route.reduce<GymsByRegion>((acc, gym) => {
        if (!acc[gym.region]) {
          acc[gym.region] = [];
        }
        const matchedGym = gyms.find((gymJson: Gym) => gymJson.gym === gym.gym);
        if (matchedGym) {
          acc[gym.region].push({
            ...gym,
            id: matchedGym.id,
          });
        }
        return acc;
      }, {})
    : {};

  if (!assignedRoute) {
    return <div>Loading...</div>;
  }

  // Filter gyms from gymsJson that are present in assignedRoute
  const filteredGymsVariations: FilteredGym[] = assignedRoute.route
    .filter((gymRoute: Route) =>
      gyms.some((gymJson: Gym) => gymJson.gym === gymRoute.gym),
    )
    .map((matchedGym: Route) => ({
      gym: matchedGym.gym,
      gymtype: matchedGym.type,
      region: gyms.find((gymJson: Gym) => gymJson.gym === matchedGym.gym)
        ?.region,
      variations: gyms.find((gymJson: Gym) => gymJson.gym === matchedGym.gym)
        ?.variations,
      id: gyms.find((gymJson: Gym) => gymJson.gym === matchedGym.gym)?.id,
      channelTP: assignedRoute.route.find(
        (gymRoute: Route) => gymRoute.gym === matchedGym.gym,
      )?.channelTP,
      heal: assignedRoute.route.find(
        (gymRoute: Route) => gymRoute.gym === matchedGym.gym,
      )?.heal,
      leads: assignedRoute.route.find(
        (gymRoute: Route) => gymRoute.gym === matchedGym.gym,
      )?.leads,
      observations: assignedRoute.route.find(
        (gymRoute: Route) => gymRoute.gym === matchedGym.gym,
      )?.observations,
      provisionalHeal: assignedRoute.route.find(
        (gymRoute: Route) => gymRoute.gym === matchedGym.gym,
      )?.provisionalHeal,
      swapItems: assignedRoute.route.find(
        (gymRoute: Route) => gymRoute.gym === matchedGym.gym,
      )?.swapItems,
      swapTeams: assignedRoute.route.find(
        (gymRoute: Route) => gymRoute.gym === matchedGym.gym,
      )?.swapTeams,
    }));

  return (
    <div className="variations-container flex w-full p-4">
    {/* Sidebar for Gyms */}
    <div className="sticky top-4 z-10 h-[calc(100vh)] w-1/6 overflow-y-auto pr-4">
      <ol className="rounded-lg bg-gray-800 p-2">
        {Object.keys(gymsByRegion).map((region, regionIndex) => (
          <li
            key={regionIndex}
            className="rounded px-4 py-2 hover:bg-gray-700"
            onClick={() => handleClickRegion(regionIndex)}
          >
            {regionIndex + 1}. {region}
            {selectedRegion === regionIndex && (
              <ol className="pl-4">
                {gymsByRegion[region].map((gym, gymIndex) => (
                  <li
                    key={gymIndex}
                    className="rounded px-4 py-2 hover:bg-gray-700"
                    onClick={() => handleClickGym(gym.id)}
                  >
                    {gymIndex + 1}. {gym.gym}
                  </li>
                ))}
              </ol>
            )}
          </li>
        ))}
      </ol>
    </div>
    {/* Main Content Area */}
    <div className="main-container flex-row">
      <div className="text-center text-lg">
        Route Name: {assignedRoute.routename}
      </div>
      <div className="h-1/6 flex-1">
        {filteredGymsVariations.map((gym, index) => (
          <div key={index} id={gym.id?.toString()} className="mb-10">
            <div className="gym-container rounded-lg bg-gray-900 p-3 shadow">
              <div className="mb-3 text-center text-xl">
                <p>
                  {gym.gym} - {gym.gymtype}
                </p>
              </div>
              <div className="mt-4 flex flex-col items-center">
                {gym.variations?.map((variation) => (
                  <div
                    key={variation.variationId}
                    className="variation-container mb-4 p-1 sm:w-1/2 md:w-1/3 lg:w-1/4"
                  >
                    <div className="flex items-center">
                      {variation.pokemons.map((pokemon) => (
                        <div
                          key={pokemon.pokemonid}
                          className="pokemon-container bg-black-100 mb-1 rounded-lg px-1 py-0.5 shadow"
                        >
                          <div className="mb-2 flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-gray-300">
                            <Svg
                              key={pokemon.pokemonid}
                              name={getPokemonNumber(pokemon.name)}
                              size={40}
                              color="brown"
                            />
                          </div>
                          <span className="pokemon-stats w-28 bg-white text-sm">
                            {pokemon.name}
                          </span>
                          <span
                            className={`pokemon-stats ${getItemColor(pokemon.ability ? pokemon.ability : '--')} w-28 text-xs`}
                          >
                            {pokemon.ability ? pokemon.ability : '--'}
                          </span>
                          <span
                            className={`pokemon-stats ${getItemColor(pokemon.item ? pokemon.item : '--')} w-28 text-xs`}
                          >
                            {pokemon.item ? pokemon.item : '--'}
                          </span>
                        </div>
                      ))}
                    </div>
                    <div className="text-box ml-4 w-[40rem] flex-shrink-0 rounded-lg bg-gray-800 p-2 text-white shadow">
                      {gym.leads
                        ?.filter(
                          (lead) =>
                            lead.variationId === variation.variationId,
                        )
                        .map((lead) => (
                          <div className="flex flex-row items-center space-x-4">
                            <div className="flex">
                              {lead.pokemon
                                .slice(0, 2)
                                .map((member, index) => (
                                  <React.Fragment key={index}>
                                    <div>
                                      <Icon
                                        name={member.toLowerCase()}
                                        size={50}
                                        color="brown"
                                      />
                                    </div>
                                  </React.Fragment>
                                ))}
                            </div>
                            {lead.pokemon.length > 2 && (
                              <span className="mx-2 items-center text-[18px] leading-[-30px]">
                                +
                              </span>
                            )}
                            {lead.pokemon.length > 2 && (
                              <div className="flex">
                                {lead.pokemon
                                  .slice(2, lead.pokemon.length)
                                  .map((member, index) => (
                                    <React.Fragment key={index}>
                                      <div>
                                        <Icon
                                          name={member.toLowerCase()}
                                          size={50}
                                          color="brown"
                                        />
                                      </div>
                                    </React.Fragment>
                                  ))}
                              </div>
                            )}
                          </div>
                        ))}
                      {gym.leads
                        ?.filter(
                          (lead) =>
                            lead.variationId === variation.variationId,
                        )
                        .map((lead, index) => (
                          <p key={index}>{lead.attacks}</p>
                        ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="changes-section flex flex-col">
              <div className="flex flex-row">
                <div className="rounded-l-lg w-32 bg-purple-500 p-2 text-base text-sm text-white">
                  Next Pair:
                </div>
                <div className="rounded-r-lg flex-grow bg-pink-700 p-2 text-base text-sm text-white">
                  Charizard Blastoise
                </div>
              </div>
              <div className="flex flex-row">
                <div className="rounded-l-lg w-32 bg-purple-500 p-2 text-base text-sm text-white">
                  Change Items:
                </div>
                <div className="rounded-r-lg flex-grow bg-pink-700 p-2 text-base text-sm text-white">
                  Change blastoise to Choice Scarf
                </div>
              </div>
              <div className="flex flex-row">
                <div className="rounded-l-lg w-32 bg-purple-500 p-2 text-base text-sm text-white">
                  Switch Channel:
                </div>
                <div className="rounded-r-lg flex-grow bg-pink-700 p-2 text-base text-sm text-white">
                  Yes
                </div>
              </div>
              <div className="flex flex-row">
                <div className="rounded-l-lg w-32 bg-purple-500 p-2 text-base text-sm text-white">
                  Swap Teams:
                </div>
                <div className="rounded-r-lg flex-grow bg-pink-700 p-2 text-base text-sm text-white">
                  Change to Bulbasaur Eevee Rapidash for Pineco Caterpie Weedle
                </div>
              </div>
              <div className="flex flex-row">
                <div className="rounded-l-lg w-32 bg-purple-500 p-2 text-base text-sm text-white">
                  Heal:
                </div>
                <div className="rounded-r-lg flex-grow bg-pink-700 p-2 text-base text-sm text-white">
                  If Needed
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
  );
};

export default ViewRoute;
