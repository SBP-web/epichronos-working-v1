from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.schemas import PatientInput
from app.ml_interface import predict_risk

app = FastAPI(title="EpiChronos Backend API")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/predict")
def predict(data: PatientInput):
    """
    Receives patient + biomarker data from frontend
    Sends it to ML module
    Returns prediction
    """
    result = predict_risk(data)
    return result
