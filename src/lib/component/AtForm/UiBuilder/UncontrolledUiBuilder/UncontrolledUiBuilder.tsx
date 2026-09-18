import React, { Suspense } from 'react';
//Context
import useAtFormConfig from '../../../../hooks/useAtFormConfig/useAtFormConfig';
import { AtUnControlledUiBuilderProps } from '../../../../types/AtForm.type';
import { AtFormTableProps } from '../../../../types/ui/Table.type';
import { AtFormCustomUncontrolledFieldProps } from '../../../../types/ui/CustomUncontrolledField.type';
import { resolveAtFormFieldLabel } from '../../FormUtils/resolveAtFormFieldLabel';

const Button = React.lazy(() => import('../../Ui/Button/Button'));
const Label = React.lazy(() => import('../../Ui/Label/Label'));
const Table = React.lazy(() => import('../../Ui/Table/Table'));
const CustomUncontrolledField = React.lazy(() => import('../../Ui/CustomUncontrolledField/CustomUncontrolledField'));

const UncontrolledUiBuilder = ({ childProps }: AtUnControlledUiBuilderProps) => {
    const { customComponents, t } = useAtFormConfig()

    const commonProps = {
        id: childProps.tProps.id,
        ...childProps.uiProps,
        label: resolveAtFormFieldLabel({
            id: childProps.tProps.id,
            label: childProps.uiProps?.label !== undefined ? childProps.uiProps.label : childProps.tProps.label,
            disableLabelLocalization: childProps.tProps.disableLabelLocalization,
            t,
        })
    }

    let CustomComponent = null
    if (customComponents) {
        const found = customComponents.find((item: any) => item.typeInfo.type === childProps.tProps.type)
        CustomComponent = found ? found.component : null
    }

    const type = childProps.tProps.type

    return <Suspense fallback={<div>{t('Loading...', 'Loading...')}</div>}>
        {type === 'Button' && <Button {...commonProps} />}
        {type === 'Label' && <Label {...commonProps} />}
        {type === 'Table' && <Table {...commonProps as AtFormTableProps} />}
        {type === 'CustomUncontrolledField' && <CustomUncontrolledField {...commonProps as unknown as AtFormCustomUncontrolledFieldProps} />}
        {CustomComponent && <CustomComponent {...commonProps} />}
    </Suspense>
}

export default UncontrolledUiBuilder; 