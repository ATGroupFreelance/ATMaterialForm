import React, { useEffect, useRef, useState } from 'react';

import TextBox from '../TextBox/TextBox';
import { convertNoneEnglishNumbers } from '../../FormUtils/FormUtils';
import { AtFormFloatTextBoxProps } from '../../../../types/ui/FloatTextBox.type';

const FloatTextBox = ({
    value,
    onChange,
    onBlur,
    onFocus,
    onKeyDown,
    min,
    max,
    step = 'any',
    slotProps,
    ...restProps
}: AtFormFloatTextBoxProps) => {
    const isFocusedRef = useRef(false);

    const [internalValue, setInternalValue] = useState(
        value === null || value === undefined ? '' : String(value)
    );

    useEffect(() => {
        if (isFocusedRef.current)
            return;

        setInternalValue(
            value === null || value === undefined ? '' : String(value)
        );
    }, [value]);

    const getFloatValue = (inputValue: string): number | null => {
        const normalizedValue = convertNoneEnglishNumbers(inputValue);

        if (
            normalizedValue === '' ||
            normalizedValue === '-' ||
            normalizedValue === '.' ||
            normalizedValue === '-.'
        )
            return null;

        const floatValue = Number(normalizedValue);

        if (isNaN(floatValue))
            return null;

        return floatValue;
    };

    const onInternalChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const normalizedValue = convertNoneEnglishNumbers(event.target.value);
        const floatValue = getFloatValue(normalizedValue);

        setInternalValue(normalizedValue);

        if (onChange)
            onChange({ target: { value: floatValue } });
    };

    const onInternalFocus = (event: React.FocusEvent<HTMLInputElement>) => {
        isFocusedRef.current = true;

        onFocus?.(event);
    };

    const onInternalBlur = (event: React.FocusEvent<HTMLInputElement>) => {
        isFocusedRef.current = false;

        let floatValue = getFloatValue(internalValue);

        if (floatValue !== null) {
            if (min !== undefined && floatValue < min)
                floatValue = min;

            if (max !== undefined && floatValue > max)
                floatValue = max;

            setInternalValue(String(floatValue));

            if (floatValue !== value && onChange)
                onChange({ target: { value: floatValue } });
        }
        else {
            setInternalValue('');

            if (value !== null && value !== undefined && onChange)
                onChange({ target: { value: null } });
        }

        onBlur?.(event);
    };

    return (
        <TextBox
            fullWidth
            type="number"
            value={internalValue}
            onChange={onInternalChange}
            onFocus={onInternalFocus}
            onBlur={onInternalBlur}
            slotProps={{
                ...(slotProps || {}),
                htmlInput: {
                    ...(slotProps?.htmlInput || {}),
                    min,
                    max,
                    step,
                },
            }}
            onKeyDown={(event) => {
                if (
                    event.key === 'e' ||
                    event.key === 'E' ||
                    event.key === '+'
                ) {
                    event.preventDefault();
                }

                onKeyDown?.(event);
            }}
            {...restProps}
        />
    );
};

export default FloatTextBox;