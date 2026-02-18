import { defineConfig } from "tsup";

export default defineConfig({
  entry: [
    "src/index.ts",
    "src/components/VimeoBrowser.tsx",
    "src/components/VideoPreview.tsx",
    "src/components/VideoPlaceholder.tsx",
    "src/components/VideoGrid.tsx",
    "src/components/VideoList.tsx",
    "src/components/SelectedBadge.tsx",
    "src/components/FolderSidebar.tsx",
    "src/components/EmbedOptions.tsx",
    "src/components/EmbedComposer.tsx",
    "src/components/VideoInfo.tsx",
    "src/components/VideoUpload.tsx",
  ],
  format: ["esm"],
  dts: true,
  sourcemap: true,
  injectStyle: true,
  external: ["react", "react-dom", "payload", "@payloadcms/ui"],
  outDir: "dist",
  outExtension: () => ({ js: ".js" }),
});
