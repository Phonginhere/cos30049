// src/components/PollutantList.js
import React, { useEffect, useState } from 'react';
import { getPollutants } from '../services/api';

function PollutantList() {
  const [pollutants, setPollutants] = useState([]);

  useEffect(() => {
    async function fetchPollutants() {
      try {
        const data = await getPollutants();
        setPollutants(data.pollutants);
      } catch (error) {
        console.error("Failed to fetch pollutants", error);
      }
    }

    fetchPollutants();
  }, []);

  return (
    <div>
      <h2>Pollutants</h2>
      <ul>
        {pollutants.map((pollutant) => (
          <li key={pollutant.key}>{pollutant.display}</li>
        ))}
      </ul>
    </div>
  );
}

export default PollutantList;


