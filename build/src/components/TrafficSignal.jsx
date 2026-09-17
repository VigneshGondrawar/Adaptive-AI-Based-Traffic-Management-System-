import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import CountdownRing from "./CountdownRing";

const LABELS = { left: "Left", right: "Right", up: "Top", down: "Bottom" };

export default function TrafficSignal({ result, onCompare, onRestart }) {
  const { vehicle_counts, green_times, directions } = result;

  // Index of the lane currently active (green). Cycles through lanes
  // in order of descending green time so the busiest lane goes first.
  const order = [...directions.keys()].sort(
    (a, b) => green_times[b] - green_times[a]
  );
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    const currentLaneIndex = order[activeIdx];
    const duration = green_times[currentLaneIndex] * 1000;
    const timer = setTimeout(() => {
      setActiveIdx((prev) => (prev + 1) % order.length);
    }, duration);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeIdx]);

  const activeLaneIndex = order[activeIdx];

  return (
    <div className="min-h-screen text-white px-6 py-12 flex flex-col items-center">
      <h2 className="text-3xl font-bold mb-2">Live Signal Simulation</h2>
      <p className="text-slate-400 mb-8">
        Green light order is prioritized by vehicle density (busiest lane first).
      </p>

      <div className="grid grid-cols-2 gap-6 w-full max-w-3xl">
        {directions.map((dir, idx) => {
          const isActive = idx === activeLaneIndex;
          return (
            <motion.div
              key={dir}
              animate={{ scale: isActive ? 1.04 : 1 }}
              className={`rounded-xl p-6 flex flex-col items-center border-2 ${
                isActive
                  ? "border-green-500 bg-slate-800"
                  : "border-slate-700 bg-slate-800/60"
              }`}
            >
              <p className="font-semibold mb-1">{LABELS[dir] || dir}</p>
              <p className="text-slate-400 text-sm mb-3">
                {vehicle_counts[idx]} vehicle{vehicle_counts[idx] === 1 ? "" : "s"} detected
              </p>

              <CountdownRing
                duration={green_times[idx]}
                color={isActive ? "green" : "blue"}
                active={isActive}
              />

              <span
                className={`mt-3 text-xs font-bold uppercase tracking-wide px-3 py-1 rounded-full ${
                  isActive ? "bg-green-600" : "bg-slate-600"
                }`}
              >
                {isActive ? "GREEN" : "RED"}
              </span>
            </motion.div>
          );
        })}
      </div>

      <div className="flex gap-4 mt-10">
        <button
          onClick={onCompare}
          className="bg-blue-600 hover:bg-blue-500 transition-colors px-6 py-2.5 rounded-full font-medium"
        >
          View Comparison
        </button>
        <button
          onClick={onRestart}
          className="bg-slate-700 hover:bg-slate-600 transition-colors px-6 py-2.5 rounded-full font-medium"
        >
          Upload New Images
        </button>
      </div>
    </div>
  );
}
