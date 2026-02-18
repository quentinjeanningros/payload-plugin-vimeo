"use client";

import { useRef, useState } from "react";
import { Upload } from "tus-js-client";

import type { VimeoVideo } from "../types";
import { buildVimeoEditUrl, extractIdFromUri } from "../utils/url";

type UploadPhase =
  | { phase: "idle" }
  | { phase: "uploading"; progress: number }
  | { phase: "processing" }
  | { phase: "error"; message: string };

async function pollVideo(videoId: string, maxAttempts = 30): Promise<VimeoVideo | null> {
  for (let i = 0; i < maxAttempts; i++) {
    await new Promise((r) => setTimeout(r, 3000));
    try {
      const res = await fetch(`/api/vimeo-videos/status?videoId=${videoId}`);
      const data = (await res.json()) as { video?: VimeoVideo; error?: string };
      if (data.video) return data.video;
    } catch (_) {
      /* keep polling */
    }
  }
  return null;
}

export function VideoUpload({
  selectedFolderId,
  onUploaded,
}: {
  selectedFolderId: string | undefined;
  onUploaded: (video: VimeoVideo) => void;
}) {
  const [state, setState] = useState<UploadPhase>({ phase: "idle" });
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const uploadRef = useRef<Upload | null>(null);

  const handleFile = async (file: File) => {
    setState({ phase: "uploading", progress: 0 });

    let initData: { uploadUrl: string; videoUri: string; error?: string };
    try {
      const res = await fetch("/api/vimeo-videos/upload-init", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: file.name.replace(/\.[^.]+$/, ""),
          size: file.size,
          folderId: selectedFolderId,
        }),
      });
      initData = await res.json();
    } catch (err) {
      setState({ phase: "error", message: String(err) });
      return;
    }

    if (initData.error) {
      setState({ phase: "error", message: initData.error });
      return;
    }

    const upload = new Upload(file, {
      uploadUrl: initData.uploadUrl,
      chunkSize: 128 * 1024 * 1024, // 128 MB chunks
      retryDelays: [0, 3000, 5000, 10000, 20000],
      onProgress(uploaded, total) {
        setState({ phase: "uploading", progress: uploaded / total });
      },
      onError(err) {
        uploadRef.current = null;
        setState({ phase: "error", message: String(err) });
      },
      onSuccess() {
        uploadRef.current = null;
        setState({ phase: "processing" });
        const videoId = extractIdFromUri(initData.videoUri);
        void pollVideo(videoId).then((video) => {
          if (video) {
            setState({ phase: "idle" });
            onUploaded(video);
            const editUrl = buildVimeoEditUrl(video.link, extractIdFromUri(video.uri));
            if (editUrl) window.open(editUrl, "_blank", "noopener,noreferrer");
          } else {
            setState({ phase: "error", message: "Processing timed out" });
          }
        });
      },
    });

    uploadRef.current = upload;
    upload.start();
  };

  const handleCancel = () => {
    uploadRef.current?.abort();
    uploadRef.current = null;
    setState({ phase: "idle" });
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) void handleFile(file);
    e.target.value = "";
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) void handleFile(file);
  };

  return (
    <div style={{ paddingTop: "1rem", borderTop: "1px solid var(--theme-elevation-150)" }}>
      <input
        ref={inputRef}
        type="file"
        accept="video/*"
        style={{ display: "none" }}
        onChange={onFileChange}
      />

      {state.phase === "idle" && (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={onDrop}
          style={{
            width: "100%",
            padding: "0.625rem 0.5rem",
            border: `1.5px dashed ${isDragging ? "var(--theme-success-500)" : "var(--theme-elevation-300)"}`,
            borderRadius: "6px",
            background: isDragging ? "var(--theme-success-100, rgba(0,200,100,0.06))" : "transparent",
            color: "var(--theme-text)",
            fontSize: "0.75rem",
            cursor: "pointer",
            textAlign: "center",
            transition: "border-color 0.15s, background 0.15s",
          }}
        >
          Upload to Vimeo
        </button>
      )}

      {state.phase === "uploading" && (
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.375rem", fontSize: "0.75rem" }}>
            <span>Uploading…</span>
            <span>{Math.round(state.progress * 100)}%</span>
          </div>
          <div style={{ height: "4px", background: "var(--theme-elevation-150)", borderRadius: "2px", overflow: "hidden" }}>
            <div
              style={{
                height: "100%",
                width: `${state.progress * 100}%`,
                background: "var(--theme-success-500)",
                transition: "width 0.2s",
              }}
            />
          </div>
          <button
            type="button"
            onClick={handleCancel}
            style={{
              marginTop: "0.5rem",
              fontSize: "0.6875rem",
              opacity: 0.5,
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "inherit",
              padding: 0,
            }}
          >
            Cancel
          </button>
        </div>
      )}

      {state.phase === "processing" && (
        <p style={{ fontSize: "0.75rem", opacity: 0.6, margin: 0, textAlign: "center" }}>
          Processing on Vimeo…
        </p>
      )}

      {state.phase === "error" && (
        <div>
          <p style={{ fontSize: "0.75rem", color: "var(--theme-error-500)", margin: "0 0 0.375rem" }}>
            {state.message}
          </p>
          <button
            type="button"
            onClick={() => setState({ phase: "idle" })}
            style={{
              fontSize: "0.6875rem",
              opacity: 0.6,
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "inherit",
              padding: 0,
            }}
          >
            Try again
          </button>
        </div>
      )}
    </div>
  );
}
