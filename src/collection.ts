import type { CollectionConfig } from "payload";
import type { VimeoPluginOptions } from "./types";
import { fetchFolders, fetchVideo, fetchVideos, initUpload } from "./vimeoApi";

export function vimeoVideosCollection(
  options?: VimeoPluginOptions,
): CollectionConfig {
  const getToken = () =>
    options?.accessToken || process.env.VIMEO_ACCESS_TOKEN || "";

  return {
    slug: "vimeo-videos",
    labels: {
      singular: "Video (Vimeo)",
      plural: "Videos (Vimeo)",
    },
    admin: {
      useAsTitle: "title",
      defaultColumns: ["title", "vimeoId", "duration"],
      group: options?.group !== undefined ? options.group : "Vimeo",
    },
    access: {
      read: () => true,
    },
    fields: [
      {
        name: "vimeoBrowser",
        type: "ui",
        admin: {
          components: {
            Field: "payload-plugin-vimeo/dist/components/VimeoBrowser",
          },
        },
      },
      {
        name: "title",
        type: "text",
        localized: true,
        required: true,
        admin: {
          description: "Video title, used as iframe title attribute",
        },
      },
      {
        name: "alt",
        type: "text",
        required: true,
        localized: true,
        admin: {
          description: "Alt text for accessibility",
        },
      },
      {
        name: "embedOptions",
        type: "ui",
        admin: {
          components: {
            Field: "payload-plugin-vimeo/dist/components/EmbedOptions",
          },
        },
      },
      {
        name: "autoplay",
        type: "checkbox",
        defaultValue: true,
        admin: { hidden: true },
      },
      {
        name: "loop",
        type: "checkbox",
        defaultValue: true,
        admin: { hidden: true },
      },
      {
        name: "muted",
        type: "checkbox",
        defaultValue: true,
        admin: { hidden: true },
      },
      {
        name: "background",
        type: "checkbox",
        defaultValue: false,
        admin: { hidden: true },
      },
      {
        name: "controls",
        type: "checkbox",
        defaultValue: true,
        admin: { hidden: true },
      },
      {
        name: "dnt",
        type: "checkbox",
        defaultValue: false,
        admin: { hidden: true },
      },
      // Hidden metadata fields
      {
        name: "vimeoId",
        type: "text",
        required: true,
        unique: true,
        admin: { hidden: true },
      },
      {
        name: "embedHtml",
        type: "code",
        admin: { hidden: true, language: "html" },
      },
      {
        name: "playerEmbedUrl",
        type: "text",
        admin: { hidden: true },
      },
      {
        name: "vimeoUrl",
        type: "text",
        admin: { hidden: true },
      },
      {
        name: "thumbnail",
        type: "text",
        admin: { hidden: true },
      },
      {
        name: "description",
        type: "textarea",
        admin: { hidden: true },
      },
      {
        name: "duration",
        type: "number",
        admin: { hidden: true },
      },
      {
        name: "width",
        type: "number",
        admin: { hidden: true },
      },
      {
        name: "height",
        type: "number",
        admin: { hidden: true },
      },
      // Sidebar
      {
        type: "ui",
        name: "videoInfo",
        admin: {
          position: "sidebar",
          components: {
            Field: "payload-plugin-vimeo/dist/components/VideoInfo",
          },
        },
      },
      {
        type: "ui",
        name: "embedComposer",
        admin: {
          position: "sidebar",
          components: {
            Field: "payload-plugin-vimeo/dist/components/EmbedComposer",
          },
        },
      },
    ],
    endpoints: [
      {
        path: "/folders",
        method: "get",
        handler: async () => {
          const token = getToken();
          if (!token) {
            return Response.json(
              { error: "VIMEO_ACCESS_TOKEN is not configured" },
              { status: 500 },
            );
          }
          try {
            const result = await fetchFolders(token);
            return Response.json(result);
          } catch (error) {
            return Response.json({ error: String(error) }, { status: 502 });
          }
        },
      },
      {
        path: "/browse",
        method: "get",
        handler: async (req) => {
          const token = getToken();
          if (!token) {
            return Response.json(
              { error: "VIMEO_ACCESS_TOKEN is not configured" },
              { status: 500 },
            );
          }
          const url = new URL(req.url || "", "http://localhost");
          const folderId = url.searchParams.get("folderId") || undefined;
          const page = Number(url.searchParams.get("page")) || 1;

          try {
            const result = await fetchVideos(token, folderId, page);
            return Response.json(result);
          } catch (error) {
            return Response.json({ error: String(error) }, { status: 502 });
          }
        },
      },
      {
        path: "/upload-init",
        method: "post",
        handler: async (req) => {
          const token = getToken();
          if (!token) {
            return Response.json(
              { error: "VIMEO_ACCESS_TOKEN is not configured" },
              { status: 500 },
            );
          }
          try {
            const body = (await req.json!()) as {
              name: string;
              size: number;
              folderId?: string;
            };
            const result = await initUpload(
              token,
              body.name,
              body.size,
              body.folderId,
            );
            return Response.json(result);
          } catch (error) {
            return Response.json({ error: String(error) }, { status: 502 });
          }
        },
      },
      {
        path: "/status",
        method: "get",
        handler: async (req) => {
          const token = getToken();
          if (!token) {
            return Response.json(
              { error: "VIMEO_ACCESS_TOKEN is not configured" },
              { status: 500 },
            );
          }
          const url = new URL(req.url || "", "http://localhost");
          const videoId = url.searchParams.get("videoId");
          if (!videoId) {
            return Response.json(
              { error: "videoId is required" },
              { status: 400 },
            );
          }
          try {
            const video = await fetchVideo(token, videoId);
            return Response.json({ video });
          } catch (error) {
            return Response.json({ error: String(error) }, { status: 502 });
          }
        },
      },
    ],
  };
}
