import { AtFormOnChangeInterface, AtFormResetInterface } from "./AtForm.type";
import { AtFormRuntime } from "./AtFormRuntime.type";

export interface AtFormContextInterface {
    onLockdownChange: (id: string, state: boolean) => void,
    isFormOnLockdown: boolean,
    errors: any,
    getTypeInfo: (type: string) => any,
    logger: any,
    checkValidation: any,
    reset: (props?: AtFormResetInterface) => void,
    getFormData: () => AtFormOnChangeInterface,
    runtime?: AtFormRuntime,
}

