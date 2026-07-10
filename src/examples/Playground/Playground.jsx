import ChildComponent from "./ChildComponent/ChildComponent";
import DataApiHook from "./DataApiHook/DataApiHook";

const Playground = () => {
    const { data, updateApiHook } = DataApiHook()
    console.log('#PLAYGROUND Playground')

    return <div>
        {data}
        Playground
        <ChildComponent />
        <button onClick={updateApiHook}>Playground</button>
    </div>
}

export default Playground;