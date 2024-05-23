import React, { useState } from 'react';

const ViewTeamEditInfo = ({ details: props, onClose: closeEdit }) => {
  const [teamData, setTeamData] = useState({
    ...props,
    team: props.team.map((member) => ({
      ...member,
      moveset: member.moveset || [], // Ensure moves is an array
    })),
  });

  const handleChange = (index, event) => {
    const { name, value } = event.target;
    const newTeam = [...teamData.team];
    const keys = name.split('.');

    let updatedMember = { ...newTeam[index] };

    if (keys.length === 2 && keys[0] === 'moveset') {
      // Handle nested array updates (e.g., moveset.0, moveset.1, etc.)
      const moveIndex = parseInt(keys[1], 10);
      updatedMember.moveset = [...updatedMember.moveset];
      updatedMember.moveset[moveIndex] = value;
    } else if (keys.length === 2) {
      // Handle nested object updates (e.g., ivs, evs.)
      updatedMember[keys[0]] = {
        ...updatedMember[keys[0]],
        [keys[1]]: value,
      };
    } else {
      updatedMember[name] = value;
    }

    newTeam[index] = updatedMember;
    setTeamData({ ...teamData, team: newTeam });
    console.log(`Updated ${name} of team member at index ${index} to ${value}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-600 bg-opacity-50">
      <div className="relative max-h-[80vh] w-full max-w-xl overflow-y-auto rounded-lg bg-black p-6 sm:max-w-2xl md:max-w-3xl lg:max-w-4xl">
        <div>save & discard</div>
        <div>add pkmn</div>
        <button
          onClick={closeEdit}
          className="text-white-500 absolute right-4 top-4 hover:text-gray-700"
        >
          X
        </button>
        <div className="max-h-[70vh] overflow-y-auto">
          <ul>
            {teamData.team.map((members, index) => (
              <li key={index} className="mb-4">
                <div className="mb-2 grid grid-cols-2 gap-4">
                  <div className="flex items-center">
                    <label
                      htmlFor={`pokemon-${index}`}
                      className="mr-4 w-24 text-right"
                    >
                      Name:
                    </label>
                    <input
                      type="text"
                      value={members.pokemon}
                      className="rounded border border-gray-300 p-2 text-center text-black"
                      style={{ width: '160px', height: '35px' }}
                      name="pokemon"
                      onChange={(event) => handleChange(index, event)}
                      id={`pokemon-${index}`}
                    />
                  </div>
                  <div className="flex items-center">
                    <label
                      htmlFor={`item-${index}`}
                      className="mr-4 w-24 text-right"
                    >
                      Item:
                    </label>
                    <input
                      type="text"
                      value={members.item}
                      className="rounded border border-gray-300 p-2 text-center text-black"
                      style={{ width: '160px', height: '35px' }}
                      name="item"
                      onChange={(event) => handleChange(index, event)}
                      id={`item-${index}`}
                    />
                  </div>
                </div>
                <div className="mb-4 grid grid-cols-2 gap-4">
                  <div className="flex items-center">
                    <label
                      htmlFor={`nature-${index}`}
                      className="mr-4 w-24 text-right"
                    >
                      Nature:
                    </label>
                    <input
                      type="text"
                      value={members.nature}
                      className="rounded border border-gray-300 p-2 text-center text-black"
                      style={{ width: '160px', height: '35px' }}
                      name="nature"
                      onChange={(event) => handleChange(index, event)}
                      id={`nature-${index}`}
                    />
                  </div>
                  <div className="flex items-center">
                    <label
                      htmlFor={`ability-${index}`}
                      className="mr-4 w-24 text-right"
                    >
                      Ability:
                    </label>
                    <input
                      type="text"
                      value={members.ability}
                      className="rounded border border-gray-300 p-2 text-center text-black"
                      style={{ width: '160px', height: '35px' }}
                      name="ability"
                      onChange={(event) => handleChange(index, event)}
                      id={`ability-${index}`}
                    />
                  </div>
                </div>

                <div className="mb-4 grid grid-cols-2 gap-4">
                  <div>
                    {/* ------------------------------------------------------------------------------------------IV PART------------------------------------------------------------------------------------------ */}
                    <p className="text-center">IVs:</p>
                    <div>
                      <p>
                        <label htmlFor="hp">HP</label>
                      </p>
                      <input
                        type="number"
                        value={members.ivs.hp}
                        className="rounded border border-gray-300 p-2 text-center text-black"
                        style={{ width: '60px', height: '35px' }}
                        name="ivs.hp"
                        onChange={(event) => handleChange(index, event)}
                        max="31"
                        min="0"
                        id="hp"
                      />
                      <p>
                        <label htmlFor="attack">Atk</label>
                      </p>
                      <input
                        type="number"
                        value={members.ivs.attack}
                        className="rounded border border-gray-300 p-2 text-center text-black"
                        style={{ width: '60px', height: '35px' }}
                        name="ivs.attack"
                        onChange={(event) => handleChange(index, event)}
                        max="31"
                        min="0"
                        id="attack"
                      />
                      <p>
                        <label htmlFor="defense">Def</label>
                      </p>
                      <input
                        type="number"
                        value={members.ivs.defense}
                        className="rounded border border-gray-300 p-2 text-center text-black"
                        style={{ width: '60px', height: '35px' }}
                        name="ivs.defense"
                        onChange={(event) => handleChange(index, event)}
                        max="31"
                        min="0"
                        id="defense"
                      />
                      <p>
                        <label htmlFor="specialAttack">SpAtk</label>
                      </p>
                      <input
                        type="number"
                        value={members.ivs.specialAttack}
                        className="rounded border border-gray-300 p-2 text-center text-black"
                        style={{ width: '60px', height: '35px' }}
                        name="ivs.specialAttack"
                        onChange={(event) => handleChange(index, event)}
                        max="31"
                        min="0"
                        id="specialAttack"
                      />
                      <p>
                        <label htmlFor="specialDefense">SpDef</label>
                      </p>
                      <input
                        type="number"
                        value={members.ivs.specialDefense}
                        className="rounded border border-gray-300 p-2 text-center text-black"
                        style={{ width: '60px', height: '35px' }}
                        name="ivs.specialDefense"
                        onChange={(event) => handleChange(index, event)}
                        max="31"
                        min="0"
                        id="specialDefense"
                      />
                      <p>
                        <label htmlFor="speed">Spd</label>
                      </p>
                      <input
                        type="number"
                        value={members.ivs.speed}
                        className="rounded border border-gray-300 p-2 text-center text-black"
                        style={{ width: '60px', height: '35px' }}
                        name="ivs.speed"
                        onChange={(event) => handleChange(index, event)}
                        max="31"
                        min="0"
                        id="speed"
                      />
                    </div>
                  </div>
                  <div>
                    {/* ------------------------------------------------------------------------------------------EV PART------------------------------------------------------------------------------------------ */}
                    <p className="text-center">EVs:</p>
                    <div>
                      <p>
                        <label htmlFor="hp">HP</label>
                      </p>
                      <input
                        type="text"
                        value={members.evs.hp}
                        className="rounded border border-gray-300 p-2 text-center text-black"
                        style={{ width: '60px', height: '35px' }}
                        name="evs.hp"
                        onChange={(event) => handleChange(index, event)}
                      />
                      <p>
                        <label htmlFor="attack">Atk</label>
                      </p>
                      <input
                        type="text"
                        value={members.evs.attack}
                        className="rounded border border-gray-300 p-2 text-center text-black"
                        style={{ width: '60px', height: '35px' }}
                        name="evs.attack"
                        onChange={(event) => handleChange(index, event)}
                      />
                      <p>
                        <label htmlFor="defense">Def</label>
                      </p>
                      <input
                        type="text"
                        value={members.evs.defense}
                        className="rounded border border-gray-300 p-2 text-center text-black"
                        style={{ width: '60px', height: '35px' }}
                        name="evs.defense"
                        onChange={(event) => handleChange(index, event)}
                      />
                      <p>
                        <label htmlFor="specialAttack">SpAtk</label>
                      </p>
                      <input
                        type="text"
                        value={members.evs.specialAttack}
                        className="rounded border border-gray-300 p-2 text-center text-black"
                        style={{ width: '60px', height: '35px' }}
                        name="evs.specialAttack"
                        onChange={(event) => handleChange(index, event)}
                      />
                      <p>
                        <label htmlFor="specialDefense">SpDef</label>
                      </p>
                      <input
                        type="text"
                        value={members.evs.specialDefense}
                        className="rounded border border-gray-300 p-2 text-center text-black"
                        style={{ width: '60px', height: '35px' }}
                        name="evs.specialDefense"
                        onChange={(event) => handleChange(index, event)}
                      />
                      <p>
                        <label htmlFor="speed">Spd</label>
                      </p>
                      <input
                        type="text"
                        value={members.evs.speed}
                        className="rounded border border-gray-300 p-2 text-center text-black"
                        style={{ width: '60px', height: '35px' }}
                        name="evs.speed"
                        onChange={(event) => handleChange(index, event)}
                      />
                    </div>
                  </div>
                </div>
                <div>
                  Moves:
                  <ul className="grid grid-cols-2 gap-4">
                    {Array.isArray(members.moveset) &&
                      members.moveset.map((move, moveIndex) => (
                        <li key={moveIndex}>
                          <div>
                            <label
                              htmlFor={`move-${moveIndex}`}
                              className="col-span-1 mr-4 w-24 text-right"
                            >
                              Move {moveIndex + 1}:
                            </label>
                            <input
                              type="text"
                              value={move}
                              className="col-span-1 rounded border border-gray-300 p-2 text-center text-black"
                              style={{ width: '160px', height: '35px' }}
                              name={`moveset.${moveIndex}`}
                              onChange={(event) => handleChange(index, event)}
                              id={`move-${moveIndex}`}
                            />
                          </div>
                        </li>
                      ))}
                  </ul>
                </div>
                <hr className="border-white-300 mb-10 mt-40" />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
export default ViewTeamEditInfo;
