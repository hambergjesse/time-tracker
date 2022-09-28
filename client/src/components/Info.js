import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
// global index of user profile
import { userIndex } from "./Home";
import tempLogo from "../assets/temp-logo.png";

// installed package for date formatting
import moment from "moment";
import "moment/locale/fi";

const Info = () => {
  const [clockInList, setClockInListUpdate] = useState("");
  const [clockOutList, setClockOutListUpdate] = useState("");
  const [clockInTime, setClockInTime] = useState();
  const [clockOutTime, setClockOutTime] = useState();
  const [data, setData] = useState(null);
  const navigate = useNavigate();

  // fetch userdata
  useEffect(() => {
    fetch("/users")
      .then((res) => res.json())
      .then((actualData) => setData(actualData));
  }, [clockInTime, clockOutTime]);

  // change page
  const changePath = () => {
    navigate("/");
  };

  // show current week
  let currWeekDay = moment().format("e");
  currWeekDay++;
  let getWeekClockIns = !data
    ? "Loading..."
    : data[userIndex].pastlogins.slice(0, currWeekDay).map((item, index) => (
        <div id="pastlogin-item" key={index}>
          {item.date + " @ " + item.time}
        </div>
      ));
  let getWeekClockOuts = !data
    ? "Loading..."
    : data[userIndex].pastlogouts.slice(0, currWeekDay).map((item, index) => (
        <div id="pastlogin-item" key={index}>
          {item.date + " @ " + item.time}
        </div>
      ));

  // get date and time
  const loginDate = moment().format("ddd L");
  const loginTime = moment().format("LT");
  // what happens when you click the "Clock-In" button?
  const handleClockIn = () => {
    let lastlogin = { date: loginDate, time: loginTime };

    // sent clock-in data object to backend
    const clockInData = {
      name: data[userIndex].name,
      pastlogins: lastlogin,
      lastlogin: lastlogin,
    };

    // send user data to backend
    fetch("/clockin", {
      method: "POST",
      body: JSON.stringify(clockInData),
      headers: {
        "Content-type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((clockInRes) => console.log(clockInRes));

    setClockInTime(getWeekClockIns);
  };

  // what happens when you click the "Clock-In" button?
  const handleClockOut = () => {
    let lastlogin = { date: loginDate, time: loginTime };

    // sent clock-in data object to backend
    const clockInData = {
      name: data[userIndex].name,
      pastlogouts: lastlogin,
      lastlogin: lastlogin,
    };

    // send user data to backend
    fetch("/clockout", {
      method: "POST",
      body: JSON.stringify(clockInData),
      headers: {
        "Content-type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((clockOutRes) => console.log(clockOutRes));

    setClockOutTime(getWeekClockOuts);
  };

  // check which option of the history filter is selected
  const options = [
    { value: "", text: "Choose an option" },
    { value: "week", text: "This Week" },
    { value: "month", text: "This Month" },
    { value: "total", text: "Total History" },
  ];

  const [selectedFilter, setSelectedFilter] = useState();

  useEffect(() => {
    console.log(selectedFilter);
    let clockInList;
    let clockOutList;
    let currMonthDay = moment().format("DD");

    if (!selectedFilter) {
      console.log("Waiting for selected filter...");
    } else {
      if (selectedFilter === "month") {
        clockInList = !data
          ? "Loading..."
          : data[userIndex].pastlogins
              .slice(0, currMonthDay)
              .map((item, index) => (
                <div id="pastlogin-item" key={index}>
                  {item.date + " @ " + item.time}
                </div>
              ));
        clockOutList = !data
          ? "Loading..."
          : data[userIndex].pastlogouts
              .slice(0, currMonthDay)
              .map((item, index) => (
                <div id="pastlogin-item" key={index}>
                  {item.date + " @ " + item.time}
                </div>
              ));
      } else if (selectedFilter === "week") {
        clockInList = !data
          ? "Loading..."
          : data[userIndex].pastlogins
              .slice(0, currWeekDay)
              .map((item, index) => (
                <div id="pastlogin-item" key={index}>
                  {item.date + " @ " + item.time}
                </div>
              ));
        clockOutList = !data
          ? "Loading..."
          : data[userIndex].pastlogouts
              .slice(0, currWeekDay)
              .map((item, index) => (
                <div id="pastlogin-item" key={index}>
                  {item.date + " @ " + item.time}
                </div>
              ));
      } else {
        clockInList = !data
          ? "Loading..."
          : data[userIndex].pastlogins.map((item, index) => (
              <div id="pastlogin-item" key={index}>
                {item.date + " @ " + item.time}
              </div>
            ));
        clockOutList = !data
          ? "Loading..."
          : data[userIndex].pastlogouts.map((item, index) => (
              <div id="pastlogin-item" key={index}>
                {item.date + " @ " + item.time}
              </div>
            ));
      }
    }
    setClockInListUpdate(clockInList);
    setClockOutListUpdate(clockOutList);
  }, [currWeekDay, data, selectedFilter]);

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
          <div className="info-right-container-buttons">
            {/* Clock-In Button */}
            <button onClick={handleClockIn} className="clockin-button">
              Clock-In
            </button>
            {/* Clock-Out Button */}
            <button onClick={handleClockOut} className="clockout-button">
              Clock-Out
            </button>
          </div>
          <div className="info-right-text-container">
            {/* dropdown filter for timestamps (daily/weekly/monthly times) */}
            <select
              id="info-select"
              value={selectedFilter}
              name="filter"
              onChange={() =>
                setSelectedFilter(
                  document.querySelector("#info-select").options[
                    document.querySelector("#info-select").selectedIndex
                  ].value
                )
              }
            >
              {options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.text}
                </option>
              ))}
            </select>
            <div className="info-right-list-container">
              <div className="info-data-text">
                <h3>Check-Ins</h3>
                {/* display selected duration from login history */}
                {!data ? "Loading..." : clockInList}
              </div>
              <div className="info-data-text">
                <h3>Check-Outs</h3>
                {/* display selected duration from logout history */}
                {!data ? "Loading..." : clockOutList}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Info;
