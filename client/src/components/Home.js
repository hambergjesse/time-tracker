import Avatar from "../assets/avatar.png";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

const Home = () => {
  const [data, setData] = useState(null);
  const navigate = useNavigate();

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
    const inputName = selectElement.options[selectElement.selectedIndex].value;
    console.log(inputName);

    changePath();
    return !data ? "Loading..." : data.indexOf(inputName);
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
        <input placeholder="insert password"></input>
        <button onClick={handleSearchResult}>Log In</button>
      </div>
    </div>
  );
};

export default Home;
