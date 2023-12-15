CREATE DATABASE IF NOT EXISTS db;
-- CREATE DATABASE IF NOT EXISTS test_database_name;

SET GLOBAL wait_timeout = 28800;
SET GLOBAL interactive_timeout = 28800;
SET GLOBAL max_allowed_packet = 1024 * 1024 * 256;
SET GLOBAL net_read_timeout = 10;
SET GLOBAL net_write_timeout = 10;
SET GLOBAL connect_timeout=10;

USE db;

-- device_key uuid PRIMARY KEY, 
CREATE TABLE IF NOT EXISTS device_table (
    device_key CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    equip_inst_id INT,
    status varchar(255),
    category VARCHAR(255),
    vendor varchar(255),
    model varchar(255),
    description varchar(255),
    shelf VARCHAR(255),
    hostname varchar(255),
    ip_address_v4 VARCHAR(15),
    netmask_v4 VARCHAR(15),
    ip_address_v6 VARCHAR(39),
    netmask_v6 VARCHAR(39),
    created_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_updated_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);


-- granite_uda table
CREATE TABLE IF NOT EXISTS granite_uda (
    granite_uda_key CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    device_key CHAR(36), 
    device_config_equipment varchar(255),
    tid varchar(255),
    gne_tid varchar(255),
    gne_ip_address varchar(255),
    secondary_access_device_ip varchar(255),
    responsible_team varchar(255),
    purchase_group varchar(255),
    is_gne boolean,
    is_ene boolean,
    is_secondary_gne boolean,
    CONSTRAINT fk_device_key_granite_uda
        FOREIGN KEY (device_key) REFERENCES device_table(device_key)
        ON DELETE CASCADE
        ON UPDATE RESTRICT
);

-- device_actual table
CREATE TABLE IF NOT EXISTS device_actual (
    device_actual_key CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    device_key CHAR(36),
    actual_hostname varchar(255),
    actual_v4 varchar(255),
    actual_netmask_v4 varchar(255),
    actual_v6 varchar(255),
    actual_netmask_v6 varchar(255),
    legacy_tid varchar(255),
    CONSTRAINT fk_device_key_device_actual
        FOREIGN KEY (device_key) REFERENCES device_table(device_key)
        ON DELETE CASCADE
        ON UPDATE RESTRICT
);



-- sanitize_models table
CREATE TABLE IF NOT EXISTS sanitize_models (
    sanitize_models_key CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    device_key CHAR(36),
    sanitize_model_description TEXT,
    CONSTRAINT fk_device_key_sanitize_models
        FOREIGN KEY (device_key) REFERENCES device_table(device_key)
        ON DELETE CASCADE
        ON UPDATE RESTRICT
);

-- Modified device_reachability table
CREATE TABLE IF NOT EXISTS device_reachability (
    device_reachability_key CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    device_key CHAR(36),
    ping_category VARCHAR(255),

    ping_from_LT_LC_LB_RDP BOOLEAN, 
    ping_from_LT_Bastion BOOLEAN, 
    ping_from_LC_Bastion BOOLEAN, 
    ping_from_LB_Bastion BOOLEAN, 
    ping_RDP BOOLEAN,
    ping_from_CBO_Bastion BOOLEAN, 

    nslookup VARCHAR(255), 
    in_ipc BOOLEAN, 
    in_granite BOOLEAN, 
    in_dx_spectrum BOOLEAN, 
    in_mcp BOOLEAN,
    in_epnm BOOLEAN, 
    in_nfmt BOOLEAN, 
    nmap_status VARCHAR(255), 
    qualys_status VARCHAR(255), 

    CONSTRAINT fk_device_key_device_reachability
        FOREIGN KEY (device_key) REFERENCES device_table(device_key)
        ON DELETE CASCADE
        ON UPDATE RESTRICT
);


-- info_source table
CREATE TABLE IF NOT EXISTS info_source (
    info_source_key CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    device_key CHAR(36),
    data_source varchar(255),
    CONSTRAINT fk_device_key_info_source
        FOREIGN KEY (device_key) REFERENCES device_table(device_key)
        ON DELETE CASCADE
        ON UPDATE RESTRICT
);

