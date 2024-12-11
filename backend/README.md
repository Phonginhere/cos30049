# Air Quality Health API

A FastAPI application for predicting air quality health burdens based on exposure data.

## Project Structure

```plaintext
backend/
├── app/
│   ├── main.py                # Entry point for FastAPI
│   ├── api/
│   │   └── endpoints/
│   │       └── regression.py   # Routes for GET pollutants, POST predict
│   ├── models/
│   │   └── regression_model.py # Model loading and prediction logic
│   └── schemas/
│      └── request.py          # Request and response schemas
│   
├── data/
│   └── predictions.csv         # Saved predictions (if using CSV)
├── requirements.txt            # Dependencies
└── README.md                   # backend documentation
```


## Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/Phonginhere/cos30049.git
   cd backend
   ```

### Create a virtual environment
```plaintext
Use Anaconda Navigator for your own os
```

### Install dependencies
```bash
pip install -r requirements.txt
```

### Run the application
```bash
python main.py 
```
Or you can click run button if IDE has its feature available.

The API will be available at `http://127.0.0.1:8000`

## API Documentation
FastAPI provides interactive API documentation at:

* Swagger UI: http://127.0.0.1:8000/docs
* ReDoc: http://127.0.0.1:8000/redoc
## Endpoints
* GET /pollutants: Retrieve a list of pollutants group by from csv table column Pollutants.
* POST /predict: Predict the burden mean based on input data.