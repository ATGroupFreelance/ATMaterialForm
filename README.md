# ATMaterialForm

ATMaterialForm is a React form-building library for creating production forms faster with Material UI. It turns repetitive form work—field JSX, layout, value handling, validation, loading behavior, configuration, callbacks, and common interactions—into structured field definitions and a reusable form runtime.

The repository also includes an interactive playground. Each visible demo owns browser regression and performance tests so changes to ATMaterialForm can be checked against the behaviors the examples are meant to preserve.

## Why ATMaterialForm?

Production forms repeatedly solve the same problems: render a field, give it a stable ID, synchronize its value, validate it, arrange it responsively, load options, expose callbacks, reset it, and repeat those patterns inside tabs, dialogs, nested forms, tables, or custom wrappers.

ATMaterialForm focuses on:

- **Production speed** — build common fields with `formBuilder` instead of repeating large JSX trees.
- **Reduced boilerplate** — centralize common form behavior and value conversion.
- **Sensible defaults** — field types provide standard behavior while remaining configurable.
- **Extensibility** — register custom fields, wrappers, runtime bindings, and specialized UI behavior.
- **Structured configuration** — compose forms from field-definition objects and builder helpers.
- **Material UI integration** — forms use MUI components, layout, dialogs, tabs, and related UI patterns.
- **Performance awareness** — controlled forms, runtime examples, a dedicated benchmark, and per-example browser performance checks make regressions easier to detect.

## Features

Capabilities demonstrated by the current source include:

- configuration/builder-based form creation through `formBuilder`
- text, integer, float, password, checkbox, slider, date, combo-box, multi-combo-box, upload, image, file-viewer, table, stepper, color, and other field types
- cascade and multi-value cascade combo boxes
- controlled and uncontrolled `AtForm` usage
- validation and programmatic validation through the form ref
- reset/load/value APIs through the form ref
- `FormData`, `FormDataKeyValue`, and `FormDataSemiKeyValue` value formats
- nested forms and `groupDataKey`
- flat and nested form tabs
- `AtFormDialog` and form-dialog fields
- `ContainerWithTable` and AG Grid integrations
- conditional field construction through form-builder utilities
- custom controlled and uncontrolled React components
- custom and built-in wrapper renderers
- runtime bindings and runtime-generated behavior
- localization/configuration hooks, enum configuration, AG Grid local text, and RTL support
- toast and confirmation flows

## Installation

```bash
npm install atmaterialform
```

React and React DOM are peer dependencies of the published package.

## Quick Start

The current public entry exports `AtForm`, `AtFormDialog`, `AtFormConfigProvider`, `formBuilder`, and `UiTypes`.

```tsx
import {
  AtForm,
  AtFormConfigProvider,
  formBuilder,
} from 'atmaterialform';

const fields = [
  formBuilder.createTextBox({
    id: 'name',
    label: 'Name',
    validation: { required: true },
  }),
  formBuilder.createCheckBox({
    id: 'acceptTerms',
    label: 'Accept terms',
  }),
];

export default function Example() {
  return (
    <AtFormConfigProvider value={{ rtl: false, enums: {} }}>
      <AtForm
        onChange={({ formDataSemiKeyValue }) => {
          console.log(formDataSemiKeyValue);
        }}
      >
        {fields}
      </AtForm>
    </AtFormConfigProvider>
  );
}
```

A field `id` is the stable key used throughout values, callbacks, validation, refs, grouping, tabs, and runtime behavior.

## Core Concepts

### `AtForm`

`AtForm` is the form runtime. It accepts field definitions as children and supports default or controlled values, validation, tabs, runtime bindings, and an imperative ref.

The current ref exposes:

```ts
formRef.current.getData();
formRef.current.setData({ data });
formRef.current.getValue({ fieldId: 'name' });
formRef.current.setValue({ fieldId: 'name', value: 'Ada' });
formRef.current.reset();
formRef.current.checkValidation(onValid, onInvalid);
formRef.current.getFormData();
```

### `formBuilder`

`formBuilder` creates field definitions and includes helpers for composing and transforming groups of fields:

