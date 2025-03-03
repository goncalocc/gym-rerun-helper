import { OnFormChange } from '@/app/routes/[routeId]/components/ViewRouteEditMain';
import { Route, SwapItem, Teams } from '@/app/types/types';
import itemsData from '../../../../data/ItemsDictionary';
import { ChangeEvent } from 'react';

interface NextStepsEditGymProps {
  swapItems: SwapItem[];
  routeGym: Route;
  assignedTeam: Teams;
  onFormChange: OnFormChange;
  handleChange: (
    event: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>,
    id: number,
  ) => void;
}

const NextStepsEditGym: React.FC<NextStepsEditGymProps> = ({
  swapItems,
  routeGym,
  assignedTeam,
  onFormChange,
  handleChange,
}) => {
  const handleItemSwapChange = (
    e: React.ChangeEvent<HTMLSelectElement>,
    id: number,
  ) => {
    const fieldName = e.target.name;
    const valueName = e.target.value;
    const [baseField, variation, subfield] = fieldName.split('.');
    const variationIndex = parseInt(variation);
    onFormChange({
      name: baseField as keyof Route,
      value: valueName,
      id,
      subfield: subfield as keyof SwapItem,
      variation: variationIndex,
    });
  };

  const handleAddSwapItem = (routeId: number) => {
    if (swapItems.length < 4) {
      const updatedSwapItems = [...swapItems, { pokemon: '', item: '' }];
      onFormChange({
        name: 'swapItems' as keyof Route,
        value: updatedSwapItems,
        id: routeId,
        variation: swapItems.length + 1,
      });
    }
  };

  const removeSwapItem = (index: number, id: number) => {
    const updatedSwapItems = swapItems.filter((_, i) => i !== index);
    onFormChange({
      name: 'swapItems' as keyof Route,
      value: updatedSwapItems,
      id,
      variation: index,
    });
    return updatedSwapItems;
  };
  return (
    <div className="p-4">
      <div className="mb-4">
        <label className="space-y-4 text-base font-bold md:text-lg">
          Next steps:
        </label>
      </div>
      <div className="flex flex-col space-y-4">
        <div className="flex flex-row">
          <label className="mr-2 w-[20%] justify-center text-xs font-bold md:text-sm">
            Swap Items:
          </label>
          <div className="">
            {/* Button to Add More Pairs */}
            <button
              type="button"
              onClick={() => handleAddSwapItem(routeGym.id)}
              className="rounded bg-blue-500 p-2 text-sm text-white transition duration-200 hover:bg-blue-600"
              disabled={swapItems.length >= 4}
            >
              +
            </button>
          </div>
          {swapItems.map((swapItem, index) => (
            <div key={index} className="mx-4 flex items-center">
              {/* Pokémon Selection */}
              <select
                key={`pokemonSelect-${index}`}
                id={`pokemonSelect-${index}`}
                name={`swapItems.${index}.pokemon`}
                value={swapItem.pokemon}
                onChange={(e) => handleItemSwapChange(e, routeGym.id)}
                className="rounded border text-xs text-black focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Pokémon</option>
                {[...assignedTeam.team, ...assignedTeam.subteam].map(
                  (pokemon, pokemonIndex) => (
                    <option
                      key={pokemonIndex}
                      value={`${pokemon.pokemon} ${pokemon.nickname}`}
                    >
                      {pokemon.pokemon} {pokemon.nickname}
                    </option>
                  ),
                )}
              </select>

              {/* Item Selection */}
              <select
                key={`itemSelect-${index}`}
                id={`itemSelect-${index}`}
                name={`swapItems.${index}.item`}
                value={swapItem.item}
                onChange={(e) => handleItemSwapChange(e, routeGym.id)}
                className="rounded border text-xs text-black focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Item</option>
                {itemsData
                  .slice()
                  .sort((a, b) => a.localeCompare(b))
                  .map((item, itemIndex) => (
                    <option key={itemIndex} value={item}>
                      {item}
                    </option>
                  ))}
              </select>
              <button
                type="button"
                onClick={() => removeSwapItem(index, routeGym.id)}
                className="rounded bg-red-500 p-1 text-sm text-white transition duration-200 hover:bg-red-600"
              >
                ✖
              </button>
            </div>
          ))}
        </div>
        <div className="flex flex-row">
          <label className="mr-2 w-[20%] text-xs font-bold md:text-sm">
            Swap Teams:
          </label>
          <label
            htmlFor="yes-swapTeams"
            className="text-xs font-medium  text-gray-900 md:text-sm dark:text-gray-300"
          >
            Yes
          </label>
          <input
            id="yes-swapTeams"
            type="radio"
            value="true"
            name="swapTeams"
            className="ms-2 h-4 w-4 border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600"
            checked={routeGym.swapTeams}
            onChange={(e) => handleChange(e, routeGym.id)}
          />
          <label
            htmlFor="no-swapTeams"
            className="ms-4 text-xs font-medium  text-gray-900 md:text-sm dark:text-gray-300"
          >
            No
          </label>
          <input
            id="no-swapTeams"
            type="radio"
            value="false"
            name="swapTeams"
            className="ms-2 h-4 w-4 border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600"
            checked={!routeGym.swapTeams}
            onChange={(e) => handleChange(e, routeGym.id)}
          />
        </div>
        <div className="flex flex-row">
          <label className=" mr-2 w-[20%] text-xs font-bold md:text-sm">
            Change Channel:
          </label>
          <label
            htmlFor="changeChannel"
            className="text-xs font-medium  text-gray-900 md:text-sm dark:text-gray-300"
          >
            Yes
          </label>
          <input
            id="yes-channelTP"
            type="radio"
            value="true"
            name="channelTP"
            className="ms-2 h-4 w-4 border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600"
            checked={routeGym.channelTP}
            onChange={(e) => handleChange(e, routeGym.id)}
          />
          <label
            htmlFor="no-changeChannel"
            className="ms-4 text-xs font-medium text-gray-900 md:text-sm dark:text-gray-300"
          >
            No
          </label>
          <input
            id="no-channelTP"
            type="radio"
            value="false"
            name="channelTP"
            className="ms-2 h-4 w-4 border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600"
            checked={!routeGym.channelTP}
            onChange={(e) => handleChange(e, routeGym.id)}
          />
        </div>
        <div className="flex flex-row">
          <label className="mr-2 w-[20%] text-xs font-bold md:text-sm">
            Heal:
          </label>
          <label
            htmlFor="heal"
            className="text-xs font-medium text-gray-900 md:text-sm dark:text-gray-300"
          >
            Yes
          </label>
          <input
            id="yes-heal"
            type="radio"
            value="yes"
            name="heal"
            className="ms-2 h-4 w-4 border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600"
            checked={routeGym.heal && !routeGym.provisionalHeal}
            onChange={(e) => handleChange(e, routeGym.id)}
          />
          <label
            htmlFor="no-heal"
            className="ms-4 text-xs font-medium text-gray-900 md:text-sm dark:text-gray-300"
          >
            No
          </label>
          <input
            id="no-heal"
            type="radio"
            value="no"
            name="heal"
            className="ms-2 h-4 w-4 border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600"
            checked={!routeGym.heal && !routeGym.provisionalHeal}
            onChange={(e) => handleChange(e, routeGym.id)}
          />
          <label
            htmlFor="ifneeded-heal"
            className="ml-2 text-xs font-medium text-gray-900 md:ms-4 md:text-sm dark:text-gray-300"
          >
            If needed
          </label>
          <input
            id="ifneeded-heal"
            type="radio"
            value="ifneeded"
            name="heal"
            className="ms-2 h-4 w-4 border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600"
            checked={routeGym.provisionalHeal && !routeGym.heal}
            onChange={(e) => handleChange(e, routeGym.id)}
          />
          {routeGym.provisionalHeal && (
            <input
              type="text"
              value={routeGym.provisionalHealObs}
              name="provisionalHealObs"
              placeholder="Specify condition"
              className="ml-2 w-[50%] rounded border p-1 text-xs text-black md:text-sm"
              onChange={(e) => handleChange(e, routeGym.id)}
              autoComplete="off"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default NextStepsEditGym;
