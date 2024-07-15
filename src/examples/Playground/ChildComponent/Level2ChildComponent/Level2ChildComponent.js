import DataAPIHook from "examples/Playground/DataAPIHook/DataAPIHook";

const Level2ChildComponent = () => {
    const {data, updateAPIHook} = DataAPIHook()
    console.log('#PLAYGROUND Level2ChildComponent', data)

    return <div>
        Level2ChildComponent
        <button onClick={updateAPIHook}>Level2ChildComponent</button>
    </div>
}

export default Level2ChildComponent;