import { AtForm, formBuilder } from "@/lib";
import { ExampleComponentInterface } from '@/App';
import { AtFormCardSelectCategory, AtFormCardSelectItem } from '@/lib/types/ui/CardSelect.type';

const categories: AtFormCardSelectCategory[] = [
    {
        id: 'fiber',
        title: 'Fiber Services',
        subTitle: 'Dedicated access and dark-fiber products',
    },
    {
        id: 'data',
        title: 'Data Services',
        subTitle: 'Business internet and point-to-point connectivity',
    },
    {
        id: 'voice',
        title: 'Voice & Signaling',
        subTitle: 'SIP and enterprise voice services',
    },
];

const serviceOptions: AtFormCardSelectItem[] = [
    {
        id: 'B2B-FIBER',
        categoryId: 'fiber',
        title: 'Business Fiber Access',
        subTitle: 'Managed B2B fiber service',
        description: 'Dedicated fiber access for commercial customers with a managed activation workflow.',
        tags: ['20 stages', { label: 'B2B', color: 'primary', variant: 'outlined' }],
    },
    {
        id: 'DARK-FIBER',
        categoryId: 'fiber',
        title: 'Dark Fiber',
        subTitle: 'Fiber-pair lease',
        description: 'Lease an unlit fiber pair for private transport, testing, handoff, and delivery.',
        tags: ['5 stages', 'DF'],
    },
    {
        id: 'INET-FIBER',
        categoryId: 'data',
        title: 'Internet over Fiber',
        subTitle: 'Dedicated internet access',
        description: 'Business internet delivered over dedicated fiber with enterprise service levels.',
        tags: ['27 stages', 'INET-FIB'],
    },
    {
        id: 'MPLS-FIBER',
        categoryId: 'data',
        title: 'MPLS over Fiber',
        subTitle: 'Private WAN connectivity',
        description: 'MPLS service delivered over fiber for private business network connectivity.',
        tags: ['27 stages', 'MPLS-FIB'],
    },
    {
        id: 'PTMP-CENTER',
        categoryId: 'data',
        title: 'PTMP Data Center',
        subTitle: 'Point-to-multipoint access',
        description: 'Point-to-multipoint connectivity for business sites terminating in a data center.',
        tags: ['28 stages', 'PTMP'],
    },
    {
        id: 'SIP-FIBER',
        categoryId: 'voice',
        title: 'SIP Trunk over Fiber',
        subTitle: 'Enterprise voice trunk',
        description: 'Managed SIP trunk service over dedicated fiber for enterprise voice traffic.',
        tags: ['29 stages', 'SIP-FIB'],
    },
];

const CardSelectPlayground = ({ ref, onChange }: ExampleComponentInterface) => {
    return <AtForm
        ref={ref}
        onChange={onChange}
        defaultValue={{ ServiceId: 'DARK-FIBER' }}
        defaultValueFormat="FormDataKeyValue"
    >
        {
            formBuilder.utils.createFieldDefBuilder([
                formBuilder.createCardSelect(
                    {
                        id: 'ServiceId',
                        label: 'Choose a business service',
                        size: 12,
                        validation: { required: true },
                    },
                    {
                        description: 'Select one service card. Click the selected card again to clear it; the selected card id is the form value.',
                        options: serviceOptions,
                        categories,
                        minCardWidth: 280,
                    },
                ),
            ]).buildAtForm()
        }
    </AtForm>;
};

export default CardSelectPlayground;
