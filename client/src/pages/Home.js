import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import tempLogo from "../assets/temp-logo.png";
import adminIcon from "../assets/admin-icon.png";

import TimeWorked from "../components/TimeWorked.js";
import LateTime from "../components/LateTime";

// global context variable setup
import React, { useContext } from "react";
import { SigninContext } from "../contexts/SigninContext";

// installed package for date formatting
import moment from "moment";
import "moment/locale/fi";

const Home = () => {
  const { userIndex, setUserIndex } = useContext(SigninContext);
  const [data, setData] = useState(null);
  let [wrongLogin, setWrongLogin] = useState("");
  // variable to switch page
  const navigate = useNavigate();

  // pull userdata from backend
  useEffect(() => {
    fetch("/users")
      .then((res) => res.json())
      .then((actualData) => setData(actualData));
  }, [userIndex]);

  // change page
  const changePath = () => {
    navigate("/info");
  };

  const handleLoginProcess = () => {
    // select dropdown menu
    const selectElement = document.querySelector("#select");
    // select password field
    const selectPass = document.querySelector("#passfield");
    // check which dropdown option is selected
    const inputName = selectElement.options[selectElement.selectedIndex].value;
    // check inserted password in field
    const inputPass = selectPass.value;
    // reset wrong login message
    setWrongLogin("");

    // check the database index of the selected username
    setUserIndex(
      !data
        ? "Loading..."
        : data
            .map(function (user) {
              return user.name;
            })
            .indexOf(inputName)
    );
    console.log(userIndex);

    // get date and time
    const loginDate = moment().format("ddd L");
    const loginTime = moment().format("LT");
    let lastlogin = { date: loginDate, time: loginTime };

    // sent user data object to backend
    const userData = {
      name: inputName,
      password: inputPass,
      lastlogin: lastlogin,
    };

    // send userdata to verify bcrypt hashed password
    fetch("/users/login/auth", {
      method: "POST",
      body: JSON.stringify(userData),
      headers: {
        "Content-type": "application/json",
      },
    })
      // check if password is correct
      .then((res) => res.json())
      .then((loginData) =>
        !loginData
          ? console.log("waiting...")
          : loginData === "Success"
          ? changePath()
          : setWrongLogin("Wrong login credentials, please try again.")
      );
  };

  return (
    <div className="home-container">
      <TimeWorked />
      <LateTime />
      <div className="left-container">
        <div className="login-container">
          <h1>Digitalents Academy</h1>
          <p>Start your day at Digitalents Academy.</p>
          <select id="select" name="users">
            {/* map/load all available usernames as dropdown list items */}
            {!data
              ? "Loading..."
              : data.map((user) => (
                  <option key={user.id} value={user.name}>
                    {user.name}
                  </option>
                ))}
          </select>
          <input id="passfield" placeholder="insert password"></input>
          <p className="login-container-wronglogin">{wrongLogin}</p>
          <button onClick={handleLoginProcess}>Log In</button>
        </div>
        <p>Login not working? Please contact your teacher.</p>
      </div>
      <div className="right-container">
        <img
          onClick={() => navigate("/admin")}
          className="right-container-admin"
          src={adminIcon}
          alt=""
        />
        <img className="right-container-logo" src={tempLogo} alt="" />
      </div>
    </div>
  );
};

// exports
export default Home;
