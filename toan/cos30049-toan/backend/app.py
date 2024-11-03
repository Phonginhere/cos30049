from fastapi import FastAPI, HTTPException, Request
from pydantic import BaseModel, validator
from typing import Union, List  # Added List
import pandas as pd
import os
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse  # Added import


from sklearn.model_selection import train_test_split
from sklearn.preprocessing import PolynomialFeatures, MinMaxScaler
from sklearn.linear_model import LinearRegression
from sklearn.metrics import r2_score, mean_squared_error 
from joblib import dump, load
import os
from sklearn.pipeline import Pipeline  # Added for pipeline


# Import regression_aimodel.py
from backend.regression_aimodel import RegressionModel

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
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
    dataset = pd.read_csv(CSV_FILE_PATH)
   # Outlier removal for 'Exposure Mean'
    Q1_exposure = dataset['Exposure Mean'].quantile(0.25)
    Q3_exposure = dataset['Exposure Mean'].quantile(0.75)
    IQR_exposure = Q3_exposure - Q1_exposure
    lower_bound_exposure = Q1_exposure - 1.5 * IQR_exposure
    upper_bound_exposure = Q3_exposure + 1.5 * IQR_exposure

    # Outlier removal for 'Burden Mean'
    Q1_burden = dataset['Burden Mean'].quantile(0.25)
    Q3_burden = dataset['Burden Mean'].quantile(0.75)
    IQR_burden = Q3_burden - Q1_burden
    lower_bound_burden = Q1_burden - 1.5 * IQR_burden
    upper_bound_burden = Q3_burden + 1.5 * IQR_burden

    # Clean dataset by removing outliers
    dataset_cleaned = dataset[
        (dataset['Exposure Mean'] >= lower_bound_exposure) & 
        (dataset['Exposure Mean'] <= upper_bound_exposure) & 
        (dataset['Burden Mean'] >= lower_bound_burden) & 
        (dataset['Burden Mean'] <= upper_bound_burden)
    ]

    # Filter dataset based on specific criteria
    filtered_df = dataset_cleaned[
        (dataset_cleaned['Cause_Name'] == 'All causes') &
        (dataset_cleaned['ISO3'] == input_data.iso3) &
        (dataset_cleaned['Pollutant'] == input_data.pollutant)
    ]

    if len(filtered_df) == 0:
        return f"Filtered Data Points : {len(filtered_df)}"

    # Feature and target variables
    X = filtered_df[['Exposure Mean']].values
    y = filtered_df['Burden Mean'].values

    # Scale features and target
    scaler_X = MinMaxScaler()
    scaler_y = MinMaxScaler()
    X_scaled = scaler_X.fit_transform(X)
    y_scaled = scaler_y.fit_transform(y.reshape(-1, 1))

    # Split data into training and testing sets
    X_train, X_test, y_train, y_test = train_test_split(
        X_scaled, y_scaled, test_size=0.2, random_state=42
    )

    # ----- Linear Regression Model -----
    model_linear = LinearRegression()
    model_linear.fit(X_train, y_train)
    y_pred_linear = model_linear.predict(X_test)

    # Evaluation Metrics for Linear Regression
    mse_linear = mean_squared_error(y_test, y_pred_linear)
    r2_linear = r2_score(y_test, y_pred_linear)

    # ----- Polynomial Regression Model (degree 4) -----
    poly = PolynomialFeatures(degree=4)
    X_train_poly = poly.fit_transform(X_train)
    X_test_poly = poly.transform(X_test)

    model_poly = LinearRegression()
    model_poly.fit(X_train_poly, y_train)
    y_pred_poly = model_poly.predict(X_test_poly)

    # Evaluation Metrics for Polynomial Regression
    mse_poly = mean_squared_error(y_test, y_pred_poly)
    r2_poly = r2_score(y_test, y_pred_poly)

    # ----- Make Prediction for the Given Exposure Value -----
    # For Linear Regression
    burden_prediction_linear = model_linear.predict(scaler_X.transform([[input_data.exposure_mean]]))[0]
    burden_prediction_rescaled_linear = scaler_y.inverse_transform([burden_prediction_linear])[0, 0]

    # For Polynomial Regression
    exposure_value_scaled = scaler_X.transform([[input_data.exposure_mean]])
    exposure_value_poly = poly.transform(exposure_value_scaled)
    burden_prediction_poly = model_poly.predict(exposure_value_poly)[0]
    burden_prediction_rescaled_poly = scaler_y.inverse_transform([burden_prediction_poly])[0, 0]

    # Determine which model is better
    if mse_linear < mse_poly and r2_linear > r2_poly:
        prediction = burden_prediction_rescaled_linear
    elif mse_poly < mse_linear and r2_poly > r2_linear:
        prediction = burden_prediction_rescaled_poly

    return PredictionOutput(predicted_burden_mean=float(prediction))
    

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
