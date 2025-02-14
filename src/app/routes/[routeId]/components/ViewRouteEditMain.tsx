import { Routes, Route, Leads, Teams } from '@/app/types/types';
import { NewErrorsLayout, validateRoutes } from './validateRoutes';
import { SetStateAction, useEffect, useState } from 'react';
import ViewRouteEditGym from './form/ViewRouteEditGym';
import { NotificationParams } from '@/app/teams/components/ViewTeams';
import AddGym from './AddGym';
import handleRoutesUpdate from './HandleRoutesUpdate';
import { FilteredGym, GymsByRegion } from '@/app/hooks/UseRouteAndTeamData';
import ViewRouteEditGymList from './form/ViewRouteEditGymList';

export interface ViewRouteEditMainProps {
  assignedRoute: Routes;
  assignedTeam: Teams;
  setAssignedRoute: React.Dispatch<SetStateAction<Routes | undefined>>;
  setRoutesData: React.Dispatch<SetStateAction<Routes[]>>;
  onClose: () => void;
  routeWithVariations: FilteredGym[];
  setNotification: React.Dispatch<React.SetStateAction<NotificationParams>>;
  gymsByRegion: GymsByRegion;
}

export type OnFormChangeProps<K extends keyof Route> = {
  name: K;
  value: Route[K];
  id: number;
};

export type OnFormChange = <K extends keyof Route>(
  props: OnFormChangeProps<K>,
) => void;

