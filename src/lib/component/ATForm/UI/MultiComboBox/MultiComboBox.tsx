import ComboBox from "../ComboBox/ComboBox";
import { ATFormMultiComboBoxProps } from '@/lib/types/ui/MultiComboBox.type';
//Facts about autocomplete:
//If "multiple" is false, value/initvalue must be string or null
//If "multiple" is true,  value/initvalue must be an array
//If "multiple" is false the out of onChange is an string
//if "multiple" is true the output of onChange is an array
//Option can be like this: 
//['uk', 'us']
//[{label: 'uk'}, {label: 'us'}]
const MultiComboBox = (props: ATFormMultiComboBoxProps) => {

    return <ComboBox
        multiple={true}
        {...props}
    />
}

export default MultiComboBox;