// src/components/Search.js
import React from 'react';
import './Search.css';

const Search = ({
  searchCountry,
  setSearchCountry,
  searchYear,
  setSearchYear,
  uniqueYears,
  searchPollutant,
  setSearchPollutant,
  uniquePollutants,
  searchExposureMean,
  setSearchExposureMean,
  searchUnits,
  setSearchUnits,
  uniqueUnits,
  searchBurdenMean,
  setSearchBurdenMean,
  searchMeasure,
  setSearchMeasure,
  uniqueMeasures,
  searchMetric,
  setSearchMetric,
  uniqueMetrics,
  searchCauseName,
  setSearchCauseName,
  uniqueCauseNames,
  handleReset,
}) => {
  return (
    <div className="search-section">
      <div className="search-group">
        <input
          type="text"
          placeholder="Search by Country"
          value={searchCountry}
          onChange={(e) => setSearchCountry(e.target.value)}
        />
        {/* Year Dropdown */}
        <select
          id="searchYear"
          value={searchYear}
          onChange={(e) => setSearchYear(e.target.value)}
        >
          <option value="">All Years</option>
          {uniqueYears.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
        {/* Pollutant Dropdown */}
        <select
          id="searchPollutant"
          value={searchPollutant}
          onChange={(e) => setSearchPollutant(e.target.value)}
        >
          <option value="">All Pollutants</option>
          {uniquePollutants.map((pollutant) => (
            <option key={pollutant} value={pollutant}>
              {pollutant}
            </option>
          ))}
        </select>
      </div>
      <div className="search-group">
        {/* Exposure Mean Input */}
        <input
          type="text"
          placeholder="Search by Exposure Mean"
          value={searchExposureMean}
          onChange={(e) => setSearchExposureMean(e.target.value)}
        />
        {/* Units Dropdown */}
        <select
          id="searchUnits"
          value={searchUnits}
          onChange={(e) => setSearchUnits(e.target.value)}
        >
          <option value="">All Units</option>
          {uniqueUnits.map((unit) => (
            <option key={unit} value={unit}>
              {unit}
            </option>
          ))}
        </select>
        {/* Burden Mean Input */}
        <input
          type="text"
          placeholder="Search by Burden Mean"
          value={searchBurdenMean}
          onChange={(e) => setSearchBurdenMean(e.target.value)}
        />
      </div>
      <div className="search-group">
        {/* Measure Dropdown */}
        <select
          id="searchMeasure"
          value={searchMeasure}
          onChange={(e) => setSearchMeasure(e.target.value)}
        >
          <option value="">All Measures</option>
          {uniqueMeasures.map((measure) => (
            <option key={measure} value={measure}>
              {measure}
            </option>
          ))}
        </select>
        {/* Metric Dropdown */}
        <select
          id="searchMetric"
          value={searchMetric}
          onChange={(e) => setSearchMetric(e.target.value)}
        >
          <option value="">All Metrics</option>
          {uniqueMetrics.map((metric) => (
            <option key={metric} value={metric}>
              {metric}
            </option>
          ))}
        </select>
        {/* Cause Name Dropdown */}
        <select
          id="searchCauseName"
          value={searchCauseName}
          onChange={(e) => setSearchCauseName(e.target.value)}
        >
          <option value="">All Cause Names</option>
          {uniqueCauseNames.map((causeName) => (
            <option key={causeName} value={causeName}>
              {causeName}
            </option>
          ))}
        </select>
      </div>
      <button onClick={handleReset} className="reset-button">
        Reset
      </button>
    </div>
  );
};

export default Search;
