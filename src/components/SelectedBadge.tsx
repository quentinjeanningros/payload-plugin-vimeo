"use client";

export function SelectedBadge({
  position,
}: { position: "absolute" | "inline" }) {
  const base: React.CSSProperties = {
    background: "var(--theme-success-500)",
    color: "#fff",
    borderRadius: "3px",
    fontSize: position === "absolute" ? "0.6875rem" : "0.625rem",
    fontWeight: 600,
  };

  return position === "absolute" ? (
    <div
      style={{
        ...base,
        position: "absolute",
        top: "6px",
        left: "6px",
        zIndex: 2,
        padding: "2px 8px",
      }}
    >
      Current
    </div>
  ) : (
    <span style={{ ...base, padding: "1px 6px", marginRight: "0.5rem" }}>
      Current
    </span>
  );
}
