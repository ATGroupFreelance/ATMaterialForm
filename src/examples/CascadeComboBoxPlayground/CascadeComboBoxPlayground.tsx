import { AtForm, formBuilder } from '@/lib';
import { ExampleComponentInterface } from '@/App';
import ServiceManager from '@/serviceManager/serviceManager';
import { AtFormCascadeLayer, AtFormCascadePathResolver } from '@/lib/types/ui/CascadeComboBox.type';

const simpleEnumLayers: AtFormCascadeLayer[] = [
    {
        id: 'country',
        label: 'Enum country',
        source: { type: 'enum', enumKey: 'Countries' },
    },
    {
        id: 'state',
        label: 'Enum state',
        source: { type: 'enum', enumKey: 'StrictFormatState' },
    },
    {
        id: 'capital',
        label: 'Enum capital',
        source: { type: 'enum', enumKey: 'StrictFormatCapital' },
    },
];

const metadataRelationLayers: AtFormCascadeLayer[] = [
    {
        id: 'business_id',
        label: 'Business',
        source: { type: 'enum' },
    },
    {
        id: 'system_id',
        label: 'System',
        source: {
            type: 'enum',
            relation: { type: 'metadata', key: 'business_id' },
        },
    },
];

const sharedEnumLayers: AtFormCascadeLayer[] = [
    {
        id: 'sharedCountry',
        label: 'Shared country',
        source: {
            type: 'enum',
            enumKey: 'GeoHierarchy',
            match: { metadata: { level: 'country' } },
        },
    },
    {
        id: 'sharedState',
        label: 'Shared state',
        source: {
            type: 'enum',
            enumKey: 'GeoHierarchy',
            match: { metadata: { level: 'state' } },
        },
    },
    {
        id: 'sharedCity',
        label: 'Shared city',
        source: {
            type: 'enum',
            enumKey: 'GeoHierarchy',
            match: { metadata: { level: 'city' } },
        },
    },
];

const staticLayers: AtFormCascadeLayer[] = [
    {
        id: 'productFamily',
        label: 'Product family',
        source: {
            type: 'static',
            options: [
                { id: 'network', title: 'Network' },
                { id: 'compute', title: 'Compute' },
            ],
        },
    },
    {
        id: 'product',
        label: 'Product',
        source: {
            type: 'static',
            options: [
                { id: 'router', title: 'Router', parentId: 'network' },
                { id: 'switch', title: 'Switch', parentId: 'network' },
                { id: 'server', title: 'Server', parentId: 'compute' },
            ],
        },
    },
];

const registeredProviderLayers: AtFormCascadeLayer[] = [
    {
        id: 'providerCountry',
        label: 'Provider country',
        source: { type: 'provider', provider: 'demo.countries' },
    },
    {
        id: 'providerState',
        label: 'Provider state',
        source: { type: 'provider', provider: 'demo.states' },
    },
];

const mixedSourceLayers: AtFormCascadeLayer[] = [
    {
        id: 'mixedCountry',
        label: 'Mixed country',
        source: { type: 'enum', enumKey: 'Countries' },
    },
    {
        id: 'mixedState',
        label: 'Mixed state',
        source: {
            type: 'provider',
            provider: async (context) => ServiceManager.getCascadeStatesProvider({
                ...context,
                parentId: context.path.mixedCountry,
            }),
        },
    },
    {
        id: 'mixedCity',
        label: 'Mixed city',
        source: {
            type: 'static',
            options: [
                { id: 'london', title: 'London', parentId: 11 },
                { id: 'edinburgh', title: 'Edinburgh', parentId: 12 },
                { id: 'montgomery', title: 'Montgomery', parentId: 21 },
                { id: 'sacramento', title: 'Sacramento', parentId: 22 },
            ],
        },
    },
];

