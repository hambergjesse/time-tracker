import { useState, useEffect } from "react";
//
import Header from "./components/Header";
import Footer from "./components/Footer";
import Main from "./components/Main";
//
import React from "react";
import "./scss/index.scss";

const App = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch("/api")
      .then((res) => res.json())
      .then((data) => setData(data.message));
  }, []);

  return (
    <div className="App">
      <Header />
      <Main />
      <p className="data-text">{!data ? "Loading..." : data}</p>
      <Footer />
    </div>
  );
};

export default App;
