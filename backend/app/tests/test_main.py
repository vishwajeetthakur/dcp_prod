import pytest
from fastapi.testclient import TestClient
from main import app


@pytest.fixture(scope="module")
def test_app():
    # Trigger 'startup' event
    with TestClient(app) as client:
        yield client


def test_read_devices(test_app):
    response = test_app.get("/devices/")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)


def test_create_device(test_app):
    device_data = {
        "equip_inst_id": 500,
        "status": "string",
        "category": "string",
        "vendor": "string",
        "model": "string",
        "description": "string",
        "shelf": "string",
        "hostname": "string",
        "ip_address_v4": "string",
        "netmask_v4": "string",
        "ip_address_v6": "string",
        "netmask_v6": "string",
    }

    response = test_app.post("/devices/", json=device_data)
    assert response.status_code == 200
    data = response.json()
    assert data["equip_inst_id"] == device_data["equip_inst_id"]


def test_read_device(test_app):
    device_data = {
        "equip_inst_id": 500,
        "status": "string",
        "category": "string",
        "vendor": "string",
        "model": "string",
        "description": "string",
        "shelf": "string",
        "hostname": "string",
        "ip_address_v4": "string",
        "netmask_v4": "string",
        "ip_address_v6": "string",
        "netmask_v6": "string",
    }

    response = test_app.post("/devices/", json=device_data)
    assert response.status_code == 200
    created_data = response.json()

    device_id = created_data["device_key"]
    response = test_app.get(f"/devices/{device_id}")
    assert response.status_code == 200
    response_data = response.json()
    assert response_data["device_key"] == device_id


def test_update_device(test_app):
    device_data = {
        "equip_inst_id": 500,
        "status": "string",
        "category": "string",
        "vendor": "string",
        "model": "string",
        "description": "string",
        "shelf": "string",
        "hostname": "string",
        "ip_address_v4": "string",
        "netmask_v4": "string",
        "ip_address_v6": "string",
        "netmask_v6": "string",
    }

    response = test_app.post("/devices/", json=device_data)
    assert response.status_code == 200
    created_data = response.json()
    device_id = created_data["device_key"]

    update_data = {
        "equip_inst_id": 100,
        "status": "string",
        "category": "string",
        "vendor": "string",
        "model": "string",
        "description": "string",
        "shelf": "string",
        "hostname": "string",
        "ip_address_v4": "string",
        "netmask_v4": "string",
        "ip_address_v6": "string",
        "netmask_v6": "string",
    }

    response = test_app.put(f"/devices/{device_id}", json=update_data)
    assert response.status_code == 200
    response_data = response.json()
    assert response_data["equip_inst_id"] == update_data["equip_inst_id"]


def test_delete_device(test_app):
    device_data = {
        "equip_inst_id": 500,
        "status": "string",
        "category": "string",
        "vendor": "string",
        "model": "string",
        "description": "string",
        "shelf": "string",
        "hostname": "string",
        "ip_address_v4": "string",
        "netmask_v4": "string",
        "ip_address_v6": "string",
        "netmask_v6": "string",
    }

    response = test_app.post("/devices/", json=device_data)
    assert response.status_code == 200
    created_data = response.json()
    device_id = created_data["device_key"]

    # Now delete the device
    response = test_app.delete(f"/devices/{device_id}")
    assert response.status_code == 200
    response_data = response.json()
    # assert device_id in response_data["detail"]
    assert device_id in response_data["detail"]
