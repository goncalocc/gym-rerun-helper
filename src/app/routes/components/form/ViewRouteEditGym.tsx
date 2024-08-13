import { Leads, Route } from '@/app/types/types';
import { FilteredGym } from '../ViewRoute';
import Svg from '@/app/utils/Svg';
import { getPokemonNumber } from '../ViewRoute';
import { ChangeEvent } from 'react';
import { OnFormChange } from '@/app/routes/components/ViewRouteEditMain';

export interface ViewRouteEditGymProps {
  routeGym: Route;
  routeWithVariations: FilteredGym[];
  onFormChange: OnFormChange;
}

const ViewRouteEditGym: React.FC<ViewRouteEditGymProps> = ({
  routeGym: routeGym,
  routeWithVariations: routeVariations,
  onFormChange: onFormChange,
}) => {
  const filteredGym = routeVariations.find((gym) => gym.id === routeGym.id);
  const stringToBoolean = (value: string): boolean => {
    return value === 'true';
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>, id: number) => {
    const { name, value, type } = event.target;

    if (type === 'radio' && name === 'heal') {
      const mappings: Record<
        string,
        { heal: boolean; provisionalHeal: boolean }
      > = {
        ifneeded: { heal: false, provisionalHeal: true },
        yes: { heal: true, provisionalHeal: false },
        no: { heal: false, provisionalHeal: false },
      };

      const selectedOption = mappings[value];
      if (selectedOption) {
        onFormChange({ name: 'heal', value: selectedOption.heal, id });
        onFormChange({
          name: 'provisionalHeal',
          value: selectedOption.provisionalHeal,
          id,
        });
      }

      return; // Exit early since the form change has been handled
    }

    // For other input types or fields
    const processedValue = type === 'radio' ? stringToBoolean(value) : value;
    onFormChange({ name: name as keyof Route, value: processedValue, id });
    // handleEnableButton();
  };
  return (
    <form className="rounded-lg p-8">
      <div className="rounded-lg bg-gray-600 p-3 shadow">
        <div className="flex flex-col items-start">
          {filteredGym?.variations?.map((variation, index) => {
            const lead = routeGym.leads.find(
              (element: Leads) => element.variationId === variation.variationId,
            );
            return (
              <div
                key={variation.variationId}
                className={`variation-container mb-6 w-full ${index !== 0 ? 'border-t-4 border-gray-300' : ''}`}
              >
                <div className="mt-6 flex w-full flex-row items-center">
                  {variation.pokemons.map((pokemon) => (
                    <div
                      key={pokemon.pokemonid}
                      className="pokemon-container rounded-lg px-1 py-0.5"
                    >
                      <div className="flex h-[10vw] max-h-[80px] w-[10vw] max-w-[80px] items-center justify-center overflow-hidden rounded-full bg-gray-300 mb-2">
                        <Svg
                          key={pokemon.pokemonid}
                          name={getPokemonNumber(pokemon.name)}
                          size="3rem"
                          color="brown"
                        />
                      </div>
                      <span className="pokemon-stats w-28 bg-white text-sm">
                        {pokemon.name}
                      </span>
                    </div>
                  ))}
                  <div className="actions-container mb-4 w-full flex-1 space-y-2">
                    <div className="lead-container flex w-full flex-grow flex-row items-center  md:space-x-2">
                      <label
                        htmlFor="lead"
                        className="mb-2 w-24 text-right font-bold"
                      >
                        Lead:
                      </label>
                      <input
                        id="pokemon"
                        name={`pokemon.${variation.variationId-1}`}
                        type="text"
                        value={lead ? lead.pokemon.join(' ') : ''}
                        className="h-6 w-full flex-grow rounded border p-2 text-sm text-black"
                        onChange={(e) => handleChange(e, routeGym.id)}
                        autoComplete="off"

                      />
                    </div>
                    <div className="attacks-container flex flex-col md:flex-row md:items-center md:space-x-2">
                      <label
                        htmlFor="attacks"
                        className="mb-2 w-24 text-right font-bold"
                      >
                        Attacks:
                      </label>
                      <textarea
                        id="attacks"
                        name={`attacks.${variation.variationId-1}`}
                        value={lead ? lead.attacks : ''}
                        className="h-24 w-full flex-grow rounded border p-2 text-sm text-black"
                        onChange={(e) => handleChange(e, routeGym.id)}
                        autoComplete="off"
                      />
                    </div>
                  </div>
                </div>
                {/* Action Content Area */}
              </div>
            );
          })}
        </div>
        <div className="mt-6">
          <label className="mb-2 font-bold">Next steps:</label>
          <div className="flex flex-col space-y-2">
            <div className="flex flex-row">
              <label className="mr-2 w-[10%] font-bold">Swap Items:</label>
              <input
                id="swapItems"
                name="swapItems"
                type="text"
                value={routeGym.swapItems}
                className="h-6 w-1/2 rounded border text-sm text-black"
                onChange={(e) => handleChange(e, routeGym.id)}
                autoComplete="off"
              />
            </div>
            <div className="flex flex-row">
              <label className="mr-2 w-[10%] font-bold">Swap Teams:</label>
              <label
                htmlFor="yes-swapTeams"
                className="text-sm font-medium text-gray-900 dark:text-gray-300"
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
                className="ms-4 text-sm font-medium text-gray-900 dark:text-gray-300"
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
              <label className="mr-2 w-[10%] font-bold">Change Channel:</label>
              <label
                htmlFor="changeChannel"
                className="text-sm font-medium text-gray-900 dark:text-gray-300"
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
                className="ms-4 text-sm font-medium text-gray-900 dark:text-gray-300"
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
              {/* <div>{routeGym.channelTP ? 'Yes' : 'No'}</div> */}
            </div>
            <div className="flex flex-row">
              <label className="mr-2 w-[10%] font-bold">Heal:</label>
              <label
                htmlFor="heal"
                className="text-sm font-medium text-gray-900 dark:text-gray-300"
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
                className="ms-4 text-sm font-medium text-gray-900 dark:text-gray-300"
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
                className="ms-4 text-sm font-medium text-gray-900 dark:text-gray-300"
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
      </div>
    </form>
  );
};

export default ViewRouteEditGym;
