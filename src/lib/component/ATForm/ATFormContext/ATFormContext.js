import React from 'react';
//Local text
import LocalText from './LocalText';

const ATFormContext = React.createContext();

export const ATFormContextProvider = ({ children, value, ...restProps }) => {
    const { localText, ...restValue } = value || {}

    const newLocalText = {
        ...LocalText,
        ...(localText || {})
    }

    const getLocalText = (id, label) => {
        if (label !== undefined)
            return label


        if (id === null || id === undefined) {
            console.error(`getLocalText input id parameter was undefined for id: ${id} and label: ${label}`)
            return 'Error, Undefined ID!'
        }

        const found = newLocalText[id] || newLocalText[id.toUpperCase()] || newLocalText[id.toLowerCase()]

        if (found !== undefined)
            return found

        return id
    }

    return <ATFormContext.Provider value={{ localText: newLocalText, getLocalText, ...restValue }} {...restProps}>
        {children}
    </ATFormContext.Provider>
}

export default ATFormContext;