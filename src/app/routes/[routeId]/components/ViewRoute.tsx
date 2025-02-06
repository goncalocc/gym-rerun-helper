import '../../../styles/PokemonVariationStyles.css';
import RouteVariationPokemon from './RouteVariationPokemon';
import ViewRouteEditMain from './ViewRouteEditMain';
import pokemonData from '@/app/data/PokemonDictionary';
import getItemColor from '@/app/utils/ColorDefiner';
import BookmarksRoute from './BookmarksRoute';
import ActionsRoute from './ActionsRoute';
import TooltipRoute from './TooltipRoute';
import NotificationBar from '@/app/utils/NotificationBar';
import deleteRoute from './DeleteRoute';
import { useRouter } from 'next/navigation';
import HamburgerMenu from '@/app/utils/HamburgerMenu';
import useRouteAndTeamData from '@/app/hooks/UseRouteAndTeamData';
import useEditModeAndSidebar from '@/app/hooks/UseEditModeAndSidebar';
import useHandleScroll from '@/app/hooks/UseHandleScroll';
import useNotification from '@/app/hooks/UseNotification';

export interface ViewRouteProps {
  idProps: string;
  router: ReturnType<typeof useRouter>;
}

export const getPokemonNumber = (pokemonName: string): string => {
  const pokemon = pokemonData.find((p) => p.pokemon === pokemonName);
  return pokemon ? pokemon.number : '0';
};

const ViewRoute: React.FC<ViewRouteProps> = ({ idProps, router }) => {
  const {
    assignedRoute,
    assignedTeam,
    gymsByRegion,
    filteredGymsVariations,
    setRoutesData,
    setAssignedRoute,
    isLoading,
  } = useRouteAndTeamData(idProps);
  const {
    editMode,
    isSidebarVisible,
    handleToggleSidebar,
    closeEdit,
    handleClickEdit,
  } = useEditModeAndSidebar();
  const { notification, setNotification, closeNotification } =
    useNotification();
  const { handleNextGym, elementsRef } = useHandleScroll();

  if (isLoading) return <div>Loading...</div>;

  if (!assignedRoute) {
    return <div>Route Not Found</div>;
  }

  return (
    <div className="screen-container flex">
      <div className="relative">
        {notification.visible && (
          <NotificationBar
            message={notification.message}
            type={notification.type}
            onClose={closeNotification}
          />
        )}
      </div>
      <div className="toggle-button-container md:hidden">
        <HamburgerMenu handleToggleSidebar={handleToggleSidebar} />
      </div>
      <div
        className={`sidebar left-0 top-0 flex h-screen flex-col space-y-4 bg-gray-800 p-4 text-white md:block md:w-1/5 lg:w-[17%] xl:w-[20%] 2xl:w-[15%] ${isSidebarVisible ? 'block' : 'hidden'}`}
      >
        <div className="button-container">
          <button
            className="button edit-button"
            onClick={() => handleClickEdit()}
          >
            Edit
          </button>
          <button
            className="button delete-button"
            onClick={() =>
              deleteRoute({
                setRoutesData,
                assignedRoute,
                setAssignedRoute,
                router,
                assignedTeam,
              })
            }
          >
            Delete
          </button>
        </div>
        <BookmarksRoute gymsByRegion={gymsByRegion} />
      </div>
      {editMode && assignedTeam ? (
        <>
          <ViewRouteEditMain
            assignedRoute={assignedRoute}
            assignedTeam={assignedTeam}
            setAssignedRoute={setAssignedRoute}
            setRoutesData={setRoutesData}
            onClose={closeEdit}
            routeWithVariations={filteredGymsVariations}
            setNotification={setNotification}
          />
        </>
      ) : (
        <></>
      )}
      {/* Main Content Area */}
      <div className="main-container flex flex-1 flex-col">
        <div className="title-center text-center">
          Route Name: {assignedRoute.routeName}
        </div>
        <div className="flex-1">
          {filteredGymsVariations.map((gym, index) => (
            <div
              key={index}
              id={gym.id?.toString()}
              className="margin-end p-3"
              ref={(el) => {
                elementsRef.current[index] = el;
              }}
            >
              <div className="gym-container rounded-lg bg-gray-900">
                <div className="flex flex-row items-center justify-between">
                  <p className="w-[55%] justify-center">
                    {gym.gym} - {gym.type}
                  </p>
                  <div className="w-[45%]">
                    <TooltipRoute gym={gym} />
                  </div>
                </div>
                <div className="flex flex-col">
                  {gym.variations?.map((variation, index) => (
                    <div
                      key={variation.variationId}
                      className={`leads-variants my-2 rounded-lg shadow ${
                        index % 2 === 0
                          ? 'bg-gray-800 text-white'
                          : 'bg-gray-600 text-gray-200'
                      }`}
                    >
                      <div className="flex w-[55%] flex-row">
                        {variation.pokemons.map((pokemon) => (
                          <div
                            key={pokemon.pokemonid}
                            className="my-2 flex flex-col items-center 2xl:mx-6"
                          >
                            <RouteVariationPokemon
                              getPokemonNumber={getPokemonNumber}
                              name={pokemon.name}
                              pokemonKey={pokemon.pokemonid}
                            />
                            <span
                              className={`pokemon-stats ${getItemColor(pokemon.ability ? pokemon.ability : '--')}`}
                            >
                              {pokemon.ability ? pokemon.ability : '--'}
                            </span>
                            <span
                              className={`pokemon-stats text-center ${getItemColor(pokemon.item ? pokemon.item : '--')}`}
                            >
                              {pokemon.item ? pokemon.item : '--'}
                            </span>
                          </div>
                        ))}
                      </div>
                      <div className="w-full">
                        {/* Action Content Area */}
                        <ActionsRoute leads={gym.leads} variation={variation} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
          {/* Buttons Container */}
          <div className="nextprevious-container z-10">
            <div className="flex space-x-4">
              <button
                className="flex h-6 w-6 items-center justify-center  rounded-full bg-blue-500 text-white transition hover:bg-blue-600 md:h-12 md:w-12"
                onClick={() =>
                  handleNextGym(filteredGymsVariations, 'previous')
                }
              >
                ↑
              </button>
              <button
                className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-500 text-white transition hover:bg-blue-600 md:h-12 md:w-12"
                onClick={() => handleNextGym(filteredGymsVariations, 'next')}
              >
                ↓
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewRoute;
