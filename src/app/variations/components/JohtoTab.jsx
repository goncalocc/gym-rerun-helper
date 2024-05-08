import gyms from '../../data/gym-variations.json';

export const JohtoTab = () => {
    return (
      <div className="m-20 flex flex-col space-y-20">
      {gyms.map((gym) => (
        gym.region == "Johto" ?
                <div key={gym.id} className="flex">
          <div className="flex w-56 items-center justify-center bg-gray-200">
            <div className="text-center text-3xl text-black">
              <p>{gym.gym}</p>
              <p>{gym.gymtype}</p>
            </div>
          </div>
          <div class="w-3/4">
            {gym.variations.map((variation) => (
              <table
                key={variation.variationid}
                className="w-3/5 border-collapse border-gray-300 table-fixed"
              >
                <tr>
                  {variation.pokemons.map((pokemon) => (
                    <td key={pokemon.pokemons} class="border border-gray-300 p-4">
                      {pokemon}
                    </td>
                  ))}
                </tr>
              </table>
            ))}
          </div>
        </div>
        : <></>

      ))}
    </div>
    );
  };
  
  export default JohtoTab;