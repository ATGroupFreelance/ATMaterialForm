import { useCallback, useRef, useState } from 'react';

const callAPI = (seed) => {
    console.log('#PLAYGROUND callAPI', seed)
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(seed + 1)
        }, 100)
    })
}

const DataAPIHook = () => {    
    const [data, setData] = useState(null)
    const counter = useRef(0)
    console.log('#PLAYGROUND DataAPIHook', data)

    const updateAPIHook = useCallback(() => {
        console.log('#PLAYGROUND DataAPIHook useCallback')
        counter.current = counter.current + 1
        return callAPI(counter.current)
        .then(res => {
            setData(res)
        })
    }, [])

    return {
        updateAPIHook,
        data,
    }
}

export default DataAPIHook;