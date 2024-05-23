'use client';

import React, { useState } from 'react';
import Navbar from '../components/NavBar';
import GeneralTab from './components/GeneralTab';

export const ViewGyms = () => {
  const navItems = [
    { id: 1, text: 'Kanto' },
    { id: 2, text: 'Johto' },
    { id: 3, text: 'Hoenn' },
    { id: 4, text: 'Sinnoh' },
    { id: 5, text: 'Unova' },
  ];

  const [selectedTab, setSelectedTab] = useState(navItems[0]);

  const handleRenderSwitch = (tab) => {
    setSelectedTab(navItems[tab]);
  };

  return (
    <main>
      <Navbar navItems={navItems} onTabChange={handleRenderSwitch} />
      <GeneralTab navItems={selectedTab.text} />
    </main>
  );
};

export default ViewGyms;
