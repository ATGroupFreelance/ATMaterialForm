import { AvatarProps } from "@mui/material";
import { ATFormMinimalControlledUIProps, StrictOmit } from "../Common.type";

export type ATFormAvatarProps = ATFormMinimalControlledUIProps & StrictOmit<AvatarProps, 'id' | 'onChange'> & {
    accept?: string,
    avatarSize?: number,
    width?: number,
    height?: number,
};