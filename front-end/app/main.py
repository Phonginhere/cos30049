from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import joblib
import numpy as np
from pydantic import BaseModel

app = FastAPI()

# Allow CORS for all origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React app URL
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods
    allow_headers=["*"],  # Allow all headers
)

# Load model and define endpoints
model = joblib.load("app\\bmi_classifier.pkl")

class BmiData(BaseModel):
    height: float
    weight: float

@app.post("/predict")
async def predict(data: BmiData):
    input_data = np.array([[data.height, data.weight]])
    prediction = model.predict(input_data)
    categories = {0: "underweight", 1: "normal", 2: "overweight"}
    result = categories.get(prediction[0], "unknown")
    return {"prediction": result}
