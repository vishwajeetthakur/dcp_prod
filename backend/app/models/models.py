from models.config import Base
from sqlalchemy import (
    Boolean,
    Column,
    DateTime,
    Float,
    ForeignKey,
    Integer,
    String,
    Text,
    func,
)
from sqlalchemy.dialects.mysql import CHAR
from sqlalchemy.sql import text

# from pydantic import BaseModel as bm


class BaseModel(Base):
    __abstract__ = True

    def as_dict(self):
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}


class DeviceTable(BaseModel):
    __tablename__ = "device_table"

    device_key = Column(CHAR(36), primary_key=True, server_default=text("UUID()"))

    equip_inst_id = Column(Integer)
    status = Column(String(255))
    category = Column(String(255))
    vendor = Column(String(255))
    model = Column(String(255))
    description = Column(String(255))
    shelf = Column(String(255))
    hostname = Column(String(255))
    ip_address_v4 = Column(String(15))
    netmask_v4 = Column(String(15))
    ip_address_v6 = Column(String(39))
    netmask_v6 = Column(String(39))
    created_timestamp = Column(DateTime(timezone=True), server_default=func.now())
    last_updated_timestamp = Column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )


class GraniteUda(BaseModel):
    __tablename__ = "granite_uda"
    granite_uda_key = Column(String(36), primary_key=True, server_default=text("UUID()"))
    device_key = Column(
        String(36),
        ForeignKey("device_table.device_key", ondelete="CASCADE", onupdate="RESTRICT"),
    )
    device_config_equipment = Column(String(255))
    tid = Column(String(255))
    gne_tid = Column(String(255))
    gne_ip_address = Column(String(255))
    secondary_access_device_ip = Column(String(255))
    responsible_team = Column(String(255))
    purchase_group = Column(String(255))
    is_gne = Column(Boolean)
    is_ene = Column(Boolean)
    is_secondary_gne = Column(Boolean)


class DeviceActual(BaseModel):
    __tablename__ = "device_actual"
    device_actual_key = Column(
        String(36), primary_key=True, server_default=text("UUID()")
    )
    device_key = Column(
        String(36),
        ForeignKey("device_table.device_key", ondelete="CASCADE", onupdate="RESTRICT"),
    )
    actual_hostname = Column(String(255))
    actual_v4 = Column(String(255))
    actual_netmask_v4 = Column(String(255))
    actual_v6 = Column(String(255))
    actual_netmask_v6 = Column(String(255))
    legacy_tid = Column(String(255))


class SanitizeModels(BaseModel):
    __tablename__ = "sanitize_models"
    sanitize_models_key = Column(
        String(36), primary_key=True, server_default=text("UUID()")
    )
    device_key = Column(
        String(36),
        ForeignKey("device_table.device_key", ondelete="CASCADE", onupdate="RESTRICT"),
    )
    sanitize_model_description = Column(Text)


class DeviceReachability(Base):
    __tablename__ = "device_reachability"
    device_reachability_key = Column(
        String(36), primary_key=True, server_default=text("UUID()")
    )
    device_key = Column(
        String(36),
        ForeignKey("device_table.device_key", ondelete="CASCADE", onupdate="RESTRICT"),
    )
    ping_category = Column(String(255))

    ping_from_LT_LC_LB_RDP = Column(Boolean)
    ping_from_LT_Bastion = Column(Boolean)
    ping_from_LC_Bastion = Column(Boolean)
    ping_from_LB_Bastion = Column(Boolean)
    ping_RDP = Column(Boolean)
    ping_from_CBO_Bastion = Column(Boolean)

    nslookup = Column(String(255))
    in_ipc = Column(Boolean)
    in_granite = Column(Boolean)
    in_dx_spectrum = Column(Boolean)
    in_mcp = Column(Boolean)
    in_epnm = Column(Boolean)
    in_nfmt = Column(Boolean)
    nmap_status = Column(String(255))
    qualys_status = Column(String(255))


