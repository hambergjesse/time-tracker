import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import tempLogo from "../assets/temp-logo.png";

// installed package for date formatting
import moment from "moment";
import "moment/locale/fi";

// global index of user profile
let userIndex;

const Home = () => {
  const [data, setData] = useState(null);
  let [wrongLogin, setWrongLogin] = useState("");
  // variable to switch page
  const navigate = useNavigate();
  // global index of user profile
  userIndex = 0;

  // pull userdata from backend
  useEffect(() => {
    fetch("/users")
      .then((res) => res.json())
      .then((actualData) => setData(actualData));
  }, []);

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
    userIndex = !data
      ? "Loading..."
      : data
          .map(function (user) {
            return user.name;
          })
          .indexOf(inputName);

    // get date and time
    const loginDate = moment().format("ddd L");
    const loginTime = moment().format("LT");
    let lastlogin = { date: loginDate, time: loginTime };

    // sent user data object to backend
    const userData = {
      name: data[userIndex].name,
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

  const boop = moment().format("LT");
  console.log(moment(boop).add(5, "hours").format("LT"));

  return (
    <div className="home-container">
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
        <img src={tempLogo} alt="" />
      </div>
    </div>
  );
};

// exports
export default Home;
export { userIndex };
