import { motion } from "framer-motion";

export default function Home({ onStart }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-white px-6">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-4xl md:text-5xl font-bold mb-4 text-center"
      >
        🚦 Adaptive Traffic Management System
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="text-slate-300 text-lg text-center max-w-2xl mb-10"
      >
        Upload images for each lane and let YOLOv8-powered vehicle detection
        dynamically calculate how long each direction's signal should stay
        green — busier lanes get more time.
      </motion.p>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.97 }}
        onClick={onStart}
        className="bg-blue-600 hover:bg-blue-500 transition-colors text-white font-semibold px-8 py-3 rounded-full shadow-lg"
      >
        Get Started
      </motion.button>
    </div>
  );
}
