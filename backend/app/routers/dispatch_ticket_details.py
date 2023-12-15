from typing import List

from crud.device_crud import DispatchTicketDetailsCRUD
from fastapi import APIRouter, Depends
from models.config import get_db
from schemas.device import DispatchTicketDetailsCreate, DispatchTicketDetailsInDB
from sqlalchemy.orm import Session

router = APIRouter(
    tags=["DispatchTicketDetails"],
    dependencies=[Depends(get_db)],  # Set common dependency for all routes
)


# DispatchTicketDetails Routes
@router.post(
    "/dispatchticketdetails/",
    response_model=DispatchTicketDetailsInDB,
    tags=["DispatchTicketDetails"],
)
async def create_dispatchticketdetail(
    dispatchticketdetail: DispatchTicketDetailsCreate,
    connection: Session = Depends(get_db),
):
    return await DispatchTicketDetailsCRUD.create(connection, dispatchticketdetail)


@router.get(
    "/dispatchticketdetails/",
    response_model=List[DispatchTicketDetailsInDB],
    tags=["DispatchTicketDetails"],
)
async def read_dispatchticketdetails(
    skip: int = 0, limit: int = 10, connection: Session = Depends(get_db)
):
    return await DispatchTicketDetailsCRUD.get_all(connection, skip=skip, limit=limit)


@router.get(
    "/dispatchticketdetails/{dispatchticketdetail_id}",
    response_model=DispatchTicketDetailsInDB,
    tags=["DispatchTicketDetails"],
)
async def read_dispatchticketdetail(
    dispatchticketdetail_id: str, connection: Session = Depends(get_db)
):
    return await DispatchTicketDetailsCRUD.get_by_id(connection, dispatchticketdetail_id)


@router.put(
    "/dispatchticketdetails/{dispatchticketdetail_id}",
    response_model=DispatchTicketDetailsInDB,
    tags=["DispatchTicketDetails"],
)
async def update_dispatchticketdetail(
    dispatchticketdetail_id: str,
    dispatchticketdetail: DispatchTicketDetailsCreate,
    connection: Session = Depends(get_db),
):
    return await DispatchTicketDetailsCRUD.update(
        connection, dispatchticketdetail_id, dispatchticketdetail
    )


@router.delete(
    "/dispatchticketdetails/{dispatchticketdetail_id}",
    response_model=dict,
    tags=["DispatchTicketDetails"],
)
async def delete_dispatchticketdetail(
    dispatchticketdetail_id: str, connection: Session = Depends(get_db)
):
    return await DispatchTicketDetailsCRUD.delete(connection, dispatchticketdetail_id)
