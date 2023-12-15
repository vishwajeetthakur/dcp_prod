from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from models.config import database
from routers import (
    device,
    device_actual,
    device_reachability,
    device_regions,
    device_software,
    dispatch_ticket_details,
    dispatch_ticket_mapping,
    get_all_device_info_by_devicekey,
    get_all_device_info_by_hostname,
    get_all_device_info_by_ipaddress,
    granite_uda,
    info_source,
    project_ticket_mapping,
    projects,
    sanitize_models,
    ticket_details,
)

app = FastAPI()


@app.on_event("startup")
async def startup():
    await database.connect()


@app.on_event("shutdown")
async def shutdown():
    await database.disconnect()


app.include_router(get_all_device_info_by_ipaddress.router)
app.include_router(get_all_device_info_by_devicekey.router)
app.include_router(get_all_device_info_by_hostname.router)
app.include_router(device_actual.router)
app.include_router(device_reachability.router)
app.include_router(device_regions.router)
app.include_router(device_software.router)
app.include_router(device.router)
app.include_router(dispatch_ticket_details.router)
app.include_router(dispatch_ticket_mapping.router)
app.include_router(granite_uda.router)
app.include_router(info_source.router)
app.include_router(project_ticket_mapping.router)
app.include_router(projects.router)
app.include_router(sanitize_models.router)
app.include_router(ticket_details.router)

origins = [
    "http://localhost",
    "http://localhost:3000",
    "http://localhost:8088",
    "*",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
