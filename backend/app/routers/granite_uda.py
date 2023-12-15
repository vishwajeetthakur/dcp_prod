from typing import List

from crud.device_crud import GraniteUdaCRUD
from fastapi import APIRouter, Depends
from models.config import get_db
from schemas.device import GraniteUdaBase, GraniteUdaCreate, GraniteUdaInDB
from sqlalchemy.orm import Session

router = APIRouter(
    tags=["GraniteUda"],
    dependencies=[Depends(get_db)],  # Set common dependency for all routes
)


# GraniteUda Routes
@router.post("/graniteudas/", response_model=GraniteUdaInDB, tags=["GraniteUda"])
async def create_graniteuda(
    graniteuda: GraniteUdaCreate, connection: Session = Depends(get_db)
):
    return await GraniteUdaCRUD.create(connection, graniteuda)


@router.get("/graniteudas/", response_model=List[GraniteUdaInDB], tags=["GraniteUda"])
async def read_graniteudas(
    skip: int = 0, limit: int = 10, connection: Session = Depends(get_db)
):
    return await GraniteUdaCRUD.get_all(connection, skip=skip, limit=limit)


@router.get(
    "/graniteudas/{graniteuda_id}",
    response_model=GraniteUdaInDB,
    tags=["GraniteUda"],
)
async def read_graniteuda(graniteuda_id: str, connection: Session = Depends(get_db)):
    return await GraniteUdaCRUD.get_by_id(connection, graniteuda_id)


@router.put(
    "/graniteudas/{graniteuda_id}",
    response_model=GraniteUdaInDB,
    tags=["GraniteUda"],
)
async def update_graniteuda(
    graniteuda_id: str,
    graniteuda: GraniteUdaBase,
    connection: Session = Depends(get_db),
):
    return await GraniteUdaCRUD.update(connection, graniteuda_id, graniteuda)


@router.delete("/graniteudas/{graniteuda_id}", response_model=dict, tags=["GraniteUda"])
async def delete_graniteuda(graniteuda_id: str, connection: Session = Depends(get_db)):
    return await GraniteUdaCRUD.delete(connection, graniteuda_id)
