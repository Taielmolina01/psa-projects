import requests
from fastapi import APIRouter

router = APIRouter()

URL_API_FOREMANS = "https://anypoint.mulesoft.com/mocking/api/v1/sources/exchange/assets/754f50e8-20d8-4223-bbdc-56d50131d0ae/recursos-psa/1.0.0/m/api/recursos"

@router.get("/foremans")
def get_foremans():
    with requests.Session() as s:
        foremans = s.get(URL_API_FOREMANS)
    return foremans.json()
