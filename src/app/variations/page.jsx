'use client';

import { KantoTab } from './components/KantoTab';
import { JohtoTab } from './components/JohtoTab';
import { HoennTab } from './components/HoennTab';
import { SinnohTab } from './components/SinnohTab';
import { UnovaTab } from './components/UnovaTab';

import React, { useState } from 'react';
import Navbar from '../components/NavBar';

export const ViewGyms = () => {

  const navItems = [
    { id: 1, text: 'Kanto Gym' },
    { id: 2, text: 'Johto Gym' },
    { id: 3, text: 'Hoenn Gym' },
    { id: 4, text: 'Sinnoh Gym' },
    { id: 5, text: 'Unova Gym' },
  ];

  const [selectedTab, setSelectedTab] = useState(1);

  const handleTabClick = (tab) => {
    setSelectedTab(tab);
  };

  const renderSwitch = (tab) => {
    switch (tab) {
      case 1:
        return <KantoTab />;
      case 2:
        return <JohtoTab />;
      case 3:
        return <HoennTab />;
      case 4:
        return <SinnohTab />;
      case 5:
        return <UnovaTab />;
    }
  };

  return (
    <main>
      <Navbar navItems={navItems} onTabChange={handleTabClick} />
      <div>{renderSwitch(selectedTab)}</div>
    </main>
  );
};

export default ViewGyms;
