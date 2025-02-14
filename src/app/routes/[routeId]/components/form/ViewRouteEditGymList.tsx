import { GymsByRegion } from '@/app/hooks/UseRouteAndTeamData';
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from '@hello-pangea/dnd';
import { SetStateAction } from 'react';
import deleteGym from '../DeleteGym';
import Svg from '@/app/utils/Svg';
import { Routes } from '@/app/types/types';

interface ViewRouteEditGymListProps {
  localGymsByRegion: GymsByRegion;
  setLocalGymsByRegion: React.Dispatch<SetStateAction<GymsByRegion>>;
  handleEnableSaveButton: () => void;
  selectedGym: number | null;
  setSelectedGym: React.Dispatch<SetStateAction<number | null>>;
  propsRoute: Routes;
  setPropsRoute: React.Dispatch<React.SetStateAction<Routes>>;
}

const ViewRouteEditGymList: React.FC<ViewRouteEditGymListProps> = ({
  localGymsByRegion,
  setLocalGymsByRegion,
  handleEnableSaveButton,
  selectedGym,
  setSelectedGym,
  propsRoute,
  setPropsRoute,
}) => {
  const onDragEnd = (result: DropResult) => {
    const { source, destination, type } = result;
    if (!destination) return;

    let updatedGymsByRegion = { ...localGymsByRegion };

    // Moving an entire region
    if (type === 'region') {
      const regionKeys = Object.keys(updatedGymsByRegion);
      const [movedRegion] = regionKeys.splice(source.index, 1);
      regionKeys.splice(destination.index, 0, movedRegion);

      const newOrder = regionKeys.reduce((acc, region) => {
        acc[region] = updatedGymsByRegion[region];
        return acc;
      }, {} as GymsByRegion);

      setLocalGymsByRegion(newOrder); //props
      return;
    }

    // Moving gyms within or between regions
    if (type === 'gym') {
      const sourceRegion = source.droppableId;
      const destRegion = destination.droppableId;

      const sourceGyms = [...updatedGymsByRegion[sourceRegion]];
      const destGyms =
        sourceRegion === destRegion
          ? sourceGyms
          : [...(updatedGymsByRegion[destRegion] || [])];

      const [movedGym] = sourceGyms.splice(source.index, 1);
      movedGym.region = destRegion; // Update the region reference
      destGyms.splice(destination.index, 0, movedGym);

      updatedGymsByRegion = {
        ...updatedGymsByRegion,
        [sourceRegion]: sourceGyms,
        [destRegion]: destGyms,
      };

      setLocalGymsByRegion(updatedGymsByRegion);
      handleEnableSaveButton();
    }
  };

  const handleGymDetails = ({
    selectedGym,
    setSelectedGym,
    id,
  }: {
    selectedGym: number | null;
    setSelectedGym: (id: number | null) => void;
    id: number;
  }) => {
    if (selectedGym === id) {
      setSelectedGym(null);
    } else {
      setSelectedGym(id);
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="regions" type="region">
        {(provided) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="space-y-6"
          >
            {Object.entries(localGymsByRegion).map(
              ([region, gyms], regionIndex) => (
                <Draggable
                  key={`region-${region}`}
                  draggableId={`region-${region}`}
                  index={regionIndex}
                >
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className="rounded-md bg-gray-300 p-4"
                    >
                      {/* Region Header (Draggable) */}
                      <div className="flex items-center justify-between">
                        <h2
                          className="text-lg font-bold"
                          {...provided.dragHandleProps}
                        >
                          {region}
                        </h2>
                      </div>

                      {/* Droppable Gyms Inside Region */}
                      <Droppable droppableId={region} type="gym">
                        {(provided) => (
                          <ul
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            className="mt-2 space-y-2"
                          >
                            {gyms.map((gym, gymIndex) => (
                              <Draggable
                                key={`${region}-${gym.id}`}
                                draggableId={`${region}-${gym.id}`}
                                index={gymIndex}
                              >
                                {(provided) => (
                                  <div
                                    className="flex flex-row"
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                  >
                                    <li
                                      {...provided.dragHandleProps}
                                      className={`w-full rounded px-2 py-1 text-center text-white ${selectedGym === gym.id ? 'bg-gray-700' : 'bg-gray-500'} hover:bg-gray-700`}
                                      onClick={() =>
                                        handleGymDetails({
                                          selectedGym: selectedGym!,
                                          setSelectedGym: setSelectedGym,
                                          id: gym.id,
                                        })
                                      }
                                    >
                                      {gym.gym}
                                    </li>
                                    <button
                                      onClick={() =>
                                        deleteGym({
                                          propsRoute: propsRoute,
                                          setPropsRoute: setPropsRoute,
                                          id: gym.id,
                                          handleEnableSaveButton:
                                            handleEnableSaveButton,
                                          setLocalGymsByRegion:
                                            setLocalGymsByRegion,
                                        })
                                      }
                                    >
                                      <Svg
                                        name="/objects/trash-grey"
                                        width={30}
                                        height={30}
                                        color="brown"
                                      />
                                    </button>
                                  </div>
                                )}
                              </Draggable>
                            ))}
                            {provided.placeholder}
                          </ul>
                        )}
                      </Droppable>
                    </div>
                  )}
                </Draggable>
              ),
            )}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default ViewRouteEditGymList;
