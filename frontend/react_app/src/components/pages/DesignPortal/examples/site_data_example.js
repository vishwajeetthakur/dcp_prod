export const site_data_example = {
    "id": 25,
    "address": "1777 Larue Dr Central Point OR 97502",
    "clli": "CNPNORBI",
    "account_id": "ACCT-26941477",
    "customer_name": "JSBAPA HOSPITALITY LLC - DBA LA QUINTA INN & SUITES-NATIONAL-",
    "dp_orders": [
      {
        "id": 32,
        "site_id": 25,
        "epr": "ENG-03804333",
        "cid": "54.L1XX.001231..CHTR",
        "product": "Managed Network Edge",
        "status": "Order Created"
      }
    ],
    "dp_site_detail": {
      "id": 25,
      "site_id": 25,
      "mne_network_overview_comments": null,
      "site_type": "Spoke",
      "site_comments": null,
      "policy_nat_mode": "Routed",
      "policy_nat_comments": null,
      "policy_ips_mode": "Prevention",
      "policy_ips_ruleset": null,
      "policy_ips_comments": null,
      "policy_web_filter_category_blocking": "Adult, Alcohol, Cannabis, Child Abuse Content, Dating, DNS-Tunneling, Extreme, Filter Avoidance, Gambling, Hacking, Hate Speech, Hunting, Illegal Activities, Illegal Downloads, Illegal Drugs, Lingerie and Swimsuits, Non-sexual Nudity, Paranormal, Pornography, Terrorism and Violent Extremism, Tobacco, Weapons",
      "policy_web_filter_threat_categories": "Bogon, Botnets, Cryptojacking, DNS Tunneling, Domain Generated Algorithm, Dynamic DNS, Ebanking Fraud, Exploits, High Risk Sites and Locations, Indicators of Compromise (IOC), Linkshare, Malicious Sites, Malware Sites, Open Mail Relay, Phishing, Spam, Spyware and Adware, TOR exit Nodes",
      "policy_web_filter_url_blacklist": null,
      "policy_web_filter_url_whitelist": null,
      "vpn_ipsec_comments": null,
      "vpn_auto_vpn_name": null,
      "vpn_auto_vpn_type": "Off",
      "vpn_auto_vpn_vpn_mode": null,
      "vpn_auto_vpn_subnet": null,
      "vpn_auto_vpn_active_to_active_auto_vpn": null,
      "vpn_auto_vpn_comments": null,
      "vpn_client_vpn_subnet": null,
      "vpn_client_vpn_dns_server": "Google",
      "vpn_client_vpn_custom_dns_servers": null,
      "vpn_client_vpn_psk": null,
      "vpn_client_vpn_authentication": "Meraki Cloud Authentication",
      "users_meraki_cloud_authentication_comments": null,
      "users_radius_comments": null,
      "users_ldap_ip": null,
      "users_ldap_domain": null,
      "users_ldap_username": null,
      "users_ldap_password": null,
      "users_ldap_comments": null,
      "mns_switch_overview_comments": null,
      "mns_switch_settings_comments": null,
      "mnw_wifi_settings_comments": null
    },
    "dp_devices": [
      {
        "id": 89,
        "site_id": 25,
        "type": "network",
        "hostname": "CNPNORBIMN1",
        "model": "MX68",
        "ip": null,
        "subnet_mask": null,
        "mne_high_availability": null,
        "mne_cid": "54.L1XX.001231..CHTR",
        "mne_features": null,
        "mns_description": null,
        "vlan": null,
        "gateway": null,
        "dns_1": null,
        "dns_2": null,
        "mnc_video_resolution": null,
        "mnc_video_quality": null,
        "comments": null
      }
    ],
    "dp_device_interfaces": [
      {
        "id": 1077,
        "site_id": 25,
        "device_id": 89,
        "interface": "port1",
        "type": null
      },
      {
        "id": 1078,
        "site_id": 25,
        "device_id": 89,
        "interface": "port2",
        "type": null
      },
      {
        "id": 1079,
        "site_id": 25,
        "device_id": 89,
        "interface": "port3",
        "type": null
      },
      {
        "id": 1080,
        "site_id": 25,
        "device_id": 89,
        "interface": "port4",
        "type": null
      },
      {
        "id": 1081,
        "site_id": 25,
        "device_id": 89,
        "interface": "port5",
        "type": null
      },
      {
        "id": 1082,
        "site_id": 25,
        "device_id": 89,
        "interface": "port6",
        "type": null
      },
      {
        "id": 1083,
        "site_id": 25,
        "device_id": 89,
        "interface": "port7",
        "type": null
      },
      {
        "id": 1084,
        "site_id": 25,
        "device_id": 89,
        "interface": "port8",
        "type": null
      },
      {
        "id": 1085,
        "site_id": 25,
        "device_id": 89,
        "interface": "port9",
        "type": null
      },
      {
        "id": 1086,
        "site_id": 25,
        "device_id": 89,
        "interface": "port10",
        "type": null
      },
      {
        "id": 1087,
        "site_id": 25,
        "device_id": 89,
        "interface": "port11",
        "type": null
      },
      {
        "id": 1088,
        "site_id": 25,
        "device_id": 89,
        "interface": "port12",
        "type": null
      }
    ],
    "dp_switch_settings": [],
    "dp_network_lan_ports": [
      {
        "id": 23,
        "site_id": 25,
        "device_id": 89,
        "device_interface_id": 1079,
        "enabled": "Enabled",
        "type": "Trunk",
        "native_vlan": 19,
        "allowed_vlan": [
          {
            "vlan_name": "All VLANs"
          }
        ]
      }
    ],
    "dp_network_wans": [
      {
        "id": 46,
        "site_id": 25,
        "device_id": 89,
        "device_interface_id": 1077,
        "type": "Dynamic",
        "description": null,
        "cid": "54.L1XX.001231..CHTR",
        "ip": "DHCP",
        "subnet": null,
        "gateway": null,
        "dns1": "8.8.8.8",
        "dns2": "8.8.4.4",
        "bw_up": 100,
        "bw_down": 100,
        "load_balancing": null
      }
    ],
    "dp_switch_ports": [],
    "dp_switch_routings": [],
    "dp_network_source_routes": [],
    "dp_network_static_routes": [],
    "dp_network_lan_vlans": [
      {
        "id": 19,
        "site_id": 25,
        "vlan_name": "LAN",
        "vlan": 1,
        "vpn_mode": "Enabled",
        "ip": "10.41.123.1",
        "subnet": "10.41.123.0/24"
      }
    ],
    "dp_network_lan_reservations": [
      {
        "id": 15,
        "site_id": 25,
        "vlan_id": 19,
        "ip": " 10.41.123.150- 10.41.123.254",
        "mac": null,
        "description": null
      }
    ],
    "dp_policy_amps": [],
    "dp_policy_firewall_layer_three_firewall_policies": [],
    "dp_policy_firewall_layer_seven_firewall_policies": [],
    "dp_policy_nat_allowed_inbound_connections": [],
    "dp_policy_nat_one_to_many_nats": [],
    "dp_policy_nat_one_to_one_nats": [],
    "dp_policy_nat_port_forwardings": [],
    "dp_users_meraki_cloud_authentications": [],
    "dp_users_radius": [],
    "dp_vpn_client_vpns": [],
    "dp_vpn_site_to_site_ipsecs": [],
    "dp_wifi_settings": []
  }