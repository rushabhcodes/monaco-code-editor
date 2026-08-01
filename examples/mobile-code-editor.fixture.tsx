import "../src/styles.css"
import { CodeEditor } from "../src/components/CodeEditor"

const MOBILE_VIEWPORT = {
  width: 390,
  height: 844,
} as const

const exampleSource = `export default () => (
  <board width="24mm" height="18mm">
    <resistor
      name="R1"
      resistance="1k"
      footprint="0402"
      pcbX={-3}
    />
    <led
      name="LED1"
      footprint="0603"
      pcbX={3}
    />
    <trace from="net.VCC" to=".R1 > .pin1" />
    <trace from=".R1 > .pin2" to=".LED1 > .pos" />
    <trace from=".LED1 > .neg" to="net.GND" />
  </board>
)
`

export default function MobileCodeEditorFixture() {
  return (
    <main className="min-h-screen overflow-auto bg-slate-100 p-4">
      <div className="mx-auto w-fit">
        <p className="mb-2 font-mono text-xs text-slate-500">
          {MOBILE_VIEWPORT.width} × {MOBILE_VIEWPORT.height} px
        </p>
        <div
          className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg"
          style={MOBILE_VIEWPORT}
        >
          <CodeEditor
            defaultValue={exampleSource}
            enableTypeScriptLanguageService={false}
            height="100%"
            language="typescript"
            path="mobile-example.tsx"
            width="100%"
            options={{
              fontSize: 13,
              lineNumbersMinChars: 2,
              padding: { top: 12, bottom: 20 },
            }}
          />
        </div>
      </div>
    </main>
  )
}
