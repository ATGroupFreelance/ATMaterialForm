import { ChangeEvent, useEffect, useState } from 'react';
//Context
import useATFormConfig from '../../../../hooks/useATFormConfig/useATFormConfig';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import { Button, CircularProgress, Typography } from '@mui/material';
import { ATFormUploadImageButtonProps } from '@/lib/types/ui/UploadImageButton.type';
import useATForm from '@/lib/hooks/useATForm/useATForm';

const UploadImageButton = ({ id, label, onChange, value, disabled, accept, error, helperText, authToken, width = 128, height = 128, readOnly }: ATFormUploadImageButtonProps) => {
    const [loading, setLoading] = useState<boolean>(false)
    const { onLockdownChange } = useATForm()
    const { uploadFilesToServer, getFile, localText } = useATFormConfig()
    const [src, setSrc] = useState<string | null>(null)

    useEffect(() => {
        if (value) {
            if (getFile)
                getFile({ id: value, authToken, width, height })
                    .then(res => {
                        const objectURL = window.URL.createObjectURL(res)

                        setSrc(objectURL)
                    })
            else {
                console.error('Please provide a getFile to the Form provider')
            }
        }
        // else {
        //     setSrc(null)
        // }
        // eslint-disable-next-line
    }, [value])

    const onInternalChange = (event: ChangeEvent<HTMLInputElement>) => {
        //selectedFiles is an object
        //the object has keys which start from 0 for each file
        //This kinda object should be treated like an array so use for (i = 0...) not for i in !! 
        //the value of each key is an object itself which contains : 
        // lastModified: 1588580785366
        // lastModifiedDate: Mon May 04 2020 12:56:25
        // name: "Marker3.png"
        // size: 4402
        // type: "image/png"
        // webkitRelativePath: ""
        const selectedFiles = event.target.files ? Array.from(event.target.files) : []
        if (selectedFiles.length === 1) {
            const formData = new FormData()

            selectedFiles.forEach((file, index) => {
                formData.append(`${localText['file']}${index}`, file)
            })

            setLoading(true)
            if (onLockdownChange && id)
                onLockdownChange(id, true)

            if (uploadFilesToServer) {
                uploadFilesToServer({ files: formData, authToken })
                    .then(res => {
                        const newValue = res?.[0]?.id

                        setSrc(URL.createObjectURL(selectedFiles[0]))
                        if (onChange)
                            onChange({ target: { value: newValue } })
                    })
                    .finally(() => {
                        setLoading(false)
                        if (onLockdownChange && id)
                            onLockdownChange(id, false)
                    })
            }
            else {
                if (onChange)
                    onChange({ target: { value: ['No uploadFilesToServer was found, please assign one usnig ATFormConfigProvider!'] } })
                setLoading(false)
                if (onLockdownChange && id)
                    onLockdownChange(id, false)
            }
        }
    }

    return <div style={{ flexDirection: "column", alignItems: "center", textAlign: 'center' }}>
        <Typography sx={{ fontSize: '14px', "userSelect": "none", "WebkitUserSelect": "none" }} color={error ? "#d32f2f" : "default"}>
            {label}
        </Typography>
        <Button component="label" sx={{ width: `${width}px`, height: `${height}px` }} variant={"outlined"} disabled={disabled || loading || readOnly} color={error ? 'error' : 'primary'}>
            <img src={src || "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"} alt={""} style={{ width: '100%', height: '100%', border: "0px" }} />
            <input hidden type="file" accept={accept || "image/png, image/gif, image/jpeg"} onChange={onInternalChange} />
            {loading ? <CircularProgress sx={{ position: 'absolute' }} /> : <UploadFileIcon sx={{ position: 'absolute' }} />}
        </Button>
        {
            error && helperText &&
            <Typography sx={{ fontSize: '12px', "userSelect": "none", "WebkitUserSelect": "none", color: '#d32f2f' }}>
                {helperText}
            </Typography>
        }
    </div>
}

export default UploadImageButton;