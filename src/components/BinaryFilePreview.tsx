import { useState } from "react"
import { getImagePreviewUrl } from "../utils/getImagePreviewUrl"
import type { EditorFile } from "./WorkspaceCodeEditor"

export function BinaryFilePreview({ file }: { file: EditorFile }) {
  const imageUrl = getImagePreviewUrl(file)
  const [failedImageUrl, setFailedImageUrl] = useState<string | null>(null)
  const downloadUrl = file.downloadUrl || imageUrl

  if (!imageUrl || failedImageUrl === imageUrl) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-3 font-sans text-slate-500">
        <p className="font-semibold">
          {imageUrl ? "Image preview unavailable" : "Binary file"}
        </p>
        <p className="text-[13px]">
          {imageUrl
            ? "This image could not be loaded."
            : "This file cannot be displayed in the editor."}
        </p>
        {downloadUrl && <DownloadLink url={downloadUrl} path={file.path} />}
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col font-sans">
      <div
        className="min-h-0 flex-1 overflow-hidden"
        style={{
          backgroundColor: "#f8fafc",
          backgroundImage:
            "repeating-conic-gradient(#e2e8f0 0% 25%, transparent 0% 50%)",
          backgroundSize: "16px 16px",
        }}
      >
        <img
          src={imageUrl}
          alt={file.path}
          draggable={false}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
            padding: "16px",
          }}
          onError={() => setFailedImageUrl(imageUrl)}
        />
      </div>
      {downloadUrl && (
        <div className="flex shrink-0 justify-center border-t border-gray-200 p-2">
          <DownloadLink url={downloadUrl} path={file.path} />
        </div>
      )}
    </div>
  )
}

function DownloadLink({ url, path }: { url: string; path: string }) {
  return (
    <a
      href={url}
      download={path.split("/").pop()}
      className="text-sm text-blue-600 underline underline-offset-2 hover:text-blue-700"
    >
      Download file
    </a>
  )
}
