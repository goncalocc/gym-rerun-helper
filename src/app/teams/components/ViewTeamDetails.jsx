import React, { useState } from 'react';

const ViewTeamDetails = ({ details: team }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <div className="container mx-auto px-4 mt-4">
      <div className="flex justify-center mb-4">
        <div className="relative inline-block text-center">
          <button
            onClick={toggleDropdown}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-700"
          >
            Choose Route 
          </button>

          {isDropdownOpen && (
            <div className="absolute left-1/2 transform -translate-x-1/2 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
              <a href="#" className="block px-4 py-2 text-gray-800 hover:bg-gray-200">Route 1</a>
              <a href="#" className="block px-4 py-2 text-gray-800 hover:bg-gray-200">Route 2</a>
              <a href="#" className="block px-4 py-2 text-gray-800 hover:bg-gray-200">Route 3</a>
            </div>
          )}
        </div>
      </div>
      <div className="flex justify-center mb-4 space-x-4">
        <button className="btn-edit bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700">Edit</button>
        <button className="btn-import bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700">Copy Team</button>
      </div>
      <div className="bg-zinc-600 rounded-md grid grid-cols-2 gap-4 p-4">
        {team.team.map((members, index) => (
          <ul key={index}>
            <li>{members.pokemon} {members.item ? `@${members.item}` : ''}</li>
            <li>Ability: {members.ability ? members.ability : 'Any'}</li>
            <li>
              IVs:
              HP: {members.ivs.hp ? members.ivs.hp : 'X'}/
              Atk: {members.ivs.attack ? members.ivs.attack : 'X'}/
              Def: {members.ivs.defense ? members.ivs.defense : 'X'}/
              SpAtk: {members.ivs.specialAttack ? members.ivs.specialAttack : 'X'}/
              SpDef: {members.ivs.specialDefense ? members.ivs.specialDefense : 'X'}/
              Spd: {members.ivs.speed ? members.ivs.speed : 'X'}
            </li>
            <li>
              EVs:
              {members.evs.hp ? ` HP: ${members.evs.hp}/` : ''}
              {members.evs.attack ? ` Atk: ${members.evs.attack}/` : ''}
              {members.evs.defense ? ` Def: ${members.evs.defense}/` : ''}
              {members.evs.specialAttack ? ` SpAtk: ${members.evs.specialAttack}/` : ''}
              {members.evs.specialDefense ? ` Spdef: ${members.evs.specialDefense}/` : ''}
              {members.evs.speed ? ` Spd: ${members.evs.speed}/` : ''}
            </li>
            {members.moveset.map((move, index) => (
              <li key={index}>- {move}</li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  );
};

export default ViewTeamDetails;