const resolveMixedSourcePath: AtFormCascadePathResolver = async ({ value }) => {
    const cities = {
        london: { city: 'London', stateId: 11, state: 'England', countryId: 1, country: 'UK' },
        edinburgh: { city: 'Edinburgh', stateId: 12, state: 'Scotland', countryId: 1, country: 'UK' },
        montgomery: { city: 'Montgomery', stateId: 21, state: 'Alabama', countryId: 2, country: 'US' },
        sacramento: { city: 'Sacramento', stateId: 22, state: 'California', countryId: 2, country: 'US' },
    } as const;
    const resolved = cities[String(value) as keyof typeof cities];
    if (!resolved)
        return null;

    return {
        mixedCountry: { id: resolved.countryId, title: resolved.country },
        mixedState: { id: resolved.stateId, title: resolved.state },
        mixedCity: { id: value, title: resolved.city },
    };
};

const lazyRemoteLayers: AtFormCascadeLayer[] = [
    {
        id: 'region',
        label: 'Large-data region',
        source: {
            type: 'static',
            options: [
                { id: 'north', title: 'North region' },
                { id: 'south', title: 'South region' },
            ],
        },
    },
    {
        id: 'facility',
        label: 'Large-data facility',
        source: {
            type: 'provider',
            provider: 'demo.facilities',
        },
    },
    {
        id: 'device',
        label: 'Large-data device',
        source: {
            type: 'provider',
            provider: 'demo.devices',
            pageSize: 30,
            loadOnOpen: true,
            search: { minChars: 2, debounceMs: 100 },
        },
    },
];

const failureRetryLayers: AtFormCascadeLayer[] = [
    {
        id: 'failureOption',
        label: 'Failure / retry option',
        source: {
            type: 'provider',
            provider: ServiceManager.getCascadeFailureProvider,
            loadOnOpen: true,
        },
    },
];

const resolveFailureRetryPath: AtFormCascadePathResolver = ({ value }) => (
    value === 'recovered'
        ? { failureOption: { id: 'recovered', title: 'Recovered option' } }
        : null
);

const responsiveFiveLayerCascade: AtFormCascadeLayer[] = [
    {
        id: 'org',
        label: 'Organization',
        source: { type: 'static', options: [{ id: 'org-1', title: 'AT Group' }] },
    },
    {
        id: 'campus',
        label: 'Campus',
        source: { type: 'static', options: [{ id: 'campus-1', title: 'Main campus', parentId: 'org-1' }] },
    },
    {
        id: 'building',
        label: 'Building',
        source: { type: 'static', options: [{ id: 'building-1', title: 'Building 17', parentId: 'campus-1' }] },
    },
    {
        id: 'floor',
        label: 'Floor',
        source: { type: 'static', options: [{ id: 'floor-2', title: 'Floor 2', parentId: 'building-1' }] },
    },
    {
        id: 'rack',
        label: 'Rack',
        source: { type: 'static', options: [{ id: 'rack-a', title: 'Rack A', parentId: 'floor-2' }] },
    },
];


/**
 * Fan-out path: selecting one parent reveals two sibling ComboBoxes at the
 * same depth. This intentionally uses CascadePathComboBox because both sibling
 * values are meaningful; there is no single scalar leaf that represents them.
 */
const branchingPathLayers: AtFormCascadeLayer[] = [
    {
        id: 'branchDepartment',
        label: 'Fan-out department',
        source: {
            type: 'static',
            options: [
                { id: 'operations', title: 'Operations' },
                { id: 'engineering', title: 'Engineering' },
            ],
        },
    },
    {
        id: 'primarySystem',
        label: 'Primary system',
        dependsOn: 'branchDepartment',
        source: {
            type: 'static',
            options: [
                { id: 'ops-primary', title: 'Operations core', parentId: 'operations' },
                { id: 'eng-primary', title: 'Engineering core', parentId: 'engineering' },
            ],
        },
    },
    {
        id: 'secondarySystem',
        label: 'Secondary system',
        dependsOn: 'branchDepartment',
        source: {
            type: 'static',
            options: [
                { id: 'ops-secondary', title: 'Operations reporting', parentId: 'operations' },
                { id: 'eng-secondary', title: 'Engineering analytics', parentId: 'engineering' },
            ],
        },
    },
];

