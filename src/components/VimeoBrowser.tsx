"use client";

import "./vimeo-browser.css";

import {
  Button,
  Drawer,
  ExternalLinkIcon,
  GridViewIcon,
  ListViewIcon,
  useForm,
  useFormFields,
  useModal,
} from "@payloadcms/ui";
import { useCallback, useEffect, useRef, useState } from "react";

import type { VimeoFolder, VimeoVideo } from "../types";
import {
  buildPreviewUrl,
  buildVimeoEditUrl,
  extractIdFromUri,
} from "../utils/url";
import { FolderSidebar } from "./FolderSidebar";
import { VideoGrid } from "./VideoGrid";
import { VideoList } from "./VideoList";
import { VideoPlaceholder } from "./VideoPlaceholder";
import { VideoPreview } from "./VideoPreview";

const DRAWER_SLUG = "vimeo-browser";
const PER_PAGE = 20;

type ViewMode = "grid" | "list";

export default function VimeoBrowser() {
  const { dispatchFields, submit } = useForm();
  const { closeModal, openModal } = useModal();

  const [folders, setFolders] = useState<VimeoFolder[]>([]);
  const [videos, setVideos] = useState<VimeoVideo[]>([]);
  const [selectedFolderId, setSelectedFolderId] = useState<
    string | undefined
  >();
  const [page, setPage] = useState(1);
  const [totalVideos, setTotalVideos] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [pendingSave, setPendingSave] = useState(false);
  const videoAbortRef = useRef<AbortController | null>(null);

  const currentVimeoId = useFormFields(
    ([f]) => (f.vimeoId?.value as string) || "",
  );
  const currentTitle = useFormFields(([f]) => (f.title?.value as string) || "");
  const currentPlayerEmbedUrl = useFormFields(
    ([f]) => (f.playerEmbedUrl?.value as string) || "",
  );
  const currentVimeoUrl = useFormFields(
    ([f]) => (f.vimeoUrl?.value as string) || "",
  );
  // When a video is selected the form fields are dispatched then pendingSave is
  // set. The effect below waits until currentVimeoId has been committed to the
  // form state (confirming all dispatches were processed) before submitting.
  useEffect(() => {
    if (pendingSave && currentVimeoId) {
      setPendingSave(false);
      void submit();
    }
  }, [pendingSave, currentVimeoId, submit]);

  // Gate on playerEmbedUrl so the preview never renders with a bare fallback URL
  // (which fails for private/unlisted videos) during the multi-dispatch sequence.
  const hasVideo = !!currentPlayerEmbedUrl;

  const loadFolders = useCallback(async () => {
    try {
      const res = await fetch("/api/vimeo-videos/folders");
      const data = await res.json();
      if (!data.error) setFolders(data.folders || []);
    } catch (_) {
      /* ignore */
    }
  }, []);

  const loadVideos = useCallback(async (folderId?: string, p = 1) => {
    videoAbortRef.current?.abort();
    videoAbortRef.current = new AbortController();
    const { signal } = videoAbortRef.current;

    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ page: String(p) });
      if (folderId) params.set("folderId", folderId);
      const res = await fetch(`/api/vimeo-videos/browse?${params}`, { signal });
      const data = await res.json();
      if (data.error) {
        setError(data.error);
        return;
      }
      setVideos(data.videos || []);
      setTotalVideos(data.total || 0);
    } catch (err) {
      if (signal.aborted) return;
      setError(String(err));
    } finally {
      if (!signal.aborted) setLoading(false);
    }
  }, []);

  const handleOpen = useCallback(() => {
    openModal(DRAWER_SLUG);
    loadFolders();
    setSelectedFolderId(undefined);
    setPage(1);
    loadVideos(undefined, 1);
  }, [openModal, loadFolders, loadVideos]);

  const handleFolderSelect = (folderId: string | undefined) => {
    setSelectedFolderId(folderId);
    setPage(1);
    loadVideos(folderId, 1);
  };

  const handleVideoSelect = (video: VimeoVideo) => {
    const values: Record<string, unknown> = {
      vimeoId: extractIdFromUri(video.uri),
      title: video.name,
      alt: video.name,
      description: video.description || "",
      thumbnail: video.thumbnailUrl,
      embedHtml: video.embedHtml,
      playerEmbedUrl: video.playerEmbedUrl,
      vimeoUrl: video.link,
      duration: video.duration,
      width: video.width,
      height: video.height,
    };

    for (const [path, value] of Object.entries(values)) {
      dispatchFields({ type: "UPDATE", path, value, valid: true });
    }

    closeModal(DRAWER_SLUG);
    setPendingSave(true);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    loadVideos(selectedFolderId, newPage);
  };

  const totalPages = Math.ceil(totalVideos / PER_PAGE);
  const previewUrl = buildPreviewUrl(currentPlayerEmbedUrl, currentVimeoId);
  const vimeoEditUrl = buildVimeoEditUrl(currentVimeoUrl, currentVimeoId);

  return (
    <div style={{ marginBottom: "1.5rem" }}>
      {hasVideo && (
        <div style={{ maxWidth: "640px" }}>
          <VideoPreview embedUrl={previewUrl} title={currentTitle} />
          <div style={{ display: "flex", gap: "0.5rem", paddingTop: "0.5rem" }}>
            <Button
              buttonStyle="pill"
              size="medium"
              onClick={handleOpen}
              margin={false}
            >
              Replace
            </Button>
            {vimeoEditUrl && (
              <Button
                buttonStyle="pill"
                size="medium"
                el="anchor"
                url={vimeoEditUrl}
                newTab
                margin={false}
                icon={<ExternalLinkIcon />}
                iconStyle="without-border"
                iconPosition="left"
              >
                Open in Vimeo
              </Button>
            )}
          </div>
        </div>
      )}

      {!hasVideo && (
        <div style={{ maxWidth: "640px" }}>
          <VideoPlaceholder onClick={handleOpen} />
        </div>
      )}

      <Drawer slug={DRAWER_SLUG} title="Select a Video">
        <div
          style={{
            display: "flex",
            height: "calc(100vh - 8rem)",
            gap: "1rem",
            padding: "1rem",
          }}
        >
          <FolderSidebar
            folders={folders}
            selectedFolderId={selectedFolderId}
            onSelect={handleFolderSelect}
            onUploaded={(video) => {
              loadVideos(selectedFolderId, 1);
              setPage(1);
              handleVideoSelect(video);
            }}
          />

          <div style={{ flex: 1, overflowY: "auto", paddingRight: "1rem" }}>
            {/* View toggle */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: "0.25rem",
                marginBottom: "0.75rem",
              }}
            >
              <div>
                {vimeoEditUrl && (
                  <Button
                    buttonStyle="pill"
                    size="medium"
                    el="anchor"
                    url={"https://vimeo.com/home"}
                    newTab
                    margin={false}
                    icon={<ExternalLinkIcon />}
                    iconStyle="without-border"
                    iconPosition="left"
                  >
                    Vimeo
                  </Button>
                )}
              </div>
              <div style={{ display: "flex", gap: "0.25rem" }}>
              <Button
                buttonStyle={viewMode === "grid" ? "pill" : "transparent"}
                size="medium"
                icon={<GridViewIcon />}
                iconStyle="without-border"
                onClick={() => setViewMode("grid")}
                aria-label="Grid view"
                margin={false}
              />
              <Button
                buttonStyle={viewMode === "list" ? "pill" : "transparent"}
                size="medium"
                icon={<ListViewIcon />}
                iconStyle="without-border"
                onClick={() => setViewMode("list")}
                aria-label="List view"
                margin={false}
              />
              </div>
            </div>

            {error && (
              <div
                style={{
                  padding: "1rem",
                  background: "var(--theme-error-100)",
                  color: "var(--theme-error-500)",
                  borderRadius: "4px",
                  marginBottom: "1rem",
                }}
              >
                {error}
              </div>
            )}

            {loading && (
              <p style={{ padding: "2rem", textAlign: "center", opacity: 0.6 }}>
                Loading videos...
              </p>
            )}

            {!loading && videos.length === 0 && !error && (
              <p style={{ padding: "2rem", textAlign: "center", opacity: 0.6 }}>
                No videos found
              </p>
            )}

            {!loading && videos.length > 0 && viewMode === "grid" && (
              <VideoGrid
                videos={videos}
                currentVimeoId={currentVimeoId}
                onSelect={handleVideoSelect}
              />
            )}

            {!loading && videos.length > 0 && viewMode === "list" && (
              <VideoList
                videos={videos}
                currentVimeoId={currentVimeoId}
                onSelect={handleVideoSelect}
              />
            )}

            {/* Pagination */}
            {!loading && totalPages > 1 && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: "1rem",
                  marginTop: "1.5rem",
                  paddingBottom: "1rem",
                }}
              >
                <Button
                  buttonStyle="pill"
                  size="small"
                  disabled={page <= 1}
                  onClick={() => handlePageChange(page - 1)}
                >
                  Previous
                </Button>
                <span style={{ fontSize: "0.875rem" }}>
                  Page {page} of {totalPages}
                </span>
                <Button
                  buttonStyle="pill"
                  size="small"
                  disabled={page >= totalPages}
                  onClick={() => handlePageChange(page + 1)}
                >
                  Next
                </Button>
              </div>
            )}
          </div>
        </div>
      </Drawer>
    </div>
  );
}
