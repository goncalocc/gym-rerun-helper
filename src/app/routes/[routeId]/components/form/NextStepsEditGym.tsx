import { OnFormChange } from '@/app/routes/[routeId]/components/ViewRouteEditMain';
import { Route, SwapItem, Teams } from '@/app/types/types';
import itemsData from '../../../../data/ItemsDictionary';
import { ChangeEvent } from 'react';

interface NextStepsEditGymProps {
  swapItems: SwapItem[];
  setSwapItems: React.Dispatch<React.SetStateAction<SwapItem[]>>;
  routeGym: Route;
  assignedTeam: Teams;
  onFormChange: OnFormChange;
  handleChange: <T extends HTMLInputElement | HTMLTextAreaElement>(
    event: ChangeEvent<T>,
    id: number,
  ) => void;
}

const NextStepsEditGym: React.FC<NextStepsEditGymProps> = ({
  swapItems,
  setSwapItems,
  routeGym,
  assignedTeam,
  onFormChange,
  handleChange,
}) => {
  const handlePkmItemSwapChange = (
    e: React.ChangeEvent<HTMLSelectElement>,
    index: number,
    id: number,
  ) => {
    const fieldName = e.target.name;
    const pokemonName = e.target.value;
    const updatedSwapItems = [...swapItems];
    updatedSwapItems[index].pokemon = pokemonName;
    const processedValue = updatedSwapItems.filter(
      (item) => item.pokemon !== '' || item.item !== '',
    );
    onFormChange({
      name: fieldName as keyof Route,
      value: processedValue,
      id,
    });
  };

  const handleItemSwapChange = (
    e: React.ChangeEvent<HTMLSelectElement>,
    index: number,
    id: number,
  ) => {
    const fieldName = e.target.name;
    const itemName = e.target.value;
    const updatedSwapItems = [...swapItems];
    updatedSwapItems[index].item = itemName;
    const processedValue = updatedSwapItems.filter(
      (item) => item.pokemon !== '' || item.item !== '',
    );
    onFormChange({
      name: fieldName as keyof Route,
      value: processedValue,
      id,
    });
  };

  const addSwapItem = () => {
    if (swapItems.length < 4) {
      setSwapItems((prev) => [...prev, { pokemon: '', item: '' }]);
    }
  };

  const removeSwapItem = (index: number, id: number) => {
    setSwapItems((prev) => {
      const updatedSwapItems = prev.filter((_, i) => i !== index);
      onFormChange({
        name: 'swapItems' as keyof Route,
        value: updatedSwapItems,
        id,
      });

      return updatedSwapItems;
    });
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
          {swapItems.map((swapItem, index) => (
            <div key={index} className="mr-6 flex items-center">
              {/* Pokémon Selection */}
              <select
                id={`pokemonSelect-${index}`}
                name="swapItems"
                value={swapItem.pokemon}
                onChange={(e) => handlePkmItemSwapChange(e, index, routeGym.id)}
                className="rounded border text-xs text-black focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Pokémon</option>
                {assignedTeam.team.map((pokemon, pokemonIndex) => (
                  <option key={pokemonIndex} value={pokemon.pokemon}>
                    {pokemon.pokemon}
                  </option>
                ))}
              </select>

              {/* Item Selection */}
              <select
                id={`itemSelect-${index}`}
                name="swapItems"
                value={swapItem.item}
                onChange={(e) => handleItemSwapChange(e, index, routeGym.id)}
                className="rounded border text-xs text-black focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Item</option>
                {itemsData.map((item, itemIndex) => (
                  <option key={itemIndex} value={item}>
                    {item}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => removeSwapItem(index, routeGym.id)}
                className="ml-2 rounded bg-red-500 p-1 text-sm text-white transition duration-200 hover:bg-red-600"
              >
                ✖
              </button>
            </div>
          ))}
          {/* Button to Add More Pairs */}
          <div className="">
            <button
              type="button"
              onClick={addSwapItem}
              className="rounded bg-blue-500 p-2 text-sm text-white transition duration-200 hover:bg-blue-600"
              disabled={swapItems.length >= 4}
            >
              +
            </button>
          </div>
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
        </div>
      </div>
    </div>
  );
};

export default NextStepsEditGym;
