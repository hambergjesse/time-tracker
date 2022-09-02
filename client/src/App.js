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
        <p className="data-text">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Culpa earum
          recusandae quos veritatis, reprehenderit rerum inventore dolor eum
          placeat libero similique ipsa voluptas in aut facere ducimus numquam
          impedit, quasi ipsum temporibus commodi. Molestiae velit suscipit
          pariatur error.
        </p>
        <Footer />
      </Router>
    </div>
  );
};

export default App;
