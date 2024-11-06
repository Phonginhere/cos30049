import React, { useState } from 'react';
import Navbar from './components/hook/NavBar';
// import PollutantList from './components/PollutantList';
import DrawAllCharts from './components/charts/charts';
import Slider from './components/hook/Slider/Slider';
import FormInputPrediction from './components/FormInputPrediction';
import PredictionForm from './components/PredictionForm';
import { Container, Box, Grid } from '@mui/material';
import Footer from './components/Footer';

function App() {
  // State to hold the selected country's data
  const [, setSelectedCountry] = useState(null);
  return (
    <div>
      <Navbar />
      <div className="App">
        <h1>Air Quality Health Dashboard</h1>
        {/* <PollutantList /> */}
      </div>
      <div>
        <DrawAllCharts onCountrySelect={setSelectedCountry}/>
        
      </div>

      {/* <div><FormInputPrediction /></div> */}
      {/* <div><PredictionForm/></div> */}

      <div>
        <Slider />
      </div>

      <div>
        <Footer/>
      </div>

    </div>
  );
}

export default App;
