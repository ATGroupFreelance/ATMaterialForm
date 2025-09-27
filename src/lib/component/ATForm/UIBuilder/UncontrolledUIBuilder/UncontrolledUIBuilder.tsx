import React, { Suspense } from 'react';
//Context
import useATFormConfig from '../../../../hooks/useATFormConfig/useATFormConfig';
import { ATUnControlledUIBuilderProps } from '@/lib/types/ATForm.type';
import { ATFormTableProps } from '@/lib/types/ui/Table.type';
import { ATFormCustomUncontrolledFieldProps } from '@/lib/types/ui/CustomUncontrolledField.type';

const Button = React.lazy(() => import('../../UI/Button/Button'));
const Label = React.lazy(() => import('../../UI/Label/Label'));
const Table = React.lazy(() => import('../../UI/Table/Table'));
const CustomUncontrolledField = React.lazy(() => import('../../UI/CustomUncontrolledField/CustomUncontrolledField'));

const UncontrolledUIBuilder = ({ childProps }: ATUnControlledUIBuilderProps) => {
    const { customComponents } = useATFormConfig()    

    const commonProps = {
        id: childProps.tProps.id,
        ...childProps.uiProps,
        label: childProps.uiProps?.label !== undefined ? childProps.uiProps.label : childProps.tProps.label
    }

    let CustomComponent = null
    if (customComponents) {
        const found = customComponents.find((item: any) => item.typeInfo.type === childProps.tProps.type)
        CustomComponent = found ? found.component : null
    }

    const type = childProps.tProps.type

    return <Suspense fallback={<div>Loading...</div>}>
        {type === 'Button' && <Button {...commonProps} />}
        {type === 'Label' && <Label {...commonProps} />}
        {type === 'Table' && <Table {...commonProps as ATFormTableProps} />}
        {type === 'CustomUncontrolledField' && <CustomUncontrolledField {...commonProps as unknown as ATFormCustomUncontrolledFieldProps} />}
        {CustomComponent && <CustomComponent {...commonProps} />}
    </Suspense>
}

export default UncontrolledUIBuilder; 