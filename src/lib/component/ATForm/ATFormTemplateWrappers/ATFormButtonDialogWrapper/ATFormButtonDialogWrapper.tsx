// import Button from '../../UI/Button/Button'
// import { Grid } from '@mui/material'
// import { ATFormButtonDialogWrapperProps } from '@/lib/types/template-wrappers/ButtonDialogWrapper'
// import ATFormDialog from '../../ATFormDialog'
// import { useState } from 'react'
// import useATForm from '@/lib/hooks/useATForm/useATForm'

// const ATFormButtonDialogWrapper = ({ children, childProps, onClick, onChange, ...restProps }: ATFormButtonDialogWrapperProps) => {
//     const {id, size = 12, label = "Open" } = childProps.tProps
//     const { reset, getFormData } = useATForm()
//     const [dialog, setDialog] = useState<any>(null)

//     const onInternalClick = () => {
//         setDialog(
//             <ATFormDialog
//                 onClose={onHandleClose}
//                 onSubmitClick={({ formDataSemiKeyValue }) => {
//                     onChange(formDataSemiKeyValue)
//                 }}
//             >
//                 {
//                     children
//                 }
//             </ATFormDialog>
//         )
//     }

//     const onHandleClose = () => {
//         setDialog(null)
//     }

//     return (
//         <Grid size={size}>
//             <Button onClick={onInternalClick} {...restProps}>
//                 {label}
//             </Button>
//             {
//                 dialog
//             }
//         </Grid>
//     )
// }

// export default ATFormButtonDialogWrapper
