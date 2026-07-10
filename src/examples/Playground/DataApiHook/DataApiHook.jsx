import { useCallback, useRef, useState } from 'react';

const callApi = (seed) => {
    console.log('#PLAYGROUND callAPI', seed)
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(seed + 1)
        }, 100)
    })
}

const DataApiHook = () => {    
    const [data, setData] = useState(null)
    const counter = useRef(0)
    console.log('#PLAYGROUND DataAPIHook', data)

    const updateApiHook = useCallback(() => {
        console.log('#PLAYGROUND DataAPIHook useCallback')
        counter.current = counter.current + 1
        return callApi(counter.current)
        .then(res => {
            setData(res)
        })
    }, [])

    return {
        updateApiHook,
        data,
    }
}

export default DataApiHook;