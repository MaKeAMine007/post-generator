import { useState, useEffect, useRef } from "react";

const STEPS: [number, number][] = [
  [15, 400],
  [35, 1100],
  [55, 2200],
  [72, 3600],
  [88, 5200],
  [95, 7500],
];

export function useProgressSimulation(isLoading: boolean) {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);
  const wasLoadingRef = useRef(false);

  useEffect(() => {
    const timers: number[] = [];

    if (isLoading) {
      wasLoadingRef.current = true;
      setProgress(0);
      setVisible(true);

      STEPS.forEach(([value, delay]) => {
        timers.push(window.setTimeout(() => setProgress(value), delay));
      });
    } else if (wasLoadingRef.current) {
      wasLoadingRef.current = false;
      setProgress(100);
      timers.push(
        window.setTimeout(() => {
          setVisible(false);
          setProgress(0);
        }, 900)
      );
    }

    return () => timers.forEach(window.clearTimeout);
  }, [isLoading]);

  return { progress, visible };
}
