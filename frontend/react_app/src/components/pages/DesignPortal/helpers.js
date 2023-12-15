export const getGraniteUrl = id => `https://granite-ise.chartercom.com:2269/web-access/WebAccess.html#HistoryToken,type=Path,mode=VIEW_MODE,instId=${id}`

export const getSalesforceUrl = id => `https://spectrum-enterprise.my.salesforce.com/${id}`

export const isValidMSProductFamily = productFamily => [
    'Enterprise Network Switch',
    'Enterprise Network Edge',
    'Enterprise Network WiFi',
    'Managed Network Edge',
    'Managed Network Switch',
    'Managed Network Camera',
    'Managed Network WiFi',
    'Managed Network IoT Sensor',
    'Managed Network Additional',
].includes(productFamily)

export const getDefault = (databaseData, defaultData) => {

    // console.log('getDefault: ', databaseData, defaultData, typeof defaultData)
    if (typeof defaultData !== 'string') return defaultData;

    if (defaultData.startsWith('salesforce.')) return databaseData.salesforce[defaultData.split('.')[1]]

    if (defaultData.startsWith('granite.')) return databaseData.granite[defaultData.split('.')[1]]

    if (defaultData.startsWith('CLLI-MSxx')) return `${databaseData?.granite?.Z_SIDE.split('-')[0]}-MSxx` ?? ''

    if (defaultData.startsWith('hostname')) return `${databaseData?.granite?.Z_SIDE.split('-')[0]}` || ''

    return defaultData;
};

export const capitalizeFirstLetter = (string) => {
    if (!string) return string

    return string[0].toUpperCase() + string.slice(1).toLowerCase();
}

export const nextAlphanumericHostnameSuffix = (data) => {
    const suffixArray = '1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')

    return data
        .map(row => row.hostname?.slice(-1))
        .reduce((acc, i) => {
            return suffixArray.filter(s => s != i)
        }, suffixArray)[0] || 'x'
}

export const nextHostnameSuffix = (data) => {
    const highestSuffix = data.map(row => row.hostname.slice(-2)).sort().slice(-1)

    const nextSuffix = ((parseInt(highestSuffix) || 0) + 1).toString()

    return ('0' + nextSuffix).slice(-2)
}

export const subnetMasks = [
    "255.255.255.255",
    "255.255.255.254",
    "255.255.255.252",
    "255.255.255.248",
    "255.255.255.240",
    "255.255.255.224",
    "255.255.255.192",
    "255.255.255.128",
    "255.255.255.0",
    "255.255.254.0",
    "255.255.252.0",
    "255.255.248.0",
    "255.255.240.0",
    "255.255.224.0",
    "255.255.192.0",
    "255.255.128.0",
    "255.255.0.0",
    "255.254.0.0",
    "255.252.0.0",
    "255.248.0.0",
    "255.240.0.0",
    "255.224.0.0",
    "255.192.0.0",
    "255.128.0.0",
    "255.0.0.0",
    "254.0.0.0",
    "252.0.0.0",
    "248.0.0.0",
    "240.0.0.0",
    "224.0.0.0",
    "192.0.0.0",
    "128.0.0.0",
    "0.0.0.0"
]

export const subnetMasksWithCidr = [
    "255.255.255.254 (/31)",
    "255.255.255.252 (/30)",
    "255.255.255.248 (/29)",
    "255.255.255.240 (/28)",
    "255.255.255.224 (/27)",
    "255.255.255.192 (/26)",
    "255.255.255.128 (/25)",
    "255.255.255.0 (/24)",
    "255.255.254.0 (/23)",
    "255.255.252.0 (/22)",
    "255.255.248.0 (/21)",
    "255.255.240.0 (/20)",
    "255.255.224.0 (/19)",
    "255.255.192.0 (/18)",
    "255.255.128.0 (/17)",
    "255.255.0.0 (/16)",
    "255.254.0.0 (/15)",
    "255.252.0.0 (/14)",
    "255.248.0.0 (/13)",
    "255.240.0.0 (/12)",
    "255.224.0.0 (/11)",
    "255.192.0.0 (/10)",
    "255.128.0.0 (/9)",
    "255.0.0.0 (/8)",
    "254.0.0.0 (/7)",
    "252.0.0.0 (/6)",
    "248.0.0.0 (/5)",
    "240.0.0.0 (/4)",
    "224.0.0.0 (/3)",
    "192.0.0.0 (/2)",
    "128.0.0.0 (/1)",
    "0.0.0.0 (/0)"
]

