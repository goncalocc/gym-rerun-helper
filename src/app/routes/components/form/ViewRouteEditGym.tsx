import { Gym, Leads, Route } from '@/app/types/types';
import { FilteredGym } from '../ViewRoute';
import Svg from '@/app/utils/Svg';
import { getPokemonNumber } from '../ViewRoute';
import { ChangeEvent } from 'react';
import { OnFormChange } from '@/app/routes/components/ViewRouteEditMain';
import RouteVariationPokemon from '../RouteVariationPokemon';
import { NewErrorsLayout } from '../validateRoutes';
import gymsJson from '../../../data/gym-variations.json';

export interface ViewRouteEditGymProps {
  routeGym: Route;
  routeWithVariations: FilteredGym[];
  onFormChange: OnFormChange;
  errorData: NewErrorsLayout[];
}

const ViewRouteEditGym: React.FC<ViewRouteEditGymProps> = ({
  routeGym: routeGym,
  routeWithVariations: routeVariations,
  onFormChange: onFormChange,
  errorData: errorData,
}) => {
  const gyms: Gym[] = gymsJson as Gym[]; // Explicitly cast gymsJson to Gym[]
  // const filteredGymsVariations: FilteredGym[] = gyms.map((gym: Gym) => ({
  //   gym: gym.gym,
  //   type: gym.gymtype,
  //   region: gym.region ?? 'Unknown',
  //   variations: gym.variations,
  //   id: gym.id,
  //   channelTP:
  //     routeVariations.find(
  //       (routeVariation: FilteredGym) =>
  //         routeVariation.gym === gym.gym && routeVariation.id === gym.id,
  //     )?.channelTP ?? false,
  //   heal:
  //     routeVariations.find(
  //       (routeVariation: FilteredGym) =>
  //         routeVariation.gym === gym.gym && routeVariation.id === gym.id,
  //     )?.heal ?? false,
  //   leads:
  //     routeVariations.find(
  //       (routeVariation: FilteredGym) =>
  //         routeVariation.gym === gym.gym && routeVariation.id === gym.id,
  //     )?.leads ?? [],
  //   observations:
  //     routeVariations.find(
  //       (routeVariation: FilteredGym) =>
  //         routeVariation.gym === gym.gym && routeVariation.id === gym.id,
  //     )?.observations ?? '',
  //   provisionalHeal:
  //     routeVariations.find(
  //       (routeVariation: FilteredGym) =>
  //         routeVariation.gym === gym.gym && routeVariation.id === gym.id,
  //     )?.provisionalHeal ?? false,
  //   swapItems:
  //     routeVariations.find(
  //       (routeVariation: FilteredGym) =>
  //         routeVariation.gym === gym.gym && routeVariation.id === gym.id,
  //     )?.swapItems ?? '',
  //   swapTeams:
  //     routeVariations.find(
  //       (routeVariation: FilteredGym) =>
  //         routeVariation.gym === gym.gym && routeVariation.id === gym.id,
  //     )?.swapTeams ?? false,
  // }));
  const filteredGym = gymsJson.find((gym) => gym.id === routeGym.id);
  const stringToBoolean = (value: string): boolean => {
    return value === 'true';
  };

  const handleChange = (
    event: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>,
    id: number,
  ) => {
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

  const hasError = (gym: string, index: number): boolean => {
    if (
      errorData &&
      errorData.some(
        (element) => element.index === index && element.gym === gym,
      )
    ) {
      return true;
    } else return false;
  };

  return (
    <form className="rounded-lg">
      <div className="rounded-lg bg-gray-600 shadow">
        <div className="flex flex-col">
          {filteredGym?.variations?.map((variation, index) => {
            {
              /* Shows the variation of the teams of the gym leaders */
            }
            const lead = routeGym.leads.find(
              (element: Leads) => element.variationId === variation.variationId,
            );
            return (
              <div
                key={variation.variationId}
                className={`leads-variants my-2 w-full ${index !== 0 ? 'border-t-4 border-gray-300' : ''}`}
              >
                <div className="my-4 flex w-full flex-row items-center">
                  {variation.pokemons.map((pokemon) => (
                    <div
                      key={pokemon.pokemonid}
                      className="flex w-full flex-col items-center rounded-lg 2xl:mx-6"
                    >
                      <div className="image-container flex items-center justify-center overflow-hidden rounded-full bg-gray-300">
                        <Svg
                          key={pokemon.pokemonid}
                          name={getPokemonNumber(pokemon.name)}
                          width={50}
                          height={50}
                          color="brown"
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mb-2 w-full">
                  <div className="flex w-full flex-grow flex-col items-center md:mt-4 md:flex-row">
                    <label
                      htmlFor="lead"
                      className="mb-2 text-center font-bold md:mr-2 md:w-[8vh] md:text-right"
                    >
                      Lead:
                    </label>
                    <input
                      id="pokemon"
                      name={`pokemon.${variation.variationId - 1}`}
                      type="text"
                      value={lead ? lead.pokemon.join(' ') : ''}
                      className={`mx-2 h-[5vh] w-full rounded border ${hasError(routeGym.gym, variation.variationId) ? 'border-2 border-red-600' : 'border-gray-300'} p-2 text-xs text-black md:h-[4vh] md:text-sm`}
                      onChange={(e) => handleChange(e, routeGym.id)}
                      autoComplete="off"
                    />
                  </div>
                  <div className="mt-4 flex w-full flex-col items-center md:flex-row">
                    <label
                      htmlFor="attacks"
                      className="mb-2 text-center font-bold md:mr-2 md:w-[8vh] md:text-right"
                    >
                      Attacks:
                    </label>
                    <textarea
                      id="attacks"
                      name={`attacks.${variation.variationId - 1}`}
                      value={lead ? lead.attacks : ''}
                      className="mx-2 h-[14vh] w-full rounded border p-2 text-xs text-black md:h-[8vh] md:text-sm"
                      onChange={(e) => handleChange(e, routeGym.id)}
                      autoComplete="off"
                    />
                  </div>
                </div>
                {/* Action Content Area */}
              </div>
            );
          })}
        </div>
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
              <input
                id="swapItems"
                name="swapItems"
                type="text"
                value={routeGym.swapItems}
                className="h-[2.5vh] rounded border p-2 text-xs text-black md:w-1/2 md:text-sm"
                onChange={(e) => handleChange(e, routeGym.id)}
                autoComplete="off"
              />
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
              {/* <div>{routeGym.channelTP ? 'Yes' : 'No'}</div> */}
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
      </div>
    </form>
  );
};

export default ViewRouteEditGym;
