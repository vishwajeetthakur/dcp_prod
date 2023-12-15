from typing import List

from crud.device_crud import DeviceRegionCRUD
from fastapi import APIRouter, Depends
from models.config import get_db
from schemas.device import DeviceRegionCreate, DeviceRegionInDB
from sqlalchemy.orm import Session

router = APIRouter(
    tags=["DeviceRegion"],
    dependencies=[Depends(get_db)],  # Set common dependency for all routes
)


# DeviceRegion Routes
@router.post("/deviceregion/", response_model=DeviceRegionInDB, tags=["DeviceRegion"])
async def create_deviceregion(
    deviceregion: DeviceRegionCreate, connection: Session = Depends(get_db)
):
    return await DeviceRegionCRUD.create(connection, deviceregion)


@router.get(
    "/deviceregion/",
    response_model=List[DeviceRegionInDB],
    tags=["DeviceRegion"],
)
async def read_deviceregions(
    skip: int = 0, limit: int = 10, connection: Session = Depends(get_db)
):
    return await DeviceRegionCRUD.get_all(connection, skip=skip, limit=limit)


@router.get(
    "/deviceregion/{deviceregion_id}",
    response_model=DeviceRegionInDB,
    tags=["DeviceRegion"],
)
async def read_deviceregion(deviceregion_id: str, connection: Session = Depends(get_db)):
    return await DeviceRegionCRUD.get_by_id(connection, deviceregion_id)


@router.put(
    "/deviceregion/{deviceregion_id}",
    response_model=DeviceRegionInDB,
    tags=["DeviceRegion"],
)
async def update_deviceregion(
    deviceregion_id: str,
    deviceregion: DeviceRegionCreate,
    connection: Session = Depends(get_db),
):
    return await DeviceRegionCRUD.update(connection, deviceregion_id, deviceregion)


@router.delete(
    "/deviceregion/{deviceregion_id}",
    response_model=dict,
    tags=["DeviceRegion"],
)
async def delete_deviceregion(
    deviceregion_id: str, connection: Session = Depends(get_db)
):
    return await DeviceRegionCRUD.delete(connection, deviceregion_id)
