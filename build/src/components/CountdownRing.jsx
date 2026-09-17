import { useEffect, useState } from "react";

const RADIUS = 45;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS; // ~282.74, matches tailwind.config.js keyframes

export default function CountdownRing({ duration, color = "green", active }) {
  const [remaining, setRemaining] = useState(duration);

  useEffect(() => {
    setRemaining(duration);
    if (!active) return;

    const interval = setInterval(() => {
      setRemaining((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, [duration, active]);

  const progress = duration > 0 ? remaining / duration : 0;
  const dashoffset = CIRCUMFERENCE * (1 - progress);
  const animationClass = color === "green" ? "animate-fill-green" : "animate-fill-blue";
  const strokeColor = color === "green" ? "#22c55e" : "#3b82f6";

  return (
    <div className="relative w-28 h-28">
      <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
        <circle
          cx="50"
          cy="50"
          r={RADIUS}
          fill="none"
          stroke="#334155"
          strokeWidth="8"
        />
        <circle
          cx="50"
          cy="50"
          r={RADIUS}
          fill="none"
          stroke={strokeColor}
          strokeWidth="8"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={dashoffset}
          style={{ "--dashoffset": dashoffset }}
          className={active ? animationClass : ""}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center text-white font-bold text-xl">
        {remaining}s
      </div>
    </div>
  );
}