export const categoryBlocking = [
    "Adult",
    "Advertisements",
    "Alcohol",
    "Animals and Pets",
    "Arts",
    "Astrology",
    "Auctions",
    "Business and Industry",
    "Cannabis",
    "Chat and Instant Messaging",
    "Cheating and Plagiarism",
    "Child Abuse Content",
    "Cloud and Data Centers",
    "Computer Security",
    "Computers and Internet",
    "Conventions, Conferences and Trade Shows",
    "Cryptocurrency",
    "Cryptomining",
    "Dating",
    "Digital Postcards",
    "Dining and Drinking",
    "DIY Projects",
    "DNS-Tuneling",
    "DNS-Tunneling",
    "DoH and DoT",
    "Dynamic and Residential",
    "Dynamic DNS Provider",
    "Education",
    "Entertainment",
    "Extreme",
    "Fashion",
    "File Transfer Services",
    "Filter Avoidance",
    "Finance",
    "Freeware and Shareware",
    "Gambling",
    "Games",
    "Government and Law",
    "Hacking",
    "Hate Speech",
    "Health and Medicine",
    "Humor",
    "Hunting",
    "Illegal Activities",
    "Illegal Downloads",
    "Illegal Drugs",
    "Infrastructure and Content Delivery Networks",
    "Internet of Things",
    "Internet Telephony",
    "Job Search",
    "Lingerie and Swimsuits",
    "Lotteries",
    "Military",
    "Mobile Phones",
    "Museums",
    "Nature and Conservation",
    "News",
    "Non-governmental Organizations",
    "Non-sexual Nudity",
    "Not Actionable",
    "Online Communities",
    "Online Document Sharing and Collaboration",
    "Online Meetings",
    "Online Storage and Backup",
    "Online Trading",
    "Organizational Email",
    "Paranormal",
    "Parked Domains",
    "Peer File Transfer",
    "Personal Sites",
    "Personal VPN",
    "Photo Search and Images",
    "Politics",
    "Pornography",
    "Private IP Addresses as Host",
    "Professional Networking",
    "Real Estate",
    "Recipes and Food",
    "Reference",
    "Regional Restricted Sites (Germany)",
    "Regional Restricted Sites (Great Britain)",
    "Regional Restricted Sites (Italy)",
    "Regional Restricted Sites (Poland)",
    "Religion",
    "SaaS and B2B",
    "Safe for Kids",
    "Science and Technology",
    "Search Engines and Portals",
    "Sex Education",
    "Shopping",
    "Social Networking",
    "Social Science",
    "Society and Culture",
    "Software Updates",
    "Sports and Recreation",
    "Streaming Audio",
    "Streaming Video",
    "Terrorism and Violent Extremism",
    "Tobacco",
    "Transportation",
    "Travel",
    "URL Shorteners",
    "Weapons",
    "Web Cache and Archives",
    "Web Hosting",
    "Web Page Translation",
    "Web-based Email"
]

export const threatCategories = [
    "Bogon",
    "Botnets",
    "Cryptojacking",
    "DNS Tunneling",
    "Domain Generated Algorithm",
    "Dynamic DNS",
    "Ebanking Fraud",
    "Exploits",
    "High Risk Sites and Locations",
    "Indicators of Compromise (IOC)",
    "Linkshare",
    "Malicious Sites",
    "Malware Sites",
    "Newly Seen Domains",
    "Open HTTP Proxy",
    "Open Mail Relay",
    "Phishing",
    "Spam",
    "Spyware and Adware",
    "TOR exit Nodes"
]