/**
 * Variable-depth scalar route. `simple` ends after three visible controls,
 * while `advanced` continues through five. Only the selected route exists in
 * the active Cascade, and its single active terminal remains the scalar value.
 */
const dynamicDepthLayers: AtFormCascadeLayer[] = [
    {
        id: 'routeMode',
        label: 'Route mode',
        source: {
            type: 'static',
            options: [
                { id: 'simple', title: 'Simple route (3 levels)' },
                { id: 'advanced', title: 'Advanced route (5 levels)' },
            ],
        },
    },
    {
        id: 'routeCountry',
        label: 'Route country',
        dependsOn: 'routeMode',
        source: {
            type: 'static',
            options: [
                { id: 'simple-uk', title: 'United Kingdom', parentId: 'simple' },
                { id: 'advanced-us', title: 'United States', parentId: 'advanced' },
            ],
        },
    },
    {
        id: 'simpleCity',
        label: 'Simple city',
        dependsOn: 'routeCountry',
        visibleWhen: { layerId: 'routeMode', ids: ['simple'] },
        source: {
            type: 'static',
            options: [
                { id: 'simple-london', title: 'London', parentId: 'simple-uk' },
            ],
        },
    },
    {
        id: 'advancedState',
        label: 'Advanced state',
        dependsOn: 'routeCountry',
        visibleWhen: { layerId: 'routeMode', ids: ['advanced'] },
        source: {
            type: 'static',
            options: [
                { id: 'advanced-ca', title: 'California', parentId: 'advanced-us' },
            ],
        },
    },
    {
        id: 'advancedCity',
        label: 'Advanced city',
        dependsOn: 'advancedState',
        source: {
            type: 'static',
            options: [
                { id: 'advanced-sf', title: 'San Francisco', parentId: 'advanced-ca' },
            ],
        },
    },
    {
        id: 'advancedBuilding',
        label: 'Advanced building',
        dependsOn: 'advancedCity',
        source: {
            type: 'static',
            options: [
                { id: 'advanced-building-1', title: 'Building 1', parentId: 'advanced-sf' },
            ],
        },
    },
];

