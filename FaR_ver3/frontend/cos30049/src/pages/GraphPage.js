import React from 'react';

import HeroSection from '../dynamic_components/HeroSectionGraphPage';

function GraphPage() {
    return (
        <div>
            <HeroSection />
            <div className="mt-5">
                <div className="text-center">
                    <h2>Visualisation</h2>
                    <p>This is where the Visualisation will be displayed.</p>
                </div>
            </div>
            <div className="mt-5">
                <div className="text-center">
                    <h2>User Input Form</h2>
                    <p>This is where the User Input Form will be displayed.</p>
                </div>
            </div>
        </div>

    );
}

export default GraphPage;
