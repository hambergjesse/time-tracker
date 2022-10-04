import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { SigninContext } from "./contexts/SigninContext";
import Home from "./pages/Home";
import Info from "./pages/Info";
import Admin from "./pages/Admin";
import React from "react";
import "./scss/index.scss";

// Main App
const App = () => {
  const [userIndex, setUserIndex] = React.useState(0);
  return (
    <div className="App">
      {/* Page Routing */}
      <Router>
        <SigninContext.Provider value={{ userIndex, setUserIndex }}>
          <Routes>
            {/* Home Page */}
            <Route path="/" element={<Home />} />
            {/* User Page */}
            <Route path="/info" element={<Info />} />
            {/* User Page */}
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </SigninContext.Provider>
      </Router>
    </div>
  );
};

export default App;
