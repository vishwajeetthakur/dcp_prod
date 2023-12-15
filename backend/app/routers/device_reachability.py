from typing import List

from crud.device_crud import DeviceReachabilityCRUD
from fastapi import APIRouter, Depends
from models.config import get_db
from schemas.device import DeviceReachabilityCreate, DeviceReachabilityInDB
from sqlalchemy.orm import Session

# Instantiate the router with a common dependency
router = APIRouter(
    tags=["DeviceReachability"],
    dependencies=[Depends(get_db)],  # Set common dependency for all routes
)


# DeviceReachability Routes
@router.post(
    "/devicereachability/",
    response_model=DeviceReachabilityInDB,
    tags=["DeviceReachability"],
)
async def create_devicereachability(
    devicereachability: DeviceReachabilityCreate,
    connection: Session = Depends(get_db),
):
    return await DeviceReachabilityCRUD.create(connection, devicereachability)


@router.get(
    "/devicereachability/",
    response_model=List[DeviceReachabilityInDB],
    tags=["DeviceReachability"],
)
async def read_devicereachabilities(
    skip: int = 0, limit: int = 10, connection: Session = Depends(get_db)
):
    return await DeviceReachabilityCRUD.get_all(connection, skip=skip, limit=limit)


@router.get(
    "/devicereachability/{devicereachability_id}",
    response_model=DeviceReachabilityInDB,
    tags=["DeviceReachability"],
)
async def read_devicereachability(
    devicereachability_id: str, connection: Session = Depends(get_db)
):
    return await DeviceReachabilityCRUD.get_by_id(connection, devicereachability_id)


@router.put(
    "/devicereachability/{devicereachability_id}",
    response_model=DeviceReachabilityInDB,
    tags=["DeviceReachability"],
)
async def update_devicereachability(
    devicereachability_id: str,
    devicereachability: DeviceReachabilityCreate,
    connection: Session = Depends(get_db),
):
    return await DeviceReachabilityCRUD.update(
        connection, devicereachability_id, devicereachability
    )


@router.delete(
    "/devicereachability/{devicereachability_id}",
    response_model=dict,
    tags=["DeviceReachability"],
)
async def delete_devicereachability(
    devicereachability_id: str, connection: Session = Depends(get_db)
):
    return await DeviceReachabilityCRUD.delete(connection, devicereachability_id)
