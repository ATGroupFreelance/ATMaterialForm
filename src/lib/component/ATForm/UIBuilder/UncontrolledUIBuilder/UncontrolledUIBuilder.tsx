import React, { Suspense } from 'react';
//Context
import useATFormConfig from '../../../../hooks/useATFormConfig/useATFormConfig';
import { ATUnControlledUIBuilderProps } from '@/lib/types/ATForm.type';
import { ATFormTableProps } from '@/lib/types/ui/Table.type';

const Button = React.lazy(() => import('../../UI/Button/Button'));
const Label = React.lazy(() => import('../../UI/Label/Label'));
const Table = React.lazy(() => import('../../UI/Table/Table'));

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
        {CustomComponent && <CustomComponent {...commonProps} />}
    </Suspense>
}

export default UncontrolledUIBuilder; 