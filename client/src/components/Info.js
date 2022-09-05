import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

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
    : data[0].pastlogins.map((item, index) => <div key={index}>{item}</div>);

  return (
    <div className="info-container">
      <h3 className="info-data-text">User Info:</h3>
      <p className="info-data-text">
        {!data ? "Loading..." : "Username: " + data[0].name}
      </p>
      <p className="info-data-text">
        {!data ? "Loading..." : "Password: super secret password"}
      </p>
      <p className="info-data-text">
        {!data ? "Loading..." : "Last Login: " + data[0].lastlogin}
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
