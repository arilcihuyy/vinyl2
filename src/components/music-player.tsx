"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  AudioLines,
  CircleAlert,
  Disc3,
  Pause,
  Play,
  Repeat2,
  SkipBack,
  SkipForward,
  Volume2,
} from "lucide-react";
import Image from "next/image";
import type { ReactNode } from "react";
import { tracks, type Track } from "@/data/portfolio";
import { useAudioPlayer } from "@/hooks/use-audio-player";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

function formatTime(value: number) {
  if (!Number.isFinite(value) || value <= 0) {
    return "--:--";
  }

  const minutes = Math.floor(value / 60);
  const seconds = Math.floor(value % 60)
    .toString()
    .padStart(2, "0");

  return `${minutes}:${seconds}`;
}

function Artwork({ track, compact = false }: { track: Track; compact?: boolean }) {
  if (track.artworkSrc) {
    return (
      <div
        className={`relative overflow-hidden bg-paper-deep ${compact ? "size-14 rounded-full" : "aspect-square w-full rounded-sm border border-cream/20"}`}
      >
        <Image
          src={track.artworkSrc}
          alt={`Artwork for ${track.title}`}
          fill
          sizes={compact ? "56px" : "(max-width: 1024px) 100vw, 42vw"}
          className="object-cover"
        />
      </div>
    );
  }

  return (
    <div
      role="img"
      aria-label={`Artwork pending for ${track.title}`}
      className={`relative grid place-items-center overflow-hidden bg-paper-deep text-ink ${compact ? "size-14 rounded-full" : "aspect-square w-full rounded-sm border border-cream/20"}`}
    >
      <div
        className={`absolute rounded-full border border-ink/35 ${compact ? "inset-1" : "inset-[14%]"}`}
        aria-hidden="true"
      >
        <div className="absolute inset-[18%] rounded-full border border-ink/20" />
        <div className="absolute inset-[36%] rounded-full border border-ink/20" />
        <div className="absolute left-1/2 top-1/2 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent" />
      </div>
      {!compact ? (
        <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between font-catalog text-[0.64rem] tracking-[0.12em] text-ink/65">
          <span>ARTWORK PENDING</span>
          <Disc3 aria-hidden="true" size={18} />
        </div>
      ) : null}
    </div>
  );
}

type ControlButtonProps = {
  label: string;
  disabled?: boolean;
  active?: boolean;
  emphasis?: boolean;
  onClick?: () => void;
  children: ReactNode;
};

