import gyms from '../../data/gym-variations.json';

type GeneralTabProps = {
  navItems: string;
};

export const GeneralTab: React.FC<GeneralTabProps> = (props) => {
  const { navItems } = props;

  return (
    <div className="m-20">
      {gyms.map((gym) => (
        <div key={gym.id} className="flex">
          {gym.region === navItems ? (
            <div className="mb-10 flex">
              <div className="flex w-56 items-center justify-center bg-gray-200">
                <div className="text-center text-3xl text-black">
                  <p>{gym.gym}</p>
                  <p>{gym.gymtype}</p>
                </div>
              </div>
              <div className="w-3/4">
                {gym.variations.map((variation) => (
                  <table
                    key={variation.variationid}
                    className="w-3/5 table-fixed border-collapse border-gray-300"
                  >
                    <tbody>
                      <tr>
                        {variation.pokemons.map((pokemon) => (
                          <td
                            key={pokemon.pokemonid}
                            className="border border-gray-300 p-4"
                          >
                            {pokemon.name}
                          </td>
                        ))}
                      </tr>
                    </tbody>
                  </table>
                ))}
              </div>
            </div>
          ) : (
            <></>
          )}
        </div>
      ))}
    </div>
  );
};

export default GeneralTab;