-- device_region table
CREATE TABLE IF NOT EXISTS device_region (
    device_region_key CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    device_key CHAR(36),
    site_inst_id int,
    site_name varchar(255),
    site_type varchar(255),
    site_id int,
    site_clli varchar(255),
    region varchar(255),
    state varchar(255),
    city varchar(255),
    zip varchar(255),
    lat float,
    longitude float,
    CONSTRAINT fk_device_key_device_region
        FOREIGN KEY (device_key) REFERENCES device_table(device_key)
        ON DELETE CASCADE
        ON UPDATE RESTRICT
);

-- projects table
CREATE TABLE IF NOT EXISTS projects (
    projects_key CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    device_key CHAR(36),
    name varchar(255),
    status varchar(255),
    assignee varchar(255),
    pm varchar(255),
    priority int,
    created_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_updated_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_device_key_projects
        FOREIGN KEY (device_key) REFERENCES device_table(device_key)
        ON DELETE CASCADE
        ON UPDATE RESTRICT
);

-- device_software table
CREATE TABLE IF NOT EXISTS device_software (
    device_software_key CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    device_key CHAR(36),
    active_release varchar(255),
    backup_release varchar(255),
    tertiary_release varchar(255),
    source varchar(255),
    created_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_updated_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_device_key_device_software
        FOREIGN KEY (device_key) REFERENCES device_table(device_key)
        ON DELETE CASCADE
        ON UPDATE RESTRICT
);

