from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi import HTTPException
from pydantic import BaseModel, Field, field_validator, ValidationInfo
from typing import Optional
from datetime import date
import json
import requests

# Initialize FastAPI app
app = FastAPI(title="Air Quality Health API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # allow only requests originating from the React app
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)




