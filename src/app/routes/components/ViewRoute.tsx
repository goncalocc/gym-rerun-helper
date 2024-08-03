import React, { useEffect, useRef, useState } from 'react';
import { Routes, Route, Gym, Variation, Leads } from '../../types/types';
import gymsJson from '../../data/gym-variations.json';
import Svg from '@/app/utils/Svg';
import '../../styles/PokemonVariationStyles.css';
import pokemonData from '@/app/data/PokemonDictionary';
import getItemColor from '@/app/utils/ColorDefiner';
import BookmarksRoute from './BookmarksRoute';
import ActionsRoute from './ActionsRoute';
import TooltipRoute from './TooltipRoute';

export interface ViewRouteProps {
  idProps: string;
}

interface RouteWithId extends Route {
  id: number;
}

export interface GymsByRegion {
  [region: string]: RouteWithId[];
}

export interface FilteredGym {
  channelTP: boolean;
  gym: string;
  heal: boolean;
  id: number;
  leads: Leads[];
  observations: string;
  provisionalHeal: boolean;
  region: string;
  swapItems: string;
  swapTeams: boolean;
  type: string;
  variations?: Variation[]; // Assuming Variation is a defined type
}

export interface StepsBefore {
  swapItems: string;
  heal: boolean;
  provisionalHeal: boolean;
  swapTeams: boolean;
  channelTP: boolean;
}

export interface TooltipProps {
  visible: boolean;
  x: number;
  y: number;
  content: StepsBefore;
  index: number | null;
}

type ScrollDirection = 'next' | 'previous';

