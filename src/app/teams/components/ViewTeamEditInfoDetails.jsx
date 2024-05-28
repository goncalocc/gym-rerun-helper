import React, { useEffect, useState } from 'react';

const ViewTeamEditInfoDetails = ({
  index: pokeIndex,
  teamIndex: teamIndex,
  member: props,
  onFormChange: onFormChange,
  enable: handleEnableButton,
}) => {
  const [formData, setFormData] = useState(props);

  const handleChange = (event, arrayName, index) => {
    const { name, value } = event.target;
    const [field, subfield] = name.split('.');

    setFormData((prevData) => {
      let newData;
      if (arrayName && typeof index === 'number') {
        // Update a specific item within an array in formData
        newData = {
          ...prevData,
          [arrayName]: prevData[arrayName].map((item, i) =>
            i === index ? value : item,
          ),
        };
      } else if (subfield) {
        // Update an object in formData
        newData = {
          ...prevData,
          [field]: {
            ...prevData[field],
            [subfield]: value,
          },
        };
      } else {
        // Update state based on the name of the field
        newData = {
          ...prevData,
          [name]: value,
        };
      }

      // Call onFormChange with the updated state
      onFormChange(newData, teamIndex, pokeIndex);

      return newData;
    });

    handleEnableButton();
  };

  return (
    <form>
      <div className="mb-2 grid grid-cols-2 gap-4">
        <div className="flex items-center">
          <label htmlFor="pokemon" className="mr-4 w-24 text-right">
            Name:
          </label>
          <input
            type="text"
            value={formData.pokemon}
            className="rounded border border-gray-300 p-2 text-center text-black"
            style={{ width: '160px', height: '35px' }}
            name="pokemon"
            onChange={handleChange}
            id="pokemon"
          />
        </div>
        <div className="flex items-center">
          <label htmlFor="item" className="mr-4 w-24 text-right">
            Item:
          </label>
          <input
            type="text"
            value={formData.item}
            className="rounded border border-gray-300 p-2 text-center text-black"
            style={{ width: '160px', height: '35px' }}
            name="item"
            onChange={handleChange}
            id="item"
          />
        </div>
      </div>
      <div className="mb-4 grid grid-cols-2 gap-4">
        <div className="flex items-center">
          <label htmlFor="nature" className="mr-4 w-24 text-right">
            Nature:
          </label>
          <input
            type="text"
            value={formData.nature}
            className="rounded border border-gray-300 p-2 text-center text-black"
            style={{ width: '160px', height: '35px' }}
            name="nature"
            onChange={handleChange}
            id="nature"
          />
        </div>
        <div className="flex items-center">
          <label htmlFor="ability" className="mr-4 w-24 text-right">
            Ability:
          </label>
          <input
            type="text"
            value={formData.ability}
            className="rounded border border-gray-300 p-2 text-center text-black"
            style={{ width: '160px', height: '35px' }}
            name="ability"
            onChange={handleChange}
            id="ability"
          />
        </div>
      </div>
      <div className="mb-4 grid grid-cols-2 gap-4">
        <div>
          {/* ------------------------------------------------------------------------------------------IV PART------------------------------------------------------------------------------------------ */}
          <p className="text-center">IVs:</p>
          <div>
            <p>
              <label htmlFor="ivs.hp">HP</label>
            </p>
            <input
              type="number"
              value={formData.ivs.hp}
              className="rounded border border-gray-300 p-2 text-center text-black"
              style={{ width: '60px', height: '35px' }}
              name="ivs.hp"
              onChange={handleChange}
              max="31"
              min="0"
              id="ivs.hp"
            />
            <p>
              <label htmlFor="ivs.attack">Atk</label>
            </p>
            <input
              type="number"
              value={formData.ivs.attack}
              className="rounded border border-gray-300 p-2 text-center text-black"
              style={{ width: '60px', height: '35px' }}
              name="ivs.attack"
              onChange={handleChange}
              max="31"
              min="0"
              id="ivs.attack"
            />
            <p>
              <label htmlFor="ivs.defense">Def</label>
            </p>
            <input
              type="number"
              value={formData.ivs.defense}
              className="rounded border border-gray-300 p-2 text-center text-black"
              style={{ width: '60px', height: '35px' }}
              name="ivs.defense"
              onChange={handleChange}
              max="31"
              min="0"
              id="ivs.defense"
            />
            <p>
              <label htmlFor="ivs.specialAttack">SpAtk</label>
            </p>
            <input
              type="number"
              value={formData.ivs.specialAttack}
              className="rounded border border-gray-300 p-2 text-center text-black"
              style={{ width: '60px', height: '35px' }}
              name="ivs.specialAttack"
              onChange={handleChange}
              max="31"
              min="0"
              id="ivs.specialAttack"
            />
            <p>
              <label htmlFor="ivs.specialDefense">SpDef</label>
            </p>
            <input
              type="number"
              value={formData.ivs.specialDefense}
              className="rounded border border-gray-300 p-2 text-center text-black"
              style={{ width: '60px', height: '35px' }}
              name="ivs.specialDefense"
              onChange={handleChange}
              max="31"
              min="0"
              id="ivs.specialDefense"
            />
            <p>
              <label htmlFor="ivs.speed">Atk</label>
            </p>
            <input
              type="number"
              value={formData.ivs.speed}
              className="rounded border border-gray-300 p-2 text-center text-black"
              style={{ width: '60px', height: '35px' }}
              name="ivs.speed"
              onChange={handleChange}
              max="31"
              min="0"
              id="ivs.speed"
            />
          </div>
        </div>
        <div>
          {/* ------------------------------------------------------------------------------------------EV PART------------------------------------------------------------------------------------------ */}
          <p className="text-center">EVs:</p>
          <div>
            <p>
              <label htmlFor="evs.hp">HP</label>
            </p>
            <input
              type="text"
              value={formData.evs.hp}
              className="rounded border border-gray-300 p-2 text-center text-black"
              style={{ width: '60px', height: '35px' }}
              name="evs.hp"
              onChange={handleChange}
              id="evs.hp"
            />
            <p>
              <label htmlFor="evs.attack">Atk</label>
            </p>
            <input
              type="text"
              value={formData.evs.attack}
              className="rounded border border-gray-300 p-2 text-center text-black"
              style={{ width: '60px', height: '35px' }}
              name="evs.attack"
              onChange={handleChange}
              id="evs.hp"
            />
            <p>
              <label htmlFor="evs.defense">Def</label>
            </p>
            <input
              type="text"
              value={formData.evs.defense}
              className="rounded border border-gray-300 p-2 text-center text-black"
              style={{ width: '60px', height: '35px' }}
              name="evs.defense"
              onChange={handleChange}
              id="evs.defense"
            />
            <p>
              <label htmlFor="evs.specialAttack">SpAtk</label>
            </p>
            <input
              type="text"
              value={formData.evs.specialAttack}
              className="rounded border border-gray-300 p-2 text-center text-black"
              style={{ width: '60px', height: '35px' }}
              name="evs.specialAttack"
              onChange={handleChange}
              id="evs.specialAttack"
            />
            <p>
              <label htmlFor="evs.specialDefense">SpDef</label>
            </p>
            <input
              type="text"
              value={formData.evs.specialDefense}
              className="rounded border border-gray-300 p-2 text-center text-black"
              style={{ width: '60px', height: '35px' }}
              name="evs.specialDefense"
              onChange={handleChange}
              id="evs.specialDefense"
            />
            <p>
              <label htmlFor="evs.speed">Spd</label>
            </p>
            <input
              type="text"
              value={formData.evs.speed}
              className="rounded border border-gray-300 p-2 text-center text-black"
              style={{ width: '60px', height: '35px' }}
              name="evs.speed"
              onChange={handleChange}
              id="evs.speed"
            />
          </div>
        </div>
      </div>
      <div>
        Moves:
        <ul className="grid grid-cols-2 gap-4">
          {Array.isArray(formData.moveset) &&
            formData.moveset.map((move, moveIndex) => (
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
                    id={`move-${moveIndex}`}
                    onChange={(e) => handleChange(e, 'moveset', moveIndex)}
                  />
                </div>
              </li>
            ))}
        </ul>
      </div>
      <hr className="border-white-300 mb-10 mt-40" />
    </form>
  );
};
export default ViewTeamEditInfoDetails;
