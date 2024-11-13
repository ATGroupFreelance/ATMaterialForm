import ChildComponent from "./ChildComponent/ChildComponent";
import DataAPIHook from "./DataAPIHook/DataAPIHook";

const Playground = () => {
    const { data, updateAPIHook } = DataAPIHook()
    console.log('#PLAYGROUND Playground')

    return <div>
        {data}
        Playground
        <ChildComponent />
        <button onClick={updateAPIHook}>Playground</button>
    </div>
}

export default Playground;