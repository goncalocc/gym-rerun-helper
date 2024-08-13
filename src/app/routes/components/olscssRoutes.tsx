import React, { useEffect, useRef, useState } from 'react';
import ViewRouteEditMain from './ViewRouteEditMain';
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

export const getPokemonNumber = (pokemonName: string): string => {
  const pokemon = pokemonData.find((p) => p.pokemon === pokemonName);
  return pokemon ? pokemon.number : '0';
};

type ScrollDirection = 'next' | 'previous';

const ViewRoute: React.FC<ViewRouteProps> = ({ idProps }) => {
  const [routesData, setRoutesData] = useState<Routes[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const elementsRef = useRef<(HTMLDivElement | null)[]>([]);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [assignedRoute, setAssignedRoute] = useState<Routes | undefined>(
    undefined,
  );
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
      setAssignedRoute(
        localStorageRoutes.find((route) => route.routeId === idProps),
      );
    }
    setIsLoading(false);
  }, []);

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
          (direction === 'next' &&
            elementTop > viewportCenter &&
            distance < minDistance) ||
          (direction === 'previous' &&
            elementTop < viewportCenter &&
            distance < minDistance)
        ) {
          closestIndex = index;
          minDistance = distance;
        }
      }
    }

    // Helper function to wrap index correctly
    const wrapIndex = (index: number, length: number) =>
      (index + length) % length;

    // Calculate new index based on the direction
    const newIndex =
      direction === 'next'
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

  const closeEdit: () => void = () => {
    setEditMode(false);
  };

  const handleClickEdit: () => void = () => {
    setEditMode(true);
  };

  return (
    <div className="variations-container flex p-4">
      {/* Sidebar for Gyms */}
      <div className="z-2 sticky top-4 mb-4 h-[50vh] w-[90vw] min-w-[100px] max-w-[22vw] overflow-y-auto pr-4 lg:mb-0 lg:h-[100vh] lg:w-[15vw]">
        <div className="flex flex-row flex-wrap p-2">
          <button
            className="mr-2 flex-grow rounded bg-blue-500 text-white shadow-lg transition hover:bg-blue-600 lg:px-4 lg:py-2"
            onClick={() => handleClickEdit()}
          >
            Edit
          </button>
          <button
            className="mr-2 flex-grow rounded bg-red-500 text-white shadow-lg transition hover:bg-red-600 lg:px-4 lg:py-2"
            onClick={() => handleNextGym(filteredGymsVariations, 'next')}
          >
            Delete
          </button>
        </div>
        <BookmarksRoute gymsByRegion={gymsByRegion} />
      </div>

      {editMode ? (
        <>
          <ViewRouteEditMain
            assignedRoute={assignedRoute}
            setAssignedRoute={setAssignedRoute}
            onClose={closeEdit}
            routeWithVariations={filteredGymsVariations}
          />
        </>
      ) : (
        <></>
      )}
      {/* Main Content Area */}
      <div className="main-container flex flex-1 flex-col">
        <div className="text-center md-text-base lg:text-lg">
          Route Name: {assignedRoute.routeName}
        </div>
        <div className="flex-1 lg:p-3">
          {filteredGymsVariations.map((gym, index) => (
            <div
              key={index}
              id={gym.id?.toString()}
              className="mb-52"
              ref={(el) => {
                elementsRef.current[index] = el;
              }}
            >
              <div className="gym-container min-w-[70vw] max-w-[95vw] lg:min-w-[20vw] lg:max-w-full rounded-lg bg-gray-900 p-3 shadow-md sm:min-w-[400px]">
                <div className="flex flex-row justify-center items-center text-[4vw] sm:text-[3.5vw] md:text-[3vw] lg:text-xl">
                  <button
                    className="flex h-[8vw] w-[8vw] sm:h-[6vw] sm:w-[6vw] md:h-[5vw] md:w-[5vw] lg:h-6 lg:w-6 items-center justify-center note bg-blue-700 text-[3.5vw] sm:text-[3vw] md:text-[2.5vw] lg:text-lg text-white"
                    onMouseEnter={(event) =>
                      handleMouseEnter(event.currentTarget, index)
                    }
                    onMouseLeave={handleMouseLeave}
                  >
                    ℹ️
                  </button>
                  <p className="flex flex-row justify-center items-center md:text-[4vw] lg:text-[1vw] lg:ml-2">
                    {gym.gym} - {gym.type}
                  </p>
                </div>
                <TooltipRoute index={index} tooltip={tooltip} />
                <div className="mt-4 flex flex-col items-center">
                  {gym.variations?.map((variation) => (
                    <div
                      key={variation.variationId}
                      className="variation-container mb-4 w-full p-2 sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5"
                    >
                      <div className="flex items-center">
                        {variation.pokemons.map((pokemon) => (
                          <div
                            key={pokemon.pokemonid}
                            className="pokemon-container bg-gray-900 mb-2 rounded-lg p-2 shadow-sm w-full flex flex-col items-center"
                          >
                            <div className="mb-2 flex lg:h-16 md:h-11 sm-6 lg:w-16 md:w-11 sm:w-6 items-center justify-center overflow-hidden rounded-full bg-gray-300">
                              <Svg
                                key={pokemon.pokemonid}
                                name={getPokemonNumber(pokemon.name)}
                                size="3rem"
                                color="brown"
                              />
                            </div>
                            <span className="pokemon-stats sm-8 md:w-18 lg:w-28 bg-white text-sm">
                              {pokemon.name}
                            </span>
                            <span
                              className={`pokemon-stats ${getItemColor(pokemon.ability ? pokemon.ability : '--')} sm-8 md:w-18 lg:w-28 text-xs`}
                            >
                              {pokemon.ability ? pokemon.ability : '--'}
                            </span>
                            <span
                              className={`pokemon-stats ${getItemColor(pokemon.item ? pokemon.item : '--')} sm-8 md:w-18 lg:w-28 text-xs`}
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
            </div>
          ))}
          {/* Buttons Container */}
          <div className="buttons-container z-2 fixed bottom-4 flex w-[calc(83.3333%-2rem)] justify-center">
            <div className="buttons-wrapper flex space-x-4">
              <button
                className="rounded bg-blue-500 px-4 py-2 text-white shadow-lg transition hover:bg-blue-600"
                onClick={() =>
                  handleNextGym(filteredGymsVariations, 'previous')
                }
              >
                Previous
              </button>
              <button
                className="rounded bg-blue-500 px-4 py-2 text-white shadow-lg transition hover:bg-blue-600"
                onClick={() => handleNextGym(filteredGymsVariations, 'next')}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewRodute;
