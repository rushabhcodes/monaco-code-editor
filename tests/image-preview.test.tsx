import { expect, test } from "bun:test"
import { renderToStaticMarkup } from "react-dom/server"
import { BinaryFilePreview } from "../src/components/BinaryFilePreview"
import type { EditorFile } from "../src/components/WorkspaceCodeEditor"
import { getImagePreviewUrl } from "../src/utils/getImagePreviewUrl"

const pngFile: EditorFile = {
  path: "assets/board.png",
  content: "blob:https://example.com/board-image",
  isBinary: true,
  downloadUrl: "https://example.com/download?file=board",
}

test("binary PNG preview uses already-fetched content instead of the authenticated download endpoint", () => {
  const markup = renderToStaticMarkup(<BinaryFilePreview file={pngFile} />)

  expect(markup).toContain(`src="${pngFile.content}"`)
  expect(markup).toContain('alt="assets/board.png"')
  expect(markup).toContain(`href="${pngFile.downloadUrl}"`)
  expect(markup).toContain('download="board.png"')
  expect(markup).not.toContain("This file cannot be displayed")
})

test("binary images support data URLs, uppercase extensions, and a download URL fallback", () => {
  const dataUrl = "data:image/png;base64,iVBORw0KGgo="
  expect(getImagePreviewUrl({ ...pngFile, content: dataUrl })).toBe(dataUrl)
  expect(getImagePreviewUrl({ ...pngFile, path: "BOARD.PNG" })).toBe(
    pngFile.content,
  )
  expect(getImagePreviewUrl({ ...pngFile, content: "" })).toBe(
    pngFile.downloadUrl!,
  )
})

test("blob-only images keep a usable download link", () => {
  const markup = renderToStaticMarkup(
    <BinaryFilePreview file={{ ...pngFile, downloadUrl: undefined }} />,
  )

  expect(markup).toContain(`src="${pngFile.content}"`)
  expect(markup).toContain(`href="${pngFile.content}"`)
})

test("unsupported binary files retain the binary notice and download link", () => {
  const file = { ...pngFile, path: "models/board.step" }
  const markup = renderToStaticMarkup(<BinaryFilePreview file={file} />)

  expect(getImagePreviewUrl(file)).toBeNull()
  expect(markup).toContain("This file cannot be displayed in the editor.")
  expect(markup).toContain(`href="${pngFile.downloadUrl}"`)
  expect(markup).not.toContain("<img")
})

test("images without a source fall back to the notice and text files stay editable", () => {
  const file = { ...pngFile, content: "", downloadUrl: undefined }
  const markup = renderToStaticMarkup(<BinaryFilePreview file={file} />)

  expect(getImagePreviewUrl(file)).toBeNull()
  expect(markup).toContain("Binary file")
  expect(markup).not.toContain("<img")
  expect(getImagePreviewUrl({ ...pngFile, isBinary: false })).toBeNull()
  expect(
    getImagePreviewUrl({
      ...pngFile,
      path: "board.svg",
      content: "<svg />",
      isBinary: false,
    }),
  ).toBeNull()
})
