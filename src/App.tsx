import { useState } from "react";
import "./App.css";

function App() {
  const [name, setName] = useState("unknown");

  const fetchNameTesting = async () => {
    try {
      const res = await fetch("/api/");
      console.log("✅ Frontend: fetch /api/health response", res);
      const data = await res.json();
      console.log("✅ Frontend: fetch /api/health data", data);
      setName(data.status || "unknown");
    } catch (error) {
      console.error("❌ Frontend: fetch /api/health error", error);
    }
  };

  return (
    <>
      <div className="card">
        <button onClick={fetchNameTesting} aria-label="get name">
          Name from API is: {name}
        </button>
      </div>
    </>
  );
}

export default App;
