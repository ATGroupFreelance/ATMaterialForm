export interface AtFormWrapperContextValueInterface {
    register: (fn: () => void) => () => void;
    activate: () => void;
    deactivate?: () => void;
}

