// import { useState, useEffect } from "react";
//
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./components/Home";
import Info from "./components/Info";
//
import React from "react";
import "./scss/index.scss";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

const App = () => {
  return (
    <div className="App">
      <Router>
        <Header />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/info" element={<Info />} />
        </Routes>
        <Footer />
      </Router>
    </div>
  );
};

export default App;
