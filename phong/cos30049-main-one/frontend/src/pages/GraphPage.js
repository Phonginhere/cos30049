import React from 'react';
import Navbar from '../components/hook/NavBar';
// import PollutantList from './components/PollutantList';
import DrawAllCharts from '../components/charts/charts';
import Slider from '../components/hook/Slider/Slider';
import { Container, Box, Grid } from '@mui/material';
import Footer from '../components/Footer';

function GraphPage() {
  return (
    <div>
      <Navbar />
      <div className="App">
        <h1>Air Quality Health Dashboard</h1>
        {/* <PollutantList /> */}
      </div>
      <div>
        <DrawAllCharts />

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

export default GraphPage;
