'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

const FilterPage = () => {
  const [vehicleTypes, setVehicleTypes] = useState([]);
  const [selectedVehicleType, setSelectedVehicleType] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [isButtonEnabled, setIsButtonEnabled] = useState(false);
  const [error, setError] = useState(null);

  // Fetch vehicle types from the API
  useEffect(() => {
    async function fetchVehicleTypes() {
      try {
        const response = await fetch(
          'https://vpic.nhtsa.dot.gov/api/vehicles/GetMakesForVehicleType/car?format=json'
        );

        if (!response.ok) {
          throw new Error('Failed to fetch vehicle types');
        }

        const data = await response.json();
        setVehicleTypes(data.Results);
      } catch (err) {
        console.error('Error fetching vehicle types:', err);
        setError('Error fetching vehicle types. Please try again later.');
      }
    }

    fetchVehicleTypes();
  }, []);

  useEffect(() => {
    setIsButtonEnabled(selectedVehicleType !== '' && selectedYear !== '');
  }, [selectedVehicleType, selectedYear]);

  const currentYear = new Date().getFullYear();
  const years = Array.from(
    { length: currentYear - 2014 },
    (_, i) => currentYear - i
  );

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Filter Page</h1>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <div className="mb-4">
        <label className="block mb-2">Select Vehicle Type:</label>
        <select
          className="p-2 border rounded w-full text-black"
          value={selectedVehicleType}
          onChange={(e) => setSelectedVehicleType(e.target.value)}
        >
          <option value="">-- Select Vehicle Type --</option>
          {vehicleTypes.map((type) => (
            <option
              key={type.MakeId}
              value={type.MakeId}
              className="text-black"
            >
              {type.MakeName}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <label className="block mb-2">Select Model Year:</label>
        <select
          className="p-2 border rounded w-full text-black"
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
        >
          <option value="">-- Select Model Year --</option>
          {years.map((year) => (
            <option key={year} value={year} className="text-black">
              {year}
            </option>
          ))}
        </select>
      </div>

      <Link href={`/result/${selectedVehicleType}/${selectedYear}`}>
        <button
          className={`p-2 bg-blue-500 text-white rounded ${
            isButtonEnabled ? '' : 'opacity-50 cursor-not-allowed'
          }`}
          disabled={!isButtonEnabled}
        >
          Next
        </button>
      </Link>
    </div>
  );
};

export default FilterPage;
