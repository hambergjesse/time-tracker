import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { userIndex } from "./Home";

import moment from "moment";
import "moment/locale/fi";

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

  // show current week
  let currWeekDay = moment().format("e");
  currWeekDay++;
  console.log(currWeekDay);
  const getCurrentWeek = !data
    ? "Loading..."
    : data[userIndex].pastlogins.slice(0, currWeekDay).map((item, index) => (
        <div id="pastlogin-item" key={index}>
          {item.date + " @ " + item.time}
        </div>
      ));

  // show current week
  let currMonthDay = moment().format("DD");
  console.log(currMonthDay);
  const getCurrentMonth = !data
    ? "Loading..."
    : data[userIndex].pastlogins.slice(0, currMonthDay).map((item, index) => (
        <div id="pastlogin-item" key={index}>
          {item.date + " @ " + item.time}
        </div>
      ));

  // show whole history
  const loginHistory = !data
    ? "Loading..."
    : data[userIndex].pastlogins.map((item, index) => (
        <div id="pastlogin-item" key={index}>
          {item.date + " @ " + item.time}
        </div>
      ));

  return (
    <div className="info-wrapper">
      <div className="info-container">
        <h3 className="info-data-text">User Info:</h3>
        <p className="info-data-text">
          {!data ? "Loading..." : "Username: " + data[userIndex].name}
        </p>
        <p className="info-data-text">
          {!data
            ? "Loading..."
            : "Last Login: " +
              data[userIndex].lastlogin.date +
              " @ " +
              data[userIndex].lastlogin.time}
        </p>
        <h4 className="info-data-text">Login History</h4>
        <div className="info-data-text">
          {!data ? "Loading..." : getCurrentWeek}
        </div>
        <button onClick={changePath}>Log Out</button>
      </div>
    </div>
  );
};

export default Info;
