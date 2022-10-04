import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import tempLogo from "../assets/temp-logo.png";

// global context variable setup
import React, { useContext } from "react";
import { SigninContext } from "../contexts/SigninContext";

// check-in/out popup message
import PopUpMessage from "../components/PopUpMessage";

// installed package for date formatting
import moment from "moment";
import "moment/locale/fi";

const Info = () => {
  const { userIndex } = useContext(SigninContext);
  console.log(userIndex);
  let [clockInList, setClockInListUpdate] = useState([]),
    [clockOutList, setClockOutListUpdate] = useState([]),
    [isDisabled, setisDisabled] = useState(false);
  const [clockInTime, setClockInTime] = useState(""),
    [clockOutTime, setClockOutTime] = useState(""),
    [data, setData] = useState(null),
    navigate = useNavigate();

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

  // what happens when you click the "Clock-In" button?
  const handleClockIn = () => {
    // get date and time
    const loginDate = moment().format("ddd L");
    const loginTime = moment().format("LT");

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
    // disable clock-in button and enable clock-out
    setisDisabled(true);
    // clock-in popup
    PopUpMessage("success", "You have clocked in!", "", 1500);
  };

  // what happens when you click the "Clock-In" button?
  const handleClockOut = () => {
    // get date and time
    const loginDate = moment().format("ddd L");
    const loginTime = moment().format("LT");
    let lastlogin = { date: loginDate, time: loginTime };

    // sent clock-in data object to backend
    const clockOutData = {
      name: data[userIndex].name,
      pastlogouts: lastlogin,
      lastlogin: lastlogin,
    };

    // send user data to backend
    fetch("/clockout", {
      method: "POST",
      body: JSON.stringify(clockOutData),
      headers: {
        "Content-type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((clockOutRes) => console.log(clockOutRes));

    setClockOutTime(getWeekClockOuts);
    // disable clock-out and enable clock-in button
    setisDisabled(false);
    // clock-in popup
    PopUpMessage("info", "You have clocked out!", "", 2500);
  };

  // dropdown check-in/out filter system
  const [selectedFilter, setSelectedFilter] = useState(""),
    [listScrollBar, setListScrollBar] = useState({ overflow: "hidden" });

  // dropdown menu options
  const options = [
    { value: "default", text: "Choose an option" },
    { value: "month", text: "This Month" },
    { value: "week", text: "This Week" },
    { value: "total", text: "Total History" },
  ];

  useEffect(() => {
    console.log(selectedFilter);
    let clockInList, clockOutList;
    let currMonthDay = moment().format("DD");

    // display this month list function
    const thisMonthList = (value) => {
      return !data
        ? "Loading..."
        : value.slice(0, currMonthDay).map((item, index) => (
            <div id="pastlogin-item" key={index}>
              {item.date + " @ " + item.time}
            </div>
          ));
    };

    // display this week list function
    const thisWeekList = (value) => {
      return !data
        ? "Loading..."
        : value.slice(0, currWeekDay).map((item, index) => (
            <div id="pastlogin-item" key={index}>
              {item.date + " @ " + item.time}
            </div>
          ));
    };

    // display total list function
    const thisTotalList = (value) => {
      return !data
        ? "Loading..."
        : value.map((item, index) => (
            <div id="pastlogin-item" key={index}>
              {item.date + " @ " + item.time}
            </div>
          ));
    };

    // check which option is selected
    if (!selectedFilter) {
      console.log("Waiting for selected filter...");
      !data
        ? console.log()
        : (clockInList = thisWeekList(data[userIndex].pastlogins));
      !data
        ? console.log()
        : (clockOutList = thisWeekList(data[userIndex].pastlogouts));
    } else {
      if (selectedFilter === "month") {
        clockInList = thisMonthList(data[userIndex].pastlogins);
        clockOutList = thisMonthList(data[userIndex].pastlogouts);
      } else if (selectedFilter === "week") {
        clockInList = thisWeekList(data[userIndex].pastlogins);
        clockOutList = thisWeekList(data[userIndex].pastlogouts);
      } else if (selectedFilter === "total") {
        clockInList = thisTotalList(data[userIndex].pastlogins);
        clockOutList = thisTotalList(data[userIndex].pastlogouts);
      } else if (selectedFilter === "default") {
        clockInList = thisWeekList(data[userIndex].pastlogins);
        clockOutList = thisWeekList(data[userIndex].pastlogouts);
      }
    }

    setClockInListUpdate(clockInList);
    setClockOutListUpdate(clockOutList);
  }, [currWeekDay, data, selectedFilter, userIndex]);

  // enable/disable scroll bar based on list length
  useEffect(() => {
    !selectedFilter
      ? console.log("waiting for selectfilter")
      : clockInList.length > 7 || clockOutList.length > 7
      ? setListScrollBar({ overflowY: "scroll" })
      : setListScrollBar({ overflowY: "hidden" });
  }, [clockInList, clockOutList, selectedFilter]);

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
            <button
              disabled={isDisabled ? true : false}
              onClick={handleClockIn}
              className="clockin-button"
            >
              Clock-In
            </button>
            {/* Clock-Out Button */}
            <button
              disabled={isDisabled ? false : true}
              onClick={handleClockOut}
              className="clockout-button"
            >
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
                <div style={listScrollBar} className="info-data-list">
                  {/* display selected duration from login history */}
                  {!data ? "Loading..." : clockInList}
                </div>
              </div>
              <div className="info-data-text">
                <h3>Check-Outs</h3>
                <div style={listScrollBar} className="info-data-list">
                  {/* display selected duration from logout history */}
                  {!data ? "Loading..." : clockOutList}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Info;
