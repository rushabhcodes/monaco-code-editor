# monaco-code-editor

Standalone Monaco editor package for the tscircuit web editor.

## Styles

The `./styles.css` export is a precompiled, self-contained stylesheet —
consumers do not need Tailwind or any `content` configuration. It is generated
from `src/styles.lib.css` by `bun run build:css` and committed as
`src/styles.compiled.css`; CI fails if it is stale. `src/styles.css` is the
raw development entry used by the cosmos fixtures.

## Workspace editor

Product-specific controls such as component imports, authentication, and save
actions should be rendered outside `WorkspaceCodeEditor`. A small ref API lets
an external toolbar invoke editor commands without depending on Monaco.

```tsx
import { useRef } from "react"
import {
  WorkspaceCodeEditor,
  type WorkspaceCodeEditorHandle,
} from "@tscircuit/monaco-code-editor"
import "@tscircuit/monaco-code-editor/styles.css"

export function EditorPanel() {
  const editorRef = useRef<WorkspaceCodeEditorHandle>(null)

  return (
    <div className="editor-panel">
      <div className="editor-toolbar">
        <button onClick={() => editorRef.current?.formatDocument()}>
          Format
        </button>
        <button onClick={() => editorRef.current?.setSidebarOpen(true)}>
          Show files
        </button>
      </div>

      <WorkspaceCodeEditor
        enableTypeScriptLanguageService={true}
        ref={editorRef}
        files={files}
        currentFile={currentFile}
        isLoadingFiles={isLoadingFiles}
        loadingProgress={loadingProgress}
        onFileSelect={setCurrentFile}
        onFileContentChange={updateFile}
      />
    </div>
  )
}
```

The ref exposes:

- `focus()`
- `formatDocument()`
- `openQuickOpen()`
- `openWorkspaceSearch()`
- `revealLocation(path, line?, column?)`
- `setSidebarOpen(open)`

Press `Ctrl+P` or `Cmd+P` to fuzzy-search workspace files from the keyboard.
Press `Ctrl+Shift+F` or `Cmd+Shift+F` to find and replace text across files.

Binary image files (PNG, JPEG, GIF, WebP, AVIF, BMP, ICO, and SVG) open in an
image preview with a download link. Set `isBinary: true` and provide a blob URL
or image data URL in `content`, or a `downloadUrl` when no local URL is available.
Text SVG files remain editable. Other binary files show a download notice.

```tsx
const files: EditorFile[] = [
  {
    path: "board.png",
    content: URL.createObjectURL(pngBlob),
    isBinary: true,
    downloadUrl: "/files/board.png",
  },
  {
    path: "photo.jpg",
    content: "data:image/jpeg;base64,...",
    isBinary: true,
  },
]
```

The file loader owns blob URLs and should revoke them when they are no longer
needed. The preview prefers `content` so authenticated files do not need a
second download request.

Run `bun run dev` and open the `binary-files` fixtures to try PNG blob URLs,
JPEG data URLs, download URLs, failed and missing images, unsupported binary
files, and editable SVG source. Each fixture includes a file sidebar so you
can switch between images and code. Sample images are generated locally;
the examples do not need a network connection.
