import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
// global index of user profile
import { userIndex } from "./Home";
import tempLogo from "../assets/temp-logo.png";

// installed package for date formatting
import moment from "moment";
import "moment/locale/fi";

const Info = () => {
  const [data, setData] = useState(null);
  const navigate = useNavigate();

  // fetch userdata
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

  // show current month
  let currMonthDay = moment().format("DD");
  console.log(currMonthDay);
  const getCurrentMonth = !data
    ? "Loading..."
    : data[userIndex].pastlogins.slice(0, currMonthDay).map((item, index) => (
        <div id="pastlogin-item" key={index}>
          {item.date + " @ " + item.time}
        </div>
      ));

  // show whole login history
  const loginHistory = !data
    ? "Loading..."
    : data[userIndex].pastlogins.map((item, index) => (
        <div id="pastlogin-item" key={index}>
          {item.date + " @ " + item.time}
        </div>
      ));

  return (
    <div className="info-wrapper">
      <div className="info-header-container">
        <h2>{!data ? "Loading..." : data[userIndex].name}</h2>
        <p>
          {/* display last login date and time of specific user */}
          {!data
            ? "Loading..."
            : "Last Login: " +
              data[userIndex].lastlogin.date +
              " @ " +
              data[userIndex].lastlogin.time}
        </p>
        {/* logout */}
        <button onClick={changePath}>Log Out</button>
      </div>
      <div className="info-display-wrapper">
        <div className="info-left-container">
          <img src={tempLogo} alt="" />
        </div>
        <div className="info-right-container">
          <div className="info-right-text-container">
            <div className="info-data-text">
              {/* display selected duration from login history */}
              {!data ? "Loading..." : getCurrentMonth}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Info;
