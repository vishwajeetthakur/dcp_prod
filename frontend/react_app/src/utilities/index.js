// // Regex patterns
// Tests for Hostname (target identifier) patterns
// Always 11 characters, first 8 are the location ...
// ... last 3 are a unique ID based on role and device count.
export const tidRegexPattern = /^\s*(\w){11}-?\w{0,3}\s*$/;

// Tests for IP Address patterns
export const ipv4RegexPattern = /^((25[0-5]|(2[0-4]|1\d|[1-9]|)\d)\.?\b){4}$/;
export const ipv4RangeRegexPattern = /^((25[0-5]|(2[0-4]|1\d|[1-9]|)\d)\.?\b){4}\s?-\s?((25[0-5]|(2[0-4]|1\d|[1-9]|)\d)\.?\b){4}$/;
export const ipv4AndCidrRegexPattern = /^((25[0-5]|(2[0-4]|1\d|[1-9]|)\d)\.?\b){4}\/(3[0-2]|[1-2]\d|\d)$/;

// MAC Address
export const macAddressRegexPattern = /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/;

// Tests for Granite Circuit ID patterns
export const circuitIdRegex = /^\d\d\..{4}\.\d{6}\..*?\..{4}$|^\d{5}\..{3,5}\..{11}\..{11}$/;

// Tests for Salesforce order patterns
export const idRegex = new RegExp(`(${'ENG-03464496'.replaceAll(' ', '|')})`, 'g');

export const emailRegex = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/

export const cidrRegexPattern = /\d/;

// Tests for Date patterns in format - 2050/01/01
export const dateRegex = /\d{4}\-\d{2}\-\d{2}/;

const allCapAcronyms = ['vpn', 'pfs', 'stp', 'ips', 'amp', 'url', 'epr', 'icb', 'tid', 'ip', 'wan', 'lan', 'vlan', 'id', 'dns', 'Dns', 'cid', 'ipsec', 'psk', 'ike', 'bgp', 'asn', 'fqdn', 'tcp', 'udp', 'icmp', 'nat', 'vip', 'cnid', 'dhcp'];
// // Formatting utilities
// Capitalizes the first letter in a given string
export const capFirst = (string) => (string.toLowerCase().includes('iot')
  ? 'IoT'
  : allCapAcronyms.includes(string)
    ? string.split('_').map((eachString) => eachString.toUpperCase()).join(' ')
    : string && string
      .split('_')
      .map((strings) => (allCapAcronyms.includes(strings)
        ? strings.toUpperCase()
        : strings?.charAt(0).toUpperCase() + strings?.slice(1))).join(' '));

// Normalizes a string from camel case to proper spacing and capitalizations
export const normalizeCamelCase = (string) => string && string?.replaceAll(/([a-z])([A-Z])/g, '$1 $2');

// adds accessibility props
export const a11yProps = (name) => ({
  id: `simple-tab-${name}`,
  'aria-controls': `simple-tabpanel-${name}`,
});

// formats date to a more readable format; can be customized/adjusted as needed
export const formatDate = (date) => new Date(date).toLocaleString('en-US', {
  weekday: 'short',
  day: 'numeric',
  year: 'numeric',
  month: 'long',
  hour: 'numeric',
  minute: 'numeric',
  second: 'numeric',
});

export const states = [
  // ... all the available US states
  { value: '', state: '' },
  { value: 'AL', state: 'Alabama' },
  { value: 'AK', state: 'Alaska' },
  { value: 'AZ', state: 'Arizona' },
  { value: 'AR', state: 'Arkansas' },
  { value: 'CA', state: 'California' },
  { value: 'CO', state: 'Colorado' },
  { value: 'CT', state: 'Connecticut' },
  { value: 'DE', state: 'Delaware' },
  { value: 'DC', state: 'District Of Columbia' },
  { value: 'FL', state: 'Florida' },
  { value: 'GA', state: 'Georgia' },
  { value: 'HI', state: 'Hawaii' },
  { value: 'ID', state: 'Idaho' },
  { value: 'IL', state: 'Illinois' },
  { value: 'IN', state: 'Indiana' },
  { value: 'IA', state: 'Iowa' },
  { value: 'KS', state: 'Kansas' },
  { value: 'KY', state: 'Kentucky' },
  { value: 'LA', state: 'Louisiana' },
  { value: 'ME', state: 'Maine' },
  { value: 'MD', state: 'Maryland' },
  { value: 'MA', state: 'Massachusetts' },
  { value: 'MI', state: 'Michigan' },
  { value: 'MN', state: 'Minnesota' },
  { value: 'MS', state: 'Mississippi' },
  { value: 'MO', state: 'Missouri' },
  { value: 'MT', state: 'Montana' },
  { value: 'NE', state: 'Nebraska' },
  { value: 'NV', state: 'Nevada' },
  { value: 'NH', state: 'New Hampshire' },
  { value: 'NJ', state: 'New Jersey' },
  { value: 'NM', state: 'New Mexico' },
  { value: 'NY', state: 'New York' },
  { value: 'NC', state: 'North Carolina' },
  { value: 'ND', state: 'North Dakota' },
  { value: 'OH', state: 'Ohio' },
  { value: 'OK', state: 'Oklahoma' },
  { value: 'OR', state: 'Oregon' },
  { value: 'PA', state: 'Pennsylvania' },
  { value: 'RI', state: 'Rhode Island' },
  { value: 'SC', state: 'South Carolina' },
  { value: 'SD', state: 'South Dakota' },
  { value: 'TN', state: 'Tennessee' },
  { value: 'TX', state: 'Texas' },
  { value: 'UT', state: 'Utah' },
  { value: 'VT', state: 'Vermont' },
  { value: 'VA', state: 'Virginia' },
  { value: 'WA', state: 'Washington' },
  { value: 'WV', state: 'West Virginia' },
  { value: 'WI', state: 'Wisconsin' },
  { value: 'WY', state: 'Wyoming' },
];

export function flattenObject(obj, currentKey){
    return Object.entries(obj)
        .reduce((acc, [key, val]) => {
            const fullKey = [currentKey, key].filter(k => k).join('.')
            
            if (typeof val != 'object' || val == null){
                return {...acc, [fullKey]: val}
            }
            else {
                return {...acc, ...flattenObject(val, fullKey)}
            }
        }, {})
}