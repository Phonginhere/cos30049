import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import PolynomialFeatures, MinMaxScaler
from sklearn.linear_model import LinearRegression
from sklearn.metrics import r2_score, mean_squared_error 
from joblib import dump, load
import os
from sklearn.pipeline import Pipeline  # Added for pipeline

CSV_FILE_PATH = "./backend/data/air_quality_health_2.csv"

class RegressionModel:
    def __init__(self):
        self.model_linear = LinearRegression()
        # Use Pipeline for polynomial regression
        self.model_polynomial = Pipeline([
            ('poly', PolynomialFeatures(degree=4)),
            ('linear', LinearRegression())
        ])
        self.linear_mse = None
        self.linear_r2 = None
        self.poly_mse = None
        self.poly_r2 = None
        
        # Read the dataset
        try:
            self.dataset = pd.read_csv(CSV_FILE_PATH)
        except FileNotFoundError:
            raise FileNotFoundError(f"CSV file not found at path: {CSV_FILE_PATH}")
        except pd.errors.ParserError as e:
            raise ValueError(f"Error parsing CSV file: {e}")
        
        # Check if 'Cause_Name' column exists
        if 'Cause_Name' not in self.dataset.columns:
            raise KeyError("Column 'Cause_Name' not found in the CSV file.")
        
        # Filter the dataset
        self.dataset = self.dataset[self.dataset['Cause_Name'] == 'All causes']

    def preprocess_data(self, ISO3, pollutant):
        dataset = self.dataset[
            (self.dataset['ISO3'] == ISO3) & 
            (self.dataset['Pollutant'] == pollutant)
        ] 

        if dataset.empty:
            raise ValueError(f"No data found for ISO3 '{ISO3}' and pollutant '{pollutant}'.")

        Q1_exposure = dataset['Exposure Mean'].quantile(0.25)
        Q3_exposure = dataset['Exposure Mean'].quantile(0.75)
        IQR_exposure = Q3_exposure - Q1_exposure

        # Calculate lower and upper bounds for 'Exposure Mean'
        lower_bound_exposure = Q1_exposure - 1.5 * IQR_exposure
        upper_bound_exposure = Q3_exposure + 1.5 * IQR_exposure

        # Calculate Q1 and Q3 for 'Burden Mean'
        Q1_burden = dataset['Burden Mean'].quantile(0.25)
        Q3_burden = dataset['Burden Mean'].quantile(0.75)
        IQR_burden = Q3_burden - Q1_burden

        # Calculate lower and upper bounds for 'Burden Mean'
        lower_bound_burden = Q1_burden - 1.5 * IQR_burden
        upper_bound_burden = Q3_burden + 1.5 * IQR_burden

        # Remove outliers from both 'Exposure Mean' and 'Burden Mean'
        dataset_cleaned = dataset[
            (dataset['Exposure Mean'] >= lower_bound_exposure) & 
            (dataset['Exposure Mean'] <= upper_bound_exposure) & 
            (dataset['Burden Mean'] >= lower_bound_burden) & 
            (dataset['Burden Mean'] <= upper_bound_burden)
        ]

        if dataset_cleaned.empty:
            raise ValueError("No data available after removing outliers.")

        x = dataset_cleaned['Exposure Mean'].values.reshape(-1, 1)
        y = dataset_cleaned['Burden Mean'].values

        scaler_x = MinMaxScaler()
        scaler_y = MinMaxScaler()  # Added scaler for y
        x_normalised = scaler_x.fit_transform(x)
        y_normalised = scaler_y.fit_transform(y.reshape(-1, 1))  # Scaled y

        return x_normalised, y_normalised  # Return scaled y
            
    def train_model(self, x, y):
        # Split data into training and testing sets
        X_train, X_test, y_train, y_test = train_test_split(
            x, y, test_size=0.2, random_state=42
        )
        
        # Train Linear Regression Model
        self.model_linear.fit(X_train, y_train)
        prediction_linear = self.model_linear.predict(X_test)
        mse_linear = mean_squared_error(y_test, prediction_linear)
        r2_linear = r2_score(y_test, prediction_linear)
        
        # Train Polynomial Regression Model using the pipeline
        self.model_polynomial.fit(X_train, y_train)
        prediction_poly = self.model_polynomial.predict(X_test)
        mse_poly = mean_squared_error(y_test, prediction_poly)
        r2_poly = r2_score(y_test, prediction_poly)
        
        # Store evaluation metrics
        self.linear_mse, self.linear_r2 = mse_linear, r2_linear
        self.poly_mse, self.poly_r2 = mse_poly, r2_poly
        
        return {
            "Linear Regression": {"MSE": mse_linear, "R2": r2_linear},
            "Polynomial Regression": {"MSE": mse_poly, "R2": r2_poly}
        }
    
    def predict(self, input_exposure):
        # Compare model performance
        if self.linear_r2 > self.poly_r2 and self.linear_mse < self.poly_mse:
            model = self.model_linear
            input_transformed = input_exposure
        else:
            model = self.model_polynomial
            input_transformed = input_exposure  # Pipeline handles transformation
        
        return model.predict(input_transformed)
