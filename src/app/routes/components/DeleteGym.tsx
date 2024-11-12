import { Routes } from '../../types/types';

interface DeleteGymProps {
  propsRoute: Routes;
  setPropsRoute: React.Dispatch<React.SetStateAction<Routes | undefined>>;
  id: number;
  handleEnableSaveButton: () => void;
}

const deleteGym = ({
  propsRoute,
  setPropsRoute,
  id,
  handleEnableSaveButton,
}: DeleteGymProps): void => {
  const updatedRoute = propsRoute.route.filter((member) => member.id !== id);
  setPropsRoute({
    ...propsRoute,
    route: updatedRoute,
  });
  handleEnableSaveButton();
};

export default deleteGym;
