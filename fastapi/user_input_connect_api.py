from fastapi import FastAPI, HTTPException, Query, Depends
from typing import Optional, List, Any
import pandas as pd
import uvicorn
from fastapi.responses import JSONResponse

# Initialize a global DataFrame
df = pd.DataFrame()

async def lifespan(app: FastAPI):
    global df
    try:
        df = pd.read_csv("/Users/phongporter/Documents/GITHUB/cos30049/csv/all_countries_data_processed.csv")  # Replace 'data.csv' with your CSV file path
        print("CSV data loaded successfully.")
    except FileNotFoundError:
        print("CSV file not found.")
        df = pd.DataFrame()  # Empty DataFrame
    # You can add more startup logic here if needed
    yield
    # Add shutdown logic here if needed
    print("Shutting down FastAPI application.")

# Assign the lifespan to the FastAPI app
app = FastAPI(title="CSV Explorer API", lifespan=lifespan)

# Endpoint to get column names
@app.get("/columns")
def get_columns():
    if df.empty:
        raise HTTPException(status_code=404, detail="CSV data not loaded.")
    return {"columns": df.columns.tolist()}


@app.get("/get-by-name/{string_name}")
def get_name(*, string_name: str, name: Optional[str] = None, test: int):
    if df.empty:
        raise HTTPException(status_code=404, detail="CSV data not loaded.")

    # Filter the DataFrame where 'name' contains the string_name (case-insensitive)
    filtered_df = df[df['Country'].str.contains(string_name, case=False, na=False)]

    if filtered_df.empty:
        raise HTTPException(status_code=404, detail="No matching records found.")

    result = filtered_df.head().to_dict(orient="records")
    return {"results": result}


# Search (optional)
# country: input str
# mean - burden & exposure: input float
# year: input str
# type of pollution, units, cause name: dropdown.
# def get_unique_pollutants():
#     return df['Pollutant'].dropna().unique().tolist()
#
# def get_unique_units():
#     return df['Units'].dropna().unique().tolist()
#
# def get_unique_cause_names():
#     return df['Cause Name'].dropna().unique().tolist()

# @app.get("/search/")
# async def search(
#     country: Optional[str] = Query(None, description="Country name to filter by"),
#     mean_burden: Optional[float] = Query(None, description="Mean Burden to filter by"),
#     mean_exposure: Optional[float] = Query(None, description="Mean Exposure to filter by"),
#     year: Optional[str] = Query(None, description="Year to filter by"),
#     type_of_pollution: Optional[str] = Query(None, description="Pollutant type to filter by", enum=Depends(get_unique_pollutants)),
#     units: Optional[str] = Query(None, description="Units to filter by", enum=Depends(get_unique_units)),
#     cause_name: Optional[str] = Query(None, description="Cause name to filter by", enum=Depends(get_unique_cause_names))
# ):
#     # Start with the full dataset
#     filtered_df = df.copy()
#
#     # Apply filters if values are provided
#     if country:
#         filtered_df = filtered_df[filtered_df['Country'].str.contains(country, case=False)]
#     if mean_burden is not None:
#         filtered_df = filtered_df[filtered_df['Burden Mean'] >= mean_burden]
#     if mean_exposure is not None:
#         filtered_df = filtered_df[filtered_df['Exposure Mean'] >= mean_exposure]
#     if year:
#         filtered_df = filtered_df[filtered_df['Year'] == year]
#     if type_of_pollution:
#         filtered_df = filtered_df[filtered_df['Pollutant'] == type_of_pollution]
#     if units:
#         filtered_df = filtered_df[filtered_df['Units'] == units]
#     if cause_name:
#         filtered_df = filtered_df[filtered_df['Cause Name'] == cause_name]
#
#     # Return the filtered dataset as JSON
#     return JSONResponse(filtered_df.to_dict(orient="records"))


# @app.get("/get-by-metrics/{metrics}")
# def get_metrics(*, student_id: int, name: Optional[str] = None, test: int):
#     for student_id in students:
#         if students[student_id]["name"] == name:
#             return students[student_id]
#     return {"Data": "Not found"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)

# User input

