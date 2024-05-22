/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

import * as React from "react";
import { GridProps, SwitchFieldProps, TextAreaFieldProps, TextFieldProps } from "@aws-amplify/ui-react";
import { StorageManagerProps } from "@aws-amplify/ui-react-storage";
export declare type EscapeHatchProps = {
    [elementHierarchy: string]: Record<string, unknown>;
} | null;
export declare type VariantValues = {
    [key: string]: string;
};
export declare type Variant = {
    variantValues: VariantValues;
    overrides: EscapeHatchProps;
};
export declare type ValidationResponse = {
    hasError: boolean;
    errorMessage?: string;
};
export declare type ValidationFunction<T> = (value: T, validationResponse: ValidationResponse) => ValidationResponse | Promise<ValidationResponse>;
export declare type AddAnnouncementInputValues = {
    Date?: string;
    Title?: string;
    Description?: string;
    Image?: string;
    Active?: boolean;
};
export declare type AddAnnouncementValidationValues = {
    Date?: ValidationFunction<string>;
    Title?: ValidationFunction<string>;
    Description?: ValidationFunction<string>;
    Image?: ValidationFunction<string>;
    Active?: ValidationFunction<boolean>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type AddAnnouncementOverridesProps = {
    AddAnnouncementGrid?: PrimitiveOverrideProps<GridProps>;
    Date?: PrimitiveOverrideProps<TextFieldProps>;
    Title?: PrimitiveOverrideProps<TextFieldProps>;
    Description?: PrimitiveOverrideProps<TextAreaFieldProps>;
    Image?: PrimitiveOverrideProps<StorageManagerProps>;
    Active?: PrimitiveOverrideProps<SwitchFieldProps>;
} & EscapeHatchProps;
export declare type AddAnnouncementProps = React.PropsWithChildren<{
    overrides?: AddAnnouncementOverridesProps | undefined | null;
} & {
    clearOnSuccess?: boolean;
    onSubmit?: (fields: AddAnnouncementInputValues) => AddAnnouncementInputValues;
    onSuccess?: (fields: AddAnnouncementInputValues) => void;
    onError?: (fields: AddAnnouncementInputValues, errorMessage: string) => void;
    onChange?: (fields: AddAnnouncementInputValues) => AddAnnouncementInputValues;
    onValidate?: AddAnnouncementValidationValues;
} & React.CSSProperties>;
export default function AddAnnouncement(props: AddAnnouncementProps): React.ReactElement;
