# backend/main.py
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field, EmailStr
from typing import Optional

app = FastAPI()

# CORS Configuration
origins = [
    "http://localhost:3002",  # React frontend origin
    # Add other allowed origins if necessary
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic Models
class User(BaseModel):
    id: int
    name: str
    email: EmailStr

class UserInput(BaseModel):
    name: str = Field(..., min_length=3, max_length=50)
    email: EmailStr
    age: Optional[int] = Field(None, ge=18)

# Dummy Data
fake_users_db = {
    1: {"id": 1, "name": "John Doe", "email": "john.doe@example.com"},
}

# Endpoints
@app.get("/api/user/{user_id}", response_model=User)
async def get_user(user_id: int):
    user = fake_users_db.get(user_id)
    if not user:
        raise HTTPException(status_code=404, detail={"error": "User not found."})
    return user

@app.post("/api/user", response_model=User)
async def create_user(user: UserInput):
    errors = {}

    # Custom Validation Example
    if "admin" in user.name.lower():
        errors["name"] = "Name cannot contain 'admin'."

    if errors:
        raise HTTPException(status_code=400, detail=errors)

    # Simulate User Creation
    new_id = max(fake_users_db.keys()) + 1
    new_user = {"id": new_id, "name": user.name, "email": user.email}
    fake_users_db[new_id] = new_user
    return new_user
