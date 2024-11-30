import React from 'react';

//MUI
import MUIAvatar from '@mui/material/Avatar';
import { Button } from '@mui/material';
//Resizer
import Resizer from "react-image-file-resizer";

const Avatar = ({ _formProps_, id, value, accept, avatarSize = 42, width = 128, height = 128, readOnly, onChange, error, helperText, ...restProps }) => {
    const { onLockdownChange } = _formProps_

    const resizeImage = (file) => {
        return new Promise((resolve, reject) => {
            try {
                Resizer.imageFileResizer(
                    file,
                    width,
                    height,
                    "JPEG",
                    90,
                    0,
                    (uri) => {
                        resolve(uri);
                    },
                    "base64"
                )
            }
            catch (err) {
                console.log(err)
                reject(err)
            }
        })
    }

    const onInternalChange = (event) => {
        const selectedFiles = Array.from(event.target.files)

        if (selectedFiles.length === 1) {
            if (onLockdownChange)
                onLockdownChange(true)
            resizeImage(selectedFiles[0])
                .then(res => {
                    console.log('res', res)
                    onChange({ target: { value: res } })
                })
                .finally(() => {
                    if (onLockdownChange)
                        onLockdownChange(false)
                })
        }
    }

    return <Button component="label" variant={error ? 'outlined' : 'Text'} color={error ? 'error' : 'primary'}>
        <MUIAvatar alt={'Avatar'} src={value}  {...restProps} sx={{ width: avatarSize, height: avatarSize }} />
        {
            error && helperText &&
            <div style={{ position: 'absolute' }}>
                {helperText}
            </div>
        }
        {!readOnly && <input hidden type="file" accept={accept || "image/png, image/gif, image/jpeg"} onChange={onInternalChange} />}
    </Button>
}

export default Avatar;