import React from 'react';

import TextBox from '../TextBox/TextBox';
import { convertNoneEnglishNumbers } from '../../FormUtils/FormUtils';
import { ATFormIntegerTextBoxProps } from '../../../../types/ui/IntegerTextBox.type';

const IntegerTextBox = ({ value, onChange, onKeyDown, min, max, slotProps, ...restProps }: ATFormIntegerTextBoxProps) => {
    const onInternalChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = convertNoneEnglishNumbers(event.target.value)
        let integerValue: number | null = null

        if (newValue)
            integerValue = parseInt(newValue)

        if (integerValue !== null && isNaN(integerValue))
            integerValue = null

        if (integerValue !== null) {
            if (min !== undefined && integerValue < min)
                integerValue = min

            if (max !== undefined && integerValue > max)
                integerValue = max
        }

        if (onChange)
            onChange({ target: { value: integerValue } })
    }

    const newValue = value === null || value === undefined ? '' : value

    return (
        <TextBox
            fullWidth
            type="number"
            value={newValue}
            onChange={onInternalChange}
            slotProps={{
                ...(slotProps || {}),
                htmlInput: {
                    ...(slotProps?.htmlInput || {}),
                    min,
                    max,
                },
            }}
            onKeyDown={(e) => {
                if (e.key === 'e' || e.key === 'E' || e.key === '+') {
                    e.preventDefault();
                }

                onKeyDown?.(e);
            }}
            {...restProps}
        />
    );
};

export default IntegerTextBox;
