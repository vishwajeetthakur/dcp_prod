import { 
    cidrRegexPattern, 
    ipv4RegexPattern, 
    ipv4AndCidrRegexPattern,
    ipv4RangeRegexPattern,
    circuitIdRegex,
    macAddressRegexPattern,
    emailRegex
} from '../../../utilities';

// export default function validationAndRelationshipCheck(fieldData, formData) {
//     function checkRelationship(obj) {
//         // Intakes
//         // {
//         //     "field": "5411643f-d9ed-47e3-a7c7-d97dabdedf5a",
//         //     "values": ["Off"]
//         // }
//         // and returns a bool
//         if (!obj) return false

//         if (typeof obj == 'boolean') return obj

//         let parentValue = formData[obj.field]

//         if (!parentValue) return false

//         // Normallizing to [ "val" ] structure
//         if (Array.isArray(parentValue)) parentValue = parentValue.map((i) => i.value)
//         else if (typeof parentValue == 'object') parentValue = [parentValue.value]
//         else parentValue = [parentValue]
//         // parentValue = parentValue.map(v => v.toString())

//         const result = obj?.values?.map((acceptedRelationshipValue) => (typeof acceptedRelationshipValue == 'string'
//                     ? acceptedRelationshipValue.toString().startsWith('!')
//                         ? !parentValue.includes(acceptedRelationshipValue.slice(1))
//                         : parentValue.includes(acceptedRelationshipValue)
//                     : parentValue.includes(acceptedRelationshipValue)))

//         return result.includes(true)
//     }

//     // const disabledCheck = formDisabled || checkRelationship(fieldData.disabled)
//     const disabledCheck = checkRelationship(fieldData.disabled)
//     const requiredCheck = checkRelationship(fieldData.required)
//     const validationObject = validate({ ...fieldData, required: requiredCheck }, formData[fieldData.id])

//     const errorObject = !disabledCheck
//             ? validationObject
//             : {}

//     return { disabled: disabledCheck, ...errorObject }
// }

export function validate(fieldData, value) {
    // If required and blank
    if (fieldData.required == true && (value != false && value != 0 && !value)) return { error: true }
    // If not required and blank
    if (fieldData.required == false && !value) return { error: false }

  // Process validation rules
  if (!fieldData.validate) return { };

  const validationFunction = validations?.[fieldData?.validate?.split('.')?.[1]];

  if (!validationFunction) return { };

  const { error, helperText } = validationFunction(value);

  return {
    error,
    helperText: error ? helperText : '',
  };
}

export const validations = {

    unique: (column, value, formValues, rows) => ({
        error: 
            !!(rows
                .filter(row => row.id != formValues.id)
                .find(row => row[column] == value)),
        helperText: `Not unique`,
    }),

    length_requirement: (value, length) => ({
        error: value.length < length,
        helperText: `Needs to be at least ${length} characters`,
    }),

    length_range_requirement: (value, from, to) => ({
        error: value.length < from || value.length > to,
        helperText: `Needs to be ${from} - ${to} characters long`,
    }),

  ipv4: (value) => ({
    error: !ipv4RegexPattern.test(value),
    helperText: 'Invalid IP address',
  }),

  ipv4_multiple: (values) => ({
    error: values.split(/,\s?\n?|\n/).some(value => !ipv4RegexPattern.test(value)),
    helperText: 'Invalid IP address, multiple addresses need to be comma or newline delineated',
  }),

  ipv4_range: (value) => ({
    error: !ipv4RangeRegexPattern.test(value),
    helperText: 'Invalid IP address range, expecting "x.x.x.x-x.x.x.x"',
  }),

  ipv4_cidr: (value) => ({
    error: !ipv4AndCidrRegexPattern.test(value),
    helperText: 'Invalid IP/CIDR',
  }),

  ipv4_cidr_multiple: (values) => ({
    error: values.split(/,\s?\n?|\n/).some(value => !ipv4AndCidrRegexPattern.test(value)),
    helperText: 'Invalid IP/CIDR, multiple addresses need to be comma or newline delineated',
  }),

  mac: (value) => ({
    error: !macAddressRegexPattern.test(value),
    helperText: 'Invalid MAC Address',
  }),

  circuit: (value) => ({
    error: !circuitIdRegex.test(value),
    helperText: 'Invalid Circuit',
  }),

  cameras_ipv4: (value) => ({
    error: (!ipv4RegexPattern.test(value) || value !== "DHCP"),
    helperText: 'Invalid IP address',
  }),

  cidr: (values) => ({
    error: !cidrRegexPattern.test(value),
    helperText: 'Must be in CIDR format',
  }),

  integer: (value) => ({
    error: typeof (value) !== 'number',
    helperText: 'Must be a number',
  }),

  vlan_name: (value) => ({
    error: !(value.match(/^[a-zA-Z0-9@#_]+$/)),
    helperText: 'Invalid character',
  }),

  vlan_id: (values) => ({
    error: values.split(', ').every(value => !(value >= 1 && value <= 4094)),
    helperText: 'Integer must be between 1-4094',
  }),

  allowed_vlan: (values) => ({
    error: (
            values?.toLowerCase() != "all"
        &&  values.split(/,\s?|-/).some(value => !(value >= 1 && value <= 4094))
    ),
    helperText: 'Integer must be between 1-4094, a list of integers, or "All"',
  }),

  voice_vlan: (value, formValues) => ({
    error: (!(value >= 1 && value <= 4094) || value == formValues.vlan),
    helperText: (value == formValues?.vlan) ? 'Value cannot be the same as VLAN' : 'Integer must be between 1-4094',
  }),

  port: (value) => ({
    error: !(value >= 1 && value <= 65535),
    helperText: 'Integer must be between 1-65535',
  }),
  port_multiple: (values) => ({
    error: values.split(/,\s?|-/).some(value => !(value >= 1 && value <= 65535)),
    helperText: 'Integer must be between 1-65535, multiples can be provided in a range or comma delineated',
  }),
  icmp: (value) => ({
    error: !(value >= 0 && value <= 255),
    helperText: 'Integer must be between 0-255',
  }),

//   protocol: (value) => ({
//     error: !(value >= 0 && value <= 254),
//     helperText: 'Integer must be between 0-254',
//   }),

  bgp: (value) => ({
    error: !(value >= 1 && value <= 4294967295),
    helperText: 'Integer must be between 1-4294967295',
  }),

  subnet: (value) => ({
    error: false,
    helperText: 'Must be a subnet',
  }),

  address_object: (value) => ({
    error: false,
    helperText: 'Must be an address object',
  }),

  distance: (value) => ({
    error: !(value >= 1 && value <= 255),
    helperText: 'Integer must be between 1-255',
  }),

  uniqueToLanInterface: (value) => ({
    error: value,
    helperText: 'Must be unique to a LAN interface',
  }),

  unique_email: (value) => ({
    error: !emailRegex.test(value),
    helperText: 'Must be a unique email',
  }),
};