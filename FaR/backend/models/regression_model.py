import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import PolynomialFeatures, MinMaxScaler
from sklearn.linear_model import LinearRegression
from sklearn.metrics import r2_score, mean_squared_error 
from sklearn.preprocessing import PolynomialFeatures
from joblib import dump, load
import os

# Paths for data and model storage
BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
CSV_FILE_PATH = os.path.join(BASE_DIR, 'data', 'air_quality_health_2.csv')
PREDICT_CSV_FILE_PATH = os.path.join(BASE_DIR, 'data', 'predictions.csv')
MODEL_PATH = os.path.join(BASE_DIR, 'model', 'regression_model.pkl')

class RegressionModel:
    def __init__(self):
        self.model = LinearRegression()
        train_dataset = pd.read_csv(CSV_FILE_PATH)
        train_dataset = train_dataset[(train_dataset['Cause Name'] == 'All causes')]

    def preprocess_data(country, pollutant):
        train_dataset = train_dataset[(train_dataset['Country'] == country) & (train_dataset['Pollutant'] == pollutant)] 

        Q1_exposure = train_dataset['Exposure Mean'].quantile(0.25)
        Q3_exposure = train_dataset['Exposure Mean'].quantile(0.75)
        IQR_exposure = Q3_exposure - Q1_exposure

        # Calculate lower and upper bounds for 'Exposure Mean'
        lower_bound_exposure = Q1_exposure - 1.5 * IQR_exposure
        upper_bound_exposure = Q3_exposure + 1.5 * IQR_exposure

        # Calculate Q1 and Q3 for 'Burden Mean'
        Q1_burden = train_dataset['Burden Mean'].quantile(0.25)
        Q3_burden = train_dataset['Burden Mean'].quantile(0.75)
        IQR_burden = Q3_burden - Q1_burden

        # Calculate lower and upper bounds for 'Burden Mean'
        lower_bound_burden = Q1_burden - 1.5 * IQR_burden
        upper_bound_burden = Q3_burden + 1.5 * IQR_burden

        # Remove outliers from both 'Exposure Mean' and 'Burden Mean'
        dataset_cleaned = train_dataset[
            (train_dataset['Exposure Mean'] >= lower_bound_exposure) & (train_dataset['Exposure Mean'] <= upper_bound_exposure) & 
            (train_dataset['Burden Mean'] >= lower_bound_burden) & (train_dataset['Burden Mean'] <= upper_bound_burden)
        ]

        x = dataset_cleaned['Exposure Mean']
        y = dataset_cleaned['Burden Mean']

        # scaler = MinMaxScaler()
        # x = scaler.fit_transform(x)
        # y = scaler.fit_transform(y.values.reshape(-1, 1))

        return x, y
    
    def train_linear_model(self,x,y):
        #Train the model
        self.model.fit(x,y)

        #Make predictions on the test data
        prediction = self.model.predict(x)

        #Evaluate the model using Mean Squared Error and R^2 score
        mse = mean_squared_error(y, prediction)
        r2 = r2_score(y, prediction)

        return mse, r2

    def train_polynomial_model(self,x,y):
        poly = PolynomialFeatures(degree=4)
        x_poly = poly.fit_transform(x)

        self.model.fit(x_poly,y)

        prediction = self.model.predict(x_poly)

        mse = mean_squared_error(y, prediction)
        r2 = r2_score(y, prediction)

        return mse, r2
    
    def save_model(model, path=MODEL_PATH):
        # Save model to disk
        dump(model, path)

    def predict(self,input_exposure):
        model = load(MODEL_PATH)
        return model.predict(input_exposure)
    
if __name__ == "main":
    model = RegressionModel()
