import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import tempLogo from "../assets/temp-logo.png";

import moment from "moment";
import "moment/locale/fi";

let userIndex;

const Home = () => {
  const [data, setData] = useState(null);
  const navigate = useNavigate();
  userIndex = 0;

  // pull data from backend
  useEffect(() => {
    fetch("/users")
      .then((res) => res.json())
      .then((actualData) => setData(actualData));
  }, []);

  // change page
  const changePath = () => {
    navigate("/info");
  };

  const handleSearchResult = () => {
    const selectElement = document.querySelector("#select");
    const selectPass = document.querySelector("#passfield");
    const inputName = selectElement.options[selectElement.selectedIndex].value;
    const inputPass = selectPass.value;

    userIndex = !data
      ? "Loading..."
      : data
          .map(function (user) {
            return user.name;
          })
          .indexOf(inputName);

    // get date and time
    const loginDate = moment().format("L");
    const loginTime = moment().format("LT");
    let lastlogin = { date: loginDate, time: loginTime };

    // sent data
    const userData = {
      name: data[userIndex].name,
      password: inputPass,
      lastlogin: lastlogin,
      pastlogins: lastlogin,
    };

    // update user data
    fetch("/user", {
      method: "POST",
      body: JSON.stringify(userData),
      headers: {
        "Content-type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((postData) => console.log(postData));

    // password auth bcrypt
    fetch("/users/login/auth", {
      method: "POST",
      body: JSON.stringify(userData),
      headers: {
        "Content-type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((loginData) =>
        !loginData
          ? console.log("waiting...")
          : loginData === "Success"
          ? changePath()
          : alert("Wrong login credentials, please try again.")
      );
  };

  return (
    <div className="home-container">
      <div className="left-container">
        <div className="login-container">
          <h1>Digitalents Academy</h1>
          <p>Start your day at Digitalents Academy.</p>
          <select id="select" name="users">
            {!data
              ? "Loading..."
              : data.map((user) => (
                  <option key={user.id} value={user.name}>
                    {user.name}
                  </option>
                ))}
          </select>
          <input id="passfield" placeholder="insert password"></input>
          <button onClick={handleSearchResult}>Log In</button>
        </div>
        <p>Login not working? Please contact your teacher.</p>
      </div>
      <div className="right-container">
        <img src={tempLogo} alt="" />
      </div>
    </div>
  );
};

export default Home;
export { userIndex };