export function resetWebFilter(setFormData) {
    if (confirm('Are you sure you want to reset Category Blocking and Threat Categories to the default values?')) {
        setFormData((old) => ({
            ...old,
            policy_web_filter_category_blocking: 'Adult, Alcohol, Cannabis, Child Abuse Content, Dating, DNS-Tunneling, Extreme, Filter Avoidance, Gambling, Hacking, Hate Speech, Hunting, Illegal Activities, Illegal Downloads, Illegal Drugs, Lingerie and Swimsuits, Non-sexual Nudity, Paranormal, Pornography, Terrorism and Violent Extremism, Tobacco, Weapons',
            policy_web_filter_threat_categories: 'Bogon, Botnets, Cryptojacking, DNS Tunneling, Domain Generated Algorithm, Dynamic DNS, Ebanking Fraud, Exploits, High Risk Sites and Locations, Indicators of Compromise (IOC), Linkshare, Malicious Sites, Malware Sites, Open Mail Relay, Phishing, Spam, Spyware and Adware, TOR exit Nodes'
        }))
    }
}

export const countries = [
    'Afghanistan',
    'Aland Islands',
    'Albania',
    'Algeria',
    'American Samoa',
    'Andorra',
    'Angola',
    'Anguilla',
    'Antarctica',
    'Antigua and Barbuda',
    'Argentina',
    'Armenia',
    'Aruba',
    'Australia',
    'Austria',
    'Azerbaijan',
    'Bahamas',
    'Bahrain',
    'Bangladesh',
    'Barbados',
    'Belarus',
    'Belgium',
    'Belize',
    'Benin',
    'Bermuda',
    'Bhutan',
    'Bolivia',
    'Bosnia and Herzegovina',
    'Botswana',
    'Bouvet Island',
    'Brazil',
    'British Indian Ocean Territory',
    'Brunei Darussalam',
    'Bulgaria',
    'Burkina Faso',
    'Burundi',
    'Cambodia',
    'Cameroon',
    'Canada',
    'Cape Verde',
    'Cayman Islands',
    'Central African Republic',
    'Chad',
    'Chile',
    'China',
    'Christmas Island',
    'Cocos (Keeling) Islands',
    'Colombia',
    'Comoros',
    'Congo (Brazzaville)',
    'Congo, Democratic Republic of the',
    'Cook Islands',
    'Costa Rica',
    "Cote D'Ivoire",
    'Croatia',
    'Cuba',
    'Curacao',
    'Cyprus',
    'Czech Republic',
    'Denmark',
    'Djibouti',
    'Dominica',
    'Dominican Republic',
    'Ecuador',
    'Egypt',
    'El Salvador',
    'Equatorial Guinea',
    'Eritrea',
    'Estonia',
    'Ethiopia',
    'Falkland Islands (Malvinas)',
    'Faroe Islands',
    'Fiji',
    'Finland',
    'France',
    'French Guiana',
    'French Polynesia',
    'French Southern Territories',
    'Gabon',
    'Gambia',
    'Georgia',
    'Germany',
    'Ghana',
    'Gibraltar',
    'Greece',
    'Greenland',
    'Grenada',
    'Guadeloupe',
    'Guam',
    'Guatemala',
    'Guernsey',
    'Guinea',
    'Guinea-Bissau',
    'Guyana',
    'Haiti',
    'Heard Island and Mcdonald Islands',
    'Honduras',
    'Hong Kong',
    'Hungary',
    'Iceland',
    'India',
    'Indonesia',
    'Iran',
    'Iraq',
    'Ireland',
    'Isle of Man',
    'Israel',
    'Italy',
    'Jamaica',
    'Japan',
    'Jersey',
    'Jordan',
    'Kazakhstan',
    'Kenya',
    'Kiribati',
    'Kosovo',
    'Kuwait',
    'Kyrgyzstan',
    'Laos',
    'Latvia',
    'Lebanon',
    'Lesotho',
    'Liberia',
    'Libya',
    'Liechtenstein',
    'Lithuania',
    'Luxembourg',
    'Macao',
    'Macedonia, the Former Yugoslav Republic of',
    'Madagascar',
    'Malawi',
    'Malaysia',
    'Maldives',
    'Mali',
    'Malta',
    'Marshall Islands',
    'Martinique',
    'Mauritania',
    'Mauritius',
    'Mayotte',
    'Mexico',
    'Micronesia, Federated States of',
    'Moldova',
    'Monaco',
    'Mongolia',
    'Montenegro',
    'Montserrat',
    'Morocco',
    'Mozambique',
    'Myanmar',
    'Namibia',
    'Nauru',
    'Nepal',
    'Netherlands',
    'Netherlands Antilles',
    'New Caledonia',
    'New Zealand',
    'Nicaragua',
    'Niger',
    'Nigeria',
    'Niue',
    'Norfolk Island',
    'North Korea',
    'Northern Mariana Islands',
    'Norway',
    'Oman',
    'Pakistan',
    'Palau',
    'Palestine',
    'Panama',
    'Papua New Guinea',
    'Paraguay',
    'Peru',
    'Philippines',
    'Pitcairn',
    'Poland',
    'Portugal',
    'Puerto Rico',
    'Qatar',
    'Reunion',
    'Romania',
    'Russia',
    'Rwanda',
    'Saint Helena',
    'Saint Kitts and Nevis',
    'Saint Lucia',
    'Saint Pierre and Miquelon',
    'Saint Vincent and the Grenadines',
    'Saint-Barthlemy',
    'Saint-Martin (French part)',
    'Samoa',
    'San Marino',
    'Sao Tome and Principe',
    'Saudi Arabia',
    'Senegal',
    'Serbia',
    'Seychelles',
    'Sierra Leone',
    'Singapore',
    'Slovakia',
    'Slovenia',
    'Solomon Islands',
    'Somalia',
    'South Africa',
    'South Georgia and the South Sandwich Islands',
    'South Korea',
    'South Sudan',
    'Spain',
    'Sri Lanka',
    'Sudan',
    'Suriname',
    'Svalbard and Jan Mayen Islands',
    'Swaziland',
    'Sweden',
    'Switzerland',
    'Syria',
    'Taiwan',
    'Tajikistan',
    'Tanzania',
    'Thailand',
    'Timor-Leste',
    'Togo',
    'Tokelau',
    'Tonga',
    'Trinidad and Tobago',
    'Tunisia',
    'Turkey',
    'Turkmenistan',
    'Turks and Caicos Islands',
    'Tuvalu',
    'Uganda',
    'Ukraine',
    'United Arab Emirates',
    'United Kingdom',
    'United States',
    'United States minor outlying islands',
    'Uruguay',
    'Uzbekistan',
    'Vanuatu',
    'Vatican City',
    'Venezuela',
    'Vietnam',
    'Virgin Islands, British',
    'Virgin Islands, U.S.',
    'Wallis and Futuna',
    'Western Sahara',
    'Yemen',
    'Zambia',
    'Zimbabwe'
]

