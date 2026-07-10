import { useEffect, useState } from 'react';

import PasswordTextBox from '../PasswordTextBox/PasswordTextBox';
//Context
import useAtFormConfig from '../../../../hooks/useAtFormConfig/useAtFormConfig';
import { AtFormDoublePasswordTextBoxProps } from '../../../../types/ui/DoublePasswordTextBox.type';
import { AtFormPasswordTextBoxProps } from '../../../../types/ui/PasswordTextBox.type';

const DoublePasswordTextBox = ({ value, onChange, showPassword, helperText, error, label, ...restProps }: AtFormDoublePasswordTextBoxProps) => {
    const { localText } = useAtFormConfig()

    const [valueA, setValueA] = useState('')
    const [valueB, setValueB] = useState('')
    const [lShowPassword, setLShowPassword] = useState<boolean>(Boolean(showPassword))

    useEffect(() => {
        if (value === null) {
            setValueA('')
            setValueB('')
        }
    }, [value])

    const onInternalChange = (newValueA: string, newValueB: string) => {
        if (onChange) {
            if (newValueA === newValueB)
                onChange({ target: { value: newValueA } })
            else
                onChange({ target: { value: '' } })
        }
    }

    const internalOnChangeA = (event: any) => {
        setValueA(event.target.value)

        onInternalChange(event.target.value, valueB)
    }

    const internalOnChangeB = (event: any) => {
        setValueB(event.target.value)

        onInternalChange(valueA, event.target.value)
    }

    const onToggleShowPasswordClick = () => {
        setLShowPassword(!lShowPassword)
    }

    const commonProps: AtFormPasswordTextBoxProps = {
        onToggleShowPasswordClick: onToggleShowPasswordClick,
        showPassword: lShowPassword,
        error: ((valueA !== valueB) && valueA !== '') || error,
        helperText: ((valueA !== valueB) && valueA !== '') ? localText['Passwords do not match'] : helperText,
        slotProps: {
            htmlInput: {
                autoComplete: 'new-password',
            }
        }
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