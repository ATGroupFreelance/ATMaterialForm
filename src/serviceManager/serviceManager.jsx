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
                    },
                    {
                        id: `${layerA}_AB1_2`,
                        title: `${layerA}_AB1_2`,
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
                    },
                    {
                        id: `${layerA}_${layerAB}_ABC2_2`,
                        title: `${layerA}_${layerAB}_ABC2_2`,
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

    getEnums = () => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const enums = {
                    "Countries": [{ title: 'UK', id: 1 }, { title: 'US', id: 2 }],
                    "StateAndCapitals": [{ id: 0, title: "England2", Country: 1 }, { id: 1, title: "England", Country: 1 }, { id: 2, title: "Alabama", Country: 2 }, { id: 3, title: "EnglandCapital", ParentID: 1 }, { id: 4, title: "AlabamaCapital", ParentID: 2 }],
                    "CountriesIDVALUE": [{ title: 'UK', id: 1 }, { title: 'US', id: 2 }],
                    "layerA": [{ id: 'A1_1', title: 'A1_1' }, { id: 'A1_2', title: 'A1_2' }],
                }

                resolve(enums)
            }, 1000)
        })
    }
}

const instance = new ServiceManager()

export default instance;