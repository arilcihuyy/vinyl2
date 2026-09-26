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

/**
 * Vintage Cassette Tape Chamber Artwork
 * Shows an authentic analog cassette inside a backlit cassette well.
 */
function CassetteWellArtwork({
  track,
  isPlaying,
  compact = false,
}: {
  track: Track;
  isPlaying: boolean;
  compact?: boolean;
}) {
  if (track.artworkSrc) {
    return (
      <div
        className={`relative overflow-hidden bg-charcoal-soft ${
          compact
            ? "size-12 rounded-md border border-cream/20"
            : "aspect-[16/10] w-full rounded-lg border-2 border-cream/20 shadow-xl"
        }`}
      >
        <Image
          src={track.artworkSrc}
          alt={`Artwork for ${track.title}`}
          fill
          sizes={compact ? "48px" : "(max-width: 1024px) 100vw, 30vw"}
          className="object-cover"
        />
      </div>
    );
  }

  if (compact) {
    return (
      <div
        role="img"
        aria-label={`Artwork pending for ${track.title}`}
        className="relative grid size-12 place-items-center overflow-hidden rounded-md border border-cream/20 bg-charcoal-soft text-cream"
      >
        <div className="flex items-center gap-1" aria-hidden="true">
          <div className="size-3 rounded-full border border-cream/40 bg-ink" />
          <div className="h-0.5 w-1.5 bg-cream/30" />
          <div className="size-3 rounded-full border border-cream/40 bg-ink" />
        </div>
      </div>
    );
  }

  return (
    <div
      role="img"
      aria-label={`Artwork pending for ${track.title}`}
      className="relative flex aspect-[16/10] w-full flex-col justify-between overflow-hidden rounded-xl border border-cream/20 bg-[#171513] p-3 shadow-xl"
    >
      {/* Tape Chamber Glass Reflection */}
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/10"
        aria-hidden="true"
      />

      {/* Chamber Header */}
      <div className="relative z-10 flex items-center justify-between border-b border-cream/15 pb-1.5">
        <div className="flex items-center gap-1.5">
          <span className="flex size-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)]" />
          <span className="font-catalog text-[0.62rem] font-bold tracking-widest text-cream/80">
            CHAMBER 1 // AUTO-REV
          </span>
        </div>
        <span className="rounded bg-black/60 px-1.5 py-0.5 font-catalog text-[0.6rem] font-bold text-amber-300">
          C-60 CHROME
        </span>
      </div>

      {/* Skeuomorphic Cassette Body Inside Chamber */}
      <div className="relative z-10 mx-auto my-auto flex w-full max-w-[19rem] flex-col justify-between rounded-lg border border-cream/20 bg-[#24211D] p-2.5 shadow-md">
        {/* Cassette Label Header */}
        <div className="flex items-center justify-between border-b border-cream/15 pb-1 font-catalog text-[0.6rem] text-cream/70">
          <span className="font-bold text-accent-light">SIDE A</span>
          <span className="truncate max-w-[12rem]">{track.title}</span>
        </div>

        {/* Dual Spools Window */}
        <div className="my-2 flex items-center justify-around rounded bg-black/70 py-1.5 shadow-inner">
          {/* Left Spool */}
          <div
            className={`relative grid size-8 place-items-center rounded-full border-2 border-dashed border-cream/40 ${
              isPlaying ? "animate-spin" : ""
            }`}
            style={{ animationDuration: "3s" }}
          >
            <div className="size-2.5 rounded-full bg-cream/20" />
            <div className="absolute size-1 rounded-full bg-white" />
          </div>

          {/* Tape Bridge / Window */}
          <div className="flex flex-col items-center gap-0.5">
            <div className="h-0.5 w-14 rounded-full bg-amber-900/60" />
            <div className="h-1 w-10 rounded-full bg-amber-800/80" />
            <span className="font-catalog text-[0.52rem] text-cream/40">ANALOG</span>
          </div>

          {/* Right Spool */}
          <div
            className={`relative grid size-8 place-items-center rounded-full border-2 border-dashed border-cream/40 ${
              isPlaying ? "animate-spin" : ""
            }`}
            style={{ animationDuration: "3s" }}
          >
            <div className="size-2.5 rounded-full bg-cream/20" />
            <div className="absolute size-1 rounded-full bg-white" />
          </div>
        </div>

        {/* Cassette Bottom Status */}
        <div className="flex items-center justify-between font-catalog text-[0.55rem] text-cream/55">
          <span>TYPE II // 70µs</span>
          <span>DOLBY B-C NR</span>
        </div>
      </div>

      {/* Chamber Bottom Status Text */}
      <div className="relative z-10 flex items-center justify-between font-catalog text-[0.58rem] tracking-wider text-cream/50">
        <span>ARTWORK PENDING</span>
        <Disc3 aria-hidden="true" size={14} />
      </div>
    </div>
  );
}