-- ticket_details table
CREATE TABLE IF NOT EXISTS ticket_details (
    ticket_details_key CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    jira_seeimp varchar(255),
    jira_seeond varchar(255),
    salesforce_eng varchar(255),
    created_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_updated_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- project_ticket_mapping table
CREATE TABLE IF NOT EXISTS project_ticket_mapping (
    project_ticket_mapping_key CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    projects_key CHAR(36),
    ticket_details_key CHAR(36),
    CONSTRAINT fk_projects_key_project_ticket_mapping
        FOREIGN KEY (projects_key) REFERENCES projects(projects_key)
        ON DELETE CASCADE
        ON UPDATE RESTRICT,

    CONSTRAINT fk_ticket_details_key_project_ticket_mapping
        FOREIGN KEY (ticket_details_key) REFERENCES ticket_details(ticket_details_key)
        ON DELETE CASCADE
        ON UPDATE RESTRICT
);

-- dispatch_ticket_details table
CREATE TABLE IF NOT EXISTS dispatch_ticket_details (
    dispatch_ticket_details_key CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    dispatch_ticket varchar(255)
);

-- dispatch_ticket_mapping table 
CREATE TABLE IF NOT EXISTS dispatch_ticket_mapping (
    dispatch_ticket_mapping_key CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    ticket_details_key CHAR(36),
    dispatch_ticket_details_key CHAR(36),

    CONSTRAINT fk_ticket_details_key_dispatch_ticket_mapping
        FOREIGN KEY (ticket_details_key) REFERENCES ticket_details(ticket_details_key)
        ON DELETE CASCADE
        ON UPDATE RESTRICT,

    CONSTRAINT fk_dispatch_ticket_details_key_dispatch_ticket_mapping
        FOREIGN KEY (dispatch_ticket_details_key) REFERENCES dispatch_ticket_details(dispatch_ticket_details_key)
        ON DELETE CASCADE
        ON UPDATE RESTRICT
);


-- INSERTING DATA

-- Insert data into device_table 
INSERT INTO device_table (device_key, equip_inst_id, status, category, vendor, model, description, shelf, hostname, ip_address_v4, netmask_v4, ip_address_v6, netmask_v6)
SELECT
    UUID(),
    FLOOR(RAND() * 1000) + 1,
    'Active',
    CONCAT('Category', (FLOOR(RAND() * 5) + 1)),
    CONCAT('Vendor', (FLOOR(RAND() * 5) + 1)),
    CONCAT('Model', (FLOOR(RAND() * 5) + 1)),
    CONCAT('Description', (FLOOR(RAND() * 5) + 1)),
    CONCAT('Shelf', (FLOOR(RAND() * 5) + 1)),
    CONCAT('Hostname', (FLOOR(RAND() * 5) + 1)),
    INET_NTOA(INET_ATON(CONCAT(FLOOR(RAND() * 256), '.', FLOOR(RAND() * 256), '.', FLOOR(RAND() * 256), '.', FLOOR(RAND() * 256)))), 
    INET_NTOA(INET_ATON(CONCAT(FLOOR(RAND() * 256), '.', FLOOR(RAND() * 256), '.', FLOOR(RAND() * 256), '.', FLOOR(RAND() * 256)))), 
    INET6_NTOA(FLOOR(RAND() * 65536)),
    INET6_NTOA(FLOOR(RAND() * 65536))
FROM
    (SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9 UNION SELECT 10) AS numbers;

-- -- Insert data into device_reachability
-- INSERT INTO device_reachability (device_reachability_key, device_key, ping_category, ping_status, ping_success_clboh, ping_success_austx, ping_success_anaca, nslookup, in_ipc, in_granite, in_dx_spectrum, in_mcp, in_epnm, in_nfmt, nmap_status, qualys_status)
-- SELECT
--     UUID(),
--     (SELECT device_key FROM device_table ORDER BY RAND() LIMIT 1),
--     CONCAT('Ping Category', (FLOOR(RAND() * 5) + 1)),
--     RAND() < 0.5,
--     RAND() < 0.5,
--     RAND() < 0.5,
--     RAND() < 0.5,
--     CONCAT('NSLookup', (FLOOR(RAND() * 5) + 1)),
--     RAND() < 0.5,
--     RAND() < 0.5,
--     RAND() < 0.5,
--     RAND() < 0.5,
--     RAND() < 0.5,
--     RAND() < 0.5,
--     CONCAT('Nmap Status', (FLOOR(RAND() * 5) + 1)),
--     CONCAT('Qualys Status', (FLOOR(RAND() * 5) + 1))
-- FROM
--     (SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9 UNION SELECT 10) AS numbers;

-- Insert data into device_reachability with new schema
INSERT INTO device_reachability ( device_reachability_key, device_key, ping_category, ping_from_LT_LC_LB_RDP, ping_from_LT_Bastion, ping_from_LC_Bastion, ping_from_LB_Bastion, ping_RDP, ping_from_CBO_Bastion, nslookup, in_ipc, in_granite, in_dx_spectrum, in_mcp, in_epnm, in_nfmt, nmap_status, qualys_status)
SELECT
    UUID(),
    (SELECT device_key FROM device_table ORDER BY RAND() LIMIT 1),
    CONCAT('Ping Category', (FLOOR(RAND() * 5) + 1)),

    RAND() < 0.5,
    RAND() < 0.5,
    RAND() < 0.5,
    RAND() < 0.5,
    RAND() < 0.5,
    RAND() < 0.5,

    CONCAT('NSLookup', (FLOOR(RAND() * 5) + 1)),
    RAND() < 0.5,
    RAND() < 0.5,
    RAND() < 0.5,
    RAND() < 0.5,
    RAND() < 0.5,
    RAND() < 0.5,
    CONCAT('Nmap Status', (FLOOR(RAND() * 5) + 1)),
    CONCAT('Qualys Status', (FLOOR(RAND() * 5) + 1))
FROM
    (SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9 UNION SELECT 10) AS numbers;


-- Insert data into granite_uda
INSERT INTO granite_uda (granite_uda_key, device_key, device_config_equipment, tid, gne_tid, gne_ip_address, secondary_access_device_ip, responsible_team, purchase_group, is_gne, is_ene, is_secondary_gne)
SELECT
    UUID(),
    (SELECT device_key FROM device_table ORDER BY RAND() LIMIT 1),
    CONCAT('Device Config Equipment', (FLOOR(RAND() * 5) + 1)),
    CONCAT('TID', (FLOOR(RAND() * 5) + 1)),
    CONCAT('GNE_TID', (FLOOR(RAND() * 5) + 1)),
    CONCAT('GNE_IP_Address', (FLOOR(RAND() * 5) + 1)),
    CONCAT('Secondary Access Device IP', (FLOOR(RAND() * 5) + 1)),
    CONCAT('Responsible Team', (FLOOR(RAND() * 5) + 1)),
    CONCAT('Purchase Group', (FLOOR(RAND() * 5) + 1)),
    RAND() < 0.5,
    RAND() < 0.5,
    RAND() < 0.5
FROM
    (SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9 UNION SELECT 10) AS numbers;

-- Insert data into device_actual
INSERT INTO device_actual (device_actual_key, device_key, actual_hostname, actual_v4, actual_netmask_v4, actual_v6, actual_netmask_v6, legacy_tid)
SELECT
    UUID(),
    (SELECT device_key FROM device_table ORDER BY RAND() LIMIT 1),
    CONCAT('Actual Hostname', (FLOOR(RAND() * 5) + 1)),
    CONCAT(FLOOR(RAND() * 256), '.', FLOOR(RAND() * 256), '.', FLOOR(RAND() * 256), '.', FLOOR(RAND() * 256)),
    CONCAT(FLOOR(RAND() * 256), '.', FLOOR(RAND() * 256), '.', FLOOR(RAND() * 256), '.', FLOOR(RAND() * 256)),
    INET6_NTOA(CONV(FLOOR(RAND() * 65536), 10, 16)),
    INET6_NTOA(CONV(FLOOR(RAND() * 65536), 10, 16)),
    CONCAT('Legacy TID', (FLOOR(RAND() * 5) + 1))
FROM
    (SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9 UNION SELECT 10) AS numbers;

-- Insert data into sanitize_models
INSERT INTO sanitize_models (sanitize_models_key, device_key, sanitize_model_description)
SELECT
    UUID(),
    (SELECT device_key FROM device_table ORDER BY RAND() LIMIT 1),
    CONCAT('Sanitize Model Description', (FLOOR(RAND() * 5) + 1))
FROM
    (SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9 UNION SELECT 10) AS numbers;

-- Insert data into device_reachability
INSERT INTO device_reachability (device_reachability_key, device_key, ping_category, ping_status, ping_success_clboh, ping_success_austx, ping_success_anaca, nslookup, in_ipc, in_granite, in_dx_spectrum, in_mcp, in_epnm, in_nfmt, nmap_status, qualys_status)
SELECT
    UUID(),
    (SELECT device_key FROM device_table ORDER BY RAND() LIMIT 1),
    CONCAT('Ping Category', (FLOOR(RAND() * 5) + 1)),
    RAND() < 0.5,
    RAND() < 0.5,
    RAND() < 0.5,
    RAND() < 0.5,
    CONCAT('NSLookup', (FLOOR(RAND() * 5) + 1)),
    RAND() < 0.5,
    RAND() < 0.5,
    RAND() < 0.5,
    RAND() < 0.5,
    RAND() < 0.5,
    RAND() < 0.5,
    CONCAT('Nmap Status', (FLOOR(RAND() * 5) + 1)),
    CONCAT('Qualys Status', (FLOOR(RAND() * 5) + 1))
FROM
    (SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9 UNION SELECT 10) AS numbers;

-- Insert data into info_source
INSERT INTO info_source (info_source_key, device_key, data_source)
SELECT
    UUID(),
    (SELECT device_key FROM device_table ORDER BY RAND() LIMIT 1),
    CONCAT('Data Source', (FLOOR(RAND() * 5) + 1))
FROM
    (SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9 UNION SELECT 10) AS numbers;

-- Insert data into device_region
INSERT INTO device_region (device_region_key, device_key, site_inst_id, site_name, site_type, site_id, site_clli, region, state, city, zip, lat, longitude)
SELECT
    UUID(),
    (SELECT device_key FROM device_table ORDER BY RAND() LIMIT 1),
    FLOOR(RAND() * 1000) + 1,
    CONCAT('Site Name', (FLOOR(RAND() * 5) + 1)),
    CONCAT('Site Type', (FLOOR(RAND() * 5) + 1)),
    FLOOR(RAND() * 1000) + 1,
    CONCAT('Site CLLI', (FLOOR(RAND() * 5) + 1)),
    CONCAT('Region', (FLOOR(RAND() * 5) + 1)),
    CONCAT('State', (FLOOR(RAND() * 5) + 1)),
    CONCAT('City', (FLOOR(RAND() * 5) + 1)),
    CONCAT('Zip', (FLOOR(RAND() * 5) + 1)),
    RAND() * 180 - 90, 
    RAND() * 360 - 180 
FROM
    (SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9 UNION SELECT 10) AS numbers;

-- Insert data into projects
INSERT INTO projects (projects_key, device_key, name, status, assignee, pm, priority)
SELECT
    UUID(),
    (SELECT device_key FROM device_table ORDER BY RAND() LIMIT 1),
    CONCAT('Project Name', (FLOOR(RAND() * 5) + 1)),
    CONCAT('Project Status', (FLOOR(RAND() * 5) + 1)),
    CONCAT('Assignee', (FLOOR(RAND() * 5) + 1)),
    CONCAT('PM', (FLOOR(RAND() * 5) + 1)),
    FLOOR(RAND() * 10) + 1
FROM
    (SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9 UNION SELECT 10) AS numbers;

-- Insert data into device_software
INSERT INTO device_software (device_software_key, device_key, active_release, backup_release, tertiary_release, source)
SELECT
    UUID(),
    (SELECT device_key FROM device_table ORDER BY RAND() LIMIT 1),
    CONCAT('Active Release', (FLOOR(RAND() * 5) + 1)),
    CONCAT('Backup Release', (FLOOR(RAND() * 5) + 1)),
    CONCAT('Tertiary Release', (FLOOR(RAND() * 5) + 1)),
    CONCAT('Source', (FLOOR(RAND() * 5) + 1))
FROM
    (SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9 UNION SELECT 10) AS numbers;

-- Insert data into ticket_details
INSERT INTO ticket_details (ticket_details_key, jira_seeimp, jira_seeond, salesforce_eng)
SELECT
    UUID(),
    CONCAT('Jira SeeImp', (FLOOR(RAND() * 5) + 1)),
    CONCAT('Jira SeeOnd', (FLOOR(RAND() * 5) + 1)),
    CONCAT('Salesforce ENG', (FLOOR(RAND() * 5) + 1))
FROM
    (SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9 UNION SELECT 10) AS numbers;

-- Insert data into project_ticket_mapping
INSERT INTO project_ticket_mapping (project_ticket_mapping_key, projects_key, ticket_details_key)
SELECT
    UUID(),
    (SELECT projects_key FROM projects ORDER BY RAND() LIMIT 1),
    (SELECT ticket_details_key FROM ticket_details ORDER BY RAND() LIMIT 1)
FROM
    (SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9 UNION SELECT 10) AS numbers;

-- Insert data into dispatch_ticket_details
INSERT INTO dispatch_ticket_details (dispatch_ticket_details_key, dispatch_ticket)
SELECT
    UUID(),
    CONCAT('Dispatch Ticket', (FLOOR(RAND() * 5) + 1))
FROM
    (SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9 UNION SELECT 10) AS numbers;

-- Insert data into dispatch_ticket_mapping
INSERT INTO dispatch_ticket_mapping (dispatch_ticket_mapping_key, ticket_details_key, dispatch_ticket_details_key)
SELECT
    UUID(),
    (SELECT ticket_details_key FROM ticket_details ORDER BY RAND() LIMIT 1),
    (SELECT dispatch_ticket_details_key FROM dispatch_ticket_details ORDER BY RAND() LIMIT 1)
FROM
    (SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9 UNION SELECT 10) AS numbers;
