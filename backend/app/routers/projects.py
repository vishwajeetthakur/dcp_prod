from typing import List

from crud.device_crud import ProjectsCRUD
from fastapi import APIRouter, Depends
from models.config import get_db
from schemas.device import ProjectsCreate, ProjectsInDB
from sqlalchemy.orm import Session

router = APIRouter(
    tags=["Projects"],
    dependencies=[Depends(get_db)],  # Set common dependency for all routes
)


# Projects Routes
@router.post("/projects/", response_model=ProjectsInDB, tags=["Projects"])
async def create_project(project: ProjectsCreate, connection: Session = Depends(get_db)):
    return await ProjectsCRUD.create(connection, project)


@router.get("/projects/", response_model=List[ProjectsInDB], tags=["Projects"])
async def read_projects(
    skip: int = 0, limit: int = 10, connection: Session = Depends(get_db)
):
    return await ProjectsCRUD.get_all(connection, skip=skip, limit=limit)


@router.get("/projects/{project_id}", response_model=ProjectsInDB, tags=["Projects"])
async def read_project(project_id: str, connection: Session = Depends(get_db)):
    return await ProjectsCRUD.get_by_id(connection, project_id)


@router.put("/projects/{project_id}", response_model=ProjectsInDB, tags=["Projects"])
async def update_project(
    project_id: str,
    project: ProjectsCreate,
    connection: Session = Depends(get_db),
):
    return await ProjectsCRUD.update(connection, project_id, project)


@router.delete("/projects/{project_id}", response_model=dict, tags=["Projects"])
async def delete_project(project_id: str, connection: Session = Depends(get_db)):
    return await ProjectsCRUD.delete(connection, project_id)
