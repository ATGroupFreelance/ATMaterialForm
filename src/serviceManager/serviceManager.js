//import ServiceManager from 'serviceManager/serviceManager';

class ServiceManager {
    uploadFilesToServer = (requestBody) => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve([
                    {
                        id: '10004912230',
                        name: 'Test.pdf',
                        size: 17856,
                    }
                ])
            }, 1000)
        })
    }

    getFile = (id) => {
        return {

        }
    }
}

const instance = new ServiceManager()

export default instance;