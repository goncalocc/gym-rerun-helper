import { Routes, Route, Leads, Teams } from '@/app/types/types';
import { FilteredGym, HandleRoutesUpdate } from './ViewRoute';
import { NewErrorsLayout, validateRoutes } from './ValidateRoutes';
import Svg from '@/app/utils/Svg';
import { SetStateAction, useEffect, useState } from 'react';
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from '@hello-pangea/dnd';
import ViewRouteEditGym from './form/ViewRouteEditGym';
import { NotificationParams } from '@/app/teams/components/ViewTeams';
import ALL_GYMS from '../../data/gym-variations.json';
import AddGym from './AddGym';
import deleteGym from './DeleteGym';

export interface ViewRouteEditMainProps {
  assignedRoute: Routes;
  assignedTeam: Teams;
  setAssignedRoute: React.Dispatch<SetStateAction<Routes | undefined>>;
  onClose: () => void;
  routeWithVariations: FilteredGym[];
  setNotification: React.Dispatch<React.SetStateAction<NotificationParams>>;
  handleRoutesUpdate: HandleRoutesUpdate;
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
  onClose: closeEdit,
  routeWithVariations: routeWithVariations,
  handleRoutesUpdate: handleRoutesUpdate,
  setNotification: setNotification,
}) => {
  const [propsRoute, setPropsRoute] = useState<Routes | undefined>(() =>
    assignedRoute ? JSON.parse(JSON.stringify(assignedRoute)) : undefined,
  );
  const [selectedGyms, setSelectedGyms] = useState<number[]>([]);
  const [errorData, setErrorData] = useState<NewErrorsLayout[]>([]);
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [openNewGyms, setOpenNewGyms] = useState<boolean>(false);
  const [isDisabled, setIsDisabled] = useState<boolean>(true);

  const missingGyms = ALL_GYMS.filter(
    (gym) => !propsRoute?.route.some((route) => route.gym === gym.gym),
  );

  useEffect(() => {
    if (isSaved) {
      closeEdit();
    }
    // Ensure that when assignedRoute changes, propsRoute is updated with a new copy.
    if (assignedRoute) {
      setPropsRoute(JSON.parse(JSON.stringify(assignedRoute)));
    }
  }, [assignedRoute, isSaved]);

  const handleEnableSaveButton = () => {
    setIsDisabled(false);
  };

  const handleGymDetails = ({
    selectedGyms,
    setSelectedGyms,
    id,
  }: {
    selectedGyms: number[];
    setSelectedGyms: (members: number[]) => void;
    id: number;
  }) => {
    if (selectedGyms.includes(id)) {
      setSelectedGyms(selectedGyms.filter((selectedId) => selectedId !== id));
    } else {
      setSelectedGyms([...selectedGyms, id]);
    }
  };

  const handleNewGymsOpen = () => {
    setOpenNewGyms(!openNewGyms);
  };

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const reorderedRoute = Array.from(propsRoute?.route || []);
    const [removed] = reorderedRoute.splice(result.source.index, 1);
    reorderedRoute.splice(result.destination.index, 0, removed);

    const updatedRoute = {
      ...propsRoute,
      route: reorderedRoute,
    } as Routes;

    setPropsRoute(updatedRoute);
    // setAssignedRoute(updatedRoute);
  };

  const onFormChange = <K extends keyof Route>({
    name,
    value,
    id,
  }: OnFormChangeProps<K>) => {
    setPropsRoute((prevData) => {
      if (!prevData) return prevData;
      const updatedRoute = { ...prevData };

      // update the right gym
      const routeIndex = updatedRoute.route?.findIndex(
        (route) => route.id === id,
      );

      const [field, subfield] = name.split('.');
      if (routeIndex !== undefined && routeIndex !== -1) {
        const updatedGym = { ...updatedRoute.route![routeIndex] };

        if (subfield) {
          const arrayIndex = parseInt(subfield);
          if (arrayIndex >= 0 && field in updatedGym.leads[arrayIndex]) {
            if (field === 'pokemon' && typeof value === 'string') {
              (updatedGym.leads[arrayIndex][field] as string[]) =
                value.split(' ');
            } else {
              (updatedGym.leads[arrayIndex][
                field as keyof Leads
              ] as Leads[keyof Leads]) = value as Leads[keyof Leads];
            }
          }
        } else {
          updatedGym[name] = value;
        }
        updatedRoute.route![routeIndex] = updatedGym;
      }
      return {
        ...updatedRoute,
        teamId: updatedRoute.teamId ?? '', // Ensure teamId is always a string
        routeName: updatedRoute.routeName ?? '', // Ensure routeName is always a string
        routeId: updatedRoute.routeId ?? '', // Ensure routeId is always a string
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
      // First, perform validations
      if (propsRoute) {
        // Collect errors from all gyms
        const allErrors: NewErrorsLayout[] = [];

        for (let i = 0; i < propsRoute.route.length; i++) {
          // Validate each gym and accumulate errors
          const errors = validateRoutes({
            gymName: propsRoute.route[i].gym,
            leads: propsRoute.route[i].leads,
            assignedTeam: assignedTeam,
          });

          if (errors.length > 0) {
            allErrors.push(...errors);
          }
        }

        // Check if any errors were collected
        if (allErrors.length > 0) {
          // Handle validation errors by displaying all messages
          const errorMessage = allErrors
            .map((error) => error.message)
            .join('\n');
          alert(errorMessage);
          setErrorData((prevState) => [...prevState, ...allErrors]);
        } else {
          // Only update routes if no errors are found
          handleRoutesUpdate(propsRoute, false);

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
      // Handle any unexpected errors during execution
      alert('An unexpected error occurred: ' + error.message);
      // Optional: log or handle other unexpected states
    }
  };

  return (
    <div className="fixed inset-0 z-30 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative my-4 h-full max-h-[95%] w-full max-w-[85%] overflow-auto rounded-lg bg-gray-900 p-8">
        <button
          className="absolute right-2 top-2 text-2xl text-gray-700 hover:text-gray-900 sm:text-xl"
          onClick={closeEdit}
        >
          &times;
        </button>
        <div className="flex flex-col items-center">
          <div className="mb-4 w-[99%] w-full rounded bg-blue-500 px-4 py-2 text-center text-base text-white hover:bg-blue-700 md:w-3/5 md:text-lg lg:w-6/12 lg:text-xl xl:w-2/5 2xl:w-[30%]">
            {propsRoute?.routeName}
          </div>
          <div className="map-container w-full">
            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable droppableId="routes">
                {(provided) => (
                  <ul
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className=""
                  >
                    <AddGym
                      openNewGyms={openNewGyms}
                      setOpenNewGyms={setOpenNewGyms}
                      propsRoute={propsRoute}
                      setPropsRoute={setPropsRoute}
                      handleEnableSaveButton={handleEnableSaveButton}
                    ></AddGym>
                    {propsRoute?.route.map((route, index) => (
                      <Draggable
                        key={route.id}
                        draggableId={route.id.toString()}
                        index={index}
                      >
                        {(provided) => (
                          <div className="">
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className="mb-4 flex justify-center"
                            >
                              <div
                                onClick={() =>
                                  handleGymDetails({
                                    selectedGyms: selectedGyms!,
                                    setSelectedGyms: setSelectedGyms,
                                    id: route.id,
                                  })
                                }
                                className="w-[65%] rounded bg-gray-500 px-4 py-2 text-center text-sm text-white hover:bg-gray-800 md:w-[45%] md:text-base lg:w-[45%] lg:text-lg xl:w-[20%] 2xl:w-[15%]"
                              >
                                {route.gym}
                              </div>
                              <button
                                className=""
                                onClick={() =>
                                  deleteGym({
                                    propsRoute: propsRoute,
                                    setPropsRoute: setPropsRoute,
                                    id: route.id,
                                    handleEnableSaveButton:
                                      handleEnableSaveButton,
                                  })
                                }
                              >
                                <Svg
                                  name="trash-grey"
                                  width={40}
                                  height={40}
                                  color="brown"
                                />
                              </button>
                            </div>
                            <div className="mb-8">
                              {selectedGyms?.includes(route.id) && (
                                <ViewRouteEditGym
                                  routeGym={route}
                                  routeWithVariations={routeWithVariations}
                                  assignedTeam={assignedTeam}
                                  onFormChange={onFormChange}
                                  errorData={errorData}
                                />
                              )}
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </ul>
                )}
              </Droppable>
            </DragDropContext>
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
