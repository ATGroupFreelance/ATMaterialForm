import { ATFormOnChangeInterface, ATFormResetInterface } from "./ATForm.type";
import { ATFormRuntime } from "./ATFormRuntime.type";

export interface ATFormContextInterface {
    onLockdownChange: (id: string, state: boolean) => void,
    isFormOnLockdown: boolean,
    errors: any,
    getTypeInfo: (type: string) => any,
    logger: any,
    checkValidation: any,
    reset: (props?: ATFormResetInterface) => void,
    getFormData: () => ATFormOnChangeInterface,
    runtime?: ATFormRuntime,
}