```tsx
const fields = [
  formBuilder.createTextBox({ id: 'name', size: 6 }),
  formBuilder.createIntegerTextBox({ id: 'age', size: 6 }),
  formBuilder.createComboBox(
    { id: 'country' },
    { options: countries },
  ),
];
```

### Validation

Fields can define validation metadata:

```tsx
formBuilder.createTextBox({
  id: 'username',
  validation: { required: true },
});
```

Programmatic validation is available through `formRef.current.checkValidation(...)`.

### Controlled values

Supplying `value` makes `AtForm` controlled. `valueFormat` specifies which supported data representation is being supplied. The controlled-form examples demonstrate all three formats.

## Form Data

`AtForm.onChange` exposes three current representations:

```ts
onChange={({ formData, formDataKeyValue, formDataSemiKeyValue }) => {
  // choose the representation that fits your integration
}}
```

### `FormData`

The rich form representation retains per-field information around values.

### `FormDataKeyValue`

A key/value-oriented representation suited to controlled/reset/load flows:

```ts
{
  name: 'Ada',
  age: 36,
}
```

### `FormDataSemiKeyValue`

The canonical data returned by `getData()`. It keeps ordinary field values concise while preserving useful nested/grouped structure:

```ts
{
  personal: {
    firstName: 'Ada',
    lastName: 'Lovelace',
  },
  acceptTerms: true,
}
```

See `FormDataControlledForm`, `FormDataKeyValueControlledForm`, `FormDataSemiKeyValueControlledForm`, and `HowToUseGroupDataKey` for concrete behavior.

## Examples / Playground

Start the playground with:

```bash
npm start
```

The playground uses a compact searchable example selector in a sticky toolbar instead of a horizontally scrolling tab strip. LTR and light mode are the defaults, and the toolbar includes explicit LTR/RTL and light/dark toggles so examples can be inspected in both directions and color schemes. A permanent inspector sits beside the selected example for form data, saved snapshots, tests, and performance history.

Useful examples include:

| Example | Demonstrates |
| --- | --- |
| `BasicForm` | broad field coverage, computed fields, conditional fields, cascades, uploads, and form actions |
| `BasicValidation` | required-field validation |
| `ControlledForm` | externally controlled form values |
| `FormData*ControlledForm` | the supported value representations |
| `CascadeComboBoxPlayground` | canonical `parentId`, custom metadata relationships, async options, and multi-value cascades |
| `ContainerWithTablePlayground` | form/table data and saved round selection |
| `FormDialog` | standalone and inline form dialogs |
| `TabsInForm` / `TabInTab` | flat and nested tab paths |
| `CustomWrappers` | custom wrapper renderers |
| `ReactAndJSONComponentTogether` | builder-created fields mixed with a custom React-controlled field |
| `HowToUseRuntime` | runtime bindings and runtime-driven values/options |
| `FormBenchMark` | large-form rendering/update benchmarks |

## Testing

The playground regression system uses **Playwright** for real browser rendering, interaction, form-output assertions, and visual regression.

Install dependencies and Chromium once:

```bash
npm install
npm run test:setup
```

Run the complete normal regression suite:

```bash
npm run test
```

Before Playwright starts, the repository checks that every visible manifest example owns both its regression and performance spec. Missing coverage fails the command instead of being silently ignored.

### Run one example

```bash
npm run test:example -- BasicForm
```

In the development playground, the inspector is always visible beside the example. Choose its **Tests** tab and use **Test This Example** to run the same real Playwright regression spec for only the selected example. Results stay inside the fixed inspector so failures do not resize the page. UI-triggered runs start an isolated Vite test server through Playwright, so they do not depend on the port used by the main playground. The Vite development endpoint accepts only known example IDs and the predefined regression/performance/visual-baseline operations; it never accepts arbitrary shell commands.

### Visual regression

Each regression spec captures its example stage using a deterministic Chromium configuration: fixed viewport, UTC timezone, light color scheme, reduced motion, disabled animations/transitions, hidden carets, and stable fonts.

Visual baselines live beside the owning example under its `test/screenshots/` directory. The current screenshot contract uses versioned `*.v2.png` baselines so older playground-layout snapshots cannot be mistaken for current expectations. The first per-example playground run automatically creates a genuinely missing v2 baseline and immediately reruns the test; an existing v2 baseline that changes still fails as a visual regression.

