import type { VimeoFolder, VimeoVideo } from "./types";
import { extractIdFromUri } from "./utils/url";

const VIMEO_API = "https://api.vimeo.com";

function headers(token: string): HeadersInit {
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
    Accept: "application/vnd.vimeo.*+json;version=3.4",
  };
}

interface VimeoApiFolderItem {
  uri: string;
  name: string;
  metadata?: {
    connections?: {
      videos?: { total?: number };
    };
  };
}

interface VimeoApiVideoItem {
  uri: string;
  name: string;
  description: string | null;
  duration: number;
  pictures?: {
    sizes?: Array<{ link: string; width: number }>;
  };
  embed?: { html?: string };
  player_embed_url?: string;
  link: string;
  width: number;
  height: number;
  modified_time?: string | null;
}

interface VimeoPaginatedResponse<T> {
  total: number;
  page: number;
  per_page: number;
  data: T[];
}

function mapFolder(item: VimeoApiFolderItem): VimeoFolder {
  return {
    uri: item.uri,
    name: item.name,
    videoCount: item.metadata?.connections?.videos?.total ?? 0,
  };
}

function extractSrcFromEmbedHtml(html: string): string {
  const match = html.match(/src="([^"]+)"/);
  return match ? match[1] : "";
}

function mapVideo(item: VimeoApiVideoItem): VimeoVideo {
  const videoId = extractIdFromUri(item.uri);
  const sizes = item.pictures?.sizes ?? [];
  const thumbnail = sizes.length > 0 ? sizes[sizes.length - 1].link : "";
  const embedHtml = item.embed?.html ?? "";

  // Use player_embed_url from API (includes hash for private/unlisted videos),
  // fall back to extracting from embed HTML, then bare URL as last resort.
  const playerEmbedUrl =
    item.player_embed_url ||
    extractSrcFromEmbedHtml(embedHtml) ||
    `https://player.vimeo.com/video/${videoId}`;

  return {
    uri: item.uri,
    name: item.name,
    description: item.description,
    duration: item.duration,
    thumbnailUrl: thumbnail,
    embedHtml,
    playerEmbedUrl,
    link: item.link,
    width: item.width,
    height: item.height,
    modifiedTime: item.modified_time ?? null,
  };
}

export async function fetchFolders(
  token: string,
  page = 1,
  perPage = 50,
): Promise<{ folders: VimeoFolder[]; total: number }> {
  const url = `${VIMEO_API}/me/projects?page=${page}&per_page=${perPage}`;
  const res = await fetch(url, { headers: headers(token) });

  if (!res.ok) {
    throw new Error(
      `Vimeo API error (folders): ${res.status} ${res.statusText}`,
    );
  }

  const json = (await res.json()) as VimeoPaginatedResponse<VimeoApiFolderItem>;

  return {
    folders: json.data.map(mapFolder),
    total: json.total,
  };
}

export async function fetchVideos(
  token: string,
  folderId?: string,
  page = 1,
  perPage = 20,
): Promise<{
  videos: VimeoVideo[];
  total: number;
  page: number;
  perPage: number;
}> {
  const base = folderId
    ? `${VIMEO_API}/me/projects/${folderId}/videos`
    : `${VIMEO_API}/me/videos`;

  const url = `${base}?page=${page}&per_page=${perPage}`;
  const res = await fetch(url, { headers: headers(token) });

  if (!res.ok) {
    throw new Error(
      `Vimeo API error (videos): ${res.status} ${res.statusText}`,
    );
  }

  const json = (await res.json()) as VimeoPaginatedResponse<VimeoApiVideoItem>;

  return {
    videos: json.data.map(mapVideo),
    total: json.total,
    page: json.page,
    perPage: json.per_page,
  };
}

export async function initUpload(
  token: string,
  name: string,
  size: number,
  folderId?: string,
): Promise<{ uploadUrl: string; videoUri: string }> {
  const res = await fetch(`${VIMEO_API}/me/videos`, {
    method: "POST",
    headers: headers(token),
    body: JSON.stringify({
      name,
      upload: { approach: "tus", size },
    }),
  });

  if (!res.ok) {
    throw new Error(
      `Vimeo API error (init upload): ${res.status} ${res.statusText}`,
    );
  }

  const json = (await res.json()) as {
    uri: string;
    upload: { upload_link: string };
  };

  if (folderId) {
    const videoId = extractIdFromUri(json.uri);
    await fetch(`${VIMEO_API}/me/projects/${folderId}/videos/${videoId}`, {
      method: "PUT",
      headers: headers(token),
    });
  }

  return { uploadUrl: json.upload.upload_link, videoUri: json.uri };
}

export async function fetchVideo(
  token: string,
  videoId: string,
): Promise<VimeoVideo> {
  const url = `${VIMEO_API}/videos/${videoId}`;
  const res = await fetch(url, { headers: headers(token) });

  if (!res.ok) {
    throw new Error(`Vimeo API error (video): ${res.status} ${res.statusText}`);
  }

  const json = (await res.json()) as VimeoApiVideoItem;
  return mapVideo(json);
}
