import { GymsByRegion } from '@/app/hooks/UseRouteAndTeamData';
import { Routes } from '@/app/types/types';

interface DeleteGymProps {
  propsRoute: Routes;
  setPropsRoute: React.Dispatch<React.SetStateAction<Routes>>;
  id: number;
  handleEnableSaveButton: () => void;
  setLocalGymsByRegion: React.Dispatch<React.SetStateAction<GymsByRegion>>;
}

const deleteGym = ({
  setPropsRoute,
  id,
  handleEnableSaveButton,
  setLocalGymsByRegion,
}: DeleteGymProps): void => {
  setPropsRoute((prevState) => {
    if (!prevState) return prevState;

    const updatedRoute = prevState.route.filter((member) => member.id !== id);
    return {
      ...prevState,
      route: updatedRoute,
    };
  });

  setLocalGymsByRegion((prevGymsByRegion) => {
    const newGymsByRegion = { ...prevGymsByRegion };

    for (const region in newGymsByRegion) {
      newGymsByRegion[region] = newGymsByRegion[region].filter(
        (gym) => gym.id !== id,
      );
      if (newGymsByRegion[region].length === 0) {
        delete newGymsByRegion[region];
      }
    }

    return newGymsByRegion;
  });
  handleEnableSaveButton();
};

export default deleteGym;
