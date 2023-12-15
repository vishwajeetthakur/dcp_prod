from typing import List

from crud.device_crud import DeviceCRUD
from fastapi import APIRouter, Depends
from models.config import get_db
from schemas.device import DeviceTableBase, DeviceTableCreate, DeviceTableInDB
from sqlalchemy.orm import Session

router = APIRouter(
    tags=["DeviceTable"],
    dependencies=[Depends(get_db)],  # Set common dependency for all routes
)


# Device Routes
@router.post("/devices/", response_model=DeviceTableInDB)
async def create_device(device: DeviceTableCreate, connection: Session = Depends(get_db)):
    return await DeviceCRUD.create(connection, device)


@router.get("/devices/", response_model=List[DeviceTableInDB])
async def read_devices(
    skip: int = 0, limit: int = 10, connection: Session = Depends(get_db)
):
    return await DeviceCRUD.get_all(connection, skip=skip, limit=limit)


@router.get("/devices/{device_id}", response_model=DeviceTableInDB)
async def read_device(device_id: str, connection: Session = Depends(get_db)):
    return await DeviceCRUD.get_by_id(connection, device_id)


@router.put("/devices/{device_id}", response_model=DeviceTableInDB)
async def update_device(
    device_id: str,
    device: DeviceTableBase,
    connection: Session = Depends(get_db),
):
    return await DeviceCRUD.update(connection, device_id, device)


@router.delete("/devices/{device_id}", response_model=dict)
async def delete_device(device_id: str, connection: Session = Depends(get_db)):
    return await DeviceCRUD.delete(connection, device_id)
