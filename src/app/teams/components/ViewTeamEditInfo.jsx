const ViewTeamEditInfo = ({ details: team, onClose: closeEdit }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-600 bg-opacity-50">
      <div className="relative max-h-[80vh] w-full max-w-xl overflow-y-auto rounded-lg bg-black p-6 sm:max-w-2xl md:max-w-3xl lg:max-w-4xl">
      <div>
          save & discard
        </div>
        <div>add pkmn</div>
        <button
          onClick={closeEdit}
          className="text-white-500 absolute right-4 top-4 hover:text-gray-700"
        >
          X
        </button>
        <div className="max-h-[70vh] overflow-y-auto">
          {team.team.map((members, index) => (
            <ul key={index} className="mb-4">
              <li className="mb-2">
                <input
                  type="text"
                  value={members.pokemon}
                  className="rounded border border-gray-300 p-2 text-center text-black"
                  style={{ width: '160px', height: '35px' }}
                ></input>
                <input
                  type="text"
                  value={members.item}
                  className="mx-4 rounded border border-gray-300 p-2 text-center text-black"
                  style={{ width: '160px', height: '35px' }}
                ></input>
              </li>
              <li className="mb-2">
                <input
                  type="text"
                  value={members.ability}
                  className="rounded border border-gray-300 p-2 text-center text-black"
                  style={{ width: '160px', height: '35px' }}
                ></input>
              </li>
              <li className="mb-2">
                IVs: HP:{' '}
                <input
                  type="text"
                  value={members.ivs.hp}
                  className="rounded border border-gray-300 p-2 text-center text-black"
                  style={{ width: '40px', height: '35px' }}
                ></input>{' '}
                Atk:{' '}
                <input
                  type="text"
                  value={members.ivs.attack}
                  className="rounded border border-gray-300 p-2 text-center text-black"
                  style={{ width: '40px', height: '35px' }}
                ></input>{' '}
                Def:{' '}
                <input
                  type="text"
                  value={members.ivs.defense}
                  className="rounded border border-gray-300 p-2 text-center text-black"
                  style={{ width: '40px', height: '35px' }}
                ></input>{' '}
                SpAtk:{' '}
                <input
                  type="text"
                  value={members.ivs.specialAttack}
                  className="rounded border border-gray-300 p-2 text-center text-black"
                  style={{ width: '40px', height: '35px' }}
                ></input>{' '}
                SpDef:{' '}
                <input
                  type="text"
                  value={members.ivs.specialDefense}
                  className="rounded border border-gray-300 p-2 text-center text-black"
                  style={{ width: '40px', height: '35px' }}
                ></input>{' '}
                Spd:{' '}
                <input
                  type="text"
                  value={members.ivs.speed}
                  className="rounded border border-gray-300 p-2 text-center text-black"
                  style={{ width: '40px', height: '35px' }}
                ></input>
              </li>
              <li className="mb-2">
                EVs: HP:{' '}
                <input
                  type="text"
                  value={members.evs.hp}
                  className="rounded border border-gray-300 p-2 text-center text-black"
                  style={{ width: '60px', height: '35px' }}
                ></input>{' '}
                Atk:{' '}
                <input
                  type="text"
                  value={members.evs.attack}
                  className="rounded border border-gray-300 p-2 text-center text-black"
                  style={{ width: '60px', height: '35px' }}
                ></input>{' '}
                Def:{' '}
                <input
                  type="text"
                  value={members.evs.defense}
                  className="rounded border border-gray-300 p-2 text-center text-black"
                  style={{ width: '60px', height: '35px' }}
                ></input>{' '}
                SpAtk:{' '}
                <input
                  type="text"
                  value={members.evs.specialAttack}
                  className="rounded border border-gray-300 p-2 text-center text-black"
                  style={{ width: '60px', height: '35px' }}
                ></input>{' '}
                SpDef:{' '}
                <input
                  type="text"
                  value={members.evs.specialDefense}
                  className="rounded border border-gray-300 p-2 text-center text-black"
                  style={{ width: '60px', height: '35px' }}
                ></input>{' '}
                Spd:{' '}
                <input
                  type="text"
                  value={members.evs.speed}
                  className="rounded border border-gray-300 p-2 text-center text-black"
                  style={{ width: '60px', height: '35px' }}
                ></input>
              </li>
              <div>
                Moves:
                {members.moveset.map((move, index) => (
                  <li className="mb-2" key={index}>
                    <input
                      type="text"
                      value={move}
                      className="rounded border border-gray-300 p-2 text-center text-black"
                      style={{ width: '160px', height: '35px' }}
                    ></input>
                  </li>
                ))}
              </div>
            </ul>
          ))}
        </div>
      </div>
    </div>
  );
};
export default ViewTeamEditInfo;
