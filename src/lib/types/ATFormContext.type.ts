export interface ATFormContextInterface {    
    onLockdownChange: (id: string, state: boolean) => void,
    isFormOnLockdown: boolean,
    errors: any,
    getTypeInfo: (type: string) => any,
}

