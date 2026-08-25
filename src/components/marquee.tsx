import { useEffect, useRef, type ReactNode } from "react";

interface MarqueeProps {
  children: ReactNode;
  duration?: number;
  reverse?: boolean;
  className?: string;
  repeat?: number;
}

export function Marquee({
  children,
  duration = 55,
  reverse = false,
  className = "",
  repeat = 4,
}: MarqueeProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const posRef = useRef(0);
  const speedRef = useRef(1);
  const targetSpeedRef = useRef(1);
  const rafRef = useRef<number | null>(null);
  const lastTsRef = useRef<number | null>(null);
  const initRef = useRef(false);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const animate = (ts: number) => {
      const halfW = track.scrollWidth / 2;
      if (halfW < 2) {
        rafRef.current = requestAnimationFrame(animate);
        return;
      }

      if (!initRef.current) {
        posRef.current = reverse ? -halfW : 0;
        initRef.current = true;
      }

      const dt = lastTsRef.current !== null ? Math.min(ts - lastTsRef.current, 50) : 0;
      lastTsRef.current = ts;

      speedRef.current += (targetSpeedRef.current - speedRef.current) * 0.055;

      const pxPerMs = halfW / (duration * 1000);
      const delta = pxPerMs * speedRef.current * dt;

      if (!reverse) {
        posRef.current -= delta;
        if (posRef.current <= -halfW) posRef.current += halfW;
      } else {
        posRef.current += delta;
        if (posRef.current >= 0) posRef.current -= halfW;
      }

      track.style.transform = `translateX(${posRef.current}px)`;
      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [duration, reverse]);

  const items = Array.from({ length: repeat }, (_, i) => (
    <span key={i} className="inline-flex items-center shrink-0">
      {children}
    </span>
  ));

  return (
    <div
      className={`overflow-hidden whitespace-nowrap select-none ${className}`}
      onMouseEnter={() => { targetSpeedRef.current = 0; }}
      onMouseLeave={() => { targetSpeedRef.current = 1; }}
      aria-hidden="true"
    >
      <div
        ref={trackRef}
        className="inline-flex items-center w-max will-change-transform"
        style={{ animation: "none" }}
      >
        <span className="inline-flex items-center shrink-0">{items}</span>
        <span className="inline-flex items-center shrink-0">{items}</span>
      </div>
    </div>
  );
}

export function MarqueeWords({ words, className = "" }: { words: string[]; className?: string }) {
  return (
    <span className={`inline-flex items-center ${className}`}>
      {words.map((w, i) => (
        <span key={`${w}-${i}`} className="inline-flex items-center">
          <span className="uppercase">{w}</span>
          <span className="ticker-dot opacity-40" />
        </span>
      ))}
    </span>
  );
}