const ViewRouteEditMain: React.FC<ViewRouteEditMainProps> = ({
  assignedRoute: assignedRoute,
  assignedTeam: assignedTeam,
  setAssignedRoute: setAssignedRoute,
  setRoutesData: setRoutesData,
  onClose: closeEdit,
  setNotification: setNotification,
  gymsByRegion: gymsByRegion,
}) => {
  const [propsRoute, setPropsRoute] = useState<Routes>(() =>
    assignedRoute ? JSON.parse(JSON.stringify(assignedRoute)) : undefined,
  );
  const [selectedGym, setSelectedGym] = useState<number | null>(null);
  const [errorData, setErrorData] = useState<NewErrorsLayout[]>([]);
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [openNewGyms, setOpenNewGyms] = useState<boolean>(false);
  const [isDisabled, setIsDisabled] = useState<boolean>(true);
  const [isAutofillChecked, setIsAutofillChecked] = useState(false);
  const [localGymsByRegion, setLocalGymsByRegion] =
    useState<GymsByRegion>(gymsByRegion);

  const handleAutofillCheckbox = () => {
    setIsAutofillChecked(!isAutofillChecked);
  };

  useEffect(() => {
    const updatedRoute = Object.values(localGymsByRegion).flat();

    setPropsRoute((prevPropsRoute) => ({
      ...prevPropsRoute,
      route: updatedRoute,
    }));
  }, [localGymsByRegion]);

  const currentGym = propsRoute?.route.find((gym) => gym.id === selectedGym);

  useEffect(() => {
    if (isSaved) {
      closeEdit();
    }
    if (assignedRoute) {
      setPropsRoute(JSON.parse(JSON.stringify(assignedRoute)));
    }
  }, [assignedRoute, isSaved]);

  const handleEnableSaveButton = () => {
    setIsDisabled(false);
  };

  const handleRouteNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPropsRoute((prev) => ({
      ...prev!,
      routeName: e.target.value,
    }));
    handleEnableSaveButton();
  };

  const onFormChange = <K extends keyof Route>({
    name,
    value,
    id,
  }: OnFormChangeProps<K>) => {
    setPropsRoute((prevData) => {
      if (!prevData) return prevData;
      const updatedRoute = { ...prevData };

      const routeIndex = updatedRoute.route?.findIndex(
        (route) => route.id === id,
      );

      const [field, subfield] = name.split('.');
      if (routeIndex !== undefined && routeIndex !== -1) {
        const updatedGym = structuredClone(updatedRoute.route![routeIndex]);

        if (subfield) {
          const arrayIndex = parseInt(subfield);
          if (arrayIndex >= 0 && field in updatedGym.leads[arrayIndex]) {
            (updatedGym.leads[arrayIndex][
              field as keyof Leads
            ] as Leads[keyof Leads]) = value as Leads[keyof Leads];
          }
        } else {
          updatedGym[name] = value;
        }
        updatedRoute.route![routeIndex] = updatedGym;
      }
      return {
        ...updatedRoute,
        teamId: updatedRoute.teamId ?? '',
        routeName: updatedRoute.routeName ?? '',
        routeId: updatedRoute.routeId ?? '',
        route: updatedRoute.route ?? [],
      };
    });
    handleEnableSaveButton();
  };

  const submitForm = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    event.preventDefault();
    try {
      if (propsRoute) {
        const allErrors: NewErrorsLayout[] = [];

        for (let i = 0; i < propsRoute.route.length; i++) {
          const errors = validateRoutes({
            gymName: propsRoute.route[i].gym,
            leads: propsRoute.route[i].leads,
            assignedTeam: assignedTeam,
          });

          if (errors.length > 0) {
            allErrors.push(...errors);
          }
        }

        if (allErrors.length > 0) {
          const errorMessage = allErrors
            .map((error) => error.message)
            .join('\n');
          alert(errorMessage);
          setErrorData((prevState) => [...prevState, ...allErrors]);
        } else {
          handleRoutesUpdate({
            updatedRoute: propsRoute,
            isDelete: false,
            setRoutesData,
            setAssignedRoute,
          });

          setNotification({
            message: 'Route edited successfully',
            type: 'success',
            visible: true,
          });

          setTimeout(() => {
            setNotification({ message: '', type: '', visible: false });
          }, 3000);

          setIsSaved(true);
        }
      }
    } catch (error: any) {
      alert('An unexpected error occurred: ' + error.message);
    }
  };

  return (
    <div className="fixed inset-0 z-30 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative my-4 h-full max-h-[95%] w-full max-w-[95%] overflow-auto rounded-lg bg-gray-900 p-8">
        <button
          className="absolute right-2 top-2 text-2xl text-gray-700 hover:text-gray-900 sm:text-xl"
          onClick={closeEdit}
        >
          &times;
        </button>
        <div className="flex w-full">
          {/* Sidebar */}
          <div className="mt-[3%] flex-[0.15] border-r border-gray-300 p-4">
            <AddGym
              openNewGyms={openNewGyms}
              setOpenNewGyms={setOpenNewGyms}
              propsRoute={propsRoute}
              setPropsRoute={setPropsRoute}
              handleEnableSaveButton={handleEnableSaveButton}
              setLocalGymsByRegion={setLocalGymsByRegion}
            />
            <ViewRouteEditGymList
              localGymsByRegion={localGymsByRegion}
              setLocalGymsByRegion={setLocalGymsByRegion}
              handleEnableSaveButton={handleEnableSaveButton}
              selectedGym={selectedGym}
              setSelectedGym={setSelectedGym}
              propsRoute={propsRoute}
              setPropsRoute={setPropsRoute}
            />
          </div>

          {/* Main Content */}
          <div className="flex-[0.85] p-4">
            {/* Title Section */}
            <div className="flex flex-col items-center">
              <input
                type="text"
                value={propsRoute?.routeName || ''}
                onChange={handleRouteNameChange}
                className="w-full rounded border px-4 py-2 text-black"
                placeholder="Enter your Route Title"
              />
            </div>
            {currentGym?.gym && (
              <div className="relative mb-4 flex w-full items-center justify-center">
                <div className="mb-2 w-[80%] rounded px-2 py-1 text-center text-white sm:w-[55%] md:w-[35%] lg:w-[25%] xl:w-[20%]">
                  {currentGym.gym}
                </div>

                <div className="absolute right-0 flex items-center space-x-2">
                  <input
                    id="autofill-checkbox"
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 sm:h-5 sm:w-5 md:h-6 md:w-6 lg:h-7 lg:w-7"
                    checked={isAutofillChecked}
                    onChange={handleAutofillCheckbox}
                  />
                  <label
                    className="text-sm text-gray-700"
                    htmlFor="autofill-checkbox"
                  >
                    Autofill all variations
                  </label>
                </div>
              </div>
            )}
            {/* Details Section */}
            <div className="relative flex flex-col">
              {selectedGym &&
                propsRoute.route.find((r) => r.id === selectedGym) && (
                  <ViewRouteEditGym
                    routeGym={
                      propsRoute.route.find((r) => r.id === selectedGym)!
                    }
                    assignedTeam={assignedTeam}
                    onFormChange={onFormChange}
                    errorData={errorData}
                    isAutofillChecked={isAutofillChecked}
                    handleEnableSaveButton={handleEnableSaveButton}
                  />
                )}
            </div>
          </div>
        </div>
      </div>
      <div className="fixed bottom-7 z-10 flex w-full items-center justify-center">
        <div className="flex space-x-4">
          <button
            className={`flex items-center justify-center rounded-lg px-4 py-2 text-sm text-white transition focus:outline-none focus:ring-2 focus:ring-blue-300 sm:px-6 sm:py-3 sm:text-base md:px-8 md:py-4 md:text-lg
            ${isDisabled ? 'cursor-not-allowed bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'}`}
            onClick={submitForm}
            disabled={isDisabled}
          >
            Save
          </button>
          <button
            className="flex items-center justify-center rounded-lg bg-red-500 px-4 py-2 text-sm text-white transition hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-300 sm:px-6 sm:py-3 sm:text-base md:px-8 md:py-4 md:text-lg"
            onClick={closeEdit}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewRouteEditMain;
