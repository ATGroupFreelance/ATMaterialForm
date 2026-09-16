import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import { Button } from '@mui/material';
import { AtFormAdvanceStepperProps } from '../../../../types/ui/AdvanceStepper.type';
import useAtFormConfig from '../../../../hooks/useAtFormConfig/useAtFormConfig';

const AdvanceStepper = (props: AtFormAdvanceStepperProps) => {
    void props;
    const { t } = useAtFormConfig();

    const steps = [
    ];

    for (let i = 0; i < 20; i++) {
        steps.push({
            id: i,
            label: i,
        })
    }


    return <div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
            <Button style={{ width: '40px' }}>{t('Back')}</Button>
            <div style={{ flex: '1' }}>
                <Stepper activeStep={1}>
                    {steps.map((item) => (
                        <Step key={item.id}>
                            <StepLabel>{item.label || item.id}</StepLabel>
                        </Step>
                    ))}
                </Stepper>
            </div>
            <Button style={{ width: '40px' }}>{t('Next')}</Button>
        </div>
    </div>
}

export default AdvanceStepper;