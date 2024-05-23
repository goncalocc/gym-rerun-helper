import React, { useState } from 'react';

const ViewTeamDetailOptions = ({ handleClick: handleClickEdit }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <main>
      <div className="mb-4 flex justify-center">
        <div className="relative inline-block text-center">
          <button
            onClick={toggleDropdown}
            className="rounded bg-gray-500 px-4 py-2 text-white hover:bg-gray-700"
          >
            Choose Route
          </button>

          {isDropdownOpen && (
            <div className="absolute left-1/2 z-10 mt-2 w-48 -translate-x-1/2 transform rounded-md bg-white shadow-lg">
              <a
                href="#"
                className="block px-4 py-2 text-gray-800 hover:bg-gray-200"
              >
                Route 1
              </a>
              <a
                href="#"
                className="block px-4 py-2 text-gray-800 hover:bg-gray-200"
              >
                Route 2
              </a>
              <a
                href="#"
                className="block px-4 py-2 text-gray-800 hover:bg-gray-200"
              >
                Route 3
              </a>
            </div>
          )}
        </div>
      </div>
      <div className="mb-4 flex justify-center space-x-4">
        <button
          onClick={handleClickEdit}
          className="btn-edit rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-700"
        >
          Edit
        </button>
        <button className="btn-import rounded bg-green-500 px-4 py-2 text-white hover:bg-green-700">
          Copy Team
        </button>
      </div>
    </main>
  );
};

export default ViewTeamDetailOptions;
