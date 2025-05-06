import React from 'react';
import { ATForm, formBuilder } from '@/lib';
import ATToast from '@/lib/component/ATToast/ATToast';

const ToastPlayground = ({ ref, onChange }) => {
    const onSimpleNotificationClick = () => {
        ATToast.info('This is a simple notification')
    }

    const onPersistentNotificationClick = () => {
        ATToast.info('This is a persistent notification', { autoClose: false })
    }

    const onAreYouSureClick = (event, { startLoading, stopLoading }) => {
        ATToast.AreYouSure('Thank you for confirming that you are sure!')
    }

    const onCustomNotificationClick = () => {
        ATToast.info((...props) => {
            console.log('onCustomNotificationClick ATToast Custom Component Props', props)

            return <div>This is a custom component</div>
        }, { data: { 'I am': 'custom data' } })
    }

    return (
        <ATForm ref={ref} onChange={onChange} validationDisabled={false} >
            {
                formBuilder.createColumnBuilder(
                    [
                        formBuilder.createButton({ id: 'Simple Notifiation', onClick: onSimpleNotificationClick }),
                        formBuilder.createButton({ id: 'Persistent Notification', onClick: onPersistentNotificationClick, color: 'error' }),
                        formBuilder.createButton({ id: 'Show Are you sure!', confirmationMessage: 'Are you sure?', onClick: onAreYouSureClick, color: 'warning' }),
                        formBuilder.createButton({ id: 'Custom Notification', onClick: onCustomNotificationClick, color: 'success' }),
                    ]
                )
                    .build()
            }
        </ATForm>
    )
}

export default ToastPlayground;