When a visual change is intentional, review the generated diff and approve only the selected example with the inspector's **Update Visual Baseline** action, or use:

```bash
npm run test:visual:example -- BasicForm
```

To update every approved baseline intentionally:

```bash
npm run test:visual:update
```

### Local form snapshots and reset verification

For examples that expose an `AtForm` ref, the permanent **Form Data** inspector can save the current form state to browser `localStorage` with **Take snapshot**. After changing the form, **Reset to snapshot & verify** restores the saved `FormDataSemiKeyValue` through `AtForm.reset(...)` and then compares the resulting `formData`, `formDataKeyValue`, and `formDataSemiKeyValue` against the saved snapshot. A mismatch is reported visibly so reset/load regressions are not hidden behind a field that merely looks correct.

When verification fails, **View diff** opens a non-disruptive dialog with a JSON-path comparison grouped by form-data format. Each mismatch is classified as changed, missing after restore, or unexpected after restore, with the saved and restored values shown side by side.

This snapshot is stored per example and survives page reloads until it is replaced or cleared.

## Performance Testing

Every visible example also owns a `*.performance.spec.ts` test. Performance checks use a warm-up followed by multiple measured browser runs and compare the median with an explicit threshold. Representative interactions wait for the resulting UI state so the measurement covers the behavior rather than only event dispatch.

Run all performance tests:

```bash
npm run test-performance
```

Run one example:

```bash
npm run test-performance:example -- BasicForm
```

The development playground's **Test Performance** control uses the same underlying per-example spec and displays measured medians, limits, and pass/fail status. Each completed browser run is also stored in `localStorage` per example (up to 20 runs), so the inspector shows recent performance history and percentage changes from the previous run.

Thresholds intentionally allow ordinary small timing noise while still failing on material regressions.

## Development

```bash
npm install
npm run test:setup
npm start
npm run test
npm run test-performance
npm run build
npm run lint
```

The repository uses Vite 8's native `resolve.tsconfigPaths` support and the official `@vitejs/plugin-react` integration. Playwright/process execution remains in development/test tooling outside `src/lib/`.

## Project Structure

```text
ATMaterialForm/
├── src/
│   ├── lib/                         # Core reusable ATMaterialForm library
│   ├── examples/
│   │   ├── exampleManifest.json    # Playground/test source of truth
│   │   ├── ExampleNavigation.tsx
│   │   ├── BasicForm/
│   │   │   ├── BasicForm.tsx
│   │   │   └── test/
│   │   │       ├── BasicForm.spec.ts
│   │   │       ├── BasicForm.performance.spec.ts
│   │   │       └── screenshots/
│   │   └── ...
│   ├── beta/                        # Beta demos keep adjacent test/ folders
│   └── testing/                     # Shared Playwright helpers + dev test UI
├── scripts/                         # Coverage checker and safe test runners/reporters
├── playwright.config.ts
├── vite.config.ts
└── package.json
```

`src/lib/` is the reusable library. The playground, browser specs, visual/performance helpers, and Node test runner stay outside it.

## Adding an Example

1. Add the example component under `src/examples/<ExampleName>/` (or keep a beta demo beside its existing implementation).
2. Add its entry to `src/examples/exampleManifest.json`.
3. Add `test/<ExampleName>.spec.ts`.
4. Add `test/<ExampleName>.performance.spec.ts`.
5. Run `npm run test` and `npm run test-performance`.

The coverage checker fails if a visible manifest example is missing either required spec.

## Contributing

Contributions are welcome. Keep changes focused, update or add the example that demonstrates the affected behavior, and add meaningful regression coverage for it. For intentional UI changes, review and update the corresponding visual baseline.

Before submitting a change, run the regression suite, performance suite, build, and lint commands above.

## Special Thanks

Special thanks to **Ahmadi3D** — a friend and collaborator whose contributions, ideas, and improvements have helped make ATMaterialForm better in many ways. Your work and support on this project are greatly appreciated.

## License

ATMaterialForm is licensed under the **ISC License**, matching the current package metadata.
