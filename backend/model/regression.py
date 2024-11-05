import os
import pandas as pd
from fastapi import HTTPException
from typing import List, Tuple, Optional
import numpy as np

from sklearn.model_selection import train_test_split
from sklearn.preprocessing import PolynomialFeatures, MinMaxScaler
from sklearn.linear_model import LinearRegression
from sklearn.metrics import r2_score, mean_squared_error


def read_csv(file_path:str):
    """
    Args:
        - file_path: File path of the dataset
    Return:
        - Data frame of the data set read from file_path
    """
    full_path = os.path.abspath(file_path)
    try:
        dataset = pd.read_csv(file_path)
    except:
        err = f"File not found at the specified path: {full_path}"
        raise FileNotFoundError(err)
    
    return dataset


def filter_data(dataset, country_code:str, pollutant:str):
    """
    Filter specific country in the dataset by country code and pollutant type

    Args:
        - country_code: Country code of the country
        - pollutant: pollutant type (pm25, no2, ozone, hap)
    Return:
        - Dataset of specific country with pollutant type
    """
    legal_country_code = dataset['ISO3'].unique().tolist()
    legal_pollutant_type = dataset['Pollutant'].unique().tolist()

    if country_code in legal_country_code:
        if pollutant in legal_pollutant_type:
            try:
                country_data = dataset[(dataset['ISO3'] == country_code) & (dataset['Pollutant'] == pollutant)] 
            except:
                raise Exception('Country data not founded')
        else:
            raise ValueError('Pollutant type is not recognized')
    else:
        raise ValueError('Country code not founded')
    
    return country_data

def normalise_data(x,y):
    """
    Normalize data in a scale of min and max value from 0 to 1 scale
    """
    scaler_X = MinMaxScaler()
    scaler_y = MinMaxScaler()
    X_scaled = scaler_X.fit_transform(x)  # Normalize features
    y_scaled = scaler_y.fit_transform(y.values.reshape(-1, 1))  # Normalize target
    return X_scaled, y_scaled, scaler_X, scaler_y


def denormalize_single(value, scaler: MinMaxScaler):
    """
    # Denormalize a single data point to the original scale
    """
    # Convert to 2D array for scaler compatibility, then return the original value
    original_value = scaler.inverse_transform(np.array([[value]]))
    return original_value[0, 0]

def clean_outliner(data, x, y, percentile: int = 0.25):
    """
    Clean outliner using IQR method

    Args:
        - data: dataset need to be cleaned
        - x: Numerical values of x
        - y: Numerical values of y
        - percentile: Remove outliner outsite of 75% as default
    Return:
        - Dataset with 75 percentile of IQR 
    """
    # Calculate Q1 (25th percentile) and Q3 (75th percentile) for x
    Q1_x = x.quantile(percentile)
    Q3_x = x.quantile(1-percentile)
    IQR_x = Q3_x - Q1_x

    # Calculate lower and upper bounds for x
    lower_bound_x = Q1_x - 1.5 * IQR_x
    upper_bound_x = Q3_x + 1.5 * IQR_x

    # Calculate Q1 and Q3 for y
    Q1_y = y.quantile(0.25)
    Q3_y = y.quantile(0.75)
    IQR_y = Q3_y - Q1_y

    # Calculate lower and upper bounds for y
    lower_bound_y = Q1_y - 1.5 * IQR_y
    upper_bound_y = Q3_y + 1.5 * IQR_y

    # Remove outliers from both x and y
    return data[
        (x >= lower_bound_x) & (x <= upper_bound_x) & 
        (y >= lower_bound_y) & (y <= upper_bound_y)
    ]

def train_linear_regression(X_train, y_train, polynomial:bool = False, poly_degrees:int = 4) -> LinearRegression:
    """
    Train a Linear or Polynomial Regression model.

    Args:
        X_train (np.ndarray): Training feature array.
        y_train (np.ndarray): Training target array.

    Returns:
        LinearRegression: Trained Linear Regression model.
    """
    model = LinearRegression()
    if polynomial:
        model.fit(X_train, y_train)
    else:
        poly = PolynomialFeatures(degree=poly_degrees)
        X_train_poly = poly.fit_transform(X_train)
        poly.fit_transform(X_train_poly)
        model.fit(X_train_poly, y_train)

    return model

def evaluate_model(model, X_test, y_test) -> Tuple[float, float]:
    """
    Evaluate the model using Mean Squared Error and R^2 Score.

    Args:
        model: Trained regression model.
        X_test (np.ndarray): Testing feature array.
        y_test (np.ndarray): Testing target array.

    Returns:
        Tuple containing MSE and R^2 Score.
    """
    y_pred = model.predict(X_test)
    mse = mean_squared_error(y_test, y_pred)
    r2 = r2_score(y_test, y_pred)
    return mse, r2

def split_data(X_scaled, y_scaled, test_size=0.2, random_state=42) -> Tuple:
    """
    Split the scaled data into training and testing sets.

    Args:
        X_scaled (np.ndarray): Scaled feature array.
        y_scaled (np.ndarray): Scaled target array.
        test_size (float, optional): Proportion of the dataset to include in the test split. Defaults to 0.2.
        random_state (int, optional): Controls the shuffling applied to the data before applying the split. Defaults to 42.

    Returns:
        Tuple: Split data (X_train, X_test, y_train, y_test).
    """
    return train_test_split(
        X_scaled, y_scaled, test_size=test_size, random_state=random_state
    )

def process_data(data,x,y):
    data = clean_outliner(data)
    
    pass


file_path = '../datasets/all_countries_data_processed.csv'

data = read_csv(file_path)

data_country = filter_data(data,'USA','pm25')



