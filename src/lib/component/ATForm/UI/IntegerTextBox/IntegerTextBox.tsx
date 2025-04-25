import React from 'react';

import TextBox from '../TextBox/TextBox';
import { convertNoneEnglishNumbers } from '../../FormUtils/FormUtils';
import { ATFormIntegerTextBoxProps } from '../../../../types/ui/IntegerTextBox.type';

const IntegerTextBox = ({ value, onChange, ...restProps }: ATFormIntegerTextBoxProps) => {

    const onInternalChange = (event: React.ChangeEvent<HTMLInputElement>) => {        
        const newValue = convertNoneEnglishNumbers(event.target.value)
        let integerValue = null

        if (newValue)
            integerValue = parseInt(newValue)

        if (integerValue !== null && isNaN(integerValue))
            integerValue = null

        if (onChange)
            onChange({ target: { value: integerValue } })
    }

    const newValue = !value && value !== 0 ? "" : value

    return <TextBox
        fullWidth={true}
        type="number"
        onChange={onInternalChange}
        value={newValue}
        onKeyDown={(e) => {
            if (e.key === "e" || e.key === "E" || e.key === "+") {
                e.preventDefault()
            }
        }}
        {...restProps}
    />
}

export default IntegerTextBox;