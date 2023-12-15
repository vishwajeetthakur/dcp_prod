from datetime import datetime
from uuid import UUID

from pydantic import BaseModel


# DeviceTable Schema
class DeviceTableBase(BaseModel):
    equip_inst_id: int
    status: str | None = None
    category: str | None = None
    vendor: str | None = None
    model: str | None = None
    description: str | None = None
    shelf: str | None = None
    hostname: str | None = None
    ip_address_v4: str | None = None
    netmask_v4: str | None = None
    ip_address_v6: str | None = None
    netmask_v6: str | None = None


class DeviceTableCreate(DeviceTableBase):
    pass


class DeviceTableInDB(DeviceTableBase):
    device_key: UUID
    created_timestamp: datetime
    last_updated_timestamp: datetime | None

    class Config:
        from_attributes = True


# GraniteUda Schema
class GraniteUdaBase(BaseModel):
    device_key: UUID
    device_config_equipment: str | None = None
    tid: str | None = None
    gne_tid: str | None = None
    gne_ip_address: str | None = None
    secondary_access_device_ip: str | None = None
    responsible_team: str | None = None
    purchase_group: str | None = None
    is_gne: bool
    is_ene: bool
    is_secondary_gne: bool


class GraniteUdaCreate(GraniteUdaBase):
    pass


class GraniteUdaInDB(GraniteUdaBase):
    granite_uda_key: UUID

    class Config:
        from_attributes = True


# DeviceActual Schema
class DeviceActualBase(BaseModel):
    device_key: UUID
    actual_hostname: str | None = None
    actual_v4: str | None = None
    actual_netmask_v4: str | None = None
    actual_v6: str | None = None
    actual_netmask_v6: str | None = None
    legacy_tid: str | None = None


class DeviceActualCreate(DeviceActualBase):
    pass


class DeviceActualInDB(DeviceActualBase):
    device_actual_key: UUID

    class Config:
        from_attributes = True


# SanitizeModels Schema
class SanitizeModelsBase(BaseModel):
    device_key: UUID
    sanitize_model_description: str


class SanitizeModelsCreate(SanitizeModelsBase):
    pass


class SanitizeModelsInDB(SanitizeModelsBase):
    sanitize_models_key: UUID

    class Config:
        from_attributes = True


# DeviceReachability Schema
class DeviceReachabilityBase(BaseModel):
    device_key: UUID
    ping_category: str | None = None

    ping_from_LT_LC_LB_RDP: bool | None = None
    ping_from_LT_Bastion: bool | None = None
    ping_from_LC_Bastion: bool | None = None
    ping_from_LB_Bastion: bool | None = None
    ping_RDP: bool | None = None
    ping_from_CBO_Bastion: bool | None = None

    nslookup: str | None = None
    in_ipc: bool | None = None
    in_granite: bool | None = None
    in_dx_spectrum: bool | None = None
    in_mcp: bool | None = None
    in_epnm: bool | None = None
    in_nfmt: bool | None = None
    nmap_status: str | None = None
    qualys_status: str | None = None


class DeviceReachabilityCreate(DeviceReachabilityBase):
    pass


class DeviceReachabilityInDB(DeviceReachabilityBase):
    device_reachability_key: UUID

    class Config:
        from_attributes = True


# InfoSource Schema
class InfoSourceBase(BaseModel):
    device_key: UUID
    data_source: str | None = None


class InfoSourceCreate(InfoSourceBase):
    pass


class InfoSourceInDB(InfoSourceBase):
    info_source_key: UUID

    class Config:
        from_attributes = True


# DeviceRegion Schema
class DeviceRegionBase(BaseModel):
    device_key: UUID
    site_inst_id: int | None = None
    site_name: str | None = None
    site_type: str | None = None
    site_id: int | None = None
    site_clli: str | None = None
    region: str | None = None
    state: str | None = None
    city: str | None = None
    zip: str | None = None
    lat: float | None = None
    longitude: float | None = None


class DeviceRegionCreate(DeviceRegionBase):
    pass


class DeviceRegionInDB(DeviceRegionBase):
    device_region_key: UUID

    class Config:
        from_attributes = True


# Projects Schema
class ProjectsBase(BaseModel):
    device_key: UUID
    name: str | None = None
    status: str | None = None
    assignee: str | None = None
    pm: str | None = None
    priority: int | None = None


class ProjectsCreate(ProjectsBase):
    pass


class ProjectsInDB(ProjectsBase):
    projects_key: UUID
    created_timestamp: datetime
    last_updated_timestamp: datetime | None

    class Config:
        from_attributes = True


# DeviceSoftware Schema
class DeviceSoftwareBase(BaseModel):
    device_key: UUID
    active_release: str | None = None
    backup_release: str | None = None
    tertiary_release: str | None = None
    source: str | None = None


class DeviceSoftwareCreate(DeviceSoftwareBase):
    pass


class DeviceSoftwareInDB(DeviceSoftwareBase):
    device_software_key: UUID
    created_timestamp: datetime
    last_updated_timestamp: datetime | None

    class Config:
        from_attributes = True


# TicketDetails Schema
class TicketDetailsBase(BaseModel):
    jira_seeimp: str | None = None
    jira_seeond: str | None = None
    salesforce_eng: str | None = None


class TicketDetailsCreate(TicketDetailsBase):
    pass


class TicketDetailsInDB(TicketDetailsBase):
    ticket_details_key: UUID
    created_timestamp: datetime
    last_updated_timestamp: datetime | None

    class Config:
        from_attributes = True


# ProjectTicketMapping Schema
class ProjectTicketMappingBase(BaseModel):
    projects_key: UUID
    ticket_details_key: UUID


class ProjectTicketMappingCreate(ProjectTicketMappingBase):
    pass


class ProjectTicketMappingInDB(ProjectTicketMappingBase):
    project_ticket_mapping_key: UUID

    class Config:
        from_attributes = True


# DispatchTicketDetails Schema
class DispatchTicketDetailsBase(BaseModel):
    dispatch_ticket: str | None = None


class DispatchTicketDetailsCreate(DispatchTicketDetailsBase):
    pass


class DispatchTicketDetailsInDB(DispatchTicketDetailsBase):
    dispatch_ticket_details_key: UUID

    class Config:
        from_attributes = True


# DispatchTicketMapping Schema
class DispatchTicketMappingBase(BaseModel):
    ticket_details_key: UUID
    dispatch_ticket_details_key: UUID


class DispatchTicketMappingCreate(DispatchTicketMappingBase):
    pass


class DispatchTicketMappingInDB(DispatchTicketMappingBase):
    dispatch_ticket_mapping_key: UUID

    class Config:
        from_attributes = True
