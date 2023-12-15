from typing import List

from crud.device_crud import DeviceActualCRUD
from fastapi import APIRouter, Depends
from models.config import get_db
from schemas.device import DeviceActualBase, DeviceActualCreate, DeviceActualInDB
from sqlalchemy.orm import Session

# Instantiate the router with a common dependency
router = APIRouter(
    tags=["DeviceActual"],
    dependencies=[Depends(get_db)],  # Set common dependency for all routes
)


# DeviceActual Routes
@router.post("/deviceactuals/", response_model=DeviceActualInDB)
async def create_deviceactual(
    deviceactual: DeviceActualCreate, connection: Session = Depends(get_db)
):
    return await DeviceActualCRUD.create(connection, deviceactual)


@router.get("/deviceactuals/", response_model=List[DeviceActualInDB])
async def read_deviceactuals(
    skip: int = 0, limit: int = 10, connection: Session = Depends(get_db)
):
    return await DeviceActualCRUD.get_all(connection, skip=skip, limit=limit)


@router.get("/deviceactuals/{deviceactual_id}", response_model=DeviceActualInDB)
async def read_deviceactual(deviceactual_id: str, connection: Session = Depends(get_db)):
    return await DeviceActualCRUD.get_by_id(connection, deviceactual_id)


@router.put("/deviceactuals/{deviceactual_id}", response_model=DeviceActualInDB)
async def update_deviceactual(
    deviceactual_id: str,
    deviceactual: DeviceActualBase,
    connection: Session = Depends(get_db),
):
    return await DeviceActualCRUD.update(connection, deviceactual_id, deviceactual)


@router.delete("/deviceactuals/{deviceactual_id}", response_model=dict)
async def delete_deviceactual(
    deviceactual_id: str, connection: Session = Depends(get_db)
):
    return await DeviceActualCRUD.delete(connection, deviceactual_id)
