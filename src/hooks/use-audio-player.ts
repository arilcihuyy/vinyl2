"use client";

import type { SyntheticEvent } from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { Track } from "@/data/portfolio";

export type RepeatMode = "off" | "all" | "one";
export type AudioStatus =
  | "unavailable"
  | "idle"
  | "loading"
  | "ready"
  | "playing"
  | "paused"
  | "error";

export function useAudioPlayer(tracks: Track[]) {
  const playableTracks = useMemo(
    () => tracks.filter((track) => Boolean(track.src)),
    [tracks],
  );
  const [currentTrackId, setCurrentTrackId] = useState(tracks[0]?.id ?? "");
  const [status, setStatus] = useState<AudioStatus>(
    playableTracks.length > 0 ? "idle" : "unavailable",
  );
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolumeState] = useState(0.72);
  const [repeatMode, setRepeatMode] = useState<RepeatMode>("off");
  const audioRef = useRef<HTMLAudioElement>(null);
  const playOnLoadRef = useRef(false);

  const currentTrack =
    tracks.find((track) => track.id === currentTrackId) ?? tracks[0] ?? null;
  const canControl = Boolean(currentTrack?.src);
  const canSeek = canControl && duration > 0;

  useEffect(() => {
    const audio = audioRef.current;
    const track = tracks.find((item) => item.id === currentTrackId);

    if (!audio || !track?.src) {
      setStatus("unavailable");
      setDuration(0);
      setCurrentTime(0);
      setIsPlaying(false);
      return;
    }

    setStatus("loading");
    setCurrentTime(0);
    setDuration(0);
    audio.src = track.src;
    audio.load();

    if (playOnLoadRef.current) {
      playOnLoadRef.current = false;
      void audio.play().catch(() => {
        setStatus("error");
        setIsPlaying(false);
      });
    }
  }, [currentTrackId, tracks]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const selectTrack = useCallback(
    (trackId: string, autoplay: boolean) => {
      const track = tracks.find((item) => item.id === trackId);

      if (!track?.src) {
        return;
      }

      if (trackId === currentTrackId) {
        if (autoplay && audioRef.current?.paused) {
          setHasStarted(true);
          void audioRef.current.play().catch(() => {
            setStatus("error");
            setIsPlaying(false);
          });
        }
        return;
      }

      playOnLoadRef.current = autoplay;
      setCurrentTrackId(trackId);
      setHasStarted((started) => started || autoplay);
      setIsPlaying(false);
    },
    [currentTrackId, tracks],
  );

  const togglePlayback = useCallback(() => {
    const audio = audioRef.current;

    if (!audio || !currentTrack?.src) {
      return;
    }

    if (!audio.paused) {
      audio.pause();
      return;
    }

    if (audio.ended || audio.currentTime >= audio.duration) {
      audio.currentTime = 0;
    }

    setHasStarted(true);
    void audio.play().catch(() => {
      setStatus("error");
      setIsPlaying(false);
    });
  }, [currentTrack?.src]);

  const moveToRelativeTrack = useCallback(
    (direction: -1 | 1) => {
      if (playableTracks.length === 0) {
        return;
      }

      const currentIndex = playableTracks.findIndex(
        (track) => track.id === currentTrackId,
      );
      const nextIndex =
        (currentIndex + direction + playableTracks.length) %
        playableTracks.length;

      selectTrack(playableTracks[nextIndex].id, isPlaying);
    },
    [currentTrackId, isPlaying, playableTracks, selectTrack],
  );

  const handleEnded = useCallback(() => {
    const audio = audioRef.current;

    if (!audio) {
      return;
    }

    if (repeatMode === "one") {
      audio.currentTime = 0;
      void audio.play().catch(() => setStatus("error"));
      return;
    }

    const currentIndex = playableTracks.findIndex(
      (track) => track.id === currentTrackId,
    );
    const hasNextTrack = currentIndex < playableTracks.length - 1;

    if (hasNextTrack || repeatMode === "all") {
      const nextIndex =
        (currentIndex + 1) % Math.max(playableTracks.length, 1);
      selectTrack(playableTracks[nextIndex].id, true);
      return;
    }

    setIsPlaying(false);
    setStatus("paused");
  }, [currentTrackId, playableTracks, repeatMode, selectTrack]);

  const seek = useCallback(
    (nextTime: number) => {
      const audio = audioRef.current;

      if (!audio || !canSeek) {
        return;
      }

      audio.currentTime = nextTime;
      setCurrentTime(nextTime);
    },
    [canSeek],
  );

  const setVolume = useCallback((nextVolume: number) => {
    setVolumeState(Math.min(1, Math.max(0, nextVolume)));
  }, []);

  const cycleRepeatMode = useCallback(() => {
    setRepeatMode((mode) => {
      if (mode === "off") return "all";
      if (mode === "all") return "one";
      return "off";
    });
  }, []);

  const handleCanPlay = useCallback(() => {
    const audio = audioRef.current;
    setStatus(audio && !audio.paused ? "playing" : "ready");
  }, []);

  const handleLoadedMetadata = useCallback(
    (event: SyntheticEvent<HTMLMediaElement>) => {
      const nextDuration = event.currentTarget.duration;
      setDuration(Number.isFinite(nextDuration) ? nextDuration : 0);
    },
    [],
  );

  const handlePlay = useCallback(() => {
    setIsPlaying(true);
    setStatus("playing");
  }, []);

  const handlePause = useCallback(() => {
    setIsPlaying(false);
    setStatus((currentStatus) =>
      currentStatus === "error" ? currentStatus : "paused",
    );
  }, []);

  const handlePlaying = useCallback(() => {
    setIsPlaying(true);
    setStatus("playing");
  }, []);

  const handleWaiting = useCallback(() => {
    if (audioRef.current && !audioRef.current.paused) {
      setStatus("loading");
    }
  }, []);

  const handleTimeUpdate = useCallback(
    (event: SyntheticEvent<HTMLMediaElement>) => {
      setCurrentTime(event.currentTarget.currentTime);
    },
    [],
  );

  const handleError = useCallback(() => {
    setIsPlaying(false);
    setStatus("error");
  }, []);

  return {
    audioRef,
    canControl,
    canSeek,
    canNavigate: playableTracks.length > 1,
    currentTime,
    currentTrack,
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
    cycleRepeatMode,
  };
}