export const deviceSchemas = {
    'MS210-24P-HW': {
        product_family: 'Managed Network Switch',
        sf_offer_name: 'Managed Network Switch MS210-24-POE',
        sf_statement_description: 'Managed Network Switch MS210-24-POE',
        model: 'MS210-24P-HW',
        service_codes: ['RM661'],
        license_type: 'MS210-24P'
    },
    'MS210-48FP-HW': {
        product_family: 'Managed Network Switch',
        sf_offer_name: 'Managed Network Switch MS210-48-POE',
        sf_statement_description: 'Managed Network Switch MS210-48-POE',
        model: 'MS210-48FP-HW',
        service_codes: ['RM662'],
        license_type: 'MS210-48FP'
    },
    'MS225-24P-HW': {
        product_family: 'Managed Network Switch',
        sf_offer_name: 'Managed Network Switch MS225-24-POE',
        sf_statement_description: 'Managed Network Switch MS225-24-POE',
        model: 'MS225-24P-HW',
        service_codes: ['RM663'],
        license_type: 'MS225-24P'
    },
    'MS225-48FP-HW': {
        product_family: 'Managed Network Switch',
        sf_offer_name: 'Managed Network Switch MS225-48-POE',
        sf_statement_description: 'Managed Network Switch MS225-48-POE',
        model: 'MS225-48FP-HW',
        service_codes: ['RM664'],
        license_type: 'MS225-48FP'
    },
    'MS250-24P-HW': {
        product_family: 'Managed Network Switch',
        sf_offer_name: 'Managed Network Switch MS250-24-POE',
        sf_statement_description: 'Managed Network Switch MS250-24-POE',
        model: 'MS250-24P-HW',
        service_codes: ['RM665'],
        license_type: 'MS250-24P'
    },
    'MS250-48FP-HW': {
        product_family: 'Managed Network Switch',
        sf_offer_name: 'Managed Network Switch MS250-48-POE',
        sf_statement_description: 'Managed Network Switch MS250-48-POE',
        model: 'MS250-48FP-HW',
        service_codes: ['RM666'],
        license_type: 'MS250-48FP'
    },
    'MS350-24X-HW': {
        product_family: 'Managed Network Switch',
        sf_offer_name: 'Managed Network Switch MS350-48-POE',
        sf_statement_description: 'Managed Network Switch MS350-48-POE',
        model: 'MS350-24X-HW',
        service_codes: ['RM667'],
        license_type: 'MS350-24X'
    },
    'MS350-48X-HW': {
        product_family: 'Managed Network Switch',
        sf_offer_name: 'Managed Network Switch MS350-24-POE',
        sf_statement_description: 'Managed Network Switch MS350-24-POE',
        model: 'MS350-48X-HW',
        service_codes: ['RM668'],
        license_type: 'MS350-48X'
    },
    'MS425-16-HW': {
        product_family: 'Managed Network Switch',
        sf_offer_name: 'Managed Network Switch MS425-16-AGG',
        sf_statement_description: 'Managed Network Switch MS425-16-AGG',
        model: 'MS425-16-HW',
        service_codes: ['RM669'],
        license_type: 'MS425-16'
    },
    'MS425-32-HW': {
        product_family: 'Managed Network Switch',
        sf_offer_name: 'Managed Network Switch MS425-32-AGG',
        sf_statement_description: 'Managed Network Switch MS425-32-AGG',
        model: 'MS425-32-HW',
        service_codes: ['RM670'],
        license_type: 'MS425-32'
    },
    'MS120-8': {
        product_family: 'Managed Network Switch',
        sf_offer_name: 'Managed Network Switch 8 Port',
        sf_statement_description: 'Managed Network Switch 8 Port',
        model: 'MS120-8',
        service_codes: ['RM626'],
        license_type: 'MS120-8'
    },
    'MS120-8FP': {
        product_family: 'Managed Network Switch',
        sf_offer_name: 'Managed Network Switch 8 Port PoE',
        sf_statement_description: 'Managed Network Switch 8 Port PoE',
        model: 'MS120-8FP',
        service_codes: ['RM627'],
        license_type: 'MS120-8FP'
    },
    'MS120-24P': {
        product_family: 'Managed Network Switch',
        sf_offer_name: 'Managed Network Switch 24 Port PoE',
        sf_statement_description: 'Managed Network Switch 24 Port PoE',
        model: 'MS120-24P',
        service_codes: ['RM628'],
        license_type: 'MS120-24P'
    },
    'MS125-48LP': {
        product_family: 'Managed Network Switch',
        sf_offer_name: 'Managed Network Switch 48 Port PoE',
        sf_statement_description: 'Managed Network Switch 48 Port PoE',
        model: 'MS125-48LP',
        service_codes: ['RM629'],
        license_type: 'MS125-48LP'
    },
    'MS410-16': {
        product_family: 'Managed Network Switch',
        sf_offer_name: 'Managed Network Switch Aggregation',
        sf_statement_description: 'Managed Network Switch Aggregation',
        model: 'MS410-16',
        service_codes: ['RM630'],
        license_type: 'MS410-16'
    },
    MR30H: {
        product_family: 'Managed Network WiFi',
        sf_offer_name: 'Managed Network WiFi In Room Coverage',
        sf_statement_description: 'Managed Network WiFi In Room Coverage',
        model: 'MR30H',
        service_codes: ['RM632', 'RM637'],
        license_type: ['ENT', 'MR-ADV']
    },
    MR36: {
        product_family: 'Managed Network WiFi',
        sf_offer_name: 'Managed Network WiFi General Purpose',
        sf_statement_description: 'Managed Network WiFi General Purpose',
        model: 'MR36',
        service_codes: ['RM633'],
        license_type: ['ENT', 'MR-ADV']
    },
    MR45: {
        product_family: 'Managed Network WiFi',
        sf_offer_name: 'Managed Network WiFi High Performance',
        sf_statement_description: 'Managed Network WiFi High Performance',
        model: 'MR45',
        service_codes: ['RM634'],
        license_type: ['ENT', 'MR-ADV']
    },
    MR74: {
        product_family: 'Managed Network WiFi',
        sf_offer_name: 'Managed Network WiFi General Purpose Outdoor',
        sf_statement_description: 'Managed Network WiFi General Purpose Outdoor',
        model: 'MR74',
        service_codes: ['RM635'],
        license_type: ['ENT', 'MR-ADV']
    },
    MR84: {
        product_family: 'Managed Network WiFi',
        sf_offer_name: 'Managed Network WiFi High Performance Outdoor',
        sf_statement_description: 'Managed Network WiFi High Performance Outdoor',
        model: 'MR84',
        service_codes: ['RM636'],
        license_type: ['ENT', 'MR-ADV']
    },
    MR33: {
        product_family: 'Managed Network WiFi',
        sf_offer_name: 'Managed Network Secure WiFi General Purpose',
        sf_statement_description: 'Managed Network Secure WiFi General Purpose',
        model: 'MR33',
        service_codes: ['RM638'],
        license_type: ['ENT', 'MR-ADV']
    },
    MR46: {
        product_family: 'Managed Network WiFi',
        sf_offer_name: 'Managed Network Secure WiFi High Performance',
        sf_statement_description: 'Managed Network Secure WiFi High Performance',
        model: 'MR46',
        service_codes: ['RM639'],
        license_type: ['ENT', 'MR-ADV']
    },
    MR76: {
        product_family: 'Managed Network WiFi',
        sf_offer_name: 'Managed Network Secure WiFi General Purpose Outdoor',
        sf_statement_description: 'Managed Network Secure WiFi General Purpose Outdoor',
        model: 'MR76',
        service_codes: ['RM640'],
        license_type: ['ENT', 'MR-ADV']
    },
    MR86: {
        product_family: 'Managed Network WiFi',
        sf_offer_name: 'Managed Network Secure WiFi High Performance Outdoor',
        sf_statement_description: 'Managed Network Secure WiFi High Performance Outdoor',
        model: 'MR86',
        service_codes: ['RM641'],
        license_type: ['ENT', 'MR-ADV']
    },
    'MV2-HW': {
        product_family: 'Managed Network Camera',
        sf_offer_name: 'Managed Network Camera Flex',
        sf_statement_description: 'Managed Network Camera Flex',
        model: 'MV2-HW',
        service_codes: ['RM675'],
        license_type: 'MV'
    },
    'MV52-HW': {
        product_family: 'Managed Network Camera',
        sf_offer_name: 'Managed Network Camera Bullet',
        sf_statement_description: 'Managed Network Camera Bullet',
        model: 'MV52-HW',
        license_type: 'MV'
    },
    MV12N: {
        product_family: 'Managed Network Camera',
        sf_offer_name: 'Managed Network Camera Narrow Angle',
        sf_statement_description: 'Managed Network Camera Narrow Angle',
        model: 'MV12N',
        service_codes: ['RM644'],
        license_type: 'MV'
    },
    MV12W: {
        product_family: 'Managed Network Camera',
        sf_offer_name: 'Managed Network Camera Wide Angle',
        sf_statement_description: 'Managed Network Camera Wide Angle',
        model: 'MV12W',
        service_codes: ['RM645'],
        license_type: 'MV'
    },
    MV32: {
        product_family: 'Managed Network Camera',
        sf_offer_name: 'Managed Network Camera 360 Degree',
        sf_statement_description: 'Managed Network Camera 360 Degree',
        model: 'MV32',
        service_codes: ['RM646'],
        license_type: 'MV'
    },
    MV72: {
        product_family: 'Managed Network Camera',
        sf_offer_name: 'Managed Network Camera Varifocul',
        sf_statement_description: 'Managed Network Camera Varifocul',
        model: 'MV72',
        service_codes: ['RM647'],
        license_type: 'MV'
    },
    'Z3-HW': {
        product_family: 'Managed Network Additional',
        sf_offer_name: 'Managed Network Teleworker',
        sf_statement_description: 'Managed Network Teleworker',
        model: 'Z3-HW',
        service_codes: ['RM625'],
        license_type: 'Z3-ENT'
    },
    'Z3C-HW-NA': {
        product_family: 'Managed Network Additional',
        sf_offer_name: 'Managed Network Teleworker LTE',
        sf_statement_description: 'Managed Network Teleworker LTE',
        model: 'Z3C-HW-NA',
        service_codes: ['RM685'],
        license_type: 'Z3C-ENT'
    },
    'MT10-HW': {
        product_family: 'Managed Network Sensor',
        sf_offer_name: 'Managed Network Sensor Temp & Humidity',
        sf_statement_description: 'Managed Network Sensor Temp & Humidity',
        model: 'MT10-HW',
        service_codes: ['TBD48'],
        license_type: 'MT'
    },
    'MT11-HW': {
        product_family: 'Managed Network Sensor',
        sf_offer_name: 'Managed Network Sensor Probe ',
        sf_statement_description: 'Managed Network Sensor Probe ',
        model: 'MT11-HW',
        service_codes: ['TBD49'],
        license_type: 'MT'
    },
    'MT12-HW': {
        product_family: 'Managed Network Sensor',
        sf_offer_name: 'Managed Network Sensor Water Detection',
        sf_statement_description: 'Managed Network Sensor Water Detection',
        model: 'MT12-HW',
        service_codes: ['TBD50'],
        license_type: 'MT'
    },
    'MT20-HW': {
        product_family: 'Managed Network Sensor',
        sf_offer_name: 'Managed Network Sensor Open | Close',
        sf_statement_description: 'Managed Network Sensor Open | Close',
        model: 'MT20-HW',
        service_codes: [],
        license_type: 'MT'
    },
    'MT14-HW': {
        product_family: 'Managed Network Sensor',
        sf_offer_name: 'Managed Network Sensor Air Quality',
        sf_statement_description: 'Managed Network Sensor Air Quality',
        model: 'MT14-HW',
        service_codes: [],
        license_type: 'MT'
    },
    MX68: {
        product_family: 'Managed Network Edge',
        sf_offer_name: 'Managed Network Edge 20Mbps',
        sf_statement_description: 'Managed Network Edge 20 Mbps',
        model: 'MX68',
        service_codes: [
            'RM600', 'RM601',
            'RM602', 'RM603',
            'RM604', 'RM610',
            'RM611', 'RM612',
            'RM613', 'RM614'
        ],
        license_type: 'MX68-SEC'
    },
    MX85: {
        product_family: 'Managed Network Edge',
        sf_offer_name: 'Managed Network Edge 500 Mbps',
        sf_statement_description: 'Managed Network Edge 500 Mbps',
        model: 'MX85',
        service_codes: ['RM605', 'RM606', 'RM615', 'RM616'],
        license_type: 'MX85-SEC'
    },
    MX95: {
        product_family: 'Managed Network Edge',
        model: 'MX95',
        license_type: 'MX95-SEC'
    },
    MX105: {
        product_family: 'Managed Network Edge',
        sf_offer_name: 'Managed Network Edge 1 Gbps',
        sf_statement_description: 'Managed Network Edge 1 Gbps',
        model: 'MX105',
        service_codes: ['RM607', 'RM617'],
        license_type: 'MX105-SEC'
    },
    MX250: {
        product_family: 'Managed Network Edge',
        sf_offer_name: 'Managed Network Edge 2 Gbps',
        sf_statement_description: 'Managed Network Edge 2 Gbps',
        model: 'MX250',
        service_codes: ['RM608', 'RM618'],
        license_type: 'MX250-SEC'
    },
    MX450: {
        product_family: 'Managed Network Edge',
        sf_offer_name: 'Managed Network Edge 4 Gbps',
        sf_statement_description: 'Managed Network Edge 4 Gbps',
        model: 'MX450',
        service_codes: ['RM609', 'RM619'],
        license_type: 'MX450-SEC'
    }
}

export function getDevicesByServiceCode(serviceCode) {
    return Object.values(deviceSchemas).filter(i => i.service_codes?.includes(serviceCode))
}

export function getDevicesByProductFamily(product_family) {
    return Object.values(deviceSchemas).filter(i => i.product_family == product_family)
}

export const wanInterfaces = {
    // LAN is determined on as an interface not in the array
    MX68: ['port1', 'port2'],
    MX85: ['port1', 'port2', 'port3', 'port4'],
    MX95: ['port1', 'port2', 'port3', 'port4'],
    MX105: ['port1', 'port2', 'port3', 'port4'],
    MX250: ['port1', 'port2'],
    MX450: ['port1', 'port2'],
    'MX450 - ICB': ['port1', 'port2'],
}