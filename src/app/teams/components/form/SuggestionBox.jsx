const SuggestionBox = ({
  filteredItems,
  itemRefs,
  activeItem,
  handleClick,
}) => {
  return (
    <div className="absolute left-0 top-full z-10 mt-1 max-h-52 w-fit overflow-y-auto border border-gray-300 bg-white text-black shadow-md">
      <ul className="m-0 list-none p-0">
        {filteredItems
          .map((optionName, index) => {
            return (
              <li
                ref={(el) => (itemRefs.current[index] = el)}
                className={`cursor-pointer px-4 py-2 ${activeItem === index ? 'bg-gray-200' : 'bg-white'} hover:bg-gray-100`}
                key={optionName}
                onMouseDown={handleClick}
              >
                {optionName}
              </li>
            );
          })
          .slice(0, 10)}
      </ul>
    </div>
  );
};

export default SuggestionBox;
