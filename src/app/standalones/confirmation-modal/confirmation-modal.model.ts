export declare type ModalResult = 'confirm' | 'cancel' | 'success' | 'failure' | 'next' | 'back' | 'close' | 'error';
export interface ConfirmationModalOptions {
    titleKey: string;
    titleParams?: Record<string, unknown>;
    contentKey?: string;
    contentParams?: Record<string, unknown>;
    buttons?: ConfirmationModalButton[];
}

export interface ConfirmationModalButton {
    labelKey: string;
    labelParams?: Record<string, unknown>;
    color?: string;
    result: ModalResult;
}
