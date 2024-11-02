# app/main.py
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import os

# from react_helloworld.backend.app.api.endpoints import regression

app = FastAPI()


# app.include_router(regression.router)

# Configure CORS
origins = [
    "http://localhost:3001",  # React frontend
    # Add other origins if needed
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # Allow only specified origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Define the path to the CSV file
CSV_FILE_PATH = os.path.join(os.path.dirname(__file__), "../data/all_countries_data_processed.csv")

@app.get("/api/data")
def get_data():
    try:
        df = pd.read_csv(CSV_FILE_PATH, index_col=0)
        data = df.to_dict(orient="records")
        return {"data": data}
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail="CSV file not found.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
