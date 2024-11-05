import React from 'react';

import FormInput from '../components/FormInputPrediction';

import HeroSection from '../dynamic_components/HeroSectionGraphPage';

import Slider from '../components/hook/Slider/Slider';
import DrawAllCharts from '../components/charts/charts';
import Choropleth from '../components/charts/choropleth/Choropleth';

function GraphPage() {
    return (
        <div>
            <HeroSection />
            <div className="mt-5">
                <div className="text-center">
                    <h2>Visualisation</h2>
                    <div>
                        <DrawAllCharts />
                    </div>

                    <div>
                        <Slider />
                    </div>
                </div>
            </div>
            <div className="mt-5">
                <div className="text-center">
                    <h2>User Input Form</h2>
                    {/* <FormInput /> */}
                </div>
            </div>
        </div>

    );
}

export default GraphPage;