const ViewRoute: React.FC<ViewRouteProps> = ({ idProps }) => {
  const [routesData, setRoutesData] = useState<Routes[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const elementsRef = useRef<(HTMLDivElement | null)[]>([]);
  const [tooltip, setTooltip] = useState<TooltipProps>({
    visible: false,
    x: 0,
    y: 0,
    content: {
      swapItems: '',
      heal: false,
      provisionalHeal: false,
      swapTeams: false,
      channelTP: false,
    },
    index: null,
  });

  useEffect(() => {
    const localStorageRoutes = fetchLocalStorageRoutes();
    if (localStorageRoutes) {
      setRoutesData(localStorageRoutes);
    }
    setIsLoading(false);
  }, []);

  const assignedRoute: Routes | undefined = routesData.find(
    (route) => route.routeid === idProps,
  );

  const getPokemonNumber = (pokemonName: string): string => {
    const pokemon = pokemonData.find((p) => p.pokemon === pokemonName);
    return pokemon ? pokemon.number : '0';
  };

  const handleMouseEnter = (
    pokemonElement: HTMLElement,
    index: number | null,
  ) => {
    const rect = pokemonElement.getBoundingClientRect();

    const scrollX = window.scrollX;
    const scrollY = window.scrollY;

    let newIndex = index !== null ? index - 1 : null;

    if (
      newIndex !== null &&
      newIndex >= 0 &&
      newIndex < filteredGymsVariations.length
    ) {
      const nextGym = filteredGymsVariations[newIndex];

      if (
        nextGym.swapItems ||
        nextGym.heal ||
        nextGym.provisionalHeal ||
        nextGym.swapTeams ||
        nextGym.channelTP
      ) {
        setTooltip({
          visible: true,
          x: rect.left - 225 + scrollX,
          y: rect.top + 40 + scrollY,
          content: {
            swapItems: filteredGymsVariations[newIndex].swapItems,
            heal: filteredGymsVariations[newIndex].heal,
            provisionalHeal: filteredGymsVariations[newIndex].provisionalHeal,
            swapTeams: filteredGymsVariations[newIndex].swapTeams,
            channelTP: filteredGymsVariations[newIndex].channelTP,
          },
          index: newIndex,
        });
      }
    }
  };

  const handleMouseLeave = () => {
    setTooltip({
      visible: false,
      x: 0,
      y: 0,
      content: {
        swapItems: '',
        heal: false,
        provisionalHeal: false,
        swapTeams: false,
        channelTP: false,
      },
      index: null,
    });
  };

  const handleScroll = (route: FilteredGym[], direction: ScrollDirection) => {
    let closestIndex = 0;
    let minDistance = Infinity;
  
    const { current: elements } = elementsRef;
    const viewportCenter = window.innerHeight / 2;
  
    for (let index = 0; index < elements.length; index++) {
      const element = elements[index];
      if (element !== null) {
        const elementTop = element.getBoundingClientRect().top;
        const distance = Math.abs(elementTop - viewportCenter);
  
        if (
          (direction === 'next' && elementTop > viewportCenter && distance < minDistance) ||
          (direction === 'previous' && elementTop < viewportCenter && distance < minDistance)
        ) {
          closestIndex = index;
          minDistance = distance;
        }
      }
    }
  
    // Helper function to wrap index correctly
    const wrapIndex = (index: number, length: number) => (index + length) % length;
  
    // Calculate new index based on the direction
    const newIndex = direction === 'next'
      ? wrapIndex(closestIndex, route.length)
      : wrapIndex(closestIndex - 1, route.length);
  
    setCurrentIndex(newIndex);
  
    return newIndex;
  };

  const handleNextGym = (route: FilteredGym[], direction: ScrollDirection) => {
    const nextIndex = handleScroll(route, direction);
    const nextElement = elementsRef.current[nextIndex];

    if (nextElement) {
      nextElement.scrollIntoView({ behavior: 'smooth' });

      // Calculate the position for the tooltip
      const rect = nextElement.getBoundingClientRect();
      const scrollX = window.scrollX;
      const scrollY = window.scrollY;
      const tooltipPos = Math.max(nextIndex - 1, 0); 
      if (
        route[tooltipPos].swapItems ||
        route[tooltipPos].heal ||
        route[tooltipPos].provisionalHeal ||
        route[tooltipPos].swapTeams ||
        route[tooltipPos].channelTP
      ) {
        setTooltip({
          visible: true,
          x: rect.left + 417.5 + scrollX,
          y: rect.top + 52 + scrollY,
          content: {
            swapItems: route[tooltipPos]?.swapItems ?? '',
            heal: route[tooltipPos]?.heal ?? false,
            provisionalHeal: route[tooltipPos]?.provisionalHeal ?? false,
            swapTeams: route[tooltipPos]?.swapTeams ?? false,
            channelTP: route[tooltipPos]?.channelTP ?? false,
          },
          index: tooltipPos,
        });
      }

      // Update the current index
      setCurrentIndex(nextIndex);
    }
  };

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
      type: matchedGym.type,
      region:
        gyms.find((gymJson: Gym) => gymJson.gym === matchedGym.gym)?.region ??
        'Unknown',
      variations: gyms.find((gymJson: Gym) => gymJson.gym === matchedGym.gym)
        ?.variations,
      id: gyms.find((gymJson: Gym) => gymJson.gym === matchedGym.gym)!.id,
      channelTP:
        assignedRoute.route.find(
          (gymRoute: Route) => gymRoute.gym === matchedGym.gym,
        )?.channelTP ?? false,
      heal:
        assignedRoute.route.find(
          (gymRoute: Route) => gymRoute.gym === matchedGym.gym,
        )?.heal ?? false,
      leads:
        assignedRoute.route.find(
          (gymRoute: Route) => gymRoute.gym === matchedGym.gym,
        )?.leads ?? [],
      observations:
        assignedRoute.route.find(
          (gymRoute: Route) => gymRoute.gym === matchedGym.gym,
        )?.observations ?? '',
      provisionalHeal:
        assignedRoute.route.find(
          (gymRoute: Route) => gymRoute.gym === matchedGym.gym,
        )?.provisionalHeal ?? false,
      swapItems:
        assignedRoute.route.find(
          (gymRoute: Route) => gymRoute.gym === matchedGym.gym,
        )?.swapItems ?? '',
      swapTeams:
        assignedRoute.route.find(
          (gymRoute: Route) => gymRoute.gym === matchedGym.gym,
        )?.swapTeams ?? false,
    }));

  return (
    <div className="variations-container flex w-full p-4">
      {/* Sidebar for Gyms */}
      <BookmarksRoute gymsByRegion={gymsByRegion} />
      {/* Main Content Area */}
      <div className="main-container flex-row">
        <div className="text-center text-lg">
          Route Name: {assignedRoute.routename}
        </div>
        <div className="h-1/6 flex-1">
          {filteredGymsVariations.map((gym, index) => (
            <div
              key={index}
              id={gym.id?.toString()}
              className="mb-10"
              ref={(el) => {
                elementsRef.current[index] = el;
              }}
            >
              <div className="gym-container rounded-lg bg-gray-900 p-3 shadow">
                <div className="mb-3 flex flex-row justify-center text-xl">
                  <button
                    className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-700 text-lg text-white"
                    onMouseEnter={(event) =>
                      handleMouseEnter(event.currentTarget, index)
                    }
                    onMouseLeave={handleMouseLeave}
                  >
                    ℹ️
                  </button>
                  <p className="ml-2 text-center">
                    {gym.gym} - {gym.type}
                  </p>
                </div>
                <TooltipRoute index={index} tooltip={tooltip} />
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
                      {/* Action Content Area */}
                      <ActionsRoute leads={gym.leads} variation={variation} />
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex flex-row fixed bottom-4 left-1/2 -translate-x-1/2">
              <button
                className="-translate-x-1/2 transform rounded bg-blue-500 px-4 py-2 text-white shadow-lg transition hover:bg-blue-600"
                onClick={() =>
                  handleNextGym(filteredGymsVariations, 'previous')
                }
              >
                Previous
              </button>
              <button
                className="-translate-x-1/2 transform rounded bg-blue-500 px-4 py-2 text-white shadow-lg transition hover:bg-blue-600"
                onClick={() =>
                  handleNextGym(filteredGymsVariations, 'next')
                }
              >
                Next
              </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ViewRoute;
