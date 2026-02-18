export interface BuildEmbedHtmlOptions {
  playerEmbedUrl: string;
  width: number;
  height: number;
  title: string;
  alt: string;
  autoplay: boolean;
  loop: boolean;
  muted: boolean;
  background: boolean;
  controls: boolean;
  dnt: boolean;
}

export function buildEmbedHtml(opts: BuildEmbedHtmlOptions): string {
  if (!opts.playerEmbedUrl) return "";

  const params = new URLSearchParams();
  if (opts.autoplay || opts.background) params.set("autoplay", "1");
  if (opts.loop || opts.background) params.set("loop", "1");
  if (opts.muted || opts.background) params.set("muted", "1");
  if (opts.background) params.set("background", "1");
  if (!opts.controls && !opts.background) params.set("controls", "0");
  if (opts.dnt) params.set("dnt", "1");

  const query = params.toString();
  const src = query ? `${opts.playerEmbedUrl}?${query}` : opts.playerEmbedUrl;

  const allowParts: string[] = [];
  if (opts.autoplay || opts.background) allowParts.push("autoplay");
  allowParts.push("fullscreen", "picture-in-picture");

  const title = opts.title || "Vimeo video";
  const alt = opts.alt ? ` aria-label="${opts.alt}"` : "";

  return `<iframe src="${src}" width="${opts.width}" height="${opts.height}" frameborder="0" allow="${allowParts.join("; ")}" allowfullscreen title="${title}"${alt}></iframe>`;
}
