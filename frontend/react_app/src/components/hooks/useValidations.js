import { useState } from 'react';
import { useSelector } from 'react-redux';

const useValidations = () => {
  const { dpDummyData } = useSelector((state) => state.globalStates);
  const [savedValues, setSavedValues] = useState(['interface 1', 'customer']);

  return {
    ipv4: (value) => {
      console.log('validations().ipv4: ', value, dpDummyData);
      // if (!ipv4RegexPattern.test(value)) return 'Invalid IP address';
    },
    vlan_id: (value) => {
      if (value < 1 > 4094) return 'Integer must be between 1-4094 inclusive';
    },
    unique: (value) => {
      console.log('in unique validator: ', value, dpDummyData);

      if (savedValues.includes(value)) return 'Value must be unique';
      setSavedValues((prevValues) => ({ ...prevValues, value }));
    },
    port: (value, start_port, end_port) => {
      if (value < 1 > 65535) return 'Integer must be between 1-65535 inclusive';
      if ((start_port > end_port) || (end_port < start_port)) return 'Start port must be less than end port';
    },
    icmp: (value) => {
      if (value < 0 > 255) return 'Integer must be between 0-255 inclusive';
    },
    protocol: (value) => {
      if (value < 0 > 254) return 'Integer must be between 0-254 inclusive';
    },
    bgp: (value) => {
      if (value < 1 > 4294967295) return 'Integer must be between 1-4294967295 inclusive';
    },
    ip_list: (value) => {
      // come back to this one
    },
    subnet: (value) => {},
    address_object: (value) => {},
    distance: (value) => {
      if (value < 1 > 255) return 'Integer must be between 1-255 inclusive';
    },
  };
};

export default useValidations;