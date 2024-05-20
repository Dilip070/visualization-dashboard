// src/App.js
import React from "react";
import Dashboard from "./components/Dashboard";

function App() {
  return (
    <div
      className="App"
      style={{
        padding: "20px",
        backgroundColor: "#2f3349",
      }}
    >
      <h1 style={{ textAlign: "center", color: "#fff" }}>
        Data Visualization Dashboard
      </h1>
      <Dashboard />
    </div>
  );
}

export default App;
