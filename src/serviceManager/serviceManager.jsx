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


    waitForCascadeDemo = (ms, signal) => {
        return new Promise((resolve, reject) => {
            const timer = setTimeout(resolve, ms)
            const onAbort = () => {
                clearTimeout(timer)
                const error = new Error('Request aborted')
                error.name = 'AbortError'
                reject(error)
            }

            if (signal?.aborted)
                onAbort()
            else
                signal?.addEventListener('abort', onAbort, { once: true })
        })
    }

    cascadeFailureAttempt = 0

    getCascadeFailureProvider = async ({ signal }) => {
        await this.waitForCascadeDemo(100, signal)
        this.cascadeFailureAttempt += 1

        if (this.cascadeFailureAttempt === 1)
            throw new Error('Simulated provider failure. Retry to recover.')

        return { items: [{ id: 'recovered', title: 'Recovered option' }] }
    }

    getCascadeCountriesProvider = async ({ signal }) => {
        await this.waitForCascadeDemo(180, signal)
        return {
            items: [
                { title: 'UK', id: 1 },
                { title: 'US', id: 2 },
            ]
        }
    }

    getCascadeStatesProvider = async ({ parentId, signal }) => {
        // UK intentionally ignores cancellation so the playground regression test
        // proves stale-response rejection in addition to AbortController support.
        if (parentId === 1)
            await new Promise(resolve => setTimeout(resolve, 700))
        else
            await this.waitForCascadeDemo(90, signal)
        const states = [
            { title: 'England', id: 11, parentId: 1 },
            { title: 'Scotland', id: 12, parentId: 1 },
            { title: 'Alabama', id: 21, parentId: 2 },
            { title: 'California', id: 22, parentId: 2 },
        ]
        return { items: states.filter(item => String(item.parentId) === String(parentId)) }
    }

    resolveCascadeStatePath = async ({ value, signal }) => {
        await this.waitForCascadeDemo(80, signal)
        const states = [
            { title: 'England', id: 11, parentId: 1 },
            { title: 'Scotland', id: 12, parentId: 1 },
            { title: 'Alabama', id: 21, parentId: 2 },
            { title: 'California', id: 22, parentId: 2 },
        ]
        const state = states.find(item => String(item.id) === String(value))
        if (!state)
            return null

        return {
            providerCountry: { id: state.parentId, title: state.parentId === 1 ? 'UK' : 'US' },
            providerState: state,
        }
    }

    getCascadeFacilitiesProvider = async ({ parentId, signal }) => {
        await this.waitForCascadeDemo(120, signal)
        const region = String(parentId)
        return {
            items: [1, 2, 3].map(index => ({
                id: `${region}-site-${index}`,
                title: `${region === 'north' ? 'North' : 'South'} site ${index}`,
            }))
        }
    }

    getCascadeDevicesProvider = async ({ parentId, query, cursor, pageSize, signal }) => {
        await this.waitForCascadeDemo(140, signal)
        const logicalTotal = 1_000_000
        const normalizedQuery = query.trim().toLowerCase()
        const start = Number(cursor || 0)
        const size = Math.max(1, Math.min(pageSize || 50, 100))

        let indexes
        if (normalizedQuery) {
            const digits = normalizedQuery.replace(/[^0-9]/g, '')
            const base = digits ? Math.min(Number(digits), logicalTotal - 1) : start
            indexes = Array.from({ length: size }, (_, offset) => (base + start + offset) % logicalTotal)
        }
        else {
            indexes = Array.from({ length: size }, (_, offset) => start + offset).filter(index => index < logicalTotal)
        }

        const nextOffset = start + indexes.length
        return {
            items: indexes.map(index => ({
                id: `${parentId}:device:${index}`,
                title: `Device ${index.toLocaleString('en-US')}`,
            })),
            nextCursor: nextOffset < logicalTotal ? String(nextOffset) : null,
            hasMore: nextOffset < logicalTotal,
        }
    }

    searchCascadeDeviceLeaves = async ({ query, limit, signal }) => {
        await this.waitForCascadeDemo(120, signal)
        const normalized = String(query || '').trim().toLowerCase()
        if (!normalized)
            return []

        const regions = normalized.includes('north')
            ? ['north']
            : normalized.includes('south')
                ? ['south']
                : ['north', 'south']
        const siteMatch = normalized.match(/site\s*([1-3])/)
        const sites = siteMatch ? [Number(siteMatch[1])] : [1, 2, 3]
        const numericTokens = normalized.match(/\d[\d,]*/g) || []
        const leafNumber = numericTokens.length ? numericTokens[numericTokens.length - 1].replace(/,/g, '') : ''
        const requestedIndex = leafNumber ? Math.min(Number(leafNumber), 999_999) : 0
        const results = []

        for (const region of regions) {
            for (const site of sites) {
                if (results.length >= limit)
                    return results
                const facilityId = `${region}-site-${site}`
                const facilityTitle = `${region === 'north' ? 'North' : 'South'} site ${site}`
                const deviceTitle = `Device ${requestedIndex.toLocaleString('en-US')}`
                results.push({
                    terminalLayerId: 'device',
                    label: `${deviceTitle} — ${facilityTitle}`,
                    path: {
                        region: { id: region, title: region === 'north' ? 'North region' : 'South region' },
                        facility: { id: facilityId, title: facilityTitle },
                        device: { id: `${facilityId}:device:${requestedIndex}`, title: deviceTitle },
                    },
                })
            }
        }

        return results
    }

    resolveCascadeDevicePath = async ({ value, signal }) => {
        await this.waitForCascadeDemo(90, signal)
        const raw = String(value)
        const marker = ':device:'
        const markerIndex = raw.lastIndexOf(marker)
        if (markerIndex < 0)
            return null

        const facilityId = raw.slice(0, markerIndex)
        const deviceIndex = Number(raw.slice(markerIndex + marker.length))
        const regionId = facilityId.startsWith('north-') ? 'north' : facilityId.startsWith('south-') ? 'south' : null
        if (!regionId || Number.isNaN(deviceIndex))
            return null

        const facilityParts = facilityId.split('-')
        const siteNumber = facilityParts[facilityParts.length - 1]
        return {
            region: { id: regionId, title: regionId === 'north' ? 'North region' : 'South region' },
            facility: { id: facilityId, title: `${regionId === 'north' ? 'North' : 'South'} site ${siteNumber}` },
            device: { id: raw, title: `Device ${deviceIndex.toLocaleString('en-US')}` },
        }
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
                    "GeoHierarchy": [
                        { id: 'uk', title: 'United Kingdom', metadata: { level: 'country' } },
                        { id: 'england', title: 'England', parentId: 'uk', metadata: { level: 'state' } },
                        { id: 'scotland', title: 'Scotland', parentId: 'uk', metadata: { level: 'state' } },
                        { id: 'london', title: 'London', parentId: 'england', metadata: { level: 'city' } },
                        { id: 'edinburgh', title: 'Edinburgh', parentId: 'scotland', metadata: { level: 'city' } },
                    ],
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