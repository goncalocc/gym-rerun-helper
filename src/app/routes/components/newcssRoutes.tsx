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
    <div className="sidebar">
      <div className="button-container">
        <button
          className="button edit-button"
          onClick={() => handleClickEdit()}
        >
          Edit
        </button>
        <button
          className="button delete-button"
          onClick={() => handleNextGym(filteredGymsVariations, 'next')}
        >
          Delete
        </button>
      </div>
      <BookmarksRoute gymsByRegion={gymsByRegion} />
    </div>
  );
};

export default VidewRoute;
