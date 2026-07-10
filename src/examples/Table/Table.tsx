import { AtForm, formBuilder } from '@/lib';

const Table = ({ ref, onChange }: any) => {
    return (
        <AtForm ref={ref} onChange={onChange} validationDisabled={true}>
            {[
                formBuilder.createTable({ id: 'Table', label: 'Documents' }, { data: [{ a: '10', b: '2000', c: '5000' }], columns: [] }),
            ]}
        </AtForm>
    )
}

export default Table;