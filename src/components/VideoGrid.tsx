"use client";

import type { VimeoVideo } from "../types";
import { formatDuration } from "../utils/format";
import { extractIdFromUri } from "../utils/url";
import { SelectedBadge } from "./SelectedBadge";

function VideoGridCard({
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
        cursor: "pointer",
        borderRadius: "4px",
        overflow: "hidden",
        border: isSelected
          ? "2px solid var(--theme-success-500)"
          : "1px solid var(--theme-elevation-150)",
        transition: "border-color 0.15s",
        padding: 0,
        color: "inherit",
        fontSize: "inherit",
        textAlign: "left",
        background: "transparent",
        width: "100%",
        position: "relative",
      }}
    >
      {isSelected && <SelectedBadge position="absolute" />}
      <div
        style={{
          position: "relative",
          paddingBottom: "56.25%",
          background: "var(--theme-elevation-100)",
        }}
      >
        {video.thumbnailUrl && (
          <img
            src={video.thumbnailUrl}
            alt={video.name}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        )}
        <span
          style={{
            position: "absolute",
            bottom: "4px",
            right: "4px",
            background: "rgba(0,0,0,0.75)",
            color: "#fff",
            padding: "2px 6px",
            borderRadius: "3px",
            fontSize: "0.75rem",
          }}
        >
          {formatDuration(video.duration)}
        </span>
      </div>
      <div style={{ padding: "0.5rem" }}>
        <p
          style={{
            margin: 0,
            fontWeight: 500,
            fontSize: "0.8125rem",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {video.name}
        </p>
      </div>
    </button>
  );
}

export function VideoGrid({
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
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
        gap: "1rem",
      }}
    >
      {videos.map((video) => (
        <VideoGridCard
          key={video.uri}
          video={video}
          isSelected={extractIdFromUri(video.uri) === currentVimeoId}
          onSelect={() => onSelect(video)}
        />
      ))}
    </div>
  );
}
