"use client";

import { GridViewIcon } from "@payloadcms/ui";

export function VideoPlaceholder({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        position: "relative",
        width: "100%",
        paddingBottom: "56.25%",
        background: "var(--theme-elevation-100)",
        border: "1px dashed var(--theme-elevation-300)",
        borderRadius: "4px",
        cursor: "pointer",
        display: "block",
      }}
    >
      <span
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "0.5rem",
          color: "var(--theme-elevation-500)",
          fontSize: "0.875rem",
        }}
      >
        <GridViewIcon />
        Browse Videos
      </span>
    </button>
  );
}
