import { GymsByRegion } from '@/app/hooks/UseRouteAndTeamData';
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from '@hello-pangea/dnd';
import { SetStateAction, useState } from 'react';
import deleteGym from '../DeleteGym';
import Svg from '@/app/utils/Svg';
import { Routes } from '@/app/types/types';
import { HandleGymDetailsProps } from '../ViewRouteEditMain';

interface ViewRouteEditGymListProps {
  localGymsByRegion: GymsByRegion;
  setLocalGymsByRegion: React.Dispatch<SetStateAction<GymsByRegion>>;
  handleEnableSaveButton: () => void;
  selectedGym: number | null;
  setSelectedGym: React.Dispatch<SetStateAction<number | null>>;
  propsRoute: Routes;
  setPropsRoute: React.Dispatch<React.SetStateAction<Routes>>;
  handleGymDetails: (props: HandleGymDetailsProps) => void;
}

const ViewRouteEditGymList: React.FC<ViewRouteEditGymListProps> = ({
  localGymsByRegion,
  setLocalGymsByRegion,
  handleEnableSaveButton,
  selectedGym,
  setSelectedGym,
  propsRoute,
  setPropsRoute,
  handleGymDetails,
}) => {
  const [selectedRegion, setSelectedRegion] = useState<number | null>(null);

  const onDragEnd = (result: DropResult) => {
    const { source, destination, type } = result;
    if (!destination) return;

    setLocalGymsByRegion((prevGymsByRegion) => {
      const updatedGymsByRegion = structuredClone(prevGymsByRegion);

      // Moving an entire region
      if (type === 'region') {
        const regionKeys = Object.keys(updatedGymsByRegion);
        const [movedRegion] = regionKeys.splice(source.index, 1);
        regionKeys.splice(destination.index, 0, movedRegion);

        const newOrder = regionKeys.reduce((acc, region) => {
          acc[region] = updatedGymsByRegion[region];
          return acc;
        }, {} as GymsByRegion);

        if (selectedRegion !== null) {
          const newSelectedRegionIndex = regionKeys.indexOf(
            Object.keys(prevGymsByRegion)[selectedRegion],
          );
          setSelectedRegion(newSelectedRegionIndex);
        }

        return newOrder;
      }

      // Moving gyms within or between regions
      if (type === 'gym') {
        const sourceRegion = source.droppableId;
        const destRegion = destination.droppableId;

        // Prevent dragging gyms between regions
        if (sourceRegion !== destRegion) return prevGymsByRegion;

        const sourceGyms = [...updatedGymsByRegion[sourceRegion]];
        const [movedGym] = sourceGyms.splice(source.index, 1);

        // Ensure a deep copy of `leads` inside `movedGym`
        movedGym.leads = structuredClone(movedGym.leads);

        sourceGyms.splice(destination.index, 0, movedGym);

        return {
          ...prevGymsByRegion,
          [sourceRegion]: sourceGyms,
        };
      }

      return prevGymsByRegion; // Fallback
    });

    handleEnableSaveButton();
  };

  const handleClickRegion = (regionIndex: number) => {
    setSelectedRegion(selectedRegion === regionIndex ? null : regionIndex);
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
                      {/* Region Header */}
                      <div className="flex items-center justify-between">
                        <div
                          className="flex cursor-pointer items-center gap-2"
                          onClick={() => handleClickRegion(regionIndex)}
                        >
                          <span className="text-lg">
                            {selectedRegion === regionIndex ? '▼' : '▶'}
                          </span>

                          <span className="text-lg font-bold">{region}</span>
                        </div>
                        <div
                          {...provided.dragHandleProps}
                          className="cursor-grab"
                        >
                          <Svg
                            name="/objects/drag-handle"
                            width={20}
                            height={20}
                            color="gray"
                          />
                        </div>
                      </div>
                      {/* Droppable Gyms Inside Region */}
                      {selectedRegion === regionIndex && (
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
                      )}
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
