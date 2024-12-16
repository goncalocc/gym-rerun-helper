const HamburgerMenu: React.FC<{ handleToggleSidebar: () => void }> = ({
  handleToggleSidebar,
}) => {
  return (
    <button className="toggle-button" onClick={() => handleToggleSidebar()}>
      ☰
    </button>
  );
};

export default HamburgerMenu;
