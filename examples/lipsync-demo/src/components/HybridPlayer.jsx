import React, { useRef, useEffect, useState } from 'react';
import { Lipsync } from 'wawa-lipsync';

// Create a single instance of Lipsync for audio analysis
const lipsync = new Lipsync({});

export const HybridPlayer = ({ audioUrl, visemes, onVisemeChange, onAmplitudeChange }) => {
  const audioRef = useRef(null);
  const animationFrameRef = useRef(null);
  const visemeIndexRef = useRef(0);

  useEffect(() => {
    if (!audioUrl || !visemes || visemes.length === 0) {
      return;
    }

    // 1. Setup Audio Element
    const audio = new Audio(audioUrl);
    audioRef.current = audio;
    audio.crossOrigin = "anonymous";

    // 2. Connect Audio to Lipsync Analyser
    lipsync.connectAudio(audio);

    const sortedVisemes = [...visemes].sort((a, b) => a.time - b.time);

    const tick = () => {
      // 3. Real-time Audio Analysis
      const features = lipsync.extractFeatures();
      if (features) {
        // We only need the volume for amplitude control
        onAmplitudeChange(features.volume);
      }

      // 4. Viseme Timing from AWS data
      const currentTime = audio.currentTime * 1000; // in ms
      while (
        visemeIndexRef.current < sortedVisemes.length &&
        currentTime >= sortedVisemes[visemeIndexRef.current].time
      ) {
        onVisemeChange(sortedVisemes[visemeIndexRef.current].value);
        visemeIndexRef.current++;
      }

      animationFrameRef.current = requestAnimationFrame(tick);
    };

    const onPlay = () => {
      lipsync.audioContext.resume(); // Ensure audio context is active
      animationFrameRef.current = requestAnimationFrame(tick);
    };

    const onEnded = () => {
      onVisemeChange('sil');
      onAmplitudeChange(0);
      visemeIndexRef.current = 0;
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };

    audio.addEventListener('play', onPlay);
    audio.addEventListener('ended', onEnded);

    // Auto-play the audio
    audio.play().catch(e => console.error("Audio play error:", e));

    // Cleanup
    return () => {
      audio.pause();
      audio.removeEventListener('play', onPlay);
      audio.removeEventListener('ended', onEnded);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [audioUrl, visemes, onVisemeChange, onAmplitudeChange]);

  // This component does not render any UI itself
  return null;
};
