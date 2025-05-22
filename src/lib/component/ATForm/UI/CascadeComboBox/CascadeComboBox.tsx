import React from 'react';

import BaseComboBox from './BaseComboBox/BaseComboBox';
import { ATFormCascadeComboBoxProps, ATFormCascadeComboBoxBaseComboBoxProps, ATFormCascadeComboBoxDesignLayer, ATFormCascadeComboBoxAsyncOptions } from '@/lib/types/ui/CascadeComboBox.type';
import ComboBox from '../ComboBox/ComboBox';
import { isAsyncOptions } from '../../FormUtils/FormUtils';
/**
    Cascade Overview:

    Result of Cascade on Change:
    When the cascade changes, it produces an object containing all child values. However, the form's convertToKeyValue logic returns only a single leaf value.

    How Does Cascade Work?
    The Cascade component operates on a tree structure provided through the design prop. This tree defines the cascade's behavior and supports the following main properties:

    id: The name/key where each combo box's value is stored.

    enumsKey: Specifies which enum is used to map a single leaf value back into the full object containing all combo box values.

    enumsParentKey: Indicates the key in the current enum that identifies the parent ID of the current value.
    For example, if the current layer has id and title, it will also have another property named by enumsParentKey, which helps locate the parent ID.

    data: A function that returns a promise, providing the data for the current combo box.
    You can filter this data based on enumsParentKey and the current enum?.enumsKey.
    If no data is provided, it will be auto-generated using enumsKey and enumsParentKey.

    Default Behavior:

    If enumsKey and enumsParentKey are not provided, the createCascadeDesign function will:
    Use id to deduce the enumsKey.
    Determine the enumsParentKey based on the parent-child relationship.
    Automatically generate the data.
    
    Example and Playground:
    You can provide a custom cascade tree through the design prop to define its structure. For more examples and possible combinations, refer to the CascadeComboBoxPlayground.
 */
const CascadeComboBox = ({ label, design, onChange, value, error, helperText, readOnly }: ATFormCascadeComboBoxProps) => {
    const onInternalChange = (id: string, event: React.ChangeEvent<HTMLInputElement>, children: ATFormCascadeComboBoxDesignLayer[] | undefined) => {
        const newValue = {
            ...(value || {}),
            [id]: event.target.value,
        }

        const resetChildrenValue = (childList: ATFormCascadeComboBoxDesignLayer[]) => {
            for (let i = 0; i < childList.length; i++) {
                if (Object.prototype.hasOwnProperty.call(newValue, childList[i].id)) {
                    newValue[childList[i].id] = null

                    if (childList[i].children) {
                        resetChildrenValue(childList[i].children!)
                    }
                }
            }
        }

        if (children)
            resetChildrenValue(children)

        if (onChange)
            onChange({ target: { value: newValue } })
    }

    const getRenderableComboBoxFlatList = (designLayer?: ATFormCascadeComboBoxDesignLayer[], parentID: string | null = null): ATFormCascadeComboBoxBaseComboBoxProps[] => {
        const result: ATFormCascadeComboBoxBaseComboBoxProps[] = [];
        /**enumsKey and enumsParentKey are used for reverse convert from a single leaf to a whole object of values */
        designLayer?.forEach(({ id, children, options, multiple, readOnly, enumsKey, enumsParentKey, uiProps }) => {
            // Default async fallback
            const defaultAsyncOptions: ATFormCascadeComboBoxAsyncOptions = async (props) => {
                const currentEnum = enumsKey ? props?.enums?.[enumsKey] : null;
                if (!currentEnum)
                    return [];

                return currentEnum.filter((item: any) => {
                    /**If you can find a key named parent_id and parentID is not null*/
                    if (enumsParentKey === "parent_id" && parentID) {
                        return item?.[enumsParentKey] === props?.values?.[parentID];
                    }
                    else {
                        /**Handle situations where the parent is not defined using parent_id but the enumsParentKey */
                        return enumsParentKey && !item.parent_id && item?.[enumsParentKey] === props?.values?.[enumsParentKey];
                    }
                });
            };

            const resolvedOptions = options ?? defaultAsyncOptions;

            const sharedProps = {
                id,
                value,
                parentID,
                multiple,
                readOnly,
                uiProps: {
                    onChange: (event: any) => onInternalChange(id, event, children),
                    ...(uiProps || {}),
                },
            };

            if (isAsyncOptions(resolvedOptions)) {
                result.push({
                    ...sharedProps,
                    //ATFormCascadeComboBoxAsyncOptions
                    options: resolvedOptions,
                });
            }
            else {
                result.push({
                    ...sharedProps,
                    //ATEnumType
                    options: resolvedOptions,
                });
            }

            if (children) {
                const childrenResult = getRenderableComboBoxFlatList(children, id);
                result.push(...childrenResult);
            }
        });

        return result;
    };
    const elementList = getRenderableComboBoxFlatList(design, null)

    return <React.Fragment>
        {
            elementList.map(item => {
                return <BaseComboBox
                    key={item.id}
                    {...item}
                    readOnly={item.readOnly === undefined ? readOnly : item.readOnly}
                    uiProps={{
                        ...(item.uiProps || {}),
                        error,
                        helperText,
                    }}
                />
            })
        }
        {
            !design && <ComboBox label={'Please provide a design!'} options={[]} />
        }
    </React.Fragment>
}

export default CascadeComboBox;