/**
 * Vintage Dual Analog VU Meters
 */
function AnalogVUMeter({ isPlaying }: { isPlaying: boolean }) {
  return (
    <div className="flex gap-2 sm:gap-3" aria-hidden="true">
      {["L CH", "R CH"].map((ch, idx) => (
        <div
          key={ch}
          className="relative flex-1 rounded border border-cream/20 bg-[#181614] p-1.5 shadow-inner"
        >
          {/* Meter Header */}
          <div className="flex items-center justify-between font-catalog text-[0.55rem] text-cream/50">
            <span>{ch}</span>
            <span className="font-bold text-amber-400/80">VU</span>
          </div>

          {/* Dial Arc & Needle */}
          <div className="relative mt-1 h-8 overflow-hidden rounded bg-[#F4ECD8] px-1.5 py-0.5 text-ink shadow-inner">
            <div className="flex justify-between font-catalog text-[0.5rem] font-bold text-ink/70">
              <span>-20</span>
              <span>-10</span>
              <span>0</span>
              <span className="text-accent">+3</span>
            </div>
            <div className="mt-0.5 h-0.5 w-full bg-gradient-to-r from-ink/60 via-ink/80 to-accent" />

            <div
              className={`absolute bottom-0 left-1/2 h-6 w-0.5 origin-bottom bg-accent transition-transform duration-150 ${
                isPlaying
                  ? idx === 0
                    ? "rotate-[12deg]"
                    : "rotate-[6deg]"
                  : "-rotate-[30deg]"
              }`}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

type TactileButtonProps = {
  label: string;
  sublabel: string;
  disabled?: boolean;
  active?: boolean;
  emphasis?: boolean;
  onClick?: () => void;
  children: ReactNode;
};

/**
 * Heavy Piano-Key Cassette Deck Mechanical Push Button
 */
function TactileDeckButton({
  label,
  sublabel,
  disabled = false,
  active = false,
  emphasis = false,
  onClick,
  children,
}: TactileButtonProps) {
  return (
    <div className="flex flex-col items-center gap-0.5">
      <button
        type="button"
        className={`flex h-10 w-9 sm:h-11 sm:w-11 flex-col items-center justify-center rounded border-b-2 sm:border-b-4 transition-all duration-150 focus-visible:outline-accent active:translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-35 ${
          emphasis
            ? "border-accent-dark bg-accent text-cream shadow hover:bg-accent-dark active:border-b-0"
            : active
              ? "border-amber-600 bg-amber-500 text-charcoal shadow active:border-b-0"
              : "border-[#141210] bg-[#322E29] text-cream hover:bg-[#3D3832] active:border-b-0"
        }`}
        aria-label={label}
        disabled={disabled}
        onClick={onClick}
      >
        {children}
      </button>
      <span className="font-catalog text-[0.52rem] font-bold tracking-wider text-cream/50">
        {sublabel}
      </span>
    </div>
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
      {/* Vintage Cassette Deck Chassis: Unified Compact 3-Column Studio Console */}
      <div className="overflow-hidden rounded-xl border-2 border-cream/20 bg-[#1A1816] p-3 sm:p-5 lg:p-6 shadow-2xl">
        {/* Chassis Top Bar */}
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2 border-b border-cream/15 pb-2">
          <div className="flex items-center gap-2">
            <span className="rounded bg-cream px-1.5 py-0.5 font-catalog text-[0.62rem] font-black tracking-widest text-charcoal">
              ARIL HI-FI
            </span>
            <span className="font-catalog text-[0.62rem] tracking-wider text-cream/70">
              STEREO CASSETTE DECK // K-1980
            </span>
          </div>
          <div className="flex items-center gap-1.5 font-catalog text-[0.6rem] tracking-wider text-accent-light">
            <span className="size-1.5 rounded-full bg-accent" />
            <span>DIRECT DRIVE MOTOR</span>
          </div>
        </div>

        {/* 3-Column Responsive Grid */}
        <div className="grid gap-4 lg:grid-cols-[minmax(14rem,0.85fr)_minmax(0,1.2fr)_minmax(15rem,0.95fr)] lg:gap-6 lg:items-start">
          {/* Column 1: Cassette Well Chamber + VU Meter */}
          <div className="flex flex-col gap-3">
            <CassetteWellArtwork track={currentTrack} isPlaying={isPlaying} />
            <AnalogVUMeter isPlaying={isPlaying} />
          </div>

          {/* Column 2: Player Console & Mechanical Controls */}
          <div className="flex min-w-0 flex-col justify-between">
            <div>
              {/* Status Header */}
              <div
                className="mb-2 flex items-center gap-1.5 font-catalog text-[0.68rem] tracking-[0.1em] text-cream/75"
                role="status"
                aria-live="polite"
              >
                {hasStatusIcon ? (
                  status === "error" ? (
                    <CircleAlert aria-hidden="true" className="text-accent-light" size={15} />
                  ) : (
                    <AudioLines aria-hidden="true" className="text-accent-light" size={15} />
                  )
                ) : null}
                <span>{statusCopy}</span>
              </div>

              <p className="font-catalog text-[0.62rem] font-bold tracking-[0.14em] text-accent-light">
                RADIOHEAD / FAVORITES
              </p>
              <h3 className="mt-1 font-display text-2xl leading-tight sm:text-3xl text-cream">
                {currentTrack.title}
              </h3>
              <p className="mt-0.5 text-xs text-cream/70 font-medium">
                {currentTrack.artist}
              </p>

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
            </div>

            {/* Tape Progress Meter */}
            <div className="mt-3 border-t border-cream/15 pt-2.5">
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
                className="w-full"
              />
              <div className="mt-0.5 flex justify-between font-catalog text-[0.62rem] tracking-[0.08em] text-cream/55">
                <span>{canSeek ? formatTime(currentTime) : "--:--"}</span>
                <span>{canSeek ? formatTime(duration) : "TIME UNAVAILABLE"}</span>
              </div>
            </div>

            {/* Piano-Key Mechanical Controls & Volume Knurled Fader */}
            <div className="mt-3 flex flex-wrap items-end justify-between gap-3 border-t border-cream/15 pt-3">
              {/* Mechanical Buttons */}
              <div className="flex items-center gap-2">
                <TactileDeckButton
                  label="Previous track"
                  sublabel="REW"
                  disabled={!canNavigate}
                  onClick={() => moveToRelativeTrack(-1)}
                >
                  <SkipBack aria-hidden="true" size={17} fill="currentColor" />
                </TactileDeckButton>

                <TactileDeckButton
                  label={isPlaying ? "Pause track" : "Play track"}
                  sublabel={isPlaying ? "PAUSE" : "PLAY"}
                  disabled={!canControl}
                  emphasis
                  onClick={togglePlayback}
                >
                  {isPlaying ? (
                    <Pause aria-hidden="true" size={19} fill="currentColor" />
                  ) : (
                    <Play aria-hidden="true" size={19} fill="currentColor" />
                  )}
                </TactileDeckButton>

                <TactileDeckButton
                  label="Next track"
                  sublabel="F.FWD"
                  disabled={!canNavigate}
                  onClick={() => moveToRelativeTrack(1)}
                >
                  <SkipForward aria-hidden="true" size={17} fill="currentColor" />
                </TactileDeckButton>

                <TactileDeckButton
                  label={`Repeat mode: ${repeatMode}`}
                  sublabel="LOOP"
                  disabled={!canControl}
                  active={repeatMode !== "off"}
                  onClick={cycleRepeatMode}
                >
                  <Repeat2 aria-hidden="true" size={16} />
                </TactileDeckButton>
              </div>

              {/* Knurled Volume Control */}
              <div className="flex flex-col gap-1 rounded border border-cream/15 bg-black/40 px-2.5 py-1.5">
                <div className="flex items-center justify-between text-cream/70">
                  <div className="flex items-center gap-1">
                    <Volume2 aria-hidden="true" size={14} />
                    <span className="font-catalog text-[0.55rem] font-bold text-cream/60">
                      OUTPUT
                    </span>
                  </div>
                  <span className="font-catalog text-[0.58rem] text-amber-300">
                    {Math.round(volume * 100)}%
                  </span>
                </div>
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
                  className="w-24 sm:w-28"
                />
              </div>
            </div>
          </div>

          {/* Column 3: Integrated Cassette J-Card Sleeve Tracklist */}
          <div className="rounded-lg border border-cream/20 bg-[#161412] p-3 shadow-inner">
            <div className="mb-2 flex items-center justify-between border-b border-accent pb-1.5">
              <div className="flex items-center gap-1.5">
                <span className="rounded bg-accent px-1.5 py-0.5 font-catalog text-[0.6rem] font-bold text-cream">
                  INDEX
                </span>
                <span className="font-catalog text-xs font-bold tracking-wider text-cream">
                  TRACKLIST
                </span>
              </div>
              <span className="font-catalog text-[0.6rem] text-cream/55">
                {tracks.length} ENTRIES
              </span>
            </div>

            <ol className="divide-y divide-cream/10">
              {tracks.map((track, index) => {
                const isCurrent = track.id === currentTrack.id;
                const content = (
                  <>
                    <span className="w-5 shrink-0 font-catalog text-xs font-bold text-cream/40">
                      {(index + 1).toString().padStart(2, "0")}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block font-display text-base leading-tight text-cream">
                        {track.title}
                      </span>
                      <span className="block text-[0.7rem] text-cream/60 font-medium">
                        {track.artist}
                      </span>
                    </span>
                    <span className="rounded border border-cream/20 bg-charcoal/60 px-1.5 py-0.5 font-catalog text-[0.55rem] tracking-wider text-cream/50">
                      {track.src ? "READY" : "AUDIO UNAVAILABLE"}
                    </span>
                  </>
                );

                return (
                  <li key={track.id} className="py-1">
                    {track.src ? (
                      <button
                        type="button"
                        className={`flex min-h-11 w-full items-center gap-2 px-1 text-left transition-colors focus-visible:outline-accent ${
                          isCurrent
                            ? "text-accent-light font-bold"
                            : "text-cream hover:text-accent-light"
                        }`}
                        aria-pressed={isCurrent}
                        onClick={() => selectTrack(track.id, true)}
                      >
                        {content}
                      </button>
                    ) : (
                      <div
                        className="flex min-h-11 items-center gap-2 px-1"
                        aria-disabled="true"
                      >
                        {content}
                      </div>
                    )}
                  </li>
                );
              })}
            </ol>
          </div>
        </div>
      </div>

      {/* Mini Player */}
      <AnimatePresence>
        {hasStarted && currentTrack?.src ? (
          <motion.aside
            aria-label="Mini music player"
            className="fixed inset-x-0 bottom-0 z-40 hidden border-t-2 border-accent bg-[#171513] px-5 py-2 text-cream shadow-[0_-12px_30px_rgba(0,0,0,0.4)] lg:flex lg:items-center lg:justify-between"
            initial={reducedMotion ? false : { y: "100%" }}
            animate={{ y: 0 }}
            exit={reducedMotion ? { opacity: 0 } : { y: "100%" }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex min-w-0 items-center gap-3">
              <CassetteWellArtwork track={currentTrack} isPlaying={isPlaying} compact />
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
              <button
                type="button"
                className="grid size-11 place-items-center rounded-full border border-accent bg-accent text-cream hover:bg-accent-dark focus-visible:outline-accent"
                aria-label={isPlaying ? "Pause track" : "Play track"}
                disabled={!canControl}
                onClick={togglePlayback}
              >
                {isPlaying ? (
                  <Pause aria-hidden="true" size={18} fill="currentColor" />
                ) : (
                  <Play aria-hidden="true" size={18} fill="currentColor" />
                )}
              </button>
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

            <button
              type="button"
              className="grid size-10 place-items-center rounded-full border border-cream/30 text-cream hover:bg-cream hover:text-charcoal focus-visible:outline-accent"
              aria-label="Next track"
              disabled={!canNavigate}
              onClick={() => moveToRelativeTrack(1)}
            >
              <SkipForward aria-hidden="true" size={18} fill="currentColor" />
            </button>
          </motion.aside>
        ) : null}
      </AnimatePresence>
    </>
  );
}
