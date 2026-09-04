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
                        metadata: { layerA },
                    },
                    {
                        id: `${layerA}_AB1_2`,
                        title: `${layerA}_AB1_2`,
                        metadata: { layerA },
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
                        metadata: { layerA, layerAB },
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
                        metadata: { layerA, layerAB },
                    },
                    {
                        id: `${layerA}_${layerAB}_ABC2_2`,
                        title: `${layerA}_${layerAB}_ABC2_2`,
                        metadata: { layerA, layerAB },
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
                    "StrictFormatState": [{ title: 'England2', id: 1, parentId: 1 }, { title: 'England', id: 2, parentId: 1 }, { title: 'Alabama', id: 3, parentId: 2 }],
                    "StrictFormatCapital": [{ title: 'EnglandCapital', id: 4, parentId: 2 }, { title: 'AlabamaCapital', id: 5, parentId: 3 }],
                    "Countries": [{ title: 'UK', id: 1 }, { title: 'US', id: 2 }],
                    "StateAndCapitals": [
                        { id: 1, title: "England2", metadata: { Country: 1 } },
                        { id: 2, title: "England", metadata: { Country: 1 } },
                        { id: 3, title: "Alabama", metadata: { Country: 2 } },
                        { id: 4, title: "EnglandCapital", metadata: { ParentId: 2 } },
                        { id: 5, title: "AlabamaCapital", metadata: { ParentId: 3 } }
                    ],
                    "CountriesIDVALUE": [{ title: 'UK', id: 1 }, { title: 'US', id: 2 }],
                    "layerA": [{ id: 'A1_1', title: 'A1_1' }, { id: 'A1_2', title: 'A1_2' }],
                    "layerAB": [{ id: 'A1_1_AB1_1', title: 'A1_1_AB1_1', metadata: { layerA: 'A1_1' } }],
                    "business_id": [
                        {
                            "id": 1,
                            "title": "Water",
                            "metadata": {
                                "meta_table_id": 8,
                                "schema_name": "uac",
                                "table_name": "businesses",
                                "key_name": "wat"
                            }
                        },
                        {
                            "id": 2,
                            "title": "Electricity",
                            "metadata": {
                                "meta_table_id": 8,
                                "schema_name": "uac",
                                "table_name": "businesses",
                                "key_name": "elt"
                            }
                        },
                        {
                            "id": 3,
                            "title": "Gas",
                            "metadata": {
                                "meta_table_id": 8,
                                "schema_name": "uac",
                                "table_name": "businesses",
                                "key_name": "gas"
                            }
                        },
                        {
                            "id": 4,
                            "title": "Telecom",
                            "metadata": {
                                "meta_table_id": 8,
                                "schema_name": "uac",
                                "table_name": "businesses",
                                "key_name": "tci"
                            }
                        }
                    ],
                    system_id: [
                        {
                            "id": 1,
                            "title": "Provisioning",
                            "metadata": {
                                "meta_table_id": 17,
                                "schema_name": "uac",
                                "table_name": "systems",
                                "key_name": "prov",
                                "business_id": 4
                            }
                        },
                        {
                            "id": 2,
                            "title": "Billing",
                            "metadata": {
                                "meta_table_id": 17,
                                "schema_name": "uac",
                                "table_name": "systems",
                                "key_name": "billing",
                                "business_id": 4
                            }
                        },
                        {
                            "id": 3,
                            "title": "CRM",
                            "metadata": {
                                "meta_table_id": 17,
                                "schema_name": "uac",
                                "table_name": "systems",
                                "key_name": "crm",
                                "business_id": 4
                            }
                        },
                        {
                            "id": 4,
                            "title": "Mediation",
                            "metadata": {
                                "meta_table_id": 17,
                                "schema_name": "uac",
                                "table_name": "systems",
                                "key_name": "med",
                                "business_id": 4
                            }
                        },
                        {
                            "id": 5,
                            "title": "User Management",
                            "metadata": {
                                "meta_table_id": 17,
                                "schema_name": "uac",
                                "table_name": "systems",
                                "key_name": "uac",
                                "business_id": 4
                            }
                        },
                        {
                            "id": 41,
                            "title": "WaterSystem",
                            "metadata": {
                                "meta_table_id": 17,
                                "schema_name": "uac",
                                "table_name": "systems",
                                "key_name": "WaterSystemKeyName",
                                "business_id": 1
                            }
                        },
                        {
                            "id": 42,
                            "title": "ElecSystem",
                            "metadata": {
                                "meta_table_id": 17,
                                "schema_name": "uac",
                                "table_name": "systems",
                                "key_name": "ElecSystemKeyName",
                                "business_id": 2
                            }
                        },
                        {
                            "id": 43,
                            "title": "GasSystem",
                            "metadata": {
                                "meta_table_id": 17,
                                "schema_name": "uac",
                                "table_name": "systems",
                                "key_name": "GasSystemKeyName",
                                "business_id": 3
                            }
                        },
                        {
                            "id": 44,
                            "title": "TelecomSystem",
                            "metadata": {
                                "meta_table_id": 17,
                                "schema_name": "uac",
                                "table_name": "systems",
                                "key_name": "TelecomSystemKeyName",
                                "business_id": 4
                            }
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