class InfoSource(BaseModel):
    __tablename__ = "info_source"
    info_source_key = Column(String(36), primary_key=True, server_default=text("UUID()"))
    device_key = Column(
        String(36),
        ForeignKey("device_table.device_key", ondelete="CASCADE", onupdate="RESTRICT"),
    )
    data_source = Column(String(255))


class DeviceRegion(BaseModel):
    __tablename__ = "device_region"
    device_region_key = Column(
        String(36), primary_key=True, server_default=text("UUID()")
    )
    device_key = Column(
        String(36),
        ForeignKey("device_table.device_key", ondelete="CASCADE", onupdate="RESTRICT"),
    )
    site_inst_id = Column(Integer)
    site_name = Column(String(255))
    site_type = Column(String(255))
    site_id = Column(Integer)
    site_clli = Column(String(255))
    region = Column(String(255))
    state = Column(String(255))
    city = Column(String(255))
    zip = Column(String(255))
    lat = Column(Float)
    longitude = Column(Float)


class Projects(BaseModel):
    __tablename__ = "projects"
    projects_key = Column(String(36), primary_key=True, server_default=text("UUID()"))
    device_key = Column(
        String(36),
        ForeignKey("device_table.device_key", ondelete="CASCADE", onupdate="RESTRICT"),
    )
    name = Column(String(255))
    status = Column(String(255))
    assignee = Column(String(255))
    pm = Column(String(255))
    priority = Column(Integer)
    created_timestamp = Column(DateTime(timezone=True), server_default=func.now())
    last_updated_timestamp = Column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )


class DeviceSoftware(BaseModel):
    __tablename__ = "device_software"
    device_software_key = Column(
        String(36), primary_key=True, server_default=text("UUID()")
    )
    device_key = Column(
        String(36),
        ForeignKey("device_table.device_key", ondelete="CASCADE", onupdate="RESTRICT"),
    )
    active_release = Column(String(255))
    backup_release = Column(String(255))
    tertiary_release = Column(String(255))
    source = Column(String(255))
    created_timestamp = Column(DateTime(timezone=True), server_default=func.now())
    last_updated_timestamp = Column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )


class TicketDetails(BaseModel):
    __tablename__ = "ticket_details"
    ticket_details_key = Column(
        String(36), primary_key=True, server_default=text("UUID()")
    )
    jira_seeimp = Column(String(255))
    jira_seeond = Column(String(255))
    salesforce_eng = Column(String(255))
    created_timestamp = Column(DateTime(timezone=True), server_default=func.now())
    last_updated_timestamp = Column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )


class ProjectTicketMapping(BaseModel):
    __tablename__ = "project_ticket_mapping"
    project_ticket_mapping_key = Column(
        String(36), primary_key=True, server_default=text("UUID()")
    )
    projects_key = Column(
        String(36),
        ForeignKey("projects.projects_key", ondelete="CASCADE", onupdate="RESTRICT"),
    )
    ticket_details_key = Column(
        String(36),
        ForeignKey(
            "ticket_details.ticket_details_key",
            ondelete="CASCADE",
            onupdate="RESTRICT",
        ),
    )


class DispatchTicketDetails(BaseModel):
    __tablename__ = "dispatch_ticket_details"
    dispatch_ticket_details_key = Column(
        String(36), primary_key=True, server_default=text("UUID()")
    )
    dispatch_ticket = Column(String(255))


class DispatchTicketMapping(BaseModel):
    __tablename__ = "dispatch_ticket_mapping"
    dispatch_ticket_mapping_key = Column(
        String(36), primary_key=True, server_default=text("UUID()")
    )
    ticket_details_key = Column(
        String(36),
        ForeignKey(
            "ticket_details.ticket_details_key",
            ondelete="CASCADE",
            onupdate="RESTRICT",
        ),
    )
    dispatch_ticket_details_key = Column(
        String(36),
        ForeignKey(
            "dispatch_ticket_details.dispatch_ticket_details_key",
            ondelete="CASCADE",
            onupdate="RESTRICT",
        ),
    )
