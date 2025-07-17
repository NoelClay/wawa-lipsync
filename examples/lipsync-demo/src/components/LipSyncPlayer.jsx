import React, { useState, useRef, useEffect } from 'react';

export const LipSyncPlayer = ({ audioUrl, visemes, onVisemeChange }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);
  const visemeIndexRef = useRef(0);

  useEffect(() => {
    const audio = new Audio(audioUrl);
    audioRef.current = audio;

    const handleTimeUpdate = () => {
      const currentTime = audioRef.current.currentTime * 1000; // Convert to milliseconds
      
      // Ensure visemes are sorted by time
      const sortedVisemes = [...visemes].sort((a, b) => a.time - b.time);

      while (visemeIndexRef.current < sortedVisemes.length && 
             currentTime >= sortedVisemes[visemeIndexRef.current].time) {
        onVisemeChange(sortedVisemes[visemeIndexRef.current].value);
        visemeIndexRef.current++;
      }
    };

    const handleAudioEnded = () => {
      onVisemeChange('sil');
      setIsPlaying(false);
      visemeIndexRef.current = 0; // Reset for next play
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleAudioEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleAudioEnded);
      audio.pause();
      audio.currentTime = 0;
    };
  }, [audioUrl, visemes, onVisemeChange]);

  const handlePlay = () => {
    if (isPlaying) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      onVisemeChange('sil');
      setIsPlaying(false);
      visemeIndexRef.current = 0; // Reset for next play
    } else {
      audioRef.current.play().catch(e => console.error('Audio play error:', e));
      setIsPlaying(true);
    }
  };

  return (
    <div style={{ position: 'absolute', top: '20px', left: '20px', zIndex: 10 }}>
      <button 
        onClick={handlePlay}
        style={{ 
            padding: '10px 20px', 
            fontSize: '16px', 
            cursor: 'pointer',
            backgroundColor: isPlaying ? 'red' : 'green',
            color: 'white',
            border: 'none',
            borderRadius: '5px'
        }}
      >
        {isPlaying ? 'Stop' : 'Play Lip Sync'}
      </button>
    </div>
  );
};