import { ATForm } from "@/lib";

import { useRequiredATFormRuntime } from "@/lib/hooks/useRequiredATFormRuntime/useRequiredATFormRuntime";
import { ATFormMinimalUncontrolledUIProps } from "@/lib/types/Common.type";
import { Button } from "@mui/material";
import { useState } from "react";

const ReportComponent = ({ id, formChildren }: ATFormMinimalUncontrolledUIProps & { formChildren: any }) => {
    const runtime = useRequiredATFormRuntime()
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
        <ATForm runtime={runtime} runtimePrefix={`${id}.`}>
            {
                formChildren
            }
        </ATForm>
    </div>
}

export default ReportComponent;