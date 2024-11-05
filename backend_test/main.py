from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi import HTTPException
from pydantic import BaseModel, Field, field_validator, ValidationInfo
from typing import Optional
from datetime import date
import model.regression

import logging, time, requests, json


# Initialize FastAPI app
app = FastAPI(title="Air Quality Health API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # allow only requests originating from the React app
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(levelname)s: %(message)s')

# Middleware to measure response time
@app.middleware("http")
async def measure_response_time(request: Request, call_next):
    start_time = time.time()
    response = await call_next(request)
    end_time = time.time()
    response_time = end_time - start_time

    if request.url.path in ["/predict", "/pollutants", "/"]:
        logging.info(f"{request.method} {request.url.path} completed in {response_time:.4f} seconds")

    return response




