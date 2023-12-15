from typing import List

from crud.device_crud import DispatchTicketMappingCRUD
from fastapi import APIRouter, Depends
from models.config import get_db
from schemas.device import DispatchTicketMappingCreate, DispatchTicketMappingInDB
from sqlalchemy.orm import Session

router = APIRouter(
    tags=["DispatchTicketMapping"],
    dependencies=[Depends(get_db)],  # Set common dependency for all routes
)


# DispatchTicketMapping Routes
@router.post(
    "/dispatchticketmapping/",
    response_model=DispatchTicketMappingInDB,
    tags=["DispatchTicketMapping"],
)
async def create_dispatchticketmapping(
    dispatchticketmapping: DispatchTicketMappingCreate,
    db: Session = Depends(get_db),
):
    async with db as connection:
        return await DispatchTicketMappingCRUD.create(connection, dispatchticketmapping)


@router.get(
    "/dispatchticketmapping/",
    response_model=List[DispatchTicketMappingInDB],
    tags=["DispatchTicketMapping"],
)
async def read_dispatchticketmappings(
    skip: int = 0, limit: int = 10, db: Session = Depends(get_db)
):
    async with db as connection:
        return await DispatchTicketMappingCRUD.get_all(connection, skip=skip, limit=limit)


@router.get(
    "/dispatchticketmapping/{dispatchticketmapping_id}",
    response_model=DispatchTicketMappingInDB,
    tags=["DispatchTicketMapping"],
)
async def read_dispatchticketmapping(
    dispatchticketmapping_id: str, db: Session = Depends(get_db)
):
    async with db as connection:
        return await DispatchTicketMappingCRUD.get_by_id(
            connection, dispatchticketmapping_id
        )


@router.put(
    "/dispatchticketmapping/{dispatchticketmapping_id}",
    response_model=DispatchTicketMappingInDB,
    tags=["DispatchTicketMapping"],
)
async def update_dispatchticketmapping(
    dispatchticketmapping_id: str,
    dispatchticketmapping: DispatchTicketMappingCreate,
    db: Session = Depends(get_db),
):
    async with db as connection:
        return await DispatchTicketMappingCRUD.update(
            connection, dispatchticketmapping_id, dispatchticketmapping
        )


@router.delete(
    "/dispatchticketmapping/{dispatchticketmapping_id}",
    response_model=dict,
    tags=["DispatchTicketMapping"],
)
async def delete_dispatchticketmapping(
    dispatchticketmapping_id: str, db: Session = Depends(get_db)
):
    async with db as connection:
        return await DispatchTicketMappingCRUD.delete(
            connection, dispatchticketmapping_id
        )
