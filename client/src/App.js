import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Info from "./pages/Info";
import React from "react";
import "./scss/index.scss";

// Main App
const App = () => {
  return (
    <div className="App">
      {/* Page Routing */}
      <Router>
        <Routes>
          {/* Home Page */}
          <Route path="/" element={<Home />} />
          {/* User Page */}
          <Route path="/info" element={<Info />} />
        </Routes>
      </Router>
    </div>
  );
};

export default App;
