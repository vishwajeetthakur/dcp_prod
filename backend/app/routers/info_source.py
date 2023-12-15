from typing import List

from crud.device_crud import InfoSourceCRUD
from fastapi import APIRouter, Depends
from models.config import get_db
from schemas.device import InfoSourceCreate, InfoSourceInDB
from sqlalchemy.orm import Session

router = APIRouter(
    tags=["InfoSource"],
    dependencies=[Depends(get_db)],  # Set common dependency for all routes
)


# InfoSource Routes
@router.post("/infosource/", response_model=InfoSourceInDB, tags=["InfoSource"])
async def create_infosource(
    infosource: InfoSourceCreate, connection: Session = Depends(get_db)
):
    return await InfoSourceCRUD.create(connection, infosource)


@router.get("/infosource/", response_model=List[InfoSourceInDB], tags=["InfoSource"])
async def read_infosources(
    skip: int = 0, limit: int = 10, connection: Session = Depends(get_db)
):
    return await InfoSourceCRUD.get_all(connection, skip=skip, limit=limit)


@router.get(
    "/infosource/{infosource_id}",
    response_model=InfoSourceInDB,
    tags=["InfoSource"],
)
async def read_infosource(infosource_id: str, connection: Session = Depends(get_db)):
    return await InfoSourceCRUD.get_by_id(connection, infosource_id)


@router.put(
    "/infosource/{infosource_id}",
    response_model=InfoSourceInDB,
    tags=["InfoSource"],
)
async def update_infosource(
    infosource_id: str,
    infosource: InfoSourceCreate,
    connection: Session = Depends(get_db),
):
    return await InfoSourceCRUD.update(connection, infosource_id, infosource)


@router.delete("/infosource/{infosource_id}", response_model=dict, tags=["InfoSource"])
async def delete_infosource(infosource_id: str, connection: Session = Depends(get_db)):
    return await InfoSourceCRUD.delete(connection, infosource_id)
