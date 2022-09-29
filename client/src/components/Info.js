import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
// global index of user profile
import { userIndex } from "./Home";
import tempLogo from "../assets/temp-logo.png";

// welcome popup
import Swal from "sweetalert2";
//import withReactContent from "sweetalert2-react-content";

// installed package for date formatting
import moment from "moment";
import "moment/locale/fi";

const Info = () => {
  let [clockInList, setClockInListUpdate] = useState(""),
    [clockOutList, setClockOutListUpdate] = useState(""),
    [isDisabled, setisDisabled] = useState(false);
  const [clockInTime, setClockInTime] = useState(),
    [clockOutTime, setClockOutTime] = useState(),
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

  // clock-in/out popup message via SweetAlert2
  const popUpMessage = (iconValue, titleValue, htmlValue, timerValue) => {
    let timerInterval;
    Swal.fire({
      icon: iconValue,
      title: titleValue,
      html: htmlValue,
      timer: timerValue,
      timerProgressBar: true,
      confirmButtonColor: "var(--colorPrimaryPurple)",
      didOpen: () => {},
      willClose: () => {
        clearInterval(timerInterval);
      },
    }).then((result) => {
      /* Read more about handling dismissals below */
      if (result.dismiss === Swal.DismissReason.timer) {
        console.log("I was closed by the timer");
      }
    });
  };

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
    // disable clock-in button and enable clock-out
    setisDisabled(true);

    // clock-in popup
    popUpMessage("success", "You have clocked in!", "", 1500);
  };

  // what happens when you click the "Clock-In" button?
  const handleClockOut = () => {
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
    popUpMessage("info", "You have clocked out!", "", 2500);
  };

  // dropdown check-in/out filter system
  const [selectedFilter, setSelectedFilter] = useState();

  // dropdown menu options
  const options = [
    { value: "", text: "Choose an option" },
    { value: "week", text: "This Week" },
    { value: "month", text: "This Month" },
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
      } else if (selectedFilter === "") {
        clockInList = thisWeekList(data[userIndex].pastlogins);
        clockOutList = thisWeekList(data[userIndex].pastlogouts);
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
                <div className="info-data-list">
                  {/* display selected duration from login history */}
                  {!data ? "Loading..." : clockInList}
                </div>
              </div>
              <div className="info-data-text">
                <h3>Check-Outs</h3>
                <div className="info-data-list">
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
