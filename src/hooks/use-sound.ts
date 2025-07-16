import { Howl } from 'howler';
import { useCallback } from 'react';

type SoundOptions = {
  volume?: number;
  loop?: boolean;
  playbackRate?: number;
};

export const useSound = (src: string, options?: SoundOptions) => {
  const sound = new Howl({
    src: [src],
    volume: options?.volume || 1,
    loop: options?.loop || false,
    rate: options?.playbackRate || 1,
    html5: true, // Use HTML5 Audio to avoid Web Audio API limitations on mobile
  });

  const play = useCallback(() => {
    sound.play();
  }, [sound]);

  const stop = useCallback(() => {
    sound.stop();
  }, [sound]);

  const pause = useCallback(() => {
    sound.pause();
  }, [sound]);

  return { play, stop, pause, sound };
};