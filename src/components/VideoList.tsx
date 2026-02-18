"use client";

import type { VimeoVideo } from "../types";
import { formatDate, formatDuration, formatResolution } from "../utils/format";
import { extractIdFromUri } from "../utils/url";
import { SelectedBadge } from "./SelectedBadge";

const LIST_COLUMNS = "48px 1fr 80px 70px 100px";

function VideoListRow({
  video,
  isSelected,
  onSelect,
}: {
  video: VimeoVideo;
  isSelected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      style={{
        display: "grid",
        gridTemplateColumns: LIST_COLUMNS,
        gap: "0.5rem",
        padding: "0.5rem 0.75rem",
        alignItems: "center",
        width: "100%",
        textAlign: "left",
        border: "none",
        borderTop: "1px solid var(--theme-elevation-100)",
        cursor: "pointer",
        color: "inherit",
        fontSize: "0.8125rem",
        background: isSelected
          ? "var(--theme-success-100, rgba(0,200,100,0.08))"
          : "transparent",
      }}
    >
      <div
        style={{
          width: "48px",
          height: "28px",
          borderRadius: "3px",
          overflow: "hidden",
          background: "var(--theme-elevation-100)",
          flexShrink: 0,
        }}
      >
        {video.thumbnailUrl && (
          <img
            src={video.thumbnailUrl}
            alt=""
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        )}
      </div>
      <span
        style={{
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          fontWeight: isSelected ? 600 : 400,
        }}
      >
        {isSelected && <SelectedBadge position="inline" />}
        {video.name}
      </span>
      <span style={{ fontSize: "0.75rem", opacity: 0.7 }}>
        {formatDuration(video.duration)}
      </span>
      <span style={{ fontSize: "0.75rem", opacity: 0.7 }}>
        {formatResolution(video.width, video.height)}
      </span>
      <span style={{ fontSize: "0.75rem", opacity: 0.7 }}>
        {formatDate(video.modifiedTime)}
      </span>
    </button>
  );
}

export function VideoList({
  videos,
  currentVimeoId,
  onSelect,
}: {
  videos: VimeoVideo[];
  currentVimeoId: string;
  onSelect: (video: VimeoVideo) => void;
}) {
  return (
    <div
      style={{
        border: "1px solid var(--theme-elevation-150)",
        borderRadius: "4px",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: LIST_COLUMNS,
          gap: "0.5rem",
          padding: "0.5rem 0.75rem",
          background: "var(--theme-elevation-100)",
          fontSize: "0.6875rem",
          fontWeight: 600,
          textTransform: "uppercase",
          opacity: 0.6,
          letterSpacing: "0.04em",
        }}
      >
        <span />
        <span>Title</span>
        <span>Duration</span>
        <span>Format</span>
        <span>Modified</span>
      </div>
      {videos.map((video) => (
        <VideoListRow
          key={video.uri}
          video={video}
          isSelected={extractIdFromUri(video.uri) === currentVimeoId}
          onSelect={() => onSelect(video)}
        />
      ))}
    </div>
  );
}
