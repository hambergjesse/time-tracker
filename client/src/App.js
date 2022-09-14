import Home from "./components/Home";
import Info from "./components/Info";
import React from "react";
import "./scss/index.scss";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

const App = () => {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/info" element={<Info />} />
        </Routes>
      </Router>
    </div>
  );
};

export default App;
