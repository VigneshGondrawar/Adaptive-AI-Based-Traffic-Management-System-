import { useState } from "react";
import { motion } from "framer-motion";
import { uploadLaneImages } from "../api";

const DIRECTIONS = [
  { key: "left", label: "Left Lane" },
  { key: "right", label: "Right Lane" },
  { key: "up", label: "Top Lane" },
  { key: "down", label: "Bottom Lane" },
];

export default function ImageUpload({ onResult }) {
  const [files, setFiles] = useState({});
  const [previews, setPreviews] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = (key, file) => {
    setFiles((prev) => ({ ...prev, [key]: file }));
    setPreviews((prev) => ({ ...prev, [key]: URL.createObjectURL(file) }));
  };

  const handleSubmit = async () => {
    const orderedFiles = DIRECTIONS.map((d) => files[d.key]);
    if (orderedFiles.some((f) => !f)) {
      setError("Please upload an image for all four lanes.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const data = await uploadLaneImages(orderedFiles);
      onResult(data);
    } catch (err) {
      setError(
        err?.response?.data?.error ||
          "Upload failed. Is the Flask backend running on port 5000?"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen text-white px-6 py-12 flex flex-col items-center">
      <h2 className="text-3xl font-bold mb-8">Upload Lane Images</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-3xl">
        {DIRECTIONS.map((d) => (
          <motion.div
            key={d.key}
            whileHover={{ scale: 1.02 }}
            className="bg-slate-800 rounded-xl p-4 flex flex-col items-center border border-slate-700"
          >
            <p className="mb-2 font-medium">{d.label}</p>
            {previews[d.key] ? (
              <img
                src={previews[d.key]}
                alt={d.label}
                className="w-full h-40 object-cover rounded-lg mb-3"
              />
            ) : (
              <div className="w-full h-40 flex items-center justify-center bg-slate-700 rounded-lg mb-3 text-slate-400">
                No image selected
              </div>
            )}
            <input
              type="file"
              accept="image/png, image/jpeg, image/jpg, image/gif"
              onChange={(e) => handleFileChange(d.key, e.target.files[0])}
              className="text-sm text-slate-300"
            />
          </motion.div>
        ))}
      </div>

      {error && <p className="text-red-400 mt-6">{error}</p>}

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.97 }}
        onClick={handleSubmit}
        disabled={loading}
        className="mt-8 bg-green-600 hover:bg-green-500 disabled:opacity-50 transition-colors px-8 py-3 rounded-full font-semibold shadow-lg"
      >
        {loading ? "Analyzing traffic..." : "Analyze & Generate Signal"}
      </motion.button>
    </div>
  );
}
