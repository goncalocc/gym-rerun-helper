'use client';

import React, { useState } from 'react';
import Navbar from '../utils/NavBar';
import GeneralTab from './components/GeneralTab';

type navItems = {
  id: number;
  text: string;
};

export const ViewGyms: React.FC = () => {
  const navItems = [
    { id: 1, text: 'Kanto' },
    { id: 2, text: 'Johto' },
    { id: 3, text: 'Hoenn' },
    { id: 4, text: 'Sinnoh' },
    { id: 5, text: 'Unova' },
  ];

  const [selectedTab, setSelectedTab] = useState<navItems>(navItems[0]);

  const handleRenderSwitch = (tabIndex: number) => {
    setSelectedTab(navItems[tabIndex]);
  };

  return (
    <main>
      <Navbar navItems={navItems} onTabChange={handleRenderSwitch} />
      <GeneralTab navItems={selectedTab.text} />
    </main>
  );
};

export default ViewGyms;
