import CascadeRenderer from '../CascadeComboBox/internal/CascadeRenderer';
import { useCascadeEngine } from '../CascadeComboBox/internal/useCascadeEngine';
import { AtFormCascadePathComboBoxProps, AtFormCascadePathValue } from '../../../../types/ui/CascadeComboBox.type';

const CascadePathComboBox = ({
    id,
    label,
    layers,
    resolver,
    onPathChange,
    onChange,
    value,
    error,
    helperText,
    readOnly,
    presentation,
}: AtFormCascadePathComboBoxProps) => {
    const engine = useCascadeEngine({
        mode: 'path',
        value,
        layers,
        resolver,
        onPathChange,
        emitValue: (nextValue) => onChange?.({ target: { value: nextValue as AtFormCascadePathValue | null } }),
    });

    return (
        <CascadeRenderer
            id={id}
            label={label}
            layers={layers}
            selections={engine.selections}
            layerStates={engine.layerStates}
            presentation={presentation}
            readOnly={readOnly}
            error={error}
            helperText={helperText}
            onSelect={engine.selectLayer}
            onOpen={engine.openLayer}
            onSearch={engine.searchLayer}
            onLoadMore={engine.loadMore}
            onRetry={engine.retryLayer}
        />
    );
};

export default CascadePathComboBox;
