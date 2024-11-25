import RouteVariationPokemon from './RouteVariationPokemon';
import React, { useEffect, useRef, useState } from 'react';
import ViewRouteEditMain from './ViewRouteEditMain';
import { Routes, Route, Gym, Variation, Leads, Teams } from '../../types/types';
import gymsJson from '../../data/gym-variations.json';
import '../../styles/PokemonVariationStyles.css';
import pokemonData from '@/app/data/PokemonDictionary';
import getItemColor from '@/app/utils/ColorDefiner';
import BookmarksRoute from './BookmarksRoute';
import ActionsRoute from './ActionsRoute';
import TooltipRoute from './TooltipRoute';
import { NotificationParams } from '@/app/teams/components/ViewTeams';
import NotificationBar from '@/app/utils/NotificationBar';
import deleteRoute from './DeleteRoute';

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

export type HandleRoutesUpdate = (updatedRoute: Routes) => void;

export const getPokemonNumber = (pokemonName: string): string => {
  const pokemon = pokemonData.find((p) => p.pokemon === pokemonName);
  return pokemon ? pokemon.number : '0';
};

type ScrollDirection = 'next' | 'previous';

const ViewRoute: React.FC<ViewRouteProps> = ({ idProps }) => {
  const [routesData, setRoutesData] = useState<Routes[]>([]);
  const [teamsData, setTeamsData] = useState<Teams[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const elementsRef = useRef<(HTMLDivElement | null)[]>([]);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const [isTooltipShowing, setIsTooltipShowing] = useState(false);
  const [assignedRoute, setAssignedRoute] = useState<Routes>();
  const [assignedTeam, setAssignedTeam] = useState<Teams>();
  const [notification, setNotification] = useState<NotificationParams>({
    message: '',
    type: '',
    visible: false,
  });
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
    const localStorageTeams = fetchLocalStorageTeams();
    if (localStorageRoutes) {
      setRoutesData(localStorageRoutes);
      const foundRoute = localStorageRoutes.find(
        (route) => route.routeId === idProps,
      );
      setAssignedRoute(foundRoute);

      if (foundRoute && localStorageTeams) {
        setTeamsData(localStorageTeams);

        const foundTeam = localStorageTeams.find(
          (team) => team.teamId === foundRoute.teamId,
        );
        if (foundTeam) {
          setAssignedTeam(foundTeam);
        }
      }
    }
    setIsLoading(false);
  }, [idProps]);

  const closeNotification = () => {
    setNotification({ message: '', type: '', visible: false });
  };

  const handleToggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible);
  };

  const showTooltipAtFixedPosition = (
    content: StepsBefore,
    index: number,
    offsetX: number = 20, // Small offset from the left edge
    offsetY: number = 60, // Top offset for tooltip
  ) => {
    // Calculate the tooltip position based on the screen size
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;

    // Ensure tooltip doesn't overflow the screen width
    const tooltipWidth = 200;
    let safeX = Math.min(offsetX, screenWidth - tooltipWidth - 20); // padding

    // Ensure tooltip doesn't overflow the screen height
    const tooltipHeight = 100;
    let safeY = Math.min(offsetY, screenHeight - tooltipHeight - 20); // padding

    // Adjust positioning for larger screens
    if (screenWidth > 1024) {
      // 1024px breakpoint for larger screens (e.g., desktops)
      const centerX = screenWidth / 2 - tooltipWidth / 2; // Center horizontally
      safeX = Math.max(centerX, 20); // Ensure it doesn't go too far left
    } else {
      // For smaller screens, ensure the tooltip stays within the view
      safeX = Math.min(offsetX, screenWidth - tooltipWidth - 20); // Padding from right edge
    }

    safeY = Math.min(offsetY, screenHeight - tooltipHeight - 20);

    setTooltip({
      visible: true,
      x: safeX + window.scrollX,
      y: safeY + window.scrollY,
      content: content,
      index: index,
    });
    setIsTooltipShowing(true);
  };

  const handleInfoClick = (index: number) => {
    if (!isTooltipShowing) {
      return handleMouseEnter(index);
    }
    return handleMouseLeave();
  };

  const handleMouseEnter = (index: number | null) => {
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
        showTooltipAtFixedPosition(
          {
            swapItems: filteredGymsVariations[newIndex].swapItems,
            heal: filteredGymsVariations[newIndex].heal,
            provisionalHeal: filteredGymsVariations[newIndex].provisionalHeal,
            swapTeams: filteredGymsVariations[newIndex].swapTeams,
            channelTP: filteredGymsVariations[newIndex].channelTP,
          },
          newIndex,
        );
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
    setIsTooltipShowing(false);
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
      setTimeout(() => {
        const tooltipPos = Math.max(nextIndex - 1, 0);
        if (
          route[tooltipPos].swapItems ||
          route[tooltipPos].heal ||
          route[tooltipPos].provisionalHeal ||
          route[tooltipPos].swapTeams ||
          route[tooltipPos].channelTP
        ) {
          showTooltipAtFixedPosition(
            {
              swapItems: filteredGymsVariations[tooltipPos].swapItems,
              heal: filteredGymsVariations[tooltipPos].heal,
              provisionalHeal:
                filteredGymsVariations[tooltipPos].provisionalHeal,
              swapTeams: filteredGymsVariations[tooltipPos].swapTeams,
              channelTP: filteredGymsVariations[tooltipPos].channelTP,
            },
            tooltipPos,
          );
        }

        // Update the current index
        setCurrentIndex(nextIndex);
      }, 800);
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

  const fetchLocalStorageTeams = (): Teams[] | null => {
    try {
      const data = localStorage.getItem('gymRerunTeam');
      if (!data) {
        throw new Error('Teams not found in localStorage');
      }
      return JSON.parse(data);
    } catch (error: any) {
      console.error('Error fetching Teams from localStorage:', error.message);
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
      gyms.some(
        (gymJson: Gym) =>
          gymJson.gym === gymRoute.gym && gymJson.id === gymRoute.id,
      ),
    )
    .map((matchedGym: Route) => ({
      gym: matchedGym.gym,
      type: matchedGym.type,
      region:
        gyms.find((gymJson: Gym) => gymJson.gym === matchedGym.gym)?.region ??
        'Unknown',
      variations: gyms.find(
        (gymJson: Gym) =>
          gymJson.gym === matchedGym.gym && gymJson.id === matchedGym.id,
      )?.variations,
      id: gyms.find(
        (gymJson: Gym) =>
          gymJson.gym === matchedGym.gym && gymJson.id === matchedGym.id,
      )!.id,
      channelTP:
        assignedRoute.route.find(
          (gymRoute: Route) =>
            gymRoute.gym === matchedGym.gym && gymRoute.id === matchedGym.id,
        )?.channelTP ?? false,
      heal:
        assignedRoute.route.find(
          (gymRoute: Route) =>
            gymRoute.gym === matchedGym.gym && gymRoute.id === matchedGym.id,
        )?.heal ?? false,
      leads:
        assignedRoute.route.find(
          (gymRoute: Route) =>
            gymRoute.gym === matchedGym.gym && gymRoute.id === matchedGym.id,
        )?.leads ?? [],
      observations:
        assignedRoute.route.find(
          (gymRoute: Route) =>
            gymRoute.gym === matchedGym.gym && gymRoute.id === matchedGym.id,
        )?.observations ?? '',
      provisionalHeal:
        assignedRoute.route.find(
          (gymRoute: Route) =>
            gymRoute.gym === matchedGym.gym && gymRoute.id === matchedGym.id,
        )?.provisionalHeal ?? false,
      swapItems:
        assignedRoute.route.find(
          (gymRoute: Route) =>
            gymRoute.gym === matchedGym.gym && gymRoute.id === matchedGym.id,
        )?.swapItems ?? '',
      swapTeams:
        assignedRoute.route.find(
          (gymRoute: Route) =>
            gymRoute.gym === matchedGym.gym && gymRoute.id === matchedGym.id,
        )?.swapTeams ?? false,
    }));

  const closeEdit: () => void = () => {
    setEditMode(false);
  };

  const handleClickEdit: () => void = () => {
    setEditMode(true);
  };

  const handleRoutesUpdate: HandleRoutesUpdate = (updatedRoute) => {
    setRoutesData((prevData) => {
      const updatedRoutes = prevData.map((route) =>
        route.routeId === updatedRoute.routeId
          ? { ...route, ...updatedRoute } // Spread updatedRoute to update the fields correctly
          : route,
      );
      localStorage.setItem('gymRerunRoutes', JSON.stringify(updatedRoutes));
      return updatedRoutes;
    });
    setAssignedRoute((prevData) => ({
      ...prevData,
      ...updatedRoute,
    }));
  };

  return (
    <div className="screen-container flex">
      <div className="relative">
        {notification.visible && (
          <NotificationBar
            message={notification.message}
            type={notification.type}
            onClose={closeNotification}
          />
        )}
      </div>
      <div className="toggle-button-container md:hidden">
        <button className="toggle-button" onClick={() => handleToggleSidebar()}>
          ☰
        </button>
      </div>

      <div
        className={`sidebar left-0 top-0 flex h-screen flex-col space-y-4 bg-gray-800 p-4 text-white md:block md:w-1/5 lg:w-[17%] xl:w-[20%] 2xl:w-[15%] ${isSidebarVisible ? 'block' : 'hidden'}`}
      >
        <div className="button-container">
          <button
            className="button edit-button"
            onClick={() => handleClickEdit()}
          >
            Edit
          </button>
          <button
            className="button delete-button"
            onClick={() =>
              deleteRoute({
                routeId: assignedRoute.routeId,
                setRoutesData,
                routesData,
                setNotification,
              })
            }
          >
            Delete
          </button>
        </div>
        <BookmarksRoute gymsByRegion={gymsByRegion} />
      </div>
      {editMode && assignedTeam ? (
        <>
          <ViewRouteEditMain
            assignedRoute={assignedRoute}
            assignedTeam={assignedTeam}
            setAssignedRoute={setAssignedRoute}
            onClose={closeEdit}
            routeWithVariations={filteredGymsVariations}
            setNotification={setNotification}
            handleRoutesUpdate={handleRoutesUpdate}
          />
        </>
      ) : (
        <></>
      )}
      {/* Main Content Area */}
      <div className="main-container flex flex-1 flex-col">
        <div className="title-center text-center">
          Route Name: {assignedRoute.routeName}
        </div>
        <div className="flex-1">
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
                <div className="flex flex-row justify-center">
                  <button
                    className="button-info rounded-lg"
                    onClick={() => handleInfoClick(index)}
                  >
                    ℹ️
                  </button>
                  <p className="flex flex-row items-center justify-center">
                    {gym.gym} - {gym.type}
                  </p>
                </div>
                <TooltipRoute
                  index={index}
                  tooltip={tooltip}
                  handleMouseLeave={handleMouseLeave}
                />
                <div className="flex flex-col">
                  {gym.variations?.map((variation) => (
                    <div
                      key={variation.variationId}
                      className="leads-variants my-2 w-full"
                    >
                      <div className="flex flex-row">
                        {variation.pokemons.map((pokemon) => (
                          <div
                            key={pokemon.pokemonid}
                            className="my-2 flex w-full flex-col items-center 2xl:mx-6"
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
                              className={`pokemon-stats text-center ${getItemColor(pokemon.item ? pokemon.item : '--')}  `}
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

export default ViewRoute;
