import { useEffect, useRef, useState } from 'react';
import { Route, Routes } from '../../types/types';
import ALL_GYMS from '../../data/gym-variations.json';

interface AddGymProps {
  openNewGyms: boolean;
  setOpenNewGyms: React.Dispatch<React.SetStateAction<boolean>>;
  propsRoute: Routes;
  setPropsRoute: React.Dispatch<React.SetStateAction<Routes>>;
  handleEnableSaveButton: () => void;
}

const AddGym = ({
  openNewGyms,
  setOpenNewGyms,
  propsRoute,
  setPropsRoute,
  handleEnableSaveButton,
}: AddGymProps) => {
  const missingGyms = Array.from(
    new Set(
      ALL_GYMS.filter(
        (gym) =>
          !propsRoute?.route.some(
            (route) => route.gym === gym.gym && route.id === gym.id,
          ),
      ).map((gym) => gym.gym),
    ),
  )
    .map((gymName) => ALL_GYMS.find((gym) => gym.gym === gymName))
    .filter((gym): gym is NonNullable<typeof gym> => gym !== undefined);

  const [newGym] = useState({
    observations: '',
    leads: [
      {
        pokemon: [''],
        attacks: '',
        isOrderMandatory: false,
        variationId: 1,
      },
      {
        pokemon: [''],
        attacks: '',
        isOrderMandatory: false,
        variationId: 2,
      },
      {
        pokemon: [''],
        attacks: '',
        isOrderMandatory: false,
        variationId: 3,
      },
      {
        pokemon: [''],
        attacks: '',
        isOrderMandatory: false,
        variationId: 4,
      },
      {
        pokemon: [''],
        attacks: '',
        isOrderMandatory: false,
        variationId: 5,
      },
    ],
    swapItems: '',
    heal: false,
    provisionalHeal: false,
    swapTeams: false,
    channelTP: false,
  });

  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleNewGymsOpen = () => {
    setOpenNewGyms(!openNewGyms);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setOpenNewGyms(false);
    }
  };

  useEffect(() => {
    if (openNewGyms) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [openNewGyms]);

  const handleAddGym = (
    gym: string,
    type: string,
    id: number,
    region: string,
  ) => {
    const mergedGymInfo: Route = { gym, type, id, region, ...newGym };
    if (gym === 'Striaton City') {
      const multipleLeaders = [
        { gym, type: 'Grass', id: id, region, ...newGym },
        { gym, type: 'Fire', id: id + 1, region, ...newGym },
        { gym, type: 'Water', id: id + 2, region, ...newGym },
      ];
      const multipleGymsNeeded = multipleLeaders.filter((gym) => {
        return !propsRoute?.route.some((routeGym) => routeGym.id === gym.id);
      });

      setPropsRoute((prevData) => ({
        ...prevData,
        route: [...prevData.route, ...multipleGymsNeeded],
      }));
    } else {
      setPropsRoute((prevData) => ({
        ...prevData,
        route: [...prevData.route, mergedGymInfo],
      }));
    }
    handleEnableSaveButton();
  };

  return (
    <div className="relative mb-5 flex flex-col items-center" ref={dropdownRef}>
      <button
        className="
            lg:h-15
            lg:w-15 flex items-center 
            justify-center rounded-full 
            bg-blue-500 text-xl text-white 
            shadow-lg transition duration-200
            hover:bg-blue-600 focus:outline-none focus:ring-2
            focus:ring-blue-400 focus:ring-offset-2 sm:h-10
            sm:w-10 sm:text-2xl md:h-12
            md:w-12 md:text-3xl lg:text-4xl
          "
        aria-label="Add"
        onClick={handleNewGymsOpen}
      >
        <span className="font-bold">+</span>
      </button>
      {openNewGyms && missingGyms.length > 0 && (
        <div className="absolute top-full mt-3 w-40 rounded-lg bg-white p-2 shadow-lg">
          <ul className="space-y-2">
            {missingGyms.map((gym) => (
              <li
                key={gym.gym}
                className="flex items-center justify-between rounded p-2 text-black hover:bg-gray-100"
                onClick={() =>
                  handleAddGym(gym.gym, gym.gymtype, gym.id, gym.region)
                }
              >
                {gym.gym}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default AddGym;
