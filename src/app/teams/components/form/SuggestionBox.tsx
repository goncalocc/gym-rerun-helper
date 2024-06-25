import React from 'react';

interface SuggestionBoxProps {
  filteredItems: string[];
  itemRefs: React.RefObject<(HTMLLIElement | null)[]>;
  activeItem: number;
  handleClick: (event: React.MouseEvent<HTMLLIElement>) => void;
}

const SuggestionBox: React.FC<SuggestionBoxProps> = ({
  filteredItems,
  itemRefs,
  activeItem,
  handleClick,
}) => {
  return (
    <div className="absolute left-0 top-full z-10 mt-1 max-h-52 w-fit overflow-y-auto border border-gray-300 bg-white text-black shadow-md">
      <ul className="m-0 list-none p-0">
        {filteredItems.slice(0, 10).map((optionName, index) => (
          <li
            ref={(el) => {
              if (el && itemRefs.current) itemRefs.current[index] = el; // Ensure itemRefs.current and el are not null
            }}
            className={`cursor-pointer px-4 py-2 ${activeItem === index ? 'bg-gray-200' : 'bg-white'} hover:bg-gray-100`}
            key={optionName}
            onMouseDown={handleClick}
          >
            {optionName}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SuggestionBox;