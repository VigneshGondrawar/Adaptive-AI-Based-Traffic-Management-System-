import { useState } from "react";
import Home from "./components/Home";
import ImageUpload from "./components/ImageUpload";
import TrafficSignal from "./components/TrafficSignal";
import ComparisonView from "./components/ComparisonView";

// view: "home" | "upload" | "signal" | "comparison"
function App() {
  const [view, setView] = useState("home");
  const [result, setResult] = useState(null);

  const handleResult = (data) => {
    setResult(data);
    setView("signal");
  };

  const restart = () => {
    setResult(null);
    setView("upload");
  };

  return (
    <div className="bg-slate-900 min-h-screen">
      {view === "home" && <Home onStart={() => setView("upload")} />}
      {view === "upload" && <ImageUpload onResult={handleResult} />}
      {view === "signal" && result && (
        <TrafficSignal
          result={result}
          onCompare={() => setView("comparison")}
          onRestart={restart}
        />
      )}
      {view === "comparison" && result && (
        <ComparisonView result={result} onRestart={restart} />
      )}
    </div>
  );
}

export default App;
