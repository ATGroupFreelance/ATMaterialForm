export interface ATFormWrapperContextValueInterface {
    register: (fn: () => void) => () => void;
    activate: () => void;
    deactivate?: () => void;
}

