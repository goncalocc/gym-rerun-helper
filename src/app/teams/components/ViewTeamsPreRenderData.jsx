'use client';

import React, { useState, useEffect } from 'react';
import ViewTeams from './ViewTeams';

const fetchLocalStorageTeams = () => {

    try {
        const data = localStorage.getItem('gymRerunTeam');
        if (!data) {
            throw new Error('Data not found in localStorage');
        }
        return JSON.parse(data);
    } catch (error) {
        console.error('Error fetching data from localStorage:', error.message);
        return null;
    }
}

const ViewTeamsPreRenderData = () => {
    const [teamsData, setTeamsData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const localStorageData = fetchLocalStorageTeams();
        setTeamsData(localStorageData);
        setIsLoading(false);
    }, []);

    if (isLoading) {
        return <p>Loading teams data...</p>;
    }

    return (
        <main>
            <ViewTeams localStorageData={teamsData} />
        </main>
    )
}

export default ViewTeamsPreRenderData;
