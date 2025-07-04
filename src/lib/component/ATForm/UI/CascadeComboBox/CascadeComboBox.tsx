import React from 'react';

import BaseComboBox from './BaseComboBox/BaseComboBox';
import { ATFormCascadeComboBoxProps, ATFormCascadeComboBoxBaseComboBoxProps, ATFormCascadeComboBoxDesignLayer, ATFormCascadeComboBoxAsyncOptions, ATFormCascadeComboBoxOptionsFilterFunction } from '@/lib/types/ui/CascadeComboBox.type';
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

    enumsKeyParentIDField: Indicates the key in the current enum that identifies the parent ID of the current value.
    For example, if the current layer has id and title, it will also have another property named by enumsKeyParentIDField, which helps locate the parent ID.

    data: A function that returns a promise, providing the data for the current combo box.
    You can filter this data based on enumsKeyParentIDField and the current enum?.enumsKey.
    If no data is provided, it will be auto-generated using enumsKey and enumsKeyParentIDField.

    Default Behavior:

    If enumsKey and enumsKeyParentIDField are not provided, the createCascadeDesign function will:
    Use id to deduce the enumsKey.
    Determine the enumsKeyParentIDField based on the parent-child relationship.
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

    const getRenderableComboBoxFlatList = (designLayers?: ATFormCascadeComboBoxDesignLayer[], designLayersParent: ATFormCascadeComboBoxDesignLayer | null | undefined = null): ATFormCascadeComboBoxBaseComboBoxProps[] => {
        const result: ATFormCascadeComboBoxBaseComboBoxProps[] = [];
        /**enumsKey and enumsKeyParentIDField are used for reverse convert from a single leaf to a whole object of values */
        designLayers?.forEach((currentLayer) => {
            const enumsKeyParentIDField = currentLayer.enumsKeyParentIDField || 'parent_id'

            // Default filter fallback
            const defaultFilterOptions: ATFormCascadeComboBoxOptionsFilterFunction = (params) => {
                if (designLayersParent?.id) {
                    return params.option?.[enumsKeyParentIDField] === params?.values?.[designLayersParent.id]
                }
                else {
                    /**If designLayersParent?.id is undefined it means we are at the very root so we just return the options without filter  */
                    return true
                }
            }

            // Default async fallback
            const defaultAsyncOptions: ATFormCascadeComboBoxAsyncOptions = async (props) => {
                /**If enums key is provided and it exists inside enums, use it as options! */
                const currentEnum = currentLayer.enumsKey ? props?.enums?.[currentLayer.enumsKey] : props?.enums?.[currentLayer.id];

                if (!currentEnum)
                    return [];

                if (currentLayer.filterOptions)
                    return currentEnum.filter((item, index) => currentLayer.filterOptions!({ index, option: item, ...props }))

                return currentEnum.filter((item: any, index) => {
                    return defaultFilterOptions({ option: item, index, ...props })
                });
            };

            const resolvedOptions = currentLayer.options ?? defaultAsyncOptions;

            const sharedProps = {
                id: currentLayer.id,
                value,
                parentID: designLayersParent?.id,
                multiple: currentLayer.multiple,
                readOnly,
                uiProps: {
                    label: label + '_' + currentLayer.id,
                    onChange: (event: any) => onInternalChange(currentLayer.id, event, currentLayer.children),
                    ...(currentLayer.uiProps || {}),
                },
                size: currentLayer.size,
            };

            if (isAsyncOptions(resolvedOptions)) {
                result.push({
                    ...sharedProps,
                    //ATFormCascadeComboBoxAsyncOptions
                    options: (props) => resolvedOptions(props)
                        .then(res => {
                            return res?.filter((item, index) => {
                                if (currentLayer.filterOptions)
                                    return currentLayer.filterOptions!({ index, option: item, ...props })

                                return defaultFilterOptions({ option: item, index, ...props })
                            })
                        })
                });
            }
            else {
                result.push({
                    ...sharedProps,
                    //Convert options to async for interface unity and easier access
                    options: (props) => new Promise((resolve) => {
                        resolve(resolvedOptions?.filter((item, index) => {
                            if (currentLayer.filterOptions)
                                return currentLayer.filterOptions!({ index, option: item, ...props })

                            return defaultFilterOptions({ option: item, index, ...props })
                        }))
                    }),
                });
            }

            if (currentLayer.children) {
                const childrenResult = getRenderableComboBoxFlatList(currentLayer.children, currentLayer);
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