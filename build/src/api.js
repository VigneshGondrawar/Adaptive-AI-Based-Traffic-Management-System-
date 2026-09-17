import axios from "axios";

// Flask backend base URL. Override with a .env value (VITE_API_URL) if needed.
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:5000";

export async function uploadLaneImages(files) {
  const formData = new FormData();
  files.forEach((file) => {
    if (file) formData.append("image", file);
  });

  const response = await axios.post(`${API_BASE_URL}/upload`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return response.data; // { vehicle_counts, green_times, directions }
}
