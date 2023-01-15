// import React, { useEffect, useState } from 'react';
// import { makeStyles } from '@material-ui/core/styles';
// import MaterialUIAvatar from '@material-ui/core/Avatar';
// import DefaultUserImage from 'assets/Images/UserProfile/DefaultUser.png';
// import UploadFileButtonBase from 'containers/FormBuilder/UI/UploadFileButtonBase/UploadFileButtonBase';
// import { GridUtils } from 'utils/UI';
// //Services
// import { archiveService } from 'services/archive.service';
// //Utils
// import { get, isObject } from 'utils/Javascript/JavascriptUtils'
// import { SignalCellularNull } from '@material-ui/icons';
// //Services
// import ServiceManagerv2 from 'ServiceManagerv2/ServiceManagerv2';

// const useStyles = makeStyles({
//     avatar: {
//         width: ({ width = '50%' }) => width,
//         height: ({ height = '50%' }) => height,
//     },
// });

// const Avatar = ({ gridClass, src = DefaultUserImage, style, onChange, defaultValue, value, ...restProps }) => {
//     const { width, height, ...restStyle } = style || {}
//     const classes = useStyles({ width, height });

//     const [fileID, setFileID] = useState(null)
//     const [thumbnail, setThumbnail] = useState(DefaultUserImage)

//     useEffect(() => {
//         const uploadArrayValue = fileID || value || defaultValue

//         const newFileID = get(['0', 'FileID'], uploadArrayValue)
//         let finalFileID = null

//         if (isObject(newFileID))
//             finalFileID = get(['0', 'FileID', 'value'], uploadArrayValue)
//         else
//             finalFileID = newFileID


//         if (finalFileID) {
//             ServiceManagerv2.archive.getImageFile({ fileID: finalFileID })
//                 .then((res) => {
//                     setThumbnail(res)
//                 })
//         }
//         else
//             setThumbnail(DefaultUserImage)
//     }, [fileID])

//     const onUploadFileChange = (event) => {
//         setFileID(event.target.value)

//         if (onChange) {
//             onChange(event)
//         }
//     }

//     return (
//         <div className={gridClass}>
//             <UploadFileButtonBase
//                 gridClass={GridUtils.getGridClass(12)}
//                 Avatar={
//                     <MaterialUIAvatar
//                         className={classes.avatar}
//                         src={thumbnail}
//                         alt={'Loading avatar failed ...'}
//                     />
//                 }
//                 style={restStyle}
//                 onChange={onUploadFileChange}
//                 value={value}
//                 defaultValue={defaultValue}
//                 {...restProps}
//             />
//         </div>
//     );
// }

// export default Avatar;