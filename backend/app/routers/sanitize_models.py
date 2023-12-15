from typing import List

from crud.device_crud import SanitizeModelsCRUD
from fastapi import APIRouter, Depends
from models.config import get_db
from schemas.device import SanitizeModelsCreate, SanitizeModelsInDB
from sqlalchemy.orm import Session

router = APIRouter(
    tags=["SanitizeModels"],
    dependencies=[Depends(get_db)],  # Set common dependency for all routes
)


# SanitizeModels Routes
@router.post(
    "/sanitizemodels/",
    response_model=SanitizeModelsInDB,
    tags=["SanitizeModels"],
)
async def create_sanitizemodel(
    sanitizemodel: SanitizeModelsCreate, connection: Session = Depends(get_db)
):
    return await SanitizeModelsCRUD.create(connection, sanitizemodel)


@router.get(
    "/sanitizemodels/",
    response_model=List[SanitizeModelsInDB],
    tags=["SanitizeModels"],
)
async def read_sanitizemodels(
    skip: int = 0, limit: int = 10, connection: Session = Depends(get_db)
):
    return await SanitizeModelsCRUD.get_all(connection, skip=skip, limit=limit)


@router.get(
    "/sanitizemodels/{sanitizemodel_id}",
    response_model=SanitizeModelsInDB,
    tags=["SanitizeModels"],
)
async def read_sanitizemodel(
    sanitizemodel_id: str, connection: Session = Depends(get_db)
):
    return await SanitizeModelsCRUD.get_by_id(connection, sanitizemodel_id)


@router.put(
    "/sanitizemodels/{sanitizemodel_id}",
    response_model=SanitizeModelsInDB,
    tags=["SanitizeModels"],
)
async def update_sanitizemodel(
    sanitizemodel_id: str,
    sanitizemodel: SanitizeModelsCreate,
    connection: Session = Depends(get_db),
):
    return await SanitizeModelsCRUD.update(connection, sanitizemodel_id, sanitizemodel)


@router.delete(
    "/sanitizemodels/{sanitizemodel_id}",
    response_model=dict,
    tags=["SanitizeModels"],
)
async def delete_sanitizemodel(
    sanitizemodel_id: str, connection: Session = Depends(get_db)
):
    return await SanitizeModelsCRUD.delete(connection, sanitizemodel_id)
