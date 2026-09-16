import React from 'react';
import { getAtFormLeafChildren, isAtFormLayout } from '../../AtForm/FormUtils/FormUtils';
import type { AtFormFieldDefInterface } from '../../../types/AtForm.type';
import { GetColumnDefsByAtFormChildrenInterface } from '../../../types/at-ag-grid/AtAgGridUtils.type';
import { AtAgGridExtendedColDef } from '../../../types/at-ag-grid/AtAgGrid.type';

export const createAgGridColumnDefs = ({ field, headerName = undefined, sortable = true, filter = true, ...restProps }: AtAgGridExtendedColDef): AtAgGridExtendedColDef => {
    return {
        field,
        headerName,
        sortable,
        filter,
        ...restProps,
    };
};

const getFieldDefinition = (item: unknown): AtFormFieldDefInterface | undefined => {
    if (!item || isAtFormLayout(item))
        return undefined;

    if (React.isValidElement(item)) {
        const props = item.props as Partial<AtFormFieldDefInterface> | undefined;
        return props?.tProps?.type ? props as AtFormFieldDefInterface : undefined;
    }

    if (typeof item !== 'object')
        return undefined;

    const candidate = item as Partial<AtFormFieldDefInterface>;
    return candidate.tProps?.type ? candidate as AtFormFieldDefInterface : undefined;
};

export const getColumnDefsByAtFormChildren = ({ formChildren, enums, getTypeInfo }: GetColumnDefsByAtFormChildrenInterface) => {
    const result: AtAgGridExtendedColDef[] = [];

    if (!formChildren)
        return result;

    getAtFormLeafChildren(formChildren).forEach(item => {
        const fieldDefinition = getFieldDefinition(item);
        if (!fieldDefinition)
            return;

        const { tProps } = fieldDefinition;
        const typeInfo = getTypeInfo(tProps.type);

        if (!typeInfo?.isControlledUi)
            return;

        result.push(
            createAgGridColumnDefs({
                ...(typeInfo.getAgGridColumnDef ? typeInfo.getAgGridColumnDef({ enums }) : {}),
                field: tProps.id,
                headerName: (tProps.label || tProps.label === '') ? tProps.label : null,
                ...(tProps.colDef || {}),
            }),
        );
    });

    return result;
};
