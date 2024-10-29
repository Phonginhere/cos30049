// src/components/Body.js
import React, { useState, useEffect } from 'react';
import './Body.css';
import Pagination from './Pagination';
import Search from './Search'; // Importing the Search component

const Body = () => {
  const [tableData, setTableData] = useState([]); // Original Data
  const [filteredData, setFilteredData] = useState([]); // Data after Filtering
  const [uniqueYears, setUniqueYears] = useState([]); // Unique Years for Dropdown
  const [uniquePollutants, setUniquePollutants] = useState([]); // Unique Pollutants
  const [uniqueUnits, setUniqueUnits] = useState([]); // Unique Units
  const [uniqueMeasures, setUniqueMeasures] = useState([]); // Unique Measures
  const [uniqueMetrics, setUniqueMetrics] = useState([]); // Unique Metrics
  const [uniqueCauseNames, setUniqueCauseNames] = useState([]); // Unique Cause Names
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Search States
  const [searchCountry, setSearchCountry] = useState('');
  const [searchYear, setSearchYear] = useState('');
  const [searchPollutant, setSearchPollutant] = useState('');
  const [searchExposureMean, setSearchExposureMean] = useState('');
  const [searchUnits, setSearchUnits] = useState('');
  const [searchBurdenMean, setSearchBurdenMean] = useState('');
  const [searchMeasure, setSearchMeasure] = useState('');
  const [searchMetric, setSearchMetric] = useState('');
  const [searchCauseName, setSearchCauseName] = useState('');

  // Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10); // Default to 10

  // Fetch data from FastAPI on component mount
  useEffect(() => {
    fetch('http://localhost:8000/api/data') // Replace with your FastAPI endpoint
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        setTableData(data.data);      // Store original data
        setFilteredData(data.data);   // Initialize filtered data

        // Extract unique years
        const years = Array.from(new Set(data.data.map(item => item.Year))).sort((a, b) => a - b);
        setUniqueYears(years);

        // Extract unique pollutants
        const pollutants = Array.from(new Set(data.data.map(item => item.Pollutant))).sort();
        setUniquePollutants(pollutants);

        // Extract unique units
        const units = Array.from(new Set(data.data.map(item => item.Units))).sort();
        setUniqueUnits(units);

        // Extract unique measures
        const measures = Array.from(new Set(data.data.map(item => item.Measure))).sort();
        setUniqueMeasures(measures);

        // Extract unique metrics
        const metrics = Array.from(new Set(data.data.map(item => item.Metric))).sort();
        setUniqueMetrics(metrics);

        // Extract unique cause names
        const causeNames = Array.from(new Set(data.data.map(item => item['Cause Name']))).sort();
        setUniqueCauseNames(causeNames);

        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        setError(true);
        setLoading(false);
      });
  }, []);

  // Handle Search Filtering
  useEffect(() => {
    let filtered = tableData;

    if (searchCountry.trim() !== '') {
      filtered = filtered.filter((item) =>
        item.Country.toLowerCase().includes(searchCountry.toLowerCase())
      );
    }

    if (searchYear !== '') { // Dropdown selection
      filtered = filtered.filter((item) =>
        item.Year === parseInt(searchYear)
      );
    }

    if (searchPollutant !== '') { // Dropdown selection
      filtered = filtered.filter((item) =>
        item.Pollutant === searchPollutant
      );
    }

    if (searchExposureMean.trim() !== '') {
      filtered = filtered.filter((item) =>
        item['Exposure Mean'].toString().includes(searchExposureMean)
      );
    }

    if (searchUnits !== '') { // Dropdown selection
      filtered = filtered.filter((item) =>
        item.Units === searchUnits
      );
    }

    if (searchBurdenMean.trim() !== '') {
      filtered = filtered.filter((item) =>
        item['Burden Mean'].toString().includes(searchBurdenMean)
      );
    }

    if (searchMeasure !== '') { // Dropdown selection
      filtered = filtered.filter((item) =>
        item.Measure === searchMeasure
      );
    }

    if (searchMetric !== '') { // Dropdown selection
      filtered = filtered.filter((item) =>
        item.Metric === searchMetric
      );
    }

    if (searchCauseName !== '') { // Dropdown selection
      filtered = filtered.filter((item) =>
        item['Cause Name'] === searchCauseName
      );
    }

    setFilteredData(filtered);
    setCurrentPage(1); // Reset to first page on search
  }, [
    searchCountry,
    searchYear,
    searchPollutant,
    searchExposureMean,
    searchUnits,
    searchBurdenMean,
    searchMeasure,
    searchMetric,
    searchCauseName,
    tableData,
  ]);

  // Calculate total pages
  const totalPages =
    itemsPerPage === 'all'
      ? 1
      : Math.ceil(filteredData.length / itemsPerPage);

  // Calculate current items to display
  const indexOfLastItem =
    itemsPerPage === 'all' ? filteredData.length : currentPage * itemsPerPage;
  const indexOfFirstItem =
    itemsPerPage === 'all' ? 0 : indexOfLastItem - itemsPerPage;
  const currentItems =
    itemsPerPage === 'all'
      ? filteredData
      : filteredData.slice(indexOfFirstItem, indexOfLastItem);

  // Handle Page Change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Handle Reset Search
  const handleReset = () => {
    setSearchCountry('');
    setSearchYear('');
    setSearchPollutant('');
    setSearchExposureMean('');
    setSearchUnits('');
    setSearchBurdenMean('');
    setSearchMeasure('');
    setSearchMetric('');
    setSearchCauseName('');
    setCurrentPage(1);
    setItemsPerPage(10);
  };

  if (loading) {
    return (
      <div className="body-container">
        <h2>Loading data...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="body-container">
        <h2>Error loading data.</h2>
      </div>
    );
  }

  return (
    <div className="body-container">
      <h2>Data from CSV</h2>

      {/* Search Section */}
      <Search
        searchCountry={searchCountry}
        setSearchCountry={setSearchCountry}
        searchYear={searchYear}
        setSearchYear={setSearchYear}
        uniqueYears={uniqueYears}
        searchPollutant={searchPollutant}
        setSearchPollutant={setSearchPollutant}
        uniquePollutants={uniquePollutants}
        searchExposureMean={searchExposureMean}
        setSearchExposureMean={setSearchExposureMean}
        searchUnits={searchUnits}
        setSearchUnits={setSearchUnits}
        uniqueUnits={uniqueUnits}
        searchBurdenMean={searchBurdenMean}
        setSearchBurdenMean={setSearchBurdenMean}
        searchMeasure={searchMeasure}
        setSearchMeasure={setSearchMeasure}
        uniqueMeasures={uniqueMeasures}
        searchMetric={searchMetric}
        setSearchMetric={setSearchMetric}
        uniqueMetrics={uniqueMetrics}
        searchCauseName={searchCauseName}
        setSearchCauseName={setSearchCauseName}
        uniqueCauseNames={uniqueCauseNames}
        handleReset={handleReset}
      />

      {/* Rows Per Page Selection */}
      <div className="rows-per-page">
        <label htmlFor="rowsPerPage">Rows per page:</label>
        <select
          id="rowsPerPage"
          value={itemsPerPage === 'all' ? 'all' : itemsPerPage}
          onChange={(e) => {
            const value = e.target.value;
            setItemsPerPage(value === 'all' ? 'all' : Number(value));
            setCurrentPage(1); // Reset to first page when items per page changes
          }}
        >
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={50}>50</option>
          <option value={100}>100</option>
          <option value="all">All</option>
        </select>
      </div>

      {/* Table Section */}
      <table className="data-table">
        <thead>
          <tr>
            {/* Dynamically create table headers based on keys */}
            {filteredData.length > 0 &&
              Object.keys(filteredData[0]).map((key) => (
                <th
                  key={key}
                  // Remove onClick for sorting if not implementing sortable columns
                  className="sortable"
                >
                  {key.toUpperCase()}
                  {/* Sort Indicator - Remove if not implementing sorting */}
                  {/* {sortConfig.key === key
                    ? sortConfig.direction === 'ascending'
                      ? ' ↑'
                      : ' ↓'
                    : ''} */}
                </th>
              ))}
          </tr>
        </thead>
        <tbody>
          {currentItems.length === 0 ? (
            <tr>
              <td colSpan="100%">No data available.</td>
            </tr>
          ) : (
            currentItems.map((row, index) => (
              <tr key={index}>
                {Object.values(row).map((value, idx) => (
                  <td key={idx}>{value}</td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Pagination Component */}
      {filteredData.length > 0 && itemsPerPage !== 'all' && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
};

export default Body;
