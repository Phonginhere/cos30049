import React from 'react';
import HeroSection from '../dynamic_components/HeroSectionHomePage';

function HomePage() {
    return (
        <div>
            <HeroSection />
            <div className="container my-5">
                {/* About the Project Section */}
                <div className="row mb-5">
                    <div className="col-md-3 text-md-end fw-bold mb-2">
                        <h5>About the project</h5>
                    </div>
                    <div className="col-md-9">
                        <p>
                            Our goal is to present accurate data on <strong>health</strong> and <strong>air quality</strong>. In terms of air quality, we search for air pollutants including <strong>ozone</strong>, <strong>nitrogen dioxide</strong>, <strong>hazardous air pollutant of solid fuels</strong>, and <strong>ambient particle matter</strong>, as well as their consequences on human health. The data source is from <strong>State of Global Air</strong>, which is contributed by the Health Effects Institute (HEI) and Institute for Health Metrics and Evaluation (IHME), which are non-profit organizations doing research on health, as well as expert input from the University of British Columbia. These metrics cover a number of nations between <strong>1990</strong> and <strong>2021</strong>.
                        </p>
                        <p>
                            The information is for the public who is interested in learning more about the health and air quality statistics for their nations in the years to come. By providing specific measurements and identifying the kinds of diseases linked to pollution, we expect that our data will increase global understanding of the health effects associated with air quality in particular nations. Furthermore, our data will be helpful to specialists or senior officials who will use it to implement policies that lower air pollution and the associated health hazards.
                        </p>
                    </div>
                </div>

                {/* About Us Section */}
                <div className="row">
                    <div className="col-md-3 text-md-end fw-bold mb-2">
                        <h5>About us</h5>
                    </div>
                    <div className="col-md-9">
                        <p>
                            <strong>Safety Windy</strong> consists of 3 members, all are Swinburne University of Technology students studying Bachelor’s of Computer Science, majoring in AI (<strong>Phong Tran 104334842</strong> and <strong>Khanh Toan Nguyen 104180605</strong>) and Data Science (<strong>Mai An Nguyen 103824070</strong>).
                        </p>
                        <p>
                            Our team aims to create an Air Quality and Health AI model together with a website to implement our model following COS30049 Computing Technology Innovation Project requirements.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default HomePage;
