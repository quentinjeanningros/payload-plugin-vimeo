export function extractIdFromUri(uri: string): string {
  return uri.split("/").pop() || "";
}

export function buildPreviewUrl(
  playerEmbedUrl: string,
  vimeoId: string,
): string {
  const base = playerEmbedUrl || `https://player.vimeo.com/video/${vimeoId}`;
  try {
    const url = new URL(base);
    const h = url.searchParams.get("h");
    url.search = "";
    if (h) url.searchParams.set("h", h);
    url.searchParams.set("dnt", "1");
    return url.toString();
  } catch {
    return base;
  }
}

export function buildVimeoEditUrl(vimeoUrl: string, vimeoId: string): string {
  if (vimeoUrl) {
    try {
      return `https://vimeo.com/manage/videos${new URL(vimeoUrl).pathname}`;
    } catch {
      // fall through
    }
  }
  return vimeoId ? `https://vimeo.com/manage/videos/${vimeoId}` : "";
}