function ControlButton({
  label,
  disabled = false,
  active = false,
  emphasis = false,
  onClick,
  children,
}: ControlButtonProps) {
  return (
    <button
      type="button"
      className={`grid size-12 place-items-center rounded-full border transition-colors duration-200 focus-visible:outline-accent disabled:cursor-not-allowed disabled:opacity-35 ${emphasis ? "border-accent bg-accent text-cream hover:bg-accent-dark" : active ? "border-accent text-accent" : "border-cream/30 text-cream hover:border-cream hover:bg-cream hover:text-charcoal"}`}
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

function getStatusCopy(status: ReturnType<typeof useAudioPlayer>["status"]) {
  if (status === "unavailable") return "Audio files have not been added";
  if (status === "loading") return "Loading audio";
  if (status === "ready") return "Ready to play";
  if (status === "playing") return "Now playing";
  if (status === "paused") return "Playback paused";
  if (status === "error") return "Playback failed. Check the audio file and try again";
  return "Select a track to begin";
}

export function MusicPlayer() {
  const reducedMotion = useReducedMotion();
  const {
    audioRef,
    canControl,
    canNavigate,
    canSeek,
    currentTime,
    currentTrack: selectedTrack,
    cycleRepeatMode,
    duration,
    handleCanPlay,
    handleEnded,
    handleError,
    handleLoadedMetadata,
    handlePause,
    handlePlay,
    handlePlaying,
    handleTimeUpdate,
    handleWaiting,
    hasStarted,
    isPlaying,
    moveToRelativeTrack,
    repeatMode,
    seek,
    selectTrack,
    setVolume,
    status,
    togglePlayback,
    volume,
  } = useAudioPlayer(tracks);
  const currentTrack = selectedTrack ?? tracks[0];
  const statusCopy = getStatusCopy(status);
  const hasStatusIcon = status === "playing" || status === "error";

  return (
    <>
      <div className="grid gap-8 border-y border-cream/20 py-8 lg:grid-cols-[minmax(16rem,0.78fr)_minmax(0,1.22fr)] lg:gap-12 lg:py-10">
        <div className="relative mx-auto w-full max-w-[30rem] lg:mx-0 lg:max-w-none">
          <Artwork track={currentTrack} />
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(120deg,transparent_0%,rgba(255,255,255,0.16)_48%,transparent_65%)] opacity-40" />
        </div>

        <div className="flex min-w-0 flex-col justify-center">
          <div
            className="mb-6 flex items-center gap-2 font-catalog text-xs tracking-[0.12em] text-cream/70"
            role="status"
            aria-live="polite"
          >
            {hasStatusIcon ? (
              status === "error" ? (
                <CircleAlert aria-hidden="true" className="text-accent-light" size={17} />
              ) : (
                <AudioLines aria-hidden="true" className="text-accent-light" size={17} />
              )
            ) : null}
            <span>{statusCopy}</span>
          </div>

          <p className="font-catalog text-xs tracking-[0.12em] text-accent-light">
            RADIOHEAD / FAVORITES
          </p>
          <h3 className="mt-3 font-display text-4xl leading-none sm:text-5xl lg:text-6xl">
            {currentTrack.title}
          </h3>
          <p className="mt-3 text-base text-cream/70">{currentTrack.artist}</p>

          <audio
            ref={audioRef}
            preload="metadata"
            onCanPlay={handleCanPlay}
            onLoadedMetadata={handleLoadedMetadata}
            onPlay={handlePlay}
            onPause={handlePause}
            onPlaying={handlePlaying}
            onWaiting={handleWaiting}
            onTimeUpdate={handleTimeUpdate}
            onError={handleError}
            onEnded={handleEnded}
            className="hidden"
          />

          <div className="mt-8 flex items-center gap-3 sm:gap-4">
            <ControlButton
              label="Previous track"
              disabled={!canNavigate}
              onClick={() => moveToRelativeTrack(-1)}
            >
              <SkipBack aria-hidden="true" size={20} fill="currentColor" />
            </ControlButton>
            <ControlButton
              label={isPlaying ? "Pause track" : "Play track"}
              disabled={!canControl}
              emphasis
              onClick={togglePlayback}
            >
              {isPlaying ? (
                <Pause aria-hidden="true" size={23} fill="currentColor" />
              ) : (
                <Play aria-hidden="true" size={23} fill="currentColor" />
              )}
            </ControlButton>
            <ControlButton
              label="Next track"
              disabled={!canNavigate}
              onClick={() => moveToRelativeTrack(1)}
            >
              <SkipForward aria-hidden="true" size={20} fill="currentColor" />
            </ControlButton>
          </div>

          <div className="mt-8">
            <label htmlFor="track-progress" className="sr-only">
              Track progress
            </label>
            <input
              id="track-progress"
              type="range"
              min="0"
              max={duration || 0}
              step="0.1"
              value={Math.min(currentTime, duration || 0)}
              disabled={!canSeek}
              onChange={(event) => seek(Number(event.target.value))}
              aria-valuetext={
                canSeek
                  ? `${formatTime(currentTime)} of ${formatTime(duration)}`
                  : "Progress unavailable"
              }
            />
            <div className="mt-1 flex justify-between font-catalog text-[0.68rem] tracking-[0.1em] text-cream/55">
              <span>{canSeek ? formatTime(currentTime) : "--:--"}</span>
              <span>{canSeek ? formatTime(duration) : "TIME UNAVAILABLE"}</span>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-5">
            <div className="flex min-w-13 items-center gap-2 text-cream/70">
              <Volume2 aria-hidden="true" size={19} />
              <label htmlFor="volume" className="sr-only">
                Volume
              </label>
              <input
                id="volume"
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                disabled={!canControl}
                onChange={(event) => setVolume(Number(event.target.value))}
                className="w-24"
              />
            </div>
            <ControlButton
              label={`Repeat mode: ${repeatMode}`}
              disabled={!canControl}
              active={repeatMode !== "off"}
              onClick={cycleRepeatMode}
            >
              <Repeat2 aria-hidden="true" size={19} />
            </ControlButton>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <div className="mb-3 flex items-center justify-between font-catalog text-xs tracking-[0.12em] text-cream/55">
          <span>TRACKLIST</span>
          <span>{tracks.length} ENTRIES</span>
        </div>
        <ol className="border-t border-cream/20">
          {tracks.map((track, index) => {
            const isCurrent = track.id === currentTrack.id;
            const content = (
              <>
                <span className="w-8 shrink-0 font-catalog text-xs text-cream/45">
                  {(index + 1).toString().padStart(2, "0")}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-display text-2xl leading-tight sm:text-3xl">
                    {track.title}
                  </span>
                  <span className="mt-1 block text-sm text-cream/55">{track.artist}</span>
                </span>
                <span className="font-catalog text-[0.64rem] tracking-[0.1em] text-cream/45">
                  {track.src ? "READY" : "AUDIO UNAVAILABLE"}
                </span>
              </>
            );

            return (
              <li key={track.id} className="border-b border-cream/20">
                {track.src ? (
                  <button
                    type="button"
                    className={`flex min-h-20 w-full items-center gap-3 px-1 text-left transition-colors focus-visible:outline-accent sm:gap-5 sm:px-3 ${isCurrent ? "text-accent-light" : "text-cream hover:text-accent-light"}`}
                    aria-pressed={isCurrent}
                    onClick={() => selectTrack(track.id, true)}
                  >
                    {content}
                  </button>
                ) : (
                  <div className="flex min-h-20 items-center gap-3 px-1 sm:gap-5 sm:px-3" aria-disabled="true">
                    {content}
                  </div>
                )}
              </li>
            );
          })}
        </ol>
      </div>

      <AnimatePresence>
        {hasStarted && currentTrack?.src ? (
          <motion.aside
            aria-label="Mini music player"
            className="fixed inset-x-0 bottom-0 z-40 hidden border-t border-accent bg-charcoal px-5 py-2 text-cream shadow-[0_-12px_30px_rgba(28,26,23,0.2)] lg:flex lg:items-center lg:justify-between"
            initial={reducedMotion ? false : { y: "100%" }}
            animate={{ y: 0 }}
            exit={reducedMotion ? { opacity: 0 } : { y: "100%" }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex min-w-0 items-center gap-3">
              <Artwork track={currentTrack} compact />
              <div className="min-w-0">
                <a
                  href="#music"
                  className="block max-w-72 truncate font-display text-lg hover:text-accent-light focus-visible:outline-accent-light"
                >
                  {currentTrack.title}
                </a>
                <p className="truncate text-xs text-cream/55">{currentTrack.artist}</p>
              </div>
            </div>

            <div className="flex min-w-0 flex-1 items-center gap-4 px-10">
              <ControlButton
                label={isPlaying ? "Pause track" : "Play track"}
                disabled={!canControl}
                onClick={togglePlayback}
              >
                {isPlaying ? (
                  <Pause aria-hidden="true" size={19} fill="currentColor" />
                ) : (
                  <Play aria-hidden="true" size={19} fill="currentColor" />
                )}
              </ControlButton>
              <input
                type="range"
                min="0"
                max={duration || 0}
                step="0.1"
                value={Math.min(currentTime, duration || 0)}
                disabled={!canSeek}
                onChange={(event) => seek(Number(event.target.value))}
                aria-label="Mini player track progress"
                className="w-full"
              />
              <span className="w-24 text-right font-catalog text-[0.68rem] text-cream/55">
                {canSeek
                  ? `${formatTime(currentTime)} / ${formatTime(duration)}`
                  : "LOADING"}
              </span>
            </div>

            <ControlButton
              label="Next track"
              disabled={!canNavigate}
              onClick={() => moveToRelativeTrack(1)}
            >
              <SkipForward aria-hidden="true" size={19} fill="currentColor" />
            </ControlButton>
          </motion.aside>
        ) : null}
      </AnimatePresence>
    </>
  );
}
