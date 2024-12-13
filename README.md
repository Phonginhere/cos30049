![bar_gif](https://github.com/user-attachments/assets/ef28b035-962b-4aac-a7ac-227c15ceefc9)
![chart](https://github.com/user-attachments/assets/db9a6066-d394-4c45-8f6d-d86ab3766fa1)
![hovering](https://github.com/user-attachments/assets/524cce5d-8b1c-476b-9d85-cd0c23cfc1fb)
![map](https://github.com/user-attachments/assets/fa4f8784-5c9b-40e9-9e87-40a9c3001404)
![input](https://github.com/user-attachments/assets/36000ad5-230f-4faf-a000-7a66a5b66566)

# Air quality and Health
This project is to help people shows on predict the exposure mean to get the Predicted Health Burden mean in country and name of the pollutant result with more insights on Data Visualisation such as Choropleth with Bar and Bubble chart. 

# Project Description:
This application will mainly show the input for user to input form for running the prediction between exposure mean and Predicted Health Burden mean in country and name of the pollutant, and plotting on data visualisation with countries in around the world at map with bar and bubble charts.

Tech-stack:
* Front-end: React.js with MUI UI tools: React is a front-end for designing in user-interface, it connects with back-end to fix and return
* Back-end: FastAPI with data is the csv file, which are improve based on assignment 2 in doing AI integration deploying models, then the endpoints GET will give users shows the dropdown Pollutants and POST for predict in predicting the exposure mean to get the burden mean at the form with processing various methods for processing data and predicting based on AI model in comparison between Polynomial and Linear Regression to find out the best one for prediction.  
* Challenges: Due to time-frame limitation, we have struggled in integrating the UI with the interaction between the front-end and back-end for development in several bugs, such as potentially duplication of map when click or disappear bar and bubble charts, which you might need to reload the website to see them again. Also below the button predict at the form is the result and even errors when detecting, although there is a warning but the catch error still got that and display, which might confuse for visitors.
* Improvement: In the future, we will focus more on better and good UI integration between frontend and backend to make the website run smoothly without bugging. Also prioritise on implementing the website with comprehensive responsive and more on improving AI integration.


# Project Structure
A full-stack website using REACT.js with MUI framework design for frontend, FastAPI for backend, the data is the csv file which we have been processed at Assignment 2, and AI model is integrated also from previous assignment. 
```plaintext
project roots/
├── LICENSE
├── README.md                   # project documentation
├── backend
│   ├── README.md # backend on how to run and documentation. 
│   ├── __pycache__
│   │   └── main.cpython-312.pyc
│   ├── app
│   │   ├── __init__.py
│   │   ├── __pycache__
│   │   │   ├── __init__.cpython-312.pyc
│   │   │   ├── app.cpython-312.pyc
│   │   │   └── main.cpython-312.pyc
│   │   ├── api
│   │   │   ├── endpoints
│   │   │   │   ├── __init__.py
│   │   │   │   ├── __pycache__
│   │   │   │   │   ├── __init__.cpython-312.pyc
│   │   │   │   │   └── regression.cpython-312.pyc
│   │   │   │   └── regression.py
│   │   │   ├── models
│   │   │   │   ├── __pycache__
│   │   │   │   │   └── regression_model.cpython-312.pyc
│   │   │   │   └── regression_model.py
│   │   │   └── schemas
│   │   │       ├── __init__.py
│   │   │       ├── __pycache__
│   │   │       │   ├── __init__.cpython-312.pyc
│   │   │       │   └── request.cpython-312.pyc
│   │   │       └── request.py
│   │   └── app.py
│   ├── data
│   │   ├── Life_expectancy.csv
│   │   ├── Population.csv
│   │   ├── ProcessedData
│   │   │   ├── Life_expectancy.csv
│   │   │   ├── Population.csv
│   │   │   ├── air_quality_health.csv
│   │   │   ├── air_quality_health_2.csv
│   │   │   ├── all_countries_data_processed.csv
│   │   │   └── country_continent.csv
│   │   ├── air_quality_health.csv
│   │   ├── air_quality_health_2.csv
│   │   ├── all_countries_data_processed.csv
│   │   └── country_continent.csv
│   ├── main.py
│   └── requirements.txt
└── frontend
    ├── README.md # front-end documentation on how to run the project
    ├── package-lock.json
    ├── package.json
    ├── public
    │   ├── favicon.ico
    │   ├── index.html
    │   ├── logo192.png
    │   ├── logo512.png
    │   ├── manifest.json
    │   └── robots.txt
    └── src
        ├── App.css
        ├── App.js
        ├── App.test.js
        ├── components
        │   ├── Body.js
        │   ├── Footer.js
        │   ├── FormInputPrediction-test.js
        │   ├── FormInputPrediction.css
        │   ├── FormInputPrediction.js
        │   ├── Header.js
        │   ├── InputForm.js
        │   ├── Navbar.css
        │   ├── Navbar.js
        │   ├── PredictionForm.js
        │   ├── ProcessedData
        │   │   ├── GDP_capita_processed.csv
        │   │   ├── GDP_processed.csv
        │   │   ├── Health_expenditure.csv
        │   │   ├── Health_workforce.csv
        │   │   ├── Life_expectancy.csv
        │   │   ├── Population.csv
        │   │   ├── air_quality_health.csv
        │   │   ├── all_countries_data_processed.csv
        │   │   └── country_continent.csv
        │   ├── charts
        │   │   ├── bar_chart
        │   │   │   └── BarCharts.js
        │   │   ├── bubble_chart
        │   │   │   └── BubblePlot.js
        │   │   ├── chart_styles.css
        │   │   ├── charts.js
        │   │   └── choropleth
        │   │       ├── Choropleth.js
        │   │       ├── chart.css
        │   │       ├── choropleth_additional_styles.css
        │   │       ├── countries.json
        │   │       └── world.json
        │   ├── hook
        │   │   ├── Dimensions.js
        │   │   ├── NavBar.js
        │   │   └── Slider
        │   │       ├── Slider.js
        │   │       └── SliderStyles.css
        │   └── mouse_move
        │       └── MouseHandler.js
        ├── dynamic_components
        │   ├── HeroSection.css
        │   ├── HeroSectionAboutPage.js
        │   └── HeroSectionGraphPage.js
        ├── index.css
        ├── index.js
        ├── logo.svg
        ├── pages
        │   ├── AboutPage.js
        │   └── GraphPage.js
        ├── reportWebVitals.js
        ├── services
        │   └── api.js
        └── setupTests.js
```

# How to install and run the project: 
Go to file README at backend and frontend folder to see on how to both of them, better to run back-end first then front-end.
In the project root, there is a file called instructions.txt for installing the dependencies. 

# How to use the project:
In backend, input localhost:8000/docs to see the list of endpoints, including GET and POST, which are different in colors.
* GET at the pollutants endpoint, which you can execute to see the list of pollutants.
* POST at the predict endpoint, which you need to input the ISO3 (country chosen but in shorter form, you can refer the air_quality_health_2.csv to check the list of ISO3 related to the country), and float value input on exposure mean, then pollutant names before execution for Predicted Health Burden mean in country and name of the pollutant.
In frontend, after starting the project, you can see there is a form user input, which you need to fill the list of info by clicking the country first at the map, then input the exposure mean and choose the dropdown pollutant. After that click the button to see the Predicted Health Burden mean in country and name of the pollutant. At the bar and bubble charts, you will see the button where you can see one of them. You can interactive the bubble chart by zooming and mouseover to see the information. 
