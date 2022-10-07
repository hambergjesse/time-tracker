import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

// installed package for date formatting
import moment from "moment";
import "moment/locale/fi";

const Admin = () => {
  const [data, setData] = useState(null);
  let [selectUserIndex, setSelectUserIndex] = useState(0);

  // pull userdata from backend
  useEffect(() => {
    fetch("/users")
      .then((res) => res.json())
      .then((actualData) => setData(actualData));
  }, []);

  // change page
  const navigate = useNavigate(),
    changePath = () => {
      navigate("/");
    };

  // Change user password and re-hash it ( wIP )
  const changePassword = () => {
    // select dropdown menu
    const selectElement = document.querySelector(
      "#admin-changepassword-select"
    );
    // select password field
    const selectPass = document.querySelector(
      "#admin-changepassword-passfield"
    );
    // check which dropdown option is selected
    const inputName = selectElement.options[selectElement.selectedIndex].value;
    // check inserted password in field
    const inputPass = selectPass.value;

    // check the database index of the selected username
    !data
      ? console.log("waiting")
      : setSelectUserIndex(
          data
            .map(function (user) {
              return user.name;
            })
            .indexOf(inputName)
        );

    // sent user data object to backend
    const userPassData = {
      name: data[selectUserIndex].name,
      password: inputPass,
    };

    // send userdata to verify bcrypt hashed password
    fetch("/admin/change-password/", {
      method: "POST",
      body: JSON.stringify(userPassData),
      headers: {
        "Content-type": "application/json",
      },
    }).then((res) => console.log(res));
  };

  // Create new user ( WIP )
  const createNewUser = () => {
    // select name field
    const selectName = document.querySelector("#admin-createuser-name-field");
    // check inserted name in field
    const inputName = selectName.value;
    // select password field
    const selectPass = document.querySelector("#admin-createuser-pass-field");
    // check inserted password in field
    const inputPass = selectPass.value;

    // get date and time
    const loginDate = moment().format("ddd L");
    const loginTime = moment().format("LT");
    let lastlogin = { date: loginDate, time: loginTime };

    let newUserData;
    if (!data && !inputName) {
      console.log("waiting for data");
    } else {
      newUserData = {
        name: inputName,
        password: inputPass,
        id: `${data.length + 1}`,
        lastlogin: lastlogin,
        pastlogins: [],
        pastlogouts: [],
        isClockedIn: false,
      };
      fetch("/admin/create-user/", {
        method: "POST",
        body: JSON.stringify(newUserData),
        headers: {
          "Content-type": "application/json",
        },
      }).then((res) => console.log(res));
    }
  };

  // Delete user ( WIP )
  const deleteUser = () => {
    // select name field
    const selectName = document.querySelector("#admin-deleteuser-select");
    // check inserted name in field
    const inputName = selectName.options[selectName.selectedIndex].value;

    let deleteUserData;
    if (!data && !inputName) {
      console.log("waiting for data");
    } else {
      deleteUserData = {
        name: inputName,
      };
      fetch("/admin/delete-user/", {
        method: "POST",
        body: JSON.stringify(deleteUserData),
        headers: {
          "Content-type": "application/json",
        },
      }).then((res) => console.log(res));
    }
  };

  return (
    <div className="admin-wrapper">
      <div className="admin-header-container">
        <h2>Admin Panel</h2>
        <p>
          {/* display last login date and time of specific user */}
          Use your power wisely..
        </p>
        {/* logout */}
        <button onClick={changePath}>Log Out</button>
      </div>
      <div className="admin-content-wrapper">
        <div className="admin-usersearch-container">
          <h3>Change user password</h3>
          <select id="admin-changepassword-select" name="users">
            {/* map/load all available usernames as dropdown list items */}
            {!data
              ? "Loading..."
              : data.map((user) => (
                  <option key={user.id} value={user.name}>
                    {user.name}
                  </option>
                ))}
          </select>
          <input
            id="admin-changepassword-passfield"
            placeholder="change password"
          ></input>
          <button onClick={changePassword}>Change</button>
        </div>
        <div className="admin-createuser-container">
          <h3>Create new user</h3>
          <input
            id="admin-createuser-name-field"
            placeholder="username"
          ></input>
          <input
            id="admin-createuser-pass-field"
            placeholder="password"
          ></input>
          <button onClick={createNewUser}>Create</button>
        </div>
        <div className="admin-deleteuser-container">
          <h3>Delete user</h3>
          <select id="admin-deleteuser-select" name="users">
            {/* map/load all available usernames as dropdown list items */}
            {!data
              ? "Loading..."
              : data.map((user) => (
                  <option key={user.id} value={user.name}>
                    {user.name}
                  </option>
                ))}
          </select>
          <button onClick={deleteUser}>Change</button>
        </div>
      </div>
    </div>
  );
};

export default Admin;
