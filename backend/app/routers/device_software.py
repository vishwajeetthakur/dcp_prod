from typing import List

from crud.device_crud import DeviceSoftwareCRUD
from fastapi import APIRouter, Depends
from models.config import get_db
from schemas.device import DeviceSoftwareCreate, DeviceSoftwareInDB
from sqlalchemy.orm import Session

router = APIRouter(
    tags=["DeviceSoftware"],
    dependencies=[Depends(get_db)],  # Set common dependency for all routes
)


# DeviceSoftware Routes
@router.post(
    "/devicesoftware/",
    response_model=DeviceSoftwareInDB,
    tags=["DeviceSoftware"],
)
async def create_devicesoftware(
    devicesoftware: DeviceSoftwareCreate, connection: Session = Depends(get_db)
):
    return await DeviceSoftwareCRUD.create(connection, devicesoftware)


@router.get(
    "/devicesoftware/",
    response_model=List[DeviceSoftwareInDB],
    tags=["DeviceSoftware"],
)
async def read_devicesoftwares(
    skip: int = 0, limit: int = 10, connection: Session = Depends(get_db)
):
    return await DeviceSoftwareCRUD.get_all(connection, skip=skip, limit=limit)


@router.get(
    "/devicesoftware/{devicesoftware_id}",
    response_model=DeviceSoftwareInDB,
    tags=["DeviceSoftware"],
)
async def read_devicesoftware(
    devicesoftware_id: str, connection: Session = Depends(get_db)
):
    return await DeviceSoftwareCRUD.get_by_id(connection, devicesoftware_id)


@router.put(
    "/devicesoftware/{devicesoftware_id}",
    response_model=DeviceSoftwareInDB,
    tags=["DeviceSoftware"],
)
async def update_devicesoftware(
    devicesoftware_id: str,
    devicesoftware: DeviceSoftwareCreate,
    connection: Session = Depends(get_db),
):
    return await DeviceSoftwareCRUD.update(connection, devicesoftware_id, devicesoftware)


@router.delete(
    "/devicesoftware/{devicesoftware_id}",
    response_model=dict,
    tags=["DeviceSoftware"],
)
async def delete_devicesoftware(
    devicesoftware_id: str, connection: Session = Depends(get_db)
):
    return await DeviceSoftwareCRUD.delete(connection, devicesoftware_id)
