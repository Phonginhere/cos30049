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

        scaler = MinMaxScaler()
        x_normalised = scaler.fit_transform(x)

        return x_normalised, y
            
    def train_linear_model(self, x, y):
        # Train the linear model
        self.model_linear.fit(x, y)

        # Make predictions on the training data
        prediction = self.model_linear.predict(x)

        # Evaluate the model using Mean Squared Error and R^2 score
        mse = mean_squared_error(y, prediction)
        r2 = r2_score(y, prediction)

        self.linear_mse, self.linear_r2 = mse, r2

        return mse, r2

    def train_polynomial_model(self, x, y):
        # Train the polynomial model using the pipeline
        self.model_polynomial.fit(x, y)

        # Make predictions on the training data
        prediction = self.model_polynomial.predict(x)

        # Evaluate the model using Mean Squared Error and R^2 score
        mse = mean_squared_error(y, prediction)
        r2 = r2_score(y, prediction)

        self.poly_mse, self.poly_r2 = mse, r2

        return mse, r2
    
    def predict(self, input_exposure):
        # Compare model performance
        if self.linear_r2 > self.poly_r2 and self.linear_mse < self.poly_mse:
            model = self.model_linear
            input_transformed = input_exposure
        else:
            model = self.model_polynomial
            input_transformed = input_exposure  # Pipeline handles transformation
        
        return model.predict(input_transformed)
