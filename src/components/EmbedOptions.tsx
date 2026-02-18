"use client";

import { CheckboxInput, useForm, useFormFields } from "@payloadcms/ui";

const SECTION_LABEL: React.CSSProperties = {
  fontSize: "0.6875rem",
  textTransform: "uppercase",
  fontWeight: 600,
  opacity: 0.5,
  letterSpacing: "0.04em",
  marginBottom: "0.375rem",
};

export default function EmbedOptions() {
  const { dispatchFields } = useForm();

  const autoplay = useFormFields(([f]) => !!f.autoplay?.value);
  const loop = useFormFields(([f]) => !!f.loop?.value);
  const muted = useFormFields(([f]) => !!f.muted?.value);
  const background = useFormFields(([f]) => !!f.background?.value);
  const controls = useFormFields(([f]) => f.controls?.value !== false);
  const dnt = useFormFields(([f]) => !!f.dnt?.value);

  const update = (path: string, value: boolean) => {
    dispatchFields({ type: "UPDATE", path, value, valid: true });
  };

  const handleBackground = (checked: boolean) => {
    update("background", checked);
    if (checked) {
      update("autoplay", true);
      update("loop", true);
      update("muted", true);
      update("controls", false);
    }
  };

  const handlePlayback = (field: string, checked: boolean) => {
    update(field, checked);
    if (!checked && background) update("background", false);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
      <div
        style={{
          display: "flex",
          alignItems: "start",
          gap: "1rem",
          width: "100%",
        }}
      >
        <CheckboxInput
          label="Background mode"
          checked={background}
          onToggle={() => handleBackground(!background)}
          name="background"
        />
        <div style={{ opacity: 0.35 }}>Autoplay, loop, muted, no controls</div>
      </div>

      <div>
        <div style={SECTION_LABEL}>Playback</div>
        <div style={{ display: "flex", gap: "2.5rem", flexWrap: "wrap" }}>
          <CheckboxInput
            label="Autoplay"
            checked={autoplay}
            onToggle={() => handlePlayback("autoplay", !autoplay)}
            name="autoplay"
          />
          <CheckboxInput
            label="Loop"
            checked={loop}
            onToggle={() => handlePlayback("loop", !loop)}
            name="loop"
          />
          <CheckboxInput
            label="Muted"
            checked={muted}
            onToggle={() => handlePlayback("muted", !muted)}
            name="muted"
          />
        </div>
      </div>

      <div>
        <div style={SECTION_LABEL}>Other</div>
        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
          <CheckboxInput
            label="Controls"
            checked={controls}
            onToggle={() => update("controls", !controls)}
            name="controls"
          />
          <CheckboxInput
            label="Do Not Track"
            checked={dnt}
            onToggle={() => update("dnt", !dnt)}
            name="dnt"
          />
        </div>
      </div>
    </div>
  );
}
