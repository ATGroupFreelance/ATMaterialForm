import { AtForm } from "@/lib";

import { useRequiredAtFormRuntime } from "@/lib/hooks/useRequiredAtFormRuntime/useRequiredAtFormRuntime";
import { AtFormMinimalUncontrolledUiProps } from "@/lib/types/Common.type";
import { Button } from "@mui/material";
import { useState } from "react";

const ReportComponent = ({ id, formChildren }: AtFormMinimalUncontrolledUiProps & { formChildren: any }) => {
    const runtime = useRequiredAtFormRuntime()
    const { execute, useRuntimeState } = runtime

    const [rowData, setRowData] = useState(null)

    //The following is not async but can be updated if runtime decides it.
    const isDisabled = useRuntimeState(
        id!,
        "disabled",
    );

    const onShowReportResultClick = () => {
        //Run an async runtime.
        execute(id!, "rowData")
            .then((res: any) => {
                setRowData(res)
            })
    }

    return <div >
        <Button disabled={isDisabled} onClick={onShowReportResultClick}>Show Report Result</Button>
        {JSON.stringify(rowData)}
        <AtForm runtime={runtime} runtimePrefix={`${id}.`}>
            {
                formChildren
            }
        </AtForm>
    </div>
}

export default ReportComponent;