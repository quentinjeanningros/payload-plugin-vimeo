"use client";

import { useForm, useFormFields } from "@payloadcms/ui";
import { useEffect, useRef } from "react";

import { buildEmbedHtml } from "../utils/embed";

export default function EmbedComposer() {
  const { dispatchFields } = useForm();
  const prevHtmlRef = useRef("");

  const playerEmbedUrl = useFormFields(
    ([f]) => (f.playerEmbedUrl?.value as string) || "",
  );
  const width = useFormFields(([f]) => (f.width?.value as number) || 640);
  const height = useFormFields(([f]) => (f.height?.value as number) || 360);
  const title = useFormFields(([f]) => (f.title?.value as string) || "");
  const alt = useFormFields(([f]) => (f.alt?.value as string) || "");
  const autoplay = useFormFields(([f]) => !!f.autoplay?.value);
  const loop = useFormFields(([f]) => !!f.loop?.value);
  const muted = useFormFields(([f]) => !!f.muted?.value);
  const background = useFormFields(([f]) => !!f.background?.value);
  const controls = useFormFields(([f]) => f.controls?.value !== false);
  const dnt = useFormFields(([f]) => !!f.dnt?.value);

  const embedHtml = buildEmbedHtml({
    playerEmbedUrl,
    width,
    height,
    title,
    alt,
    autoplay,
    loop,
    muted,
    background,
    controls,
    dnt,
  });

  useEffect(() => {
    if (embedHtml && embedHtml !== prevHtmlRef.current) {
      prevHtmlRef.current = embedHtml;
      dispatchFields({
        type: "UPDATE",
        path: "embedHtml",
        value: embedHtml,
        valid: true,
      });
    }
  }, [embedHtml, dispatchFields]);

  if (!playerEmbedUrl) {
    return (
      <p style={{ fontSize: "0.8125rem", opacity: 0.4, margin: 0 }}>
        Select a video to generate embed code
      </p>
    );
  }

  return (
    <div>
      <div
        style={{
          fontSize: "0.6875rem",
          textTransform: "uppercase",
          fontWeight: 600,
          opacity: 0.5,
          letterSpacing: "0.04em",
          marginBottom: "0.375rem",
        }}
      >
        Generated Embed
      </div>
      <pre
        style={{
          fontSize: "0.6875rem",
          background: "var(--theme-elevation-100)",
          padding: "0.5rem",
          borderRadius: "3px",
          overflow: "auto",
          maxHeight: "8rem",
          whiteSpace: "pre-wrap",
          wordBreak: "break-all",
          margin: 0,
        }}
      >
        {embedHtml}
      </pre>
    </div>
  );
}
