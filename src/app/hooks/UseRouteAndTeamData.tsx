import { useState, useEffect, useRef } from 'react';
import {
  Gym,
  Leads,
  Route,
  Routes,
  SwapItem,
  Teams,
  Variation,
} from '../types/types';
import gymsJson from '../data/gym-variations.json';

export interface RouteWithId extends Route {
  id: number;
}

export interface GymsByRegion {
  [region: string]: RouteWithId[];
}

export interface LeadItem {
  pokemon: string;
  nickname?: string;
  item: string;
}

export interface PokemonItemsRoute {
  team: LeadItem[];
}

export interface FilteredGym {
  channelTP: boolean;
  gym: string;
  heal: boolean;
  id: number;
  leads: Leads[];
  observations: string;
  provisionalHeal: boolean;
  provisionalHealObs: string;
  region: string;
  swapItems: SwapItem[];
  swapTeams: boolean;
  type: string;
  variations?: Variation[];
}

const useRouteAndTeamData = (idProps: string) => {
  const [routesData, setRoutesData] = useState<Routes[]>([]);
  const [teamsData, setTeamsData] = useState<Teams[]>([]);
  const [assignedRoute, setAssignedRoute] = useState<Routes>();
  const [pokemonItemsRoute, setPokemonItemsRoute] = useState<
    PokemonItemsRoute[]
  >([]);
  const [assignedTeam, setAssignedTeam] = useState<Teams>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [currentGym, setCurrentGym] = useState<Route | undefined>(undefined);
  const [nextGym, setNextGym] = useState<Route | undefined>(undefined);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const fetchData = () => {
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
          } else {
            throw new Error('Assigned team is not found');
          }
        }
      }
      setIsLoading(false);
    };

    fetchData();
  }, [idProps]);

  useEffect(() => {
    if (!assignedRoute?.route || assignedRoute.route.length === 0) return;

    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.6,
    };

    observerRef.current = new IntersectionObserver((entries) => {
      const visibleGym = entries.find((entry) => entry.isIntersecting);
      if (visibleGym) {
        const gymObject = assignedRoute.route.find(
          (gym) => gym.id.toString() === visibleGym.target.id,
        );
        const currentIndex = assignedRoute.route.findIndex(
          (r) => r.id === gymObject?.id,
        );
        const nextGymName = assignedRoute.route[currentIndex + 1];
        const currentGymName = assignedRoute.route[currentIndex];
        setNextGym(nextGymName);
        setCurrentGym(currentGymName);
      }
    }, options);

    assignedRoute.route.forEach(({ id }) => {
      const element = document.getElementById(id.toString());
      if (element) observerRef.current?.observe(element);
    });

    return () => {
      observerRef.current?.disconnect();
    };
  }, [assignedRoute]);

  useEffect(() => {
    if (!assignedRoute || !assignedTeam) return;

    let updatedRoute: PokemonItemsRoute[] = [];
    let currentTeamItems: LeadItem[] = [
      ...assignedTeam.team.map((pokemon) => ({
        pokemon: pokemon.pokemon,
        nickname: pokemon.nickname,
        item: pokemon.item,
      })),
      ...assignedTeam.subteam.map((pokemon) => ({
        pokemon: pokemon.pokemon,
        nickname: pokemon.nickname,
        item: pokemon.item,
      })),
    ];
    assignedRoute.route.forEach((gym) => {
      let updatedTeam = currentTeamItems.map((pkmn) => ({ ...pkmn }));

      gym.swapItems.forEach((swap) => {
        let pokemonToUpdate = updatedTeam.find((pkmn) => {
          // Check if the Pokemon has a nickname
          if (pkmn.nickname) {
            // Format nickname as "Pokemon (Nickname)"
            const formattedNickname = `${pkmn.pokemon} ${pkmn.nickname}`;
            return (
              pkmn.pokemon === swap.pokemon ||
              formattedNickname === swap.pokemon
            );
          } else {
            // If no nickname, just check by Pokemon species
            return pkmn.pokemon === swap.pokemon;
          }
        });

        if (pokemonToUpdate) {
          pokemonToUpdate.item = swap.item; // Update item if found
        }
      });

      // Push the updated team for this gym
      updatedRoute.push({ team: updatedTeam });

      // Update the current tracking list for the next gym
      currentTeamItems = updatedTeam;
    });

    setPokemonItemsRoute(updatedRoute);
  }, [assignedRoute, assignedTeam]);

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

  // Group gyms by region
  const gymsByRegion: GymsByRegion = {};
  // Track region order
  const regionOrder: string[] = [];

  // Only process if assignedRoute exists
  if (assignedRoute?.route) {
    for (const gym of assignedRoute.route) {
      if (!regionOrder.includes(gym.region)) {
        regionOrder.push(gym.region);
      }

      // Initialize the region array if it doesn't exist
      if (!gymsByRegion[gym.region]) {
        gymsByRegion[gym.region] = [];
      }

      // Find the matching gym in the gyms array
      const matchedGym = gyms.find(
        (gymJson) => gymJson.gym === gym.gym && gymJson.id === gym.id,
      );

      // Add the gym to the appropriate region if found
      if (matchedGym) {
        gymsByRegion[gym.region].push({
          ...gym,
          id: matchedGym.id,
        });
      }
    }
  }

  // Filter gyms from gymsJson that are present in assignedRoute
  const filteredGymsVariations: FilteredGym[] =
    assignedRoute?.route?.map((matchedGym) => {
      const gymData = gyms.find(
        (gymJson) =>
          gymJson.gym === matchedGym.gym && gymJson.id === matchedGym.id,
      );

      return {
        gym: matchedGym.gym,
        type: matchedGym.type,
        region: gymData?.region ?? 'Unknown',
        variations: gymData?.variations ?? [],
        id: Number(gymData?.id ?? 0),
        channelTP: matchedGym.channelTP ?? false,
        heal: matchedGym.heal ?? false,
        leads: matchedGym.leads ?? [],
        observations: matchedGym.observations ?? '',
        provisionalHeal: matchedGym.provisionalHeal ?? false,
        provisionalHealObs: matchedGym.provisionalHealObs ?? '',
        swapItems: matchedGym.swapItems ?? [],
        swapTeams: matchedGym.swapTeams ?? false,
      };
    }) || [];

  return {
    routesData,
    teamsData,
    assignedRoute,
    assignedTeam,
    gymsByRegion,
    filteredGymsVariations,
    isLoading,
    setRoutesData,
    setAssignedRoute,
    currentGym,
    nextGym,
    pokemonItemsRoute,
  };
};

export default useRouteAndTeamData;
