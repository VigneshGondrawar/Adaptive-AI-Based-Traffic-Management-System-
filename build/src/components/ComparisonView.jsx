import { motion } from "framer-motion";

const LABELS = { left: "Left", right: "Right", up: "Top", down: "Bottom" };
const FIXED_TIME = 30; // seconds - what every lane would get in a traditional fixed-timer system

export default function ComparisonView({ result, onRestart }) {
  const { vehicle_counts, green_times, directions } = result;
  const maxTime = Math.max(FIXED_TIME, ...green_times);

  const totalFixed = FIXED_TIME * directions.length;
  const totalAdaptive = green_times.reduce((a, b) => a + b, 0);

  return (
    <div className="min-h-screen text-white px-6 py-12 flex flex-col items-center">
      <h2 className="text-3xl font-bold mb-2">Fixed vs Adaptive Timing</h2>
      <p className="text-slate-400 mb-10 text-center max-w-xl">
        A traditional fixed-timer signal gives every lane the same{" "}
        {FIXED_TIME}s regardless of traffic. This system adapts green time to
        actual vehicle density.
      </p>

      <div className="w-full max-w-3xl space-y-6">
        {directions.map((dir, idx) => (
          <div key={dir}>
            <div className="flex justify-between text-sm mb-1">
              <span className="font-medium">
                {LABELS[dir] || dir} — {vehicle_counts[idx]} vehicles
              </span>
              <span className="text-slate-400">
                Fixed: {FIXED_TIME}s vs Adaptive: {green_times[idx]}s
              </span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-3 mb-1 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(FIXED_TIME / maxTime) * 100}%` }}
                transition={{ duration: 0.8 }}
                className="h-3 bg-slate-400 rounded-full"
              />
            </div>
            <div className="w-full bg-slate-700 rounded-full h-3 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(green_times[idx] / maxTime) * 100}%` }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="h-3 bg-green-500 rounded-full"
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10 bg-slate-800 rounded-xl px-8 py-5 text-center">
        <p className="text-slate-400 text-sm">Total cycle time</p>
        <p className="text-lg">
          Fixed: <span className="font-bold">{totalFixed}s</span> &nbsp;|&nbsp;
          Adaptive: <span className="font-bold text-green-400">{totalAdaptive}s</span>
        </p>
      </div>

      <button
        onClick={onRestart}
        className="mt-8 bg-slate-700 hover:bg-slate-600 transition-colors px-6 py-2.5 rounded-full font-medium"
      >
        Start Over
      </button>
    </div>
  );
}
