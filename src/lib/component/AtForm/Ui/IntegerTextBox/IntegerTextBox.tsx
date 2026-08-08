import React from 'react';

import TextBox from '../TextBox/TextBox';
import { convertNoneEnglishNumbers } from '../../FormUtils/FormUtils';
import { AtFormIntegerTextBoxProps } from '../../../../types/ui/IntegerTextBox.type';

const IntegerTextBox = ({
    value,
    onChange,
    onBlur,
    onKeyDown,
    min,
    max,
    slotProps,
    ...restProps
}: AtFormIntegerTextBoxProps) => {
    const getIntegerValue = (value: string): number | null => {
        const newValue = convertNoneEnglishNumbers(value);

        if (!newValue)
            return null;

        const integerValue = parseInt(newValue, 10);

        if (isNaN(integerValue))
            return null;

        return integerValue;
    };

    const onInternalChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const integerValue = getIntegerValue(event.target.value);

        if (onChange)
            onChange({ target: { value: integerValue } });
    };

    const onInternalBlur = (event: React.FocusEvent<HTMLInputElement>) => {
        let integerValue = getIntegerValue(event.target.value);

        if (integerValue !== null) {
            if (min !== undefined && integerValue < min)
                integerValue = min;

            if (max !== undefined && integerValue > max)
                integerValue = max;

            if (integerValue !== value && onChange)
                onChange({ target: { value: integerValue } });
        }

        onBlur?.(event);
    };

    const newValue = value === null || value === undefined ? '' : value;

    return (
        <TextBox
            fullWidth
            type="number"
            value={newValue}
            onChange={onInternalChange}
            onBlur={onInternalBlur}
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