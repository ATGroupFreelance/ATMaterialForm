// src/components/FormBenchmark.tsx
import React, { useMemo, useRef, useState } from "react";
import { ATForm, formBuilder } from "@/lib"; // adjust path if needed

type Mode = "reset" | "manual";
type Target = "simple" | "nested";
type ValueFormat = "FormData" | "FormDataKeyValue" | "FormDataSemiKeyValue";

function buildSimpleFields(numFields: number) {
    const arr: any[] = [];
    for (let i = 0; i < numFields; i++) arr.push(formBuilder.createTextBox({ id: `field${i}`, size: 6 }));
    return arr;
}
function buildNestedForms(numForms: number, fieldsPerForm: number) {
    const arr: any[] = [];
    for (let f = 0; f < numForms; f++) {
        const elems: any[] = [];
        for (let i = 0; i < fieldsPerForm; i++) elems.push(formBuilder.createTextBox({ id: `form${f}.field${i}`, size: 6 }));
        arr.push(formBuilder.createForm({ id: `Form${f}`, size: 12 }, { elements: elems }));
    }
    return arr;
}

function buildPayload(format: ValueFormat, iter: number, isSimple: boolean, numFields: number, numForms: number, fieldsPerForm: number) {
    if (format === "FormData") {
        const p: Record<string, any> = {};
        if (isSimple) {
            for (let i = 0; i < numFields; i++) p[`field${i}`] = { value: `v_${iter}_${i}` };
        } else {
            for (let f = 0; f < numForms; f++)
                for (let i = 0; i < fieldsPerForm; i++) p[`form${f}.field${i}`] = { value: `v_${iter}_${f}_${i}` };
        }
        return p;
    } else {
        const p: Record<string, any> = {};
        if (isSimple) for (let i = 0; i < numFields; i++) p[`field${i}`] = `v_${iter}_${i}`;
        else for (let f = 0; f < numForms; f++) for (let i = 0; i < fieldsPerForm; i++) p[`form${f}.field${i}`] = `v_${iter}_${f}_${i}`;
        return p;
    }
}

const avg = (a: number[]) => (a.length ? a.reduce((s, v) => s + v, 0) / a.length : 0);
const btnStyle: React.CSSProperties = { padding: "8px 10px", borderRadius: 8, border: "1px solid #d6e9ff", background: "linear-gradient(180deg,#f7fbff,#eef7ff)", cursor: "pointer", fontWeight: 600 };

