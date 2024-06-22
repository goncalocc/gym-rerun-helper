type navItems = {
  id: number;
  text: string;
};

type NavBarProps = {
  navItems: navItems[];
  onTabChange: (tabIndex: number) => void;
};

export const Navbar: React.FC<NavBarProps> = ({ navItems, onTabChange }) => {
  const goBack = () => {
    window.history.back();
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
        {navItems &&
          navItems.map((item, index) => (
            <li
              onClick={() => onTabChange(index)}
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
