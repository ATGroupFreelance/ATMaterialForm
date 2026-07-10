import { AtForm, formBuilder } from '@/lib';
import AtToast from '@/lib/component/AtToast/AtToast';
import { ExampleComponentInterface } from '@/App';

const ToastPlayground = ({ ref, onChange }: ExampleComponentInterface) => {
    const onSimpleNotificationClick = () => {
        AtToast.info('This is a simple notification')
    }

    const onPersistentNotificationClick = () => {
        AtToast.info('This is a persistent notification', { autoClose: false })
    }

    const onAreYouSureClick = () => {
        AtToast.AreYouSure('Thank you for confirming that you are sure!')
    }

    const onCustomNotificationClick = () => {
        AtToast.info((...props: any) => {
            console.log('onCustomNotificationClick ATToast Custom Component Props', props)

            return <div>This is a custom component</div>
        }, { data: { 'I am': 'custom data' } })
    }

    return (
        <AtForm ref={ref} onChange={onChange} validationDisabled={false} >
            {
                formBuilder.utils.createFieldDefBuilder(
                    [
                        formBuilder.createButton({ id: 'Simple Notifiation' }, { onClick: onSimpleNotificationClick }),
                        formBuilder.createButton({ id: 'Persistent Notification' }, { onClick: onPersistentNotificationClick, color: 'error' }),
                        formBuilder.createButton({ id: 'Show Are you sure!' }, { confirmationText: 'Are you sure?', onClick: onAreYouSureClick, color: 'warning' }),
                        formBuilder.createButton({ id: 'Custom Notification' }, { onClick: onCustomNotificationClick, color: 'success' }),
                    ]
                )
                    .buildAtForm()
            }
        </AtForm>
    )
}

export default ToastPlayground;