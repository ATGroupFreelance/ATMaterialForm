//import ServiceManager from '@/serviceManager/serviceManager';

class ServiceManager {
    uploadFilesToServer = (requestBody) => {
        return new Promise((resolve, reject) => {
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
        }
    }

    getData_layerA = () => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve([
                    {
                        ID: 'A1_1',
                        Title: 'A1_1',
                    },
                    {
                        ID: 'A1_2',
                        Title: 'A1_2',
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
                        ID: `${layerA}_AB1_1`,
                        Title: `${layerA}_AB1_1`,
                    },
                    {
                        ID: `${layerA}_AB1_2`,
                        Title: `${layerA}_AB1_2`,
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
                        ID: `${layerA}_${layerAB}_ABC1`,
                        Title: `${layerA}_${layerAB}_ABC1`,
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
                        ID: `${layerA}_${layerAB}_ABC2_1`,
                        Title: `${layerA}_${layerAB}_ABC2_1`,
                    },
                    {
                        ID: `${layerA}_${layerAB}_ABC2_2`,
                        Title: `${layerA}_${layerAB}_ABC2_2`,
                    }
                ])
            })
        })
    }

    getCountries = () => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve([{ Title: 'UK', ID: 1 }, { Title: 'US', ID: 2 }])
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

    getEnums = () => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const enums = {
                    "Countries": [{ Title: 'UK', ID: 1 }, { Title: 'US', ID: 2 }],
                    "StateAndCapitals": [{ ID: 0, Title: "England2", Country: 1 }, { ID: 1, Title: "England", Country: 1 }, { ID: 2, Title: "Alabama", Country: 2 }, { ID: 3, Title: "EnglandCapital", ParentID: 1 }, { ID: 4, Title: "AlabamaCapital", ParentID: 2 }],
                    "CountriesIDVALUE": [{ Title: 'UK', ID: 1 }, { Title: 'US', ID: 2 }],
                    "layerA": [{ ID: 'A1_1', Title: 'A1_1' }, { ID: 'A1_2', Title: 'A1_2' }],
                }

                resolve(enums)
            }, 1000)
        })
    }
}

const instance = new ServiceManager()

export default instance;