from fastapi import FastAPI, HTTPException, Request
from pydantic import BaseModel, validator
from typing import Union, List  # Added List
import pandas as pd
import os
from sklearn.preprocessing import MinMaxScaler  # Added import
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse  # Added import

# Import regression_aimodel.py
from backend.regression_aimodel import RegressionModel

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Define input structure for validation with ISO3 code
class ValidationInput(BaseModel):
    iso3: str  # Replaced 'country' with 'iso3'
    exposure_mean: Union[str, int, float]
    pollutant: str

    @validator('iso3')
    def iso3_must_be_valid(cls, v):
        if len(v) != 3 or not v.isalpha():
            raise ValueError("`iso3` must be a 3-letter alphabetic country code.")
        return v.upper()

    @validator('exposure_mean', pre=True)
    def validate_exposure_mean(cls, v):
        if isinstance(v, str):
            try:
                float_value = float(v)
                return float_value
            except ValueError:
                raise ValueError("`exposure_mean` must be a number, not a string.")
        elif isinstance(v, (int, float)):
            if v < 0:
                raise ValueError("`exposure_mean` must be a positive number.")
            return float(v)
        else:
            raise ValueError("`exposure_mean` must be a number.")

class PredictionOutput(BaseModel):
    predicted_burden_mean: float

# Path to the updated CSV data file
CSV_FILE_PATH = "./backend/data/air_quality_health_2.csv"

@app.get("/")
def read_root():
    if not os.path.exists(CSV_FILE_PATH):
        raise HTTPException(status_code=404, detail="Data file not found.")
    
    try:
        data = pd.read_csv(CSV_FILE_PATH)
    except pd.errors.ParserError as e:
        raise HTTPException(status_code=500, detail=f"CSV Parsing Error: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error reading data file: {str(e)}")
    
    return data.head().to_dict(orient='records')


def validate_data(input_data: ValidationInput):
    errors: List[str] = []

    # At this point, iso3 has been validated and converted to uppercase
    iso3 = input_data.iso3
    exposure_mean = input_data.exposure_mean
    pollutant = input_data.pollutant

    # Check if the CSV file exists
    if not os.path.exists(CSV_FILE_PATH):
        raise HTTPException(status_code=404, detail=["Data file not found."])

    try:
        data = pd.read_csv(CSV_FILE_PATH)
    except pd.errors.ParserError as e:
        raise HTTPException(status_code=500, detail=[f"CSV Parsing Error: {str(e)}"])
    except Exception as e:
        raise HTTPException(status_code=500, detail=[f"Error reading data file: {str(e)}"])
    
    # Normalize column names to lowercase for consistency
    data.columns = [col.strip().lower() for col in data.columns]

    # Ensure that 'iso3' and 'pollutant' columns exist
    required_columns = ['iso3', 'pollutant']
    for col in required_columns:
        if col not in data.columns:
            errors.append(f"Missing required column in CSV: {col.upper()}.")

    if errors:
        raise HTTPException(status_code=500, detail=errors)

    # Filter data based on input ISO3 code and pollutant
    iso3_data = data[data['iso3'] == iso3]
    if iso3_data.empty:
        errors.append(f"No data found for the specified ISO3 country code: {iso3}.")

    pollutant_data = iso3_data[iso3_data['pollutant'] == pollutant]
    if pollutant_data.empty:
        errors.append(f"No data found for the specified pollutant: {pollutant} in country: {iso3}.")

    # If there are any errors, return them all
    if errors:
        raise HTTPException(status_code=400, detail=errors)

    # If validation passes, return success message
    return {"message": "Validation successful", "status_code": 200}

# Prediction endpoint updated with ISO3
def predict_burden(input_data: ValidationInput):
    try:
        # Prediction logic
        regression_model = RegressionModel()
        x_normalised, y = regression_model.preprocess_data(input_data.iso3, input_data.pollutant)
        
        # Train both models
        regression_model.train_linear_model(x_normalised, y)
        regression_model.train_polynomial_model(x_normalised, y)
        
        # Prepare input for prediction
        input_exposure = [[input_data.exposure_mean]]
        scaler = MinMaxScaler()
        input_exposure_normalised = scaler.fit_transform(input_exposure)
        
        predicted_burden = regression_model.predict(input_exposure_normalised)[0]  # Assuming single input
        return PredictionOutput(predicted_burden_mean=predicted_burden)
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=[str(ve)])
    except KeyError as ke:
        raise HTTPException(status_code=500, detail=[str(ke)])
    except Exception as e:
        raise HTTPException(status_code=500, detail=[str(e)])

@app.post("/predict")
async def predict(input_data: ValidationInput):
    validate_data(input_data)
    result = predict_burden(input_data)
    return {"prediction": result}

@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    return JSONResponse(
        status_code=exc.status_code,
        content={"detail": exc.detail},
    )
