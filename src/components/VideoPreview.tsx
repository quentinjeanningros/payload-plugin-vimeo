"use client";

export function VideoPreview({
  embedUrl,
  title,
}: {
  embedUrl: string;
  title: string;
}) {
  return (
    <div
      style={{
        position: "relative",
        paddingBottom: "56.25%",
        height: 0,
        overflow: "hidden",
        borderRadius: "4px",
      }}
    >
      <iframe
        src={embedUrl}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          border: 0,
          background: "#000",
        }}
        allow="autoplay; fullscreen; picture-in-picture"
        title={title}
      />
    </div>
  );
}
