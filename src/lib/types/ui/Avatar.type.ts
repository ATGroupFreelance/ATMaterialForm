import { AvatarProps } from "@mui/material";
import { AtFormMinimalControlledUiProps, StrictOmit } from "../Common.type";

export type AtFormAvatarProps = AtFormMinimalControlledUiProps & StrictOmit<AvatarProps, 'id' | 'onChange'> & {
    accept?: string,
    avatarSize?: number,
    width?: number,
    height?: number,
};