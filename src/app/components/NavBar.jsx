export const Navbar = ({ navItems, onTabChange }) => {
  const goBack = () => {
    window.history.back();
  };

  const handleTabClick = (tab) => {
    console.log('return ' + tab);
    onTabChange(tab);
  };

  return (
    <div className="mx-auto flex  max-w-[120] items-center justify-between bg-black px-4 text-white">
      <ul className="margin-0 padding-0">
        <li
          onClick={goBack}
          className="float-left
              m-2 cursor-pointer rounded-xl p-4 duration-300 hover:bg-[#00df9a] hover:text-black"
        >
          Back
        </li>
        {navItems.map((item) => (
          <li
            onClick={() => handleTabClick(item.id)}
            key={item.id}
            className="float-left
              m-2 cursor-pointer rounded-xl p-4 duration-300 hover:bg-[#00df9a] hover:text-black"
          >
            {item.text}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Navbar;
