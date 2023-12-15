from datetime import datetime
from typing import Optional
from uuid import UUID

from pydantic import BaseModel


# DeviceTable Schema
class DeviceTableBase(BaseModel):
    equip_inst_id: int
    status: str
    category: str
    vendor: str
    model: str
    description: str
    shelf: str
    hostname: str
    ip_address_v4: Optional[str] = None
    netmask_v4: Optional[str] = None
    ip_address_v6: Optional[str] = None
    netmask_v6: Optional[str] = None


class DeviceTableCreate(DeviceTableBase):
    pass


class DeviceTableInDB(DeviceTableBase):
    device_key: UUID
    created_timestamp: datetime
    last_updated_timestamp: Optional[datetime]

    class Config:
        from_attributes = True


# GraniteUda Schema
class GraniteUdaBase(BaseModel):
    device_key: UUID
    device_config_equipment: str
    tid: str
    gne_tid: str
    gne_ip_address: str
    secondary_access_device_ip: str
    responsible_team: str
    purchase_group: str
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
    actual_hostname: str
    actual_v4: str
    actual_netmask_v4: str
    actual_v6: Optional[str] = None
    actual_netmask_v6: Optional[str] = None
    legacy_tid: str


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


"""
# DeviceReachability Schema
class DeviceReachabilityBase(BaseModel):
    device_key: UUID
    ping_category: str
    ping_status: bool
    ping_success_clboh: bool
    ping_success_austx: bool
    ping_success_anaca: bool
    nslookup: str
    in_ipc: bool
    in_granite: bool
    in_dx_spectrum: bool
    in_mcp: bool
    in_epnm: bool
    in_nfmt: bool
    nmap_status: str
    qualys_status: str

class DeviceReachabilityCreate(DeviceReachabilityBase):
    pass

class DeviceReachabilityInDB(DeviceReachabilityBase):
    device_reachability_key: UUID

    class Config:
        from_attributes = True
"""


# DeviceReachability Schema
class DeviceReachabilityBase(BaseModel):
    device_key: UUID
    ping_category: str

    ping_from_LT_LC_LB_RDP: bool
    ping_from_LT_Bastion: bool
    ping_from_LC_Bastion: bool
    ping_from_LB_Bastion: bool
    ping_RDP: bool
    ping_from_CBO_Bastion: bool

    nslookup: str
    in_ipc: bool
    in_granite: bool
    in_dx_spectrum: bool
    in_mcp: bool
    in_epnm: bool
    in_nfmt: bool
    nmap_status: str
    qualys_status: str


class DeviceReachabilityCreate(DeviceReachabilityBase):
    pass


class DeviceReachabilityInDB(DeviceReachabilityBase):
    device_reachability_key: UUID

    class Config:
        from_attributes = True


# InfoSource Schema
class InfoSourceBase(BaseModel):
    device_key: UUID
    data_source: str


class InfoSourceCreate(InfoSourceBase):
    pass


class InfoSourceInDB(InfoSourceBase):
    info_source_key: UUID

    class Config:
        from_attributes = True


# DeviceRegion Schema
class DeviceRegionBase(BaseModel):
    device_key: UUID
    site_inst_id: int
    site_name: str
    site_type: str
    site_id: int
    site_clli: str
    region: str
    state: str
    city: str
    zip: str
    lat: float
    longitude: float


class DeviceRegionCreate(DeviceRegionBase):
    pass


class DeviceRegionInDB(DeviceRegionBase):
    device_region_key: UUID

    class Config:
        from_attributes = True


# Projects Schema
class ProjectsBase(BaseModel):
    device_key: UUID
    name: str
    status: str
    assignee: str
    pm: str
    priority: int


class ProjectsCreate(ProjectsBase):
    pass


class ProjectsInDB(ProjectsBase):
    projects_key: UUID
    created_timestamp: datetime
    last_updated_timestamp: Optional[datetime]

    class Config:
        from_attributes = True


# DeviceSoftware Schema
class DeviceSoftwareBase(BaseModel):
    device_key: UUID
    active_release: str
    backup_release: str
    tertiary_release: str
    source: str


class DeviceSoftwareCreate(DeviceSoftwareBase):
    pass


class DeviceSoftwareInDB(DeviceSoftwareBase):
    device_software_key: UUID
    created_timestamp: datetime
    last_updated_timestamp: Optional[datetime]

    class Config:
        from_attributes = True


# TicketDetails Schema
class TicketDetailsBase(BaseModel):
    jira_seeimp: str
    jira_seeond: str
    salesforce_eng: str


class TicketDetailsCreate(TicketDetailsBase):
    pass


class TicketDetailsInDB(TicketDetailsBase):
    ticket_details_key: UUID
    created_timestamp: datetime
    last_updated_timestamp: Optional[datetime]

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
    dispatch_ticket: str


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
