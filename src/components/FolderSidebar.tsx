"use client";

import type { VimeoFolder } from "../types";
import { extractIdFromUri } from "../utils/url";

export function FolderSidebar({
  folders,
  selectedFolderId,
  onSelect,
}: {
  folders: VimeoFolder[];
  selectedFolderId: string | undefined;
  onSelect: (id: string | undefined) => void;
}) {
  const navItemStyle = (active: boolean): React.CSSProperties => ({
    padding: "0.375rem 0.5rem",
    borderRadius: "4px",
    cursor: "pointer",
    width: "100%",
    textAlign: "left",
    border: "none",
    color: "inherit",
    fontSize: "0.8125rem",
    background: active ? "var(--theme-elevation-150)" : "transparent",
    fontWeight: active ? 600 : 400,
  });

  return (
    <div
      style={{
        width: "220px",
        flexShrink: 0,
        overflowY: "auto",
        borderRight: "1px solid var(--theme-elevation-150)",
        paddingRight: "1rem",
      }}
    >
      <button
        type="button"
        onClick={() => onSelect(undefined)}
        style={{
          ...navItemStyle(selectedFolderId === undefined),
          marginBottom: "0.75rem",
          fontWeight: 600,
        }}
      >
        All Videos
      </button>

      <p
        style={{
          fontWeight: 600,
          marginBottom: "0.375rem",
          fontSize: "0.6875rem",
          textTransform: "uppercase",
          opacity: 0.45,
          letterSpacing: "0.05em",
        }}
      >
        Folders
      </p>

      {folders.length === 0 && (
        <p
          style={{
            fontSize: "0.75rem",
            opacity: 0.4,
            padding: "0.25rem 0.5rem",
          }}
        >
          No folders
        </p>
      )}

      {folders.map((folder) => {
        const fid = extractIdFromUri(folder.uri);
        return (
          <button
            type="button"
            key={folder.uri}
            onClick={() => onSelect(fid)}
            style={{
              ...navItemStyle(selectedFolderId === fid),
              marginBottom: "1px",
            }}
          >
            {folder.name}
            <span style={{ opacity: 0.4, marginLeft: "0.375rem" }}>
              {folder.videoCount}
            </span>
          </button>
        );
      })}
    </div>
  );
}
