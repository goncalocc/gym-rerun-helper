import { Routes, Route, Leads } from '@/app/types/types';
import { FilteredGym } from './ViewRoute';
import Svg from '@/app/utils/Svg';
import { SetStateAction, useEffect, useState } from 'react';
// import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from '@hello-pangea/dnd';
import ViewRouteEditGym from './form/ViewRouteEditGym';

export interface ViewRouteEditMainProps {
  assignedRoute: Routes;
  setAssignedRoute: React.Dispatch<SetStateAction<Routes | undefined>>;
  onClose: () => void;
  routeWithVariations: FilteredGym[];
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
  setAssignedRoute: setAssignedRoute,
  onClose: closeEdit,
  routeWithVariations: routeWithVariations,
}) => {
  const [propsRoute, setPropsRoute] = useState<Routes | undefined>(() =>
    assignedRoute ? JSON.parse(JSON.stringify(assignedRoute)) : undefined,
  );
  const [selectedGyms, setSelectedGyms] = useState<number[]>([]);

  useEffect(() => {
    // Ensure that when assignedRoute changes, propsRoute is updated with a new copy.
    if (assignedRoute) {
      setPropsRoute(JSON.parse(JSON.stringify(assignedRoute)));
    }
  }, [assignedRoute]);

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
          if (
            arrayIndex >=0 &&
            field in updatedGym.leads[arrayIndex]
          ) {
            if (field === 'pokemon' && typeof value === 'string') {
              (updatedGym.leads[arrayIndex][field] as string[]) = value.split(' ');
            } else {
              (updatedGym.leads[arrayIndex][field as keyof Leads] as Leads[keyof Leads]) = value as Leads[keyof Leads];
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
  };

  return (
    <div className="fixed inset-0 z-10 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative mx-auto my-4 h-full max-h-[95%] w-full max-w-[85%] overflow-auto rounded-lg bg-gray-900 p-8">
        <button
          className="absolute right-2 top-2 text-xl text-gray-700 hover:text-gray-900"
          onClick={closeEdit}
        >
          &times;
        </button>
        <div className="flex flex-col items-center">
          <div className="mb-4 w-80 rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-700">
            name: {propsRoute?.routeName}
          </div>
          <div className="map-container w-full">
            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable droppableId="routes">
                {(provided) => (
                  <ul
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="w-full"
                  >
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
                                className="w-56 rounded bg-gray-500 px-4 py-2 text-white hover:bg-gray-700"
                              >
                                {route.gym}
                              </div>
                              <button>
                                <Svg
                                  name="trash-grey"
                                  size="2rem"
                                  color="brown"
                                />
                              </button>
                            </div>
                            <div className="">
                              {selectedGyms?.includes(route.id) && (
                                <ViewRouteEditGym
                                  routeGym={route}
                                  routeWithVariations={routeWithVariations}
                                  onFormChange={onFormChange}
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
    </div>
  );
};

export default ViewRouteEditMain;