const CascadeComboBoxPlayground = ({ ref, onChange }: ExampleComponentInterface) => {
    const fields = [
        formBuilder.createLayout(
            {
                id: 'CascadeLocalData',
                renderer: 'Section',
                size: 12,
                config: {
                    title: 'Local data & whole-tree search',
                    description: 'ATForm Layout owns visual grouping; each Cascade stays a lightweight compound field inside the section.',
                    divider: true,
                    gridProps: { spacing: 2 },
                },
            },
            [
                formBuilder.createCascadeComboBox(
                    { id: 'SimpleEnumCascade', validation: { required: true } },
                    {
                        schemaVersion: 2,
                        label: 'Simple enum cascade',
                        layers: simpleEnumLayers,
                        leafSearch: {
                            label: 'Find any capital',
                            placeholder: 'Search the complete local tree…',
                        },
                    },
                ),
                formBuilder.createCascadeComboBox(
                    { id: 'MetadataRelationCascade' },
                    {
                        schemaVersion: 2,
                        label: 'Custom metadata relationship',
                        layers: metadataRelationLayers,
                    },
                ),
                formBuilder.createCascadeComboBox(
                    { id: 'SharedEnumCascade' },
                    {
                        schemaVersion: 2,
                        label: 'One shared hierarchical enum',
                        layers: sharedEnumLayers,
                    },
                ),
                formBuilder.createCascadeComboBox(
                    { id: 'StaticCascade' },
                    {
                        schemaVersion: 2,
                        label: 'Static options cascade',
                        layers: staticLayers,
                    },
                ),
            ],
        ),
        formBuilder.createLayout(
            {
                id: 'CascadeRemoteData',
                renderer: 'Box',
                size: 12,
                config: {
                    title: 'Async, registered providers & large data',
                    description: 'Remote layers stay lazy. Whole-tree search uses a dedicated provider instead of enumerating the dataset.',
                    appearance: 'soft',
                    gridProps: { spacing: 2 },
                },
            },
            [
                formBuilder.createCascadeComboBox(
                    { id: 'RegisteredProviderCascade' },
                    {
                        schemaVersion: 2,
                        label: 'Registered async provider cascade',
                        layers: registeredProviderLayers,
                        resolver: 'demo.statePath',
                    },
                ),
                formBuilder.createCascadeComboBox(
                    { id: 'MixedSourceCascade' },
                    {
                        schemaVersion: 2,
                        label: 'Mixed enum + function + static cascade',
                        layers: mixedSourceLayers,
                        resolver: resolveMixedSourcePath,
                    },
                ),
                formBuilder.createCascadeComboBox(
                    { id: 'LazyMillionCascade' },
                    {
                        schemaVersion: 2,
                        label: 'Lazy searchable million-record cascade',
                        layers: lazyRemoteLayers,
                        resolver: 'demo.devicePath',
                        leafSearch: {
                            provider: 'demo.deviceLeafSearch',
                            label: 'Find any device',
                            placeholder: 'Try 4242, north 4242, or south site 2 900…',
                            minChars: 2,
                            debounceMs: 120,
                            limit: 12,
                        },
                    },
                ),
            ],
        ),
        formBuilder.createLayout(
            {
                id: 'CascadeValueAndRoutes',
                renderer: 'Section',
                size: 12,
                config: {
                    title: 'Value shapes & route structures',
                    description: 'Path output, fan-out siblings, and variable-depth scalar routes share the same Cascade engine.',
                    divider: true,
                    gridProps: { spacing: 2 },
                },
            },
            [
                formBuilder.createCascadePathComboBox(
                    { id: 'PathValueCascade' },
                    {
                        schemaVersion: 2,
                        label: 'Path-valued cascade',
                        layers: simpleEnumLayers.map((layer, index) => ({
                            ...layer,
                            id: `path${index === 0 ? 'Country' : index === 1 ? 'State' : 'Capital'}`,
                            label: `Path ${index === 0 ? 'country' : index === 1 ? 'state' : 'capital'}`,
                        })),
                    },
                ),
                formBuilder.createCascadePathComboBox(
                    { id: 'BranchingPathCascade' },
                    {
                        schemaVersion: 2,
                        label: 'Fan-out path cascade (two siblings at one depth)',
                        layers: branchingPathLayers,
                        presentation: { reveal: 'progressive', showPath: true },
                    },
                ),
                formBuilder.createCascadeComboBox(
                    { id: 'DynamicDepthCascade' },
                    {
                        schemaVersion: 2,
                        label: 'Dynamic-depth scalar cascade (3 or 5 levels)',
                        layers: dynamicDepthLayers,
                        leafSearch: {
                            label: 'Jump directly to a route leaf',
                            placeholder: 'Search London or Building 1…',
                        },
                        presentation: { reveal: 'progressive', showPath: true },
                    },
                ),
            ],
        ),
        formBuilder.createLayout(
            {
                id: 'CascadeOperations',
                renderer: 'Box',
                size: 12,
                config: {
                    title: 'Operational states & responsive wrapping',
                    description: 'Provider errors remain local to the failing layer, while the Cascade controls its own responsive internal flow.',
                    appearance: 'outlined',
                    gridProps: { spacing: 2 },
                },
            },
            [
                formBuilder.createCascadeComboBox(
                    { id: 'FailureRetryCascade' },
                    {
                        schemaVersion: 2,
                        label: 'Provider failure and retry',
                        layers: failureRetryLayers,
                        resolver: resolveFailureRetryPath,
                    },
                ),
                formBuilder.createCascadeComboBox(
                    {
                        id: 'ResponsiveCascade',
                        defaultValue: 'rack-a',
                    },
                    {
                        schemaVersion: 2,
                        label: 'Responsive five-layer cascade',
                        layers: responsiveFiveLayerCascade,
                        presentation: { minColumnWidth: 190, showPath: true },
                    },
                ),
            ],
        ),
    ];

    return (
        <AtForm ref={ref} onChange={onChange}>
            {fields}
        </AtForm>
    );
};

export default CascadeComboBoxPlayground;
