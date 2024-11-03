import React from 'react';

function Body() {
  return (
    <div className="container my-5">
      <section className="mb-4">
        <h4>About the Project</h4>
        <p>
          Our goal is to present accurate data on health and air quality. We search for air pollutants like ozone, nitrogen dioxide, hazardous air pollutants from solid fuels, and ambient particle matter, as well as their effects on human health. 
          The data source is from State of Global Air, which includes contributions from HEI and IHME.
        </p>
        <p>
          This information is for the public interested in learning more about air quality statistics and its health impacts. Our data will be useful for specialists and officials in policy-making.
        </p>
      </section>
      <section className="mb-4">
        <h4>About Us</h4>
        <p>
          Safety Windy consists of three Swinburne University students: Phong Tran (104334842), Khanh Toan Nguyen (104180605), and Mai An Nguyen (103824070). Our team aims to create an Air Quality and Health AI model, accompanied by a website, as part of the COS30049 project requirements.
        </p>
      </section>
    </div>
  );
}

export default Body;
