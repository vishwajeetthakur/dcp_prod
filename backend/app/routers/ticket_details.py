from typing import List

from crud.device_crud import TicketDetailsCRUD
from fastapi import APIRouter, Depends
from models.config import get_db
from schemas.device import TicketDetailsCreate, TicketDetailsInDB
from sqlalchemy.orm import Session

router = APIRouter(
    tags=["TicketDetails"],
    dependencies=[Depends(get_db)],  # Set common dependency for all routes
)


# TicketDetails Routes
@router.post("/ticketdetails/", response_model=TicketDetailsInDB, tags=["TicketDetails"])
async def create_ticketdetail(
    ticketdetail: TicketDetailsCreate, connection: Session = Depends(get_db)
):
    return await TicketDetailsCRUD.create(connection, ticketdetail)


@router.get(
    "/ticketdetails/",
    response_model=List[TicketDetailsInDB],
    tags=["TicketDetails"],
)
async def read_ticketdetails(
    skip: int = 0, limit: int = 10, connection: Session = Depends(get_db)
):
    return await TicketDetailsCRUD.get_all(connection, skip=skip, limit=limit)


@router.get(
    "/ticketdetails/{ticketdetail_id}",
    response_model=TicketDetailsInDB,
    tags=["TicketDetails"],
)
async def read_ticketdetail(ticketdetail_id: str, connection: Session = Depends(get_db)):
    return await TicketDetailsCRUD.get_by_id(connection, ticketdetail_id)


@router.put(
    "/ticketdetails/{ticketdetail_id}",
    response_model=TicketDetailsInDB,
    tags=["TicketDetails"],
)
async def update_ticketdetail(
    ticketdetail_id: str,
    ticketdetail: TicketDetailsCreate,
    connection: Session = Depends(get_db),
):
    return await TicketDetailsCRUD.update(connection, ticketdetail_id, ticketdetail)


@router.delete(
    "/ticketdetails/{ticketdetail_id}",
    response_model=dict,
    tags=["TicketDetails"],
)
async def delete_ticketdetail(
    ticketdetail_id: str, connection: Session = Depends(get_db)
):
    return await TicketDetailsCRUD.delete(connection, ticketdetail_id)
