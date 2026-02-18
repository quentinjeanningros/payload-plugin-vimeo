import type { Plugin } from "payload";
import { vimeoVideosCollection } from "./collection";
import type { VimeoPluginOptions } from "./types";

export const vimeoPlugin =
  (options?: VimeoPluginOptions): Plugin =>
  (incomingConfig) => {
    return {
      ...incomingConfig,
      collections: [
        ...(incomingConfig.collections || []),
        vimeoVideosCollection(options),
      ],
    };
  };

export type { VimeoFolder, VimeoVideo, VimeoPluginOptions } from "./types";
