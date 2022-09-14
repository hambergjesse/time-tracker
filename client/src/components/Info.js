import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { userIndex } from "./Home";

const Info = () => {
  const [data, setData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("/users")
      .then((res) => res.json())
      .then((actualData) => setData(actualData));
  }, []);

  // change page
  const changePath = () => {
    navigate("/");
  };

  const loginHistory = !data
    ? "Loading..."
    : data[userIndex].pastlogins.map((item, index) => (
        <div key={index}>{item}</div>
      ));

  return (
    <div className="info-container">
      <h3 className="info-data-text">User Info:</h3>
      <p className="info-data-text">
        {!data ? "Loading..." : "Username: " + data[userIndex].name}
      </p>
      <p className="info-data-text">
        {!data ? "Loading..." : "Password: " + data[userIndex].password}
      </p>
      <p className="info-data-text">
        {!data ? "Loading..." : "Last Login: " + data[userIndex].lastlogin}
      </p>
      <h4 className="info-data-text">Login History</h4>
      <div className="info-data-text">
        {!data ? "Loading..." : loginHistory}
      </div>
      <button onClick={changePath}>Log Out</button>
    </div>
  );
};

export default Info;
