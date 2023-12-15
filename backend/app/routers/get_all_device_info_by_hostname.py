from fastapi import APIRouter, Depends, HTTPException
from models.config import get_db
from models.models import (
    DeviceActual,
    DeviceReachability,
    DeviceRegion,
    DeviceSoftware,
    DeviceTable,
    GraniteUda,
    InfoSource,
    Projects,
)
from schemas.device_complete_details import AllDeviceDataResponse

# from sqlalchemy import select
from sqlalchemy.future import select
from sqlalchemy.orm import Session

router = APIRouter(tags=["Default"], dependencies=[Depends(get_db)])


@router.get(
    "/devices/hostname/{host_name}/details",
    response_model=AllDeviceDataResponse,
)
async def get_device_info_by_hostname(
    host_name: str, connection: Session = Depends(get_db)
):
    stmt = (
        select(
            DeviceTable.device_key,
            DeviceTable.equip_inst_id,
            DeviceTable.status,
            DeviceTable.category,
            DeviceTable.vendor,
            DeviceTable.model,
            DeviceTable.description,
            DeviceTable.shelf,
            DeviceTable.hostname,
            DeviceTable.ip_address_v4,
            DeviceTable.netmask_v4,
            DeviceTable.ip_address_v6,
            DeviceTable.netmask_v6,
            DeviceTable.created_timestamp.label("device_created_timestamp"),
            DeviceTable.last_updated_timestamp.label("device_last_updated_timestamp"),
            GraniteUda.device_config_equipment,
            GraniteUda.tid.label("gu_tid"),
            GraniteUda.gne_tid,
            GraniteUda.gne_ip_address,
            GraniteUda.secondary_access_device_ip,
            GraniteUda.responsible_team.label("gu_responsible_team"),
            GraniteUda.purchase_group.label("gu_purchase_group"),
            GraniteUda.is_gne,
            GraniteUda.is_ene,
            GraniteUda.is_secondary_gne,
            DeviceActual.actual_hostname.label("da_actual_hostname"),
            DeviceActual.actual_v4.label("da_actual_v4"),
            DeviceActual.actual_netmask_v4.label("da_actual_netmask_v4"),
            DeviceActual.actual_v6.label("da_actual_v6"),
            DeviceActual.actual_netmask_v6.label("da_actual_netmask_v6"),
            DeviceActual.legacy_tid.label("da_legacy_tid"),
            DeviceReachability.ping_category.label("dr_ping_category"),
            DeviceReachability.ping_from_LT_LC_LB_RDP.label("ping_from_LT_LC_LB_RDP"),
            DeviceReachability.ping_from_LT_Bastion.label("ping_from_LT_Bastion"),
            DeviceReachability.ping_from_LC_Bastion.label("ping_from_LC_Bastion"),
            DeviceReachability.ping_from_LB_Bastion.label("ping_from_LB_Bastion"),
            DeviceReachability.ping_RDP.label("ping_RDP"),
            DeviceReachability.ping_from_CBO_Bastion.label("ping_from_CBO_Bastion"),
            DeviceReachability.nslookup.label("dr_nslookup"),
            DeviceReachability.in_ipc.label("dr_in_ipc"),
            DeviceReachability.in_granite.label("dr_in_granite"),
            DeviceReachability.in_dx_spectrum.label("dr_in_dx_spectrum"),
            DeviceReachability.in_mcp.label("dr_in_mcp"),
            DeviceReachability.in_epnm.label("dr_in_epnm"),
            DeviceReachability.in_nfmt.label("dr_in_nfmt"),
            DeviceReachability.nmap_status.label("dr_nmap_status"),
            DeviceReachability.qualys_status.label("dr_qualys_status"),
            InfoSource.data_source.label("isrc_data_source"),
            DeviceRegion.site_inst_id.label("drg_site_inst_id"),
            DeviceRegion.site_name.label("drg_site_name"),
            DeviceRegion.site_type.label("drg_site_type"),
            DeviceRegion.site_id.label("drg_site_id"),
            DeviceRegion.site_clli.label("drg_site_clli"),
            DeviceRegion.region.label("drg_region"),
            DeviceRegion.state.label("drg_state"),
            DeviceRegion.city.label("drg_city"),
            DeviceRegion.zip.label("drg_zip"),
            DeviceRegion.lat.label("drg_lat"),
            DeviceRegion.longitude.label("drg_longitude"),
            Projects.name.label("p_name"),
            Projects.status.label("p_status"),
            Projects.assignee.label("p_assignee"),
            Projects.pm.label("p_pm"),
            Projects.priority.label("p_priority"),
            Projects.created_timestamp.label("project_created_timestamp"),
            Projects.last_updated_timestamp.label("project_last_updated_timestamp"),
            # Fields from DeviceSoftware table
            DeviceSoftware.active_release,
            DeviceSoftware.backup_release,
            DeviceSoftware.tertiary_release,
            DeviceSoftware.source,
            DeviceSoftware.created_timestamp.label("software_created_timestamp"),
            DeviceSoftware.last_updated_timestamp.label(
                "software_last_updated_timestamp"
            ),
        )
        .filter(DeviceTable.hostname == host_name)
        .outerjoin(GraniteUda, DeviceTable.device_key == GraniteUda.device_key)
        .outerjoin(DeviceActual, DeviceTable.device_key == DeviceActual.device_key)
        .outerjoin(
            DeviceReachability,
            DeviceTable.device_key == DeviceReachability.device_key,
        )
        .outerjoin(InfoSource, DeviceTable.device_key == InfoSource.device_key)
        .outerjoin(DeviceRegion, DeviceTable.device_key == DeviceRegion.device_key)
        .outerjoin(Projects, DeviceTable.device_key == Projects.device_key)
        .outerjoin(DeviceSoftware, DeviceTable.device_key == DeviceSoftware.device_key)
        .limit(1)
    )

    device_data = await connection.fetch_one(stmt)

    if not device_data:
        raise HTTPException(status_code=404, detail="Device not found")

    return AllDeviceDataResponse.from_orm(device_data)
