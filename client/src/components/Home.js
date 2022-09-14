import Avatar from "../assets/avatar.png";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

let userIndex;

const Home = () => {
  const [data, setData] = useState(null);
  const [loginPerms, setLoginPerms] = useState("");
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
    let lastlogin =
      new Date().getDate() +
      "/" +
      (new Date().getMonth() + 1) +
      "/" +
      new Date().getFullYear() +
      " @ " +
      new Date().getHours() +
      ":" +
      new Date().getMinutes();

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
      .then((loginData) => setLoginPerms(loginData));

    !loginPerms
      ? console.log("waiting...")
      : loginPerms === "Success"
      ? changePath()
      : console.log("Not Allowed");
  };

  return (
    <div className="home-container">
      <div className="home-text-container">
        <h1>Futurice Employee Login</h1>
        <p>
          We’re Futurice. We bring together strategy, design, engineering, and
          data to help organisations become resilient, so they can take control
          of their futures.
        </p>
      </div>
      <div className="login-container">
        <img src={Avatar} alt="" />
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
    </div>
  );
};

export default Home;
export { userIndex };
