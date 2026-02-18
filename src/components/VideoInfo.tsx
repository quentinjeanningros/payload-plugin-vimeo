"use client";

import { useFormFields } from "@payloadcms/ui";

import { formatDuration } from "../utils/format";

const labelStyle: React.CSSProperties = {
  fontSize: "0.6875rem",
  textTransform: "uppercase",
  fontWeight: 600,
  opacity: 0.5,
  letterSpacing: "0.04em",
};

const valueStyle: React.CSSProperties = {
  fontSize: "0.8125rem",
  wordBreak: "break-all",
};

export default function VideoInfo() {
  const vimeoId = useFormFields(([f]) => (f.vimeoId?.value as string) || "");
  const title = useFormFields(([f]) => (f.title?.value as string) || "");
  const description = useFormFields(
    ([f]) => (f.description?.value as string) || "",
  );
  const thumbnail = useFormFields(
    ([f]) => (f.thumbnail?.value as string) || "",
  );
  const playerEmbedUrl = useFormFields(
    ([f]) => (f.playerEmbedUrl?.value as string) || "",
  );
  const vimeoUrl = useFormFields(([f]) => (f.vimeoUrl?.value as string) || "");
  const duration = useFormFields(([f]) => (f.duration?.value as number) || 0);
  const width = useFormFields(([f]) => (f.width?.value as number) || 0);
  const height = useFormFields(([f]) => (f.height?.value as number) || 0);

  if (!vimeoId) {
    return (
      <p style={{ fontSize: "0.8125rem", opacity: 0.4, margin: 0 }}>
        No video selected
      </p>
    );
  }

  const rows: Array<{ label: string; value: string }> = [
    { label: "Vimeo ID", value: vimeoId },
    { label: "Title", value: title },
    { label: "Duration", value: duration ? formatDuration(duration) : "—" },
    {
      label: "Dimensions",
      value: width && height ? `${width} x ${height}` : "—",
    },
    { label: "Vimeo URL", value: vimeoUrl },
    { label: "Player URL", value: playerEmbedUrl },
    { label: "Thumbnail", value: thumbnail },
    { label: "Description", value: description || "—" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
      {rows.map((row) => (
        <div key={row.label}>
          <div style={labelStyle}>{row.label}</div>
          <div style={valueStyle}>{row.value}</div>
        </div>
      ))}
    </div>
  );
}
