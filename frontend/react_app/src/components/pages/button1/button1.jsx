import React, { useState } from 'react';
import './SearchComponent.css';
import axios from 'axios';

const SearchComponent = () => {
  const [inputValue, setInputValue] = useState('');
  const [selectedOption, setSelectedOption] = useState('Search by IP');
  const [deviceData, setDeviceData] = useState(null);

  const [error, setError] = useState(null); // to handle error

  const handleSearch = () => {
    // Reset states before the search
    setDeviceData(null);
    setError(null);

    if (!inputValue) {
      setError('Please enter a search query.');
      return;
    }

    let apiEndpoint = '';
    switch (selectedOption) {
      case 'Search by IP':
        apiEndpoint = `http://localhost:8088/devices/ip/${inputValue}/details`;
        break;
      case 'Search by Hostname':
        apiEndpoint = `http://localhost:8088/devices/hostname/${inputValue}/details`;
        break;
      case 'Search by Device key':
        apiEndpoint = `http://localhost:8088/devices/${inputValue}/details`;
        break;
      default:
        console.error('Invalid option selected');
        setError('Invalid option selected');
        return;
    }

    axios
      .get(apiEndpoint)
      .then((response) => {
        setDeviceData(response.data);
      })
      .catch((error) => {
        setError('No data was Found for this query.');
        console.error('Error fetching data:', error);
      });
  };

  return (
    <div className="search-component">
      <div className="search-container">
        <div className="search-label-container">
          <label htmlFor="search-filter" className="search-label">
            Filter by:
          </label>
        </div>
        <div className="input-group">
          <select
            id="search-filter"
            value={selectedOption}
            onChange={(e) => setSelectedOption(e.target.value)}
            className="dropdown-select"
            style={{ marginRight: '8px' }}
          >
            <option value="Search by IP">Search by IP</option>
            <option value="Search by Hostname">Search by Hostname</option>
            <option value="Search by Device key">Search by Device key</option>
          </select>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Enter Device Key..."
            className="search-input"
            style={{ marginLeft: '8px' }}
          />
        </div>
        <button onClick={handleSearch} className="search-button">
          Search
        </button>
      </div>

        {error && (
            <div className="card">
              <div>{error}</div>
            </div>
          )}

        {!error && deviceData && (
            <div className="card">
              <div><b>Device Key:</b> {deviceData.device_key}</div>
              <div><b>Equipment Installation ID:</b> {deviceData.equip_inst_id || 'N/A'}</div>
              <div><b>Status:</b> {deviceData.status || 'N/A'}</div>
              <div><b>Category:</b> {deviceData.category || 'N/A'}</div>
              <div><b>Vendor:</b> {deviceData.vendor || 'N/A'}</div>
              <div><b>Model:</b> {deviceData.model || 'N/A'}</div>
              <div><b>Description:</b> {deviceData.description || 'N/A'}</div>
              <div><b>Shelf:</b> {deviceData.shelf || 'N/A'}</div>
              <div><b>Hostname:</b> {deviceData.hostname || 'N/A'}</div>
              <div><b>IPv4 Address:</b> {deviceData.ip_address_v4 || 'N/A'}</div>
              <div><b>IPv4 Netmask:</b> {deviceData.netmask_v4 || 'N/A'}</div>
              <div><b>IPv6 Address:</b> {deviceData.ip_address_v6 || 'N/A'}</div>
              <div><b>IPv6 Netmask:</b> {deviceData.netmask_v6 || 'N/A'}</div>
              <div><b>Device Created Timestamp:</b> {deviceData.device_created_timestamp}</div>
              <div><b>Device Last Updated Timestamp:</b> {deviceData.device_last_updated_timestamp}</div>
              <div><b>Device Config Equipment:</b> {deviceData.device_config_equipment || 'N/A'}</div>
              <div><b>GU TID:</b> {deviceData.gu_tid || 'N/A'}</div>
              <div><b>GNE TID:</b> {deviceData.gne_tid || 'N/A'}</div>
              <div><b>GNE IP Address:</b> {deviceData.gne_ip_address || 'N/A'}</div>
              <div><b>Secondary Access Device IP:</b> {deviceData.secondary_access_device_ip || 'N/A'}</div>
              <div><b>GU Responsible Team:</b> {deviceData.gu_responsible_team || 'N/A'}</div>
              <div><b>GU Purchase Group:</b> {deviceData.gu_purchase_group || 'N/A'}</div>
              <div><b>Is GNE:</b> {deviceData.is_gne ? 'Yes' : 'No'}</div>
              <div><b>Is ENE:</b> {deviceData.is_ene ? 'Yes' : 'No'}</div>
              <div><b>Is Secondary GNE:</b> {deviceData.is_secondary_gne ? 'Yes' : 'No'}</div>
              <div><b>DA Actual Hostname:</b> {deviceData.da_actual_hostname || 'N/A'}</div>
              <div><b>DA Actual IPv4:</b> {deviceData.da_actual_v4 || 'N/A'}</div>
              <div><b>DA Actual Netmask IPv4:</b> {deviceData.da_actual_netmask_v4 || 'N/A'}</div>
              <div><b>DA Actual IPv6:</b> {deviceData.da_actual_v6 || 'N/A'}</div>
              <div><b>DA Actual Netmask IPv6:</b> {deviceData.da_actual_netmask_v6 || 'N/A'}</div>
              <div><b>DA Legacy TID:</b> {deviceData.da_legacy_tid || 'N/A'}</div>
              <div><b>DR Ping Category:</b> {deviceData.dr_ping_category || 'N/A'}</div>

              <div><b>DR Ping Status from LT or LC or LB RDP:</b> {deviceData.ping_from_LT_LC_LB_RDP ? 'Yes' : 'No'}</div>
              <div><b>DR Ping Status from LT Bastion:</b> {deviceData.ping_from_LT_Bastion ? 'Yes' : 'No'}</div>
              <div><b>DR Ping Status from LC Bastion:</b> {deviceData.ping_from_LC_Bastion ? 'Yes' : 'No'}</div>
              <div><b>DR Ping Status from LB Bastion:</b> {deviceData.ping_from_LB_Bastion ? 'Yes' : 'No'}</div>
              <div><b>DR Ping Status RDP:</b> {deviceData.ping_RDP ? 'Yes' : 'No'}</div>
              <div><b>DR Ping Status from CBO Bastion:</b> {deviceData.ping_from_CBO_Bastion ? 'Yes' : 'No'}</div>

              <div><b>DR NSLookup:</b> {deviceData.dr_nslookup || 'N/A'}</div>
              <div><b>DR In IPC:</b> {deviceData.dr_in_ipc ? 'Yes' : 'No'}</div>
              <div><b>DR In Granite:</b> {deviceData.dr_in_granite ? 'Yes' : 'No'}</div>
              <div><b>DR In DX Spectrum:</b> {deviceData.dr_in_dx_spectrum ? 'Yes' : 'No'}</div>
              <div><b>DR In MCP:</b> {deviceData.dr_in_mcp ? 'Yes' : 'No'}</div>
              <div><b>DR In EPNM:</b> {deviceData.dr_in_epnm ? 'Yes' : 'No'}</div>
              <div><b>DR In NFMT:</b> {deviceData.dr_in_nfmt ? 'Yes' : 'No'}</div>
              <div><b>DR Nmap Status:</b> {deviceData.dr_nmap_status || 'N/A'}</div>
              <div><b>DR Qualys Status:</b> {deviceData.dr_qualys_status || 'N/A'}</div>
              <div><b>ISRC Data Source:</b> {deviceData.isrc_data_source || 'N/A'}</div>
              <div><b>DRG Site Installation ID:</b> {deviceData.drg_site_inst_id || 'N/A'}</div>
              <div><b>DRG Site Name:</b> {deviceData.drg_site_name || 'N/A'}</div>
              <div><b>DRG Site Type:</b> {deviceData.drg_site_type || 'N/A'}</div>
              <div><b>DRG Site ID:</b> {deviceData.drg_site_id || 'N/A'}</div>
              <div><b>DRG Site CLLI:</b> {deviceData.drg_site_clli || 'N/A'}</div>
              <div><b>DRG Region:</b> {deviceData.drg_region || 'N/A'}</div>
              <div><b>DRG State:</b> {deviceData.drg_state || 'N/A'}</div>
              <div><b>DRG City:</b> {deviceData.drg_city || 'N/A'}</div>
              <div><b>DRG Zip:</b> {deviceData.drg_zip || 'N/A'}</div>
              <div><b>DRG Latitude:</b> {deviceData.drg_lat || 'N/A'}</div>
              <div><b>DRG Longitude:</b> {deviceData.drg_longitude || 'N/A'}</div>
              <div><b>Project Name:</b> {deviceData.p_name || 'N/A'}</div>
              <div><b>Project Status:</b> {deviceData.p_status || 'N/A'}</div>
              <div><b>Project Assignee:</b> {deviceData.p_assignee || 'N/A'}</div>
              <div><b>Project PM:</b> {deviceData.p_pm || 'N/A'}</div>
              <div><b>Project Priority:</b> {deviceData.p_priority || 'N/A'}</div>
              <div><b>Project Created Timestamp:</b> {deviceData.project_created_timestamp}</div>
              <div><b>Project Last Updated Timestamp:</b> {deviceData.project_last_updated_timestamp}</div>

              <div><b>Software Active Release:</b> {deviceData.active_release || 'N/A'}</div>
              <div><b>Software Backup Release:</b> {deviceData.backup_release || 'N/A'}</div>
              <div><b>Software Tertiary Release:</b> {deviceData.tertiary_release || 'N/A'}</div>
              <div><b>Software Source:</b> {deviceData.source || 'N/A'}</div>
              <div><b>Software Created Timestamp:</b> {deviceData.software_created_timestamp}</div>
              <div><b>Software Last Updated Timestamp:</b> {deviceData.software_last_updated_timestamp}</div>
              

            </div>
        )}

        {/* {!error && !deviceData && (
          <div className="card">
            <div>Enter search parameters and click "Search" to view data.</div>
          </div>
        )} */}

    </div>

    
  );
};

export default SearchComponent;
