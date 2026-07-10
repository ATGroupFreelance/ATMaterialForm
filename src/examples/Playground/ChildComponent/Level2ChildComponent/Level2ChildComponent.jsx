import DataApiHook from "@/examples/Playground/DataApiHook/DataApiHook";

const Level2ChildComponent = () => {
    const {data, updateApiHook} = DataApiHook()
    console.log('#PLAYGROUND Level2ChildComponent', data)

    return <div>
        Level2ChildComponent
        <button onClick={updateApiHook}>Level2ChildComponent</button>
    </div>
}

export default Level2ChildComponent;