export interface VimeoFolder {
  uri: string;
  name: string;
  videoCount: number;
}

export interface VimeoVideo {
  uri: string;
  name: string;
  description: string | null;
  duration: number;
  thumbnailUrl: string;
  embedHtml: string;
  playerEmbedUrl: string;
  link: string;
  width: number;
  height: number;
  modifiedTime: string | null;
}

export interface VimeoPluginOptions {
  accessToken?: string;
}
