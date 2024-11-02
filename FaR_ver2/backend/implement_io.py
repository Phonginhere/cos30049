import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from sklearn.preprocessing import MinMaxScaler, OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline

# Load the data
CSV_FILE_PATH = "./backend/data/air_quality_health_2.csv"
data = pd.read_csv(CSV_FILE_PATH)

# Filter the necessary columns
country_data_cleaned = data[['ISO3', 'Pollutant', 'Exposure Mean', 'Burden Mean']]

# Split the data into features and target variable
X = country_data_cleaned[['ISO3', 'Pollutant', 'Exposure Mean']]
y = country_data_cleaned['Burden Mean']

# Normalize data in a scale of min and max value from 0 to 1 scale
def normalize_data(x, y):
    scaler_X = ColumnTransformer(
        transformers=[
            ('cat', OneHotEncoder(), ['ISO3', 'Pollutant']),  # One-hot encode categorical features
            ('num', MinMaxScaler(), ['Exposure Mean'])  # Normalize numerical features
        ])
    scaler_y = MinMaxScaler()
    
    X_scaled = scaler_X.fit_transform(x)  # Normalize features
    y_scaled = scaler_y.fit_transform(y.values.reshape(-1, 1))  # Normalize target
    
    return X_scaled, y_scaled, scaler_X, scaler_y

# Denormalize a single data point to the original scale
def denormalize_single_value(value, scaler):
    original_value = scaler.inverse_transform(np.array([[value]]))
    return original_value[0, 0]

# Normalize the data
x_scaled, y_scaled, scaler_X, scaler_y = normalize_data(X, y)

# Split the data into training and test sets (80% training, 20% testing)
X_train, X_test, y_train, y_test = train_test_split(x_scaled, y_scaled, test_size=0.2, random_state=42)

# Initialize the Linear Regression model
lr = LinearRegression()

# Train the model
lr.fit(X_train, y_train)

# Function to predict Burden Mean based on user inputs
def predict_burden_mean(iso3, pollutant, exposure_mean):
    # Create input DataFrame for prediction
    input_data = pd.DataFrame({
        'ISO3': [iso3],
        'Pollutant': [pollutant],
        'Exposure Mean': [exposure_mean]
    })

    # Normalize the input data
    input_scaled = scaler_X.transform(input_data)  # Use the fitted scaler for transformation
    y_single = lr.predict(input_scaled)  # Predict the normalized value
    predicted_burden_mean = denormalize_single_value(y_single[0][0], scaler_y)  # Denormalize the predicted value
    
    return predicted_burden_mean

# Example usage:
iso3_input = 'VNM'  # Replace with actual ISO3 code
pollutant_input = 'no2'  # Replace with actual pollutant
exposure_mean_input = 13.2  # Replace with actual exposure mean

predicted_burden_mean = predict_burden_mean(iso3_input, pollutant_input, exposure_mean_input)

print(f"User input - ISO3: {iso3_input}, Pollutant: {pollutant_input}, Exposure Mean: {exposure_mean_input}")
print(f"Predicted Burden Mean: {predicted_burden_mean}")
