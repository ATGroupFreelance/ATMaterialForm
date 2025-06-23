import { ATForm, formBuilder } from '@/lib';
import ATToast from '@/lib/component/ATToast/ATToast';
import { ExampleComponentInterface } from '@/App';

const ToastPlayground = ({ ref, onChange }: ExampleComponentInterface) => {
    const onSimpleNotificationClick = () => {
        ATToast.info('This is a simple notification')
    }

    const onPersistentNotificationClick = () => {
        ATToast.info('This is a persistent notification', { autoClose: false })
    }

    const onAreYouSureClick = () => {
        ATToast.AreYouSure('Thank you for confirming that you are sure!')
    }

    const onCustomNotificationClick = () => {
        ATToast.info((...props: any) => {
            console.log('onCustomNotificationClick ATToast Custom Component Props', props)

            return <div>This is a custom component</div>
        }, { data: { 'I am': 'custom data' } })
    }

    return (
        <ATForm ref={ref} onChange={onChange} validationDisabled={false} >
            {
                formBuilder.utils.createFieldDefinitionBuilder(
                    [
                        formBuilder.createButton({ id: 'Simple Notifiation' }, { onClick: onSimpleNotificationClick }),
                        formBuilder.createButton({ id: 'Persistent Notification' }, { onClick: onPersistentNotificationClick, color: 'error' }),
                        formBuilder.createButton({ id: 'Show Are you sure!' }, { confirmationText: 'Are you sure?', onClick: onAreYouSureClick, color: 'warning' }),
                        formBuilder.createButton({ id: 'Custom Notification' }, { onClick: onCustomNotificationClick, color: 'success' }),
                    ]
                )
                    .buildATForm()
            }
        </ATForm>
    )
}

export default ToastPlayground;