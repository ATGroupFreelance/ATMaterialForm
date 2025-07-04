//import ServiceManager from '@/serviceManager/serviceManager';

class ServiceManagerClass {
    uploadFilesToServer = (requestBody) => {
        console.log('requestBody', requestBody)
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve([
                    {
                        id: '10004912230',
                        name: 'Test.pdf',
                        size: 17856,
                    },
                    {
                        id: '10004912232',
                        name: 'image.jpg',
                        size: 17456,
                    }
                ])
            }, 1000)
        })
    }

    getFile = (id) => {
        return {
            id
        }
    }

    getData_layerA = () => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve([
                    {
                        id: 'A1_1',
                        title: 'A1_1',
                    },
                    {
                        id: 'A1_2',
                        title: 'A1_2',
                    }
                ])
            })
        })
    }

    getData_layerAB = ({ layerA }) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve([
                    {
                        id: `${layerA}_AB1_1`,
                        title: `${layerA}_AB1_1`,
                        layerA,
                    },
                    {
                        id: `${layerA}_AB1_2`,
                        title: `${layerA}_AB1_2`,
                        layerA,
                    }
                ])
            })
        })
    }

    getData_layerABC1 = ({ layerA, layerAB }) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve([
                    {
                        id: `${layerA}_${layerAB}_ABC1`,
                        title: `${layerA}_${layerAB}_ABC1`,
                        layerA,
                        layerAB,
                    }
                ])
            })
        })
    }

    getData_layerABC2 = ({ layerA, layerAB }) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve([
                    {
                        id: `${layerA}_${layerAB}_ABC2_1`,
                        title: `${layerA}_${layerAB}_ABC2_1`,
                        layerA,
                        layerAB,
                    },
                    {
                        id: `${layerA}_${layerAB}_ABC2_2`,
                        title: `${layerA}_${layerAB}_ABC2_2`,
                        layerA,
                        layerAB,
                    }
                ])
            })
        })
    }

    getCountries = () => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve([{ title: 'UK', id: 1 }, { title: 'US', id: 2 }])
            }, 500)
        })
    }

    getCountriesLabelOnly = () => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(['UK', 'US'])
            }, 3000)
        })
    }

    getStrictFormatState = () => {
        return this.getEnums()
            .then(res => {
                return res.StrictFormatState
            })
    }

    getStrictFormatCapital = () => {
        return this.getEnums()
            .then(res => {
                return res.StrictFormatCapital
            })
    }

    getEnums = () => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const enums = {
                    "StrictFormatState": [{ title: 'England2', id: 1, parent_id: 1 }, { title: 'England', id: 2, parent_id: 1 }, { title: 'Alabama', id: 3, parent_id: 2 }],
                    "StrictFormatCapital": [{ title: 'EnglandCapital', id: 4, parent_id: 2 }, { title: 'AlabamaCapital', id: 5, parent_id: 3 }],
                    "Countries": [{ title: 'UK', id: 1 }, { title: 'US', id: 2 }],
                    "StateAndCapitals": [
                        { id: 1, title: "England2", Country: 1 },
                        { id: 2, title: "England", Country: 1 },
                        { id: 3, title: "Alabama", Country: 2 },
                        { id: 4, title: "EnglandCapital", ParentID: 2 },
                        { id: 5, title: "AlabamaCapital", ParentID: 3 }
                    ],
                    "CountriesIDVALUE": [{ title: 'UK', id: 1 }, { title: 'US', id: 2 }],
                    "layerA": [{ id: 'A1_1', title: 'A1_1' }, { id: 'A1_2', title: 'A1_2' }],
                    "layerAB": [{ id: 'A1_1_AB1_1', title: 'A1_1_AB1_1', layerA: 'A1_1' }],
                    "business_id": [
                        {
                            "meta_table_id": 8,
                            "schema_name": "uac",
                            "table_name": "businesses",
                            "id": 1,
                            "title": "Water",
                            "key_name": "wat"
                        },
                        {
                            "meta_table_id": 8,
                            "schema_name": "uac",
                            "table_name": "businesses",
                            "id": 2,
                            "title": "Electricity",
                            "key_name": "elt"
                        },
                        {
                            "meta_table_id": 8,
                            "schema_name": "uac",
                            "table_name": "businesses",
                            "id": 3,
                            "title": "Gas",
                            "key_name": "gas"
                        },
                        {
                            "meta_table_id": 8,
                            "schema_name": "uac",
                            "table_name": "businesses",
                            "id": 4,
                            "title": "Telecom",
                            "key_name": "tci"
                        }
                    ],
                    system_id: [
                        {
                            "meta_table_id": 17,
                            "schema_name": "uac",
                            "table_name": "systems",
                            "id": 1,
                            "title": "Provisioning",
                            "key_name": "prov",
                            "business_id": 4
                        },
                        {
                            "meta_table_id": 17,
                            "schema_name": "uac",
                            "table_name": "systems",
                            "id": 2,
                            "title": "Billing",
                            "key_name": "billing",
                            "business_id": 4
                        },
                        {
                            "meta_table_id": 17,
                            "schema_name": "uac",
                            "table_name": "systems",
                            "id": 3,
                            "title": "CRM",
                            "key_name": "crm",
                            "business_id": 4
                        },
                        {
                            "meta_table_id": 17,
                            "schema_name": "uac",
                            "table_name": "systems",
                            "id": 4,
                            "title": "Mediation",
                            "key_name": "med",
                            "business_id": 4
                        },
                        {
                            "meta_table_id": 17,
                            "schema_name": "uac",
                            "table_name": "systems",
                            "id": 5,
                            "title": "User Management",
                            "key_name": "uac",
                            "business_id": 4
                        },
                        {
                            "meta_table_id": 17,
                            "schema_name": "uac",
                            "table_name": "systems",
                            "id": 41,
                            "title": "WaterSystem",
                            "key_name": "WaterSystemKeyName",
                            "business_id": 1
                        },
                        {
                            "meta_table_id": 17,
                            "schema_name": "uac",
                            "table_name": "systems",
                            "id": 42,
                            "title": "ElecSystem",
                            "key_name": "ElecSystemKeyName",
                            "business_id": 2
                        },
                        {
                            "meta_table_id": 17,
                            "schema_name": "uac",
                            "table_name": "systems",
                            "id": 43,
                            "title": "GasSystem",
                            "key_name": "GasSystemKeyName",
                            "business_id": 3
                        },
                        {
                            "meta_table_id": 17,
                            "schema_name": "uac",
                            "table_name": "systems",
                            "id": 44,
                            "title": "TelecomSystem",
                            "key_name": "TelecomSystemKeyName",
                            "business_id": 4
                        }
                    ]
                }

                resolve(enums)
            }, 1000)
        })
    }
}

const ServiceManager = new ServiceManagerClass()

export default ServiceManager;