import Level2ChildComponent from "./Level2ChildComponent/Level2ChildComponent";

const ChildComponent = () => {
    console.log('#PLAYGROUND ChildComponent')

    return <div>
        ChildComponent
        <Level2ChildComponent/>
    </div>
}

export default ChildComponent;