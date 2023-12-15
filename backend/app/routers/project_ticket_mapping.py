from typing import List

from crud.device_crud import ProjectTicketMappingCRUD
from fastapi import APIRouter, Depends
from models.config import get_db
from schemas.device import ProjectTicketMappingCreate, ProjectTicketMappingInDB
from sqlalchemy.orm import Session

router = APIRouter(
    tags=["ProjectTicketMapping"],
    dependencies=[Depends(get_db)],  # Set common dependency for all routes
)


# ProjectTicketMapping Routes
@router.post(
    "/projectticketmapping/",
    response_model=ProjectTicketMappingInDB,
    tags=["ProjectTicketMapping"],
)
async def create_projectticketmapping(
    projectticketmapping: ProjectTicketMappingCreate,
    connection: Session = Depends(get_db),
):
    return await ProjectTicketMappingCRUD.create(connection, projectticketmapping)


@router.get(
    "/projectticketmapping/",
    response_model=List[ProjectTicketMappingInDB],
    tags=["ProjectTicketMapping"],
)
async def read_projectticketmappings(
    skip: int = 0, limit: int = 10, connection: Session = Depends(get_db)
):
    return await ProjectTicketMappingCRUD.get_all(connection, skip=skip, limit=limit)


@router.get(
    "/projectticketmapping/{projectticketmapping_id}",
    response_model=ProjectTicketMappingInDB,
    tags=["ProjectTicketMapping"],
)
async def read_projectticketmapping(
    projectticketmapping_id: str, connection: Session = Depends(get_db)
):
    return await ProjectTicketMappingCRUD.get_by_id(connection, projectticketmapping_id)


@router.put(
    "/projectticketmapping/{projectticketmapping_id}",
    response_model=ProjectTicketMappingInDB,
    tags=["ProjectTicketMapping"],
)
async def update_projectticketmapping(
    projectticketmapping_id: str,
    projectticketmapping: ProjectTicketMappingCreate,
    connection: Session = Depends(get_db),
):
    return await ProjectTicketMappingCRUD.update(
        connection, projectticketmapping_id, projectticketmapping
    )


@router.delete(
    "/projectticketmapping/{projectticketmapping_id}",
    response_model=dict,
    tags=["ProjectTicketMapping"],
)
async def delete_projectticketmapping(
    projectticketmapping_id: str, connection: Session = Depends(get_db)
):
    return await ProjectTicketMappingCRUD.delete(connection, projectticketmapping_id)