export default function FormBenchmark() {
    // Controls
    const [numFields, setNumFields] = useState<number>(200);
    const [numForms, setNumForms] = useState<number>(20);
    const [fieldsPerForm, setFieldsPerForm] = useState<number>(10);
    const [iterations, setIterations] = useState<number>(20);
    const [includeOnChange, setIncludeOnChange] = useState<boolean>(true);
    const [valueFormat, setValueFormat] = useState<ValueFormat>("FormDataSemiKeyValue");

    // Typing test controls
    const [typingFieldId, setTypingFieldId] = useState<string>("field0");
    const [charsPerSecond, setCharsPerSecond] = useState<number>(60);
    const [typingLength, setTypingLength] = useState<number>(60);
    const [typingRuns, setTypingRuns] = useState<number>(3);

    // Forms & refs
    const refSimple = useRef<any>(null);
    const [valueSimple, setValueSimple] = useState<any>({});
    const refNested = useRef<any>(null);
    const [valueNested, setValueNested] = useState<any>({});

    // memoized fields
    const simpleFields = useMemo(() => buildSimpleFields(numFields), [numFields]);
    const nestedFields = useMemo(() => buildNestedForms(numForms, fieldsPerForm), [numForms, fieldsPerForm]);

    // results
    type ResultsShape = { reset: number[]; manual: number[] };
    const [results, setResults] = useState<{ simple: ResultsShape; nested: ResultsShape }>({
        simple: { reset: [], manual: [] },
        nested: { reset: [], manual: [] },
    });

    // typing results & progress
    const [typingResults, setTypingResults] = useState<{ target: Target; runs: number[] }[]>([]);
    const [typingBusy, setTypingBusy] = useState<boolean>(false);

    // Refs used for onChange capture & async matching
    // Queue of dispatch timestamps (one per dispatched keystroke)
    const pendingDispatchTimesRef = useRef<number[]>([]);
    // Collected measured latencies (in ms), appended as onChange events arrive
    const collectedOnChangeLatenciesRef = useRef<number[]>([]);
    // simple boolean to indicate we're in a typing session
    const typingSessionActiveRef = useRef<boolean>(false);

    const waitForRender = async (extraMs = 20) => {
        await new Promise<void>((res) => requestAnimationFrame(() => requestAnimationFrame(() => res())));
        if (extraMs > 0) await new Promise((r) => setTimeout(r, extraMs));
    };

    // Utility to find input element robustly
    function findInputElement(fieldId: string): HTMLInputElement | null {
        const byId = document.getElementById(fieldId) as HTMLInputElement | null;
        if (byId && byId instanceof HTMLInputElement) return byId;

        const byName = document.querySelector<HTMLInputElement>(`input[name="${fieldId}"], input[aria-label="${fieldId}"]`);
        if (byName) return byName;

        const byAttr = document.querySelector<HTMLInputElement>(`[id="${fieldId}"]`);
        if (byAttr && byAttr instanceof HTMLInputElement) return byAttr;

        const container = document.querySelector("#__atform_benchmark_root") || document.body;
        const firstInput = container.querySelector<HTMLInputElement>("input:not([type=hidden])");
        return firstInput ?? null;
    }

    // runReset/manual benchmark (unchanged)
    const runTest = async (target: Target, mode: Mode) => {
        const isSimple = target === "simple";
        const ref = isSimple ? refSimple : refNested;
        const setState = isSimple ? setValueSimple : setValueNested;
        const totalFields = isSimple ? numFields : numForms * fieldsPerForm;

        // warm up (small)
        for (let w = 0; w < 3; w++) {
            const payload = buildPayload(valueFormat, -1, isSimple, numFields, numForms, fieldsPerForm);
            if (mode === "reset") {
                ref.current?.reset?.({
                    inputDefaultValue: payload,
                    inputDefaultValueFormat: valueFormat === "FormData" ? "FormData" : valueFormat,
                    suppressFormOnChange: !includeOnChange,
                });
            } else {
                setState((p: any) => ({ ...p, ...payload }));
            }
            await waitForRender(10);
        }

        const samples: number[] = [];
        for (let iter = 0; iter < iterations; iter++) {
            const payload = buildPayload(valueFormat, iter, isSimple, numFields, numForms, fieldsPerForm);
            const t0 = performance.now();
            if (mode === "reset") {
                ref.current?.reset?.({
                    inputDefaultValue: payload,
                    inputDefaultValueFormat: valueFormat === "FormData" ? "FormData" : valueFormat,
                    suppressFormOnChange: !includeOnChange,
                });
            } else {
                setState((prev: any) => ({ ...prev, ...payload }));
            }
            await waitForRender(20);
            const t1 = performance.now();
            samples.push(t1 - t0);

            setResults((prev) => {
                const copy = { ...prev };
                copy[target] = { ...copy[target], [mode]: [...copy[target][mode], t1 - t0] };
                return copy;
            });
        }

        console.log(`[Benchmark] target=${target} mode=${mode} format=${valueFormat} fields=${totalFields}`, samples);
        return samples;
    };

    // ========== TYPING: non-blocking capture + async matching ==========

    const dispatchKeystroke = (input: HTMLInputElement, ch: string) => {
        try {
            input.focus();

            input.dispatchEvent(new KeyboardEvent("keydown", { key: ch, bubbles: true, cancelable: true }));
            input.dispatchEvent(new KeyboardEvent("keypress", { key: ch, bubbles: true, cancelable: true }));

            const nativeSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value")?.set;
            const prev = input.value || "";
            const newVal = prev + ch;
            if (nativeSetter) nativeSetter.call(input, newVal);
            else input.value = newVal;

            try {
                input.setSelectionRange(newVal.length, newVal.length);
            } catch {
                // ignore
            }

            if (typeof (window as any).InputEvent === "function") {
                input.dispatchEvent(new (window as any).InputEvent("input", { data: ch, bubbles: true, cancelable: true, inputType: "insertText" }));
            } else {
                input.dispatchEvent(new Event("input", { bubbles: true, cancelable: true }));
            }

            input.dispatchEvent(new Event("change", { bubbles: true }));

            input.dispatchEvent(new KeyboardEvent("keyup", { key: ch, bubbles: true, cancelable: true }));
        } catch {
            // fallback: avoid creating an unused error binding
            input.value = (input.value || "") + ch;
            input.dispatchEvent(new Event("input", { bubbles: true }));
        }
    };

    // run a single typing pass (target param intentionally unused)
    const runSingleTyping = async (target: Target) => {
        void target;

        const input = findInputElement(typingFieldId);
        if (!input) {
            alert(`Could not find input with id/name "${typingFieldId}". Ensure field exists and is rendered.`);
            return null;
        }

        const text = Array.from({ length: typingLength }).map((_, i) => String.fromCharCode(97 + (i % 26))).join("");
        const intervalMs = Math.max(1, Math.round(1000 / Math.max(1, charsPerSecond)));
        const samples: number[] = [];

        pendingDispatchTimesRef.current = [];
        collectedOnChangeLatenciesRef.current = [];
        typingSessionActiveRef.current = true;
        await waitForRender(5);

        for (let i = 0; i < text.length; i++) {
            const ch = text[i];
            const tDispatch = performance.now();

            dispatchKeystroke(input, ch);

            if (includeOnChange) {
                pendingDispatchTimesRef.current.push(tDispatch);
            } else {
                await waitForRender(0);
                samples.push(performance.now() - tDispatch);
            }

            await new Promise((r) => setTimeout(r, intervalMs));
        }

        const maxWaitAfterTypingMs = 800;
        const pollIntervalMs = 20;
        const startCollectWait = performance.now();
        while (includeOnChange && pendingDispatchTimesRef.current.length > 0 && performance.now() - startCollectWait < maxWaitAfterTypingMs) {
            await new Promise((r) => setTimeout(r, pollIntervalMs));
        }

        if (includeOnChange) {
            const collected = collectedOnChangeLatenciesRef.current.slice();
            const missing = Math.max(0, text.length - collected.length);
            let fillValue = intervalMs;
            if (collected.length) fillValue = Math.round(collected.reduce((s, v) => s + v, 0) / collected.length);
            const filled = collected.concat(Array.from({ length: missing }).map(() => fillValue));
            samples.push(...filled);
        }

        pendingDispatchTimesRef.current = [];
        collectedOnChangeLatenciesRef.current = [];
        typingSessionActiveRef.current = false;

        return samples;
    };

    // run typing test multiple times
    const runTypingTest = async (target: Target) => {
        if (typingBusy) return;
        setTypingBusy(true);
        const runs: number[] = [];
        for (let r = 0; r < typingRuns; r++) {
            const input = findInputElement(typingFieldId);
            if (input) {
                const nativeSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value")?.set;
                if (nativeSetter) nativeSetter.call(input, "");
                else input.value = "";
                input.dispatchEvent(new Event("input", { bubbles: true }));
            }
            await waitForRender(10);
            const samples = await runSingleTyping(target);
            if (samples && samples.length) runs.push(avg(samples));
            await waitForRender(50);
        }

        setTypingResults((prev) => [{ target, runs }, ...prev].slice(0, 20));
        setTypingBusy(false);
    };

    // no parameter because we don't use the payload
    const onFormChangeCapture = () => {
        const now = performance.now();

        if (pendingDispatchTimesRef.current.length > 0) {
            const tDispatch = pendingDispatchTimesRef.current.shift() as number;
            const delta = now - tDispatch;
            collectedOnChangeLatenciesRef.current.push(delta);
        }

        // do not forward to outer listeners inside benchmark
    };

    const renderStats = (arr: number[]) => {
        if (!arr || arr.length === 0) return <div style={{ color: "#666" }}>No runs</div>;
        const average = avg(arr);
        const min = Math.min(...arr);
        const max = Math.max(...arr);
        return (
            <div style={{ fontSize: 13 }}>
                <div>Avg: <strong>{average.toFixed(1)} ms</strong></div>
                <div style={{ color: "#555" }}>Min: {min.toFixed(1)} ms — Max: {max.toFixed(1)} ms</div>
                <div style={{ marginTop: 8, maxHeight: 120, overflow: "auto", background: "#fbfdff", padding: 8, borderRadius: 6 }}>
                    <small>Samples: {arr.map((v) => v.toFixed(1)).join(", ")}</small>
                </div>
            </div>
        );
    };

    const renderTypingSummary = () => {
        if (!typingResults.length) return <div style={{ color: "#666" }}>No typing runs yet</div>;
        return (
            <div style={{ display: "grid", gap: 10 }}>
                {typingResults.map((r, idx) => {
                    const a = avg(r.runs);
                    return (
                        <div key={idx} style={{ padding: 8, borderRadius: 8, background: "#fff", border: "1px solid #eef6ff" }}>
                            <div style={{ display: "flex", justifyContent: "space-between" }}>
                                <div><strong>{r.target.toUpperCase()} typing</strong></div>
                                <div style={{ color: "#555" }}>{r.runs.length} runs — Avg: <strong>{a.toFixed(1)}ms</strong></div>
                            </div>
                            <div style={{ marginTop: 8 }}>
                                <small>Run avgs: {r.runs.map(n => n.toFixed(1)).join(", ")}</small>
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    };

    // Build fields once (recomputed when inputs change via useMemo above)
    return (
        <div id="__atform_benchmark_root" style={{ fontFamily: "Inter, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial", padding: 20, display: "grid", gridTemplateColumns: "380px 1fr", gap: 20, maxWidth: 1200, margin: "0 auto" }}>
            <aside style={{ border: "1px solid #e6eef8", padding: 16, borderRadius: 10, background: "linear-gradient(180deg,#ffffff,#fbfdff)" }}>
                <h3 style={{ marginTop: 0 }}>Benchmark Controls</h3>

                <label style={{ display: "block", marginBottom: 8 }}>
                    NUM_FIELDS (simple):
                    <input type="number" value={numFields} onChange={(e) => setNumFields(Number(e.target.value))} style={{ width: "100%", padding: 6, marginTop: 6 }} />
                </label>

                <label style={{ display: "block", marginBottom: 8 }}>
                    NUM_FORMS (nested):
                    <input type="number" value={numForms} onChange={(e) => setNumForms(Number(e.target.value))} style={{ width: "100%", padding: 6, marginTop: 6 }} />
                </label>

                <label style={{ display: "block", marginBottom: 8 }}>
                    FIELDS_PER_FORM (nested):
                    <input type="number" value={fieldsPerForm} onChange={(e) => setFieldsPerForm(Number(e.target.value))} style={{ width: "100%", padding: 6, marginTop: 6 }} />
                </label>

                <label style={{ display: "block", marginBottom: 8 }}>
                    ITERATIONS:
                    <input type="number" value={iterations} onChange={(e) => setIterations(Number(e.target.value))} style={{ width: "100%", padding: 6, marginTop: 6 }} />
                </label>

                <label style={{ display: "block", marginBottom: 12 }}>
                    Value format:
                    <select value={valueFormat} onChange={(e) => setValueFormat(e.target.value as ValueFormat)} style={{ width: "100%", padding: 8, marginTop: 6 }}>
                        <option value="FormDataSemiKeyValue">FormDataSemiKeyValue</option>
                        <option value="FormDataKeyValue">FormDataKeyValue</option>
                        <option value="FormData">FormData (rich)</option>
                    </select>
                </label>

                <label style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                    <input type="checkbox" checked={includeOnChange} onChange={(e) => setIncludeOnChange(e.target.checked)} /> Include props.onChange emission (recommended for typing test)
                </label>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 8 }}>
                    <button onClick={() => runTest("simple", "reset")} style={btnStyle}>Simple: Reset</button>
                    <button onClick={() => runTest("simple", "manual")} style={btnStyle}>Simple: Manual</button>
                    <button onClick={() => runTest("nested", "reset")} style={btnStyle}>Nested: Reset</button>
                    <button onClick={() => runTest("nested", "manual")} style={btnStyle}>Nested: Manual</button>
                </div>

                <div style={{ marginTop: 12 }}>
                    <button onClick={() => { setResults({ simple: { reset: [], manual: [] }, nested: { reset: [], manual: [] } }); setTypingResults([]); }} style={{ ...btnStyle, background: "#fff6f6", color: "#7a1212", borderColor: "#ffdfdf" }}>Clear results</button>
                </div>

                <hr style={{ margin: "12px 0" }} />

                <h4 style={{ margin: "6px 0 10px" }}>Typing test</h4>
                <label style={{ display: "block", marginBottom: 8 }}>
                    Field id to type into:
                    <input value={typingFieldId} onChange={(e) => setTypingFieldId(e.target.value)} style={{ width: "100%", padding: 6, marginTop: 6 }} />
                    <div style={{ fontSize: 12, color: "#666", marginTop: 6 }}>If your TextBox forwards id correctly this will be the DOM input id (e.g. <code>field0</code> or <code>form0.field0</code>).</div>
                </label>

                <label style={{ display: "block", marginBottom: 8 }}>
                    Chars per run:
                    <input type="number" value={typingLength} onChange={(e) => setTypingLength(Number(e.target.value))} style={{ width: "100%", padding: 6, marginTop: 6 }} />
                </label>

                <label style={{ display: "block", marginBottom: 8 }}>
                    Typing speed (chars/sec):
                    <input type="number" value={charsPerSecond} onChange={(e) => setCharsPerSecond(Number(e.target.value))} style={{ width: "100%", padding: 6, marginTop: 6 }} />
                </label>

                <label style={{ display: "block", marginBottom: 8 }}>
                    Runs:
                    <input type="number" value={typingRuns} onChange={(e) => setTypingRuns(Number(e.target.value))} style={{ width: "100%", padding: 6, marginTop: 6 }} />
                </label>

                <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                    <button disabled={typingBusy} onClick={() => runTypingTest("simple")} style={btnStyle}>{typingBusy ? "Running..." : "Typing (simple)"}</button>
                    <button disabled={typingBusy} onClick={() => runTypingTest("nested")} style={btnStyle}>{typingBusy ? "Running..." : "Typing (nested)"}</button>
                </div>

                <div style={{ marginTop: 12 }}>
                    <strong>Typing recordings</strong>
                    <div style={{ marginTop: 8 }}>{renderTypingSummary()}</div>
                </div>
            </aside>

            <main style={{ display: "grid", gridTemplateRows: "auto 1fr", gap: 16 }}>
                <section style={{ display: "flex", gap: 12 }}>
                    <div style={{ flex: 1, borderRadius: 10, border: "1px solid #eef6ff", padding: 12, background: "#ffffff" }}>
                        <h4 style={{ margin: "6px 0 10px" }}>Simple Form under test (flat fields)</h4>
                        <div style={{ height: 360, overflow: "auto", padding: 8, border: "1px dashed #f0f6ff", borderRadius: 8 }}>
                            <ATForm ref={refSimple} onChange={onFormChangeCapture} value={valueSimple} valueFormat={valueFormat}>
                                {simpleFields}
                            </ATForm>
                        </div>
                    </div>

                    <div style={{ flex: 1, borderRadius: 10, border: "1px solid #eef6ff", padding: 12, background: "#ffffff" }}>
                        <h4 style={{ margin: "6px 0 10px" }}>Nested Form under test (forms containing fields)</h4>
                        <div style={{ height: 360, overflow: "auto", padding: 8, border: "1px dashed #f0f6ff", borderRadius: 8 }}>
                            <ATForm ref={refNested} onChange={onFormChangeCapture} value={valueNested} valueFormat={valueFormat}>
                                {nestedFields}
                            </ATForm>
                        </div>
                    </div>
                </section>

                <section style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                    <div style={{ borderRadius: 10, padding: 12, background: "#fff", border: "1px solid #f0f7ff" }}>
                        <h4 style={{ marginTop: 0 }}>Simple form results</h4>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                            <div>
                                <strong>Reset</strong>
                                <div style={{ marginTop: 8 }}>{renderStats(results.simple.reset)}</div>
                            </div>
                            <div>
                                <strong>manual setState</strong>
                                <div style={{ marginTop: 8 }}>{renderStats(results.simple.manual)}</div>
                            </div>
                        </div>
                    </div>

                    <div style={{ borderRadius: 10, padding: 12, background: "#fff", border: "1px solid #f0f7ff" }}>
                        <h4 style={{ marginTop: 0 }}>Nested form results</h4>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                            <div>
                                <strong>Reset</strong>
                                <div style={{ marginTop: 8 }}>{renderStats(results.nested.reset)}</div>
                            </div>
                            <div>
                                <strong>manual setState</strong>
                                <div style={{ marginTop: 8 }}>{renderStats(results.nested.manual)}</div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}
