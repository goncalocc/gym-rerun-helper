"use client";

import Navbar from '../components/NavBar';
import React, { useState, useEffect } from 'react';
import ViewTeamsPreRenderData from './components/ViewTeamsPreRenderData';

const ViewTeamsPage = () => {
    return (
        <main>
            <Navbar />
            <ViewTeamsPreRenderData />
        </main>
    );
}

export default ViewTeamsPage;

