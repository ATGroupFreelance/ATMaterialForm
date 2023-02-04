import React, { useEffect, useState, useContext } from 'react';

import PasswordTextBox from '../PasswordTextBox/PasswordTextBox';
//Context
import ATFormContext from '../../ATFormContext/ATFormContext';

const DoublePasswordTextBox = ({ _formProps_, id, showPassword = false, onChange, value, error, helperText, label, ...restProps }) => {
    const { localText } = useContext(ATFormContext)

    const [valueA, setValueA] = useState('')
    const [valueB, setValueB] = useState('')

    useEffect(() => {
        if (value === null) {
            setValueA('')
            setValueB('')
        }
    }, [value])

    const onInternalChange = (newValueA, newValueB) => {
        if (newValueA === newValueB)
            onChange({ target: { value: newValueA } })
        else
            onChange({ target: { value: '' } })
    }

    const internalOnChangeA = (event) => {
        setValueA(event.target.value)

        onInternalChange(event.target.value, valueB)
    }

    const internalOnChangeB = (event) => {
        setValueB(event.target.value)

        onInternalChange(valueA, event.target.value)
    }

    const [lShowPassword, setLShowPassword] = useState(showPassword)

    const onToggleShowPasswordClick = () => {
        setLShowPassword(!lShowPassword)
    }

    const commonProps = {
        onToggleShowPasswordClick: onToggleShowPasswordClick,
        showPassword: lShowPassword,
        error: ((valueA !== valueB) && valueA !== '') || error,
        helperText: ((valueA !== valueB) && valueA !== '') ? localText['Passwords do not match'] : helperText
    }

    return <div style={{ width: '100%', margin: 0, padding: 0 }}>
        <div style={{ width: '49.5%', display: 'inline-block', margin: 0, padding: 0 }}>
            <PasswordTextBox {...commonProps} onChange={internalOnChangeA} value={valueA} label={label} {...restProps} />
        </div>
        <div style={{ width: '1%', display: 'inline-block' }}>

        </div>
        <div style={{ width: '49.5%', display: 'inline-block', margin: 0, padding: 0 }}>
            <PasswordTextBox {...commonProps} onChange={internalOnChangeB} value={valueB} label={`${localText['Confirm']} ${label}`} {...restProps} />
        </div>
    </div>
}

export default DoublePasswordTextBox;