import uuid

from fastapi import HTTPException
from models.models import (
    DeviceActual,
    DeviceReachability,
    DeviceRegion,
    DeviceSoftware,
    DeviceTable,
    DispatchTicketDetails,
    DispatchTicketMapping,
    GraniteUda,
    InfoSource,
    Projects,
    ProjectTicketMapping,
    SanitizeModels,
    TicketDetails,
)
from schemas.device import (
    DeviceActualCreate,
    DeviceActualInDB,
    DeviceReachabilityCreate,
    DeviceReachabilityInDB,
    DeviceRegionCreate,
    DeviceRegionInDB,
    DeviceSoftwareCreate,
    DeviceSoftwareInDB,
    DeviceTableCreate,
    DeviceTableInDB,
    DispatchTicketDetailsCreate,
    DispatchTicketDetailsInDB,
    DispatchTicketMappingCreate,
    DispatchTicketMappingInDB,
    GraniteUdaCreate,
    GraniteUdaInDB,
    InfoSourceCreate,
    InfoSourceInDB,
    ProjectsCreate,
    ProjectsInDB,
    ProjectTicketMappingCreate,
    ProjectTicketMappingInDB,
    SanitizeModelsCreate,
    SanitizeModelsInDB,
    TicketDetailsCreate,
    TicketDetailsInDB,
)
from sqlalchemy import delete, insert, select, update


def common_crud_operations(db_model, primary_key_name, create_schema, update_schema):
    class CommonCRUD:
        @staticmethod
        async def create(db, obj_in: create_schema):
            device_key = str(uuid.uuid4())
            with open("log.txt", "a") as file:
                file.write(f"UUID: {device_key}")
            obj_data = obj_in.dict(exclude_unset=True)
            obj_data[primary_key_name] = device_key
            query = insert(db_model).values(**obj_data)
            await db.execute(query)
            return await CommonCRUD.get_by_id(db, device_key)

        @staticmethod
        async def get_by_id(db, obj_id: str):
            query = select(db_model).filter(getattr(db_model, primary_key_name) == obj_id)
            row = await db.fetch_one(query)
            if not row:
                raise HTTPException(status_code=404, detail="Device not found")
            return dict(row)

        @staticmethod
        async def get_all(db, skip: int = 0, limit: int = 10):
            query = select([db_model]).offset(skip).limit(limit)
            results = await db.fetch_all(query)

            return [dict(row) for row in results]

        @staticmethod
        async def update(db, obj_id: str, obj_in: update_schema):
            query = (
                update(db_model)
                .where(getattr(db_model, primary_key_name) == obj_id)
                .values(**obj_in.dict())
            )  # new change
            await db.execute(query)
            return await CommonCRUD.get_by_id(db, obj_id)

        @staticmethod
        async def delete(db, obj_id: str):
            existing = await CommonCRUD.get_by_id(db, obj_id)
            if not existing:
                raise HTTPException(status_code=404, detail="Item not found")

            query = delete(db_model).where(getattr(db_model, primary_key_name) == obj_id)
            result = await db.execute(query)

            if result:
                return {"detail": f"Item with ID {obj_id} successfully deleted"}
                # return {"result": result, "type": str(type(result))}
            else:
                raise HTTPException(status_code=404, detail="Device not found")

    return CommonCRUD


DeviceCRUD = common_crud_operations(
    DeviceTable, "device_key", DeviceTableCreate, DeviceTableInDB
)
GraniteUdaCRUD = common_crud_operations(
    GraniteUda, "granite_uda_key", GraniteUdaCreate, GraniteUdaInDB
)
DeviceActualCRUD = common_crud_operations(
    DeviceActual, "device_actual_key", DeviceActualCreate, DeviceActualInDB
)
SanitizeModelsCRUD = common_crud_operations(
    SanitizeModels,
    "sanitize_models_key",
    SanitizeModelsCreate,
    SanitizeModelsInDB,
)
DeviceReachabilityCRUD = common_crud_operations(
    DeviceReachability,
    "device_reachability_key",
    DeviceReachabilityCreate,
    DeviceReachabilityInDB,
)
InfoSourceCRUD = common_crud_operations(
    InfoSource, "info_source_key", InfoSourceCreate, InfoSourceInDB
)
DeviceRegionCRUD = common_crud_operations(
    DeviceRegion, "device_region_key", DeviceRegionCreate, DeviceRegionInDB
)
ProjectsCRUD = common_crud_operations(
    Projects, "projects_key", ProjectsCreate, ProjectsInDB
)
DeviceSoftwareCRUD = common_crud_operations(
    DeviceSoftware,
    "device_software_key",
    DeviceSoftwareCreate,
    DeviceSoftwareInDB,
)
TicketDetailsCRUD = common_crud_operations(
    TicketDetails, "ticket_details_key", TicketDetailsCreate, TicketDetailsInDB
)
ProjectTicketMappingCRUD = common_crud_operations(
    ProjectTicketMapping,
    "project_ticket_mapping_key",
    ProjectTicketMappingCreate,
    ProjectTicketMappingInDB,
)
DispatchTicketDetailsCRUD = common_crud_operations(
    DispatchTicketDetails,
    "dispatch_ticket_details_key",
    DispatchTicketDetailsCreate,
    DispatchTicketDetailsInDB,
)
DispatchTicketMappingCRUD = common_crud_operations(
    DispatchTicketMapping,
    "dispatch_ticket_mapping_key",
    DispatchTicketMappingCreate,
    DispatchTicketMappingInDB,
)
