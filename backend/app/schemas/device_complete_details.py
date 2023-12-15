from datetime import datetime

from pydantic import BaseModel


class AllDeviceDataResponse(BaseModel):
    device_key: str | None = None
    equip_inst_id: int | None = None
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
    device_created_timestamp: datetime | None = None
    device_last_updated_timestamp: datetime | None = None

    device_config_equipment: str | None = None
    gu_tid: str | None = None
    gne_tid: str | None = None
    gne_ip_address: str | None = None
    secondary_access_device_ip: str | None = None
    gu_responsible_team: str | None = None
    gu_purchase_group: str | None = None
    is_gne: bool | None = None
    is_ene: bool | None = None
    is_secondary_gne: bool | None = None

    da_actual_hostname: str | None = None
    da_actual_v4: str | None = None
    da_actual_netmask_v4: str | None = None
    da_actual_v6: str | None = None
    da_actual_netmask_v6: str | None = None
    da_legacy_tid: str | None = None

    dr_ping_category: str | None = None
    ping_from_LT_LC_LB_RDP: bool | None = None
    ping_from_LT_Bastion: bool | None = None
    ping_from_LC_Bastion: bool | None = None
    ping_from_LB_Bastion: bool | None = None
    ping_RDP: bool | None = None
    ping_from_CBO_Bastion: bool | None = None

    dr_nslookup: str | None = None
    dr_in_ipc: bool | None = None
    dr_in_granite: bool | None = None
    dr_in_dx_spectrum: bool | None = None
    dr_in_mcp: bool | None = None
    dr_in_epnm: bool | None = None
    dr_in_nfmt: bool | None = None
    dr_nmap_status: str | None = None
    dr_qualys_status: str | None = None

    isrc_data_source: str | None = None

    drg_site_inst_id: int | None = None
    drg_site_name: str | None = None
    drg_site_type: str | None = None
    drg_site_id: int | None = None
    drg_site_clli: str | None = None
    drg_region: str | None = None
    drg_state: str | None = None
    drg_city: str | None = None
    drg_zip: str | None = None
    drg_lat: float | None = None
    drg_longitude: float | None = None

    p_name: str | None = None
    p_status: str | None = None
    p_assignee: str | None = None
    p_pm: str | None = None
    p_priority: int | None = None
    project_created_timestamp: datetime | None = None
    project_last_updated_timestamp: datetime | None = None

    active_release: str | None = None
    backup_release: str | None = None
    tertiary_release: str | None = None
    software_source: str | None = None
    software_created_timestamp: datetime | None = None
    software_last_updated_timestamp: datetime | None = None

    class Config:
        from_attributes = True
