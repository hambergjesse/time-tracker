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
  let [clockInList, setClockInListUpdate] = useState("");
  let [clockOutList, setClockOutListUpdate] = useState("");
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

  // clock-in/out popup message via SweetAlert2
  const popUpMessage = (titleValue, htmlValue, timerValue) => {
    let timerInterval;
    Swal.fire({
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

    // clock-in popup
    popUpMessage(
      "Welcome to work!",
      "We hope you have a great day at Digitalents Academy.",
      1500
    );
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

    // clock-in popup
    popUpMessage(
      "Have a nice day!",
      "We hope that you had a productive day here at Digitalents Academy.",
      2500
    );
  };

  // check which option of the history filter is selected
  const options = [
    { value: "", text: "Choose an option" },
    { value: "week", text: "This Week" },
    { value: "month", text: "This Month" },
    { value: "total", text: "Total History" },
  ];

  // dropdown check-in/out filter system
  const [selectedFilter, setSelectedFilter] = useState();

  useEffect(() => {
    console.log(selectedFilter);
    let clockInList, clockOutList;
    let currMonthDay = moment().format("DD");

    const thisMonthList = (value) => {
      return !data
        ? "Loading..."
        : value.slice(0, currMonthDay).map((item, index) => (
            <div id="pastlogin-item" key={index}>
              {item.date + " @ " + item.time}
            </div>
          ));
    };

    const thisWeekList = (value) => {
      return !data
        ? "Loading..."
        : value.slice(0, currWeekDay).map((item, index) => (
            <div id="pastlogin-item" key={index}>
              {item.date + " @ " + item.time}
            </div>
          ));
    };

    const thisTotalList = (value) => {
      return !data
        ? "Loading..."
        : value.map((item, index) => (
            <div id="pastlogin-item" key={index}>
              {item.date + " @ " + item.time}
            </div>
          ));
    };

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
      } else {
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
