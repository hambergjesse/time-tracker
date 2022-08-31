import Avatar from "../assets/avatar.png";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  const changePath = () => {
    navigate("/info");
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
        <input placeholder="insert name"></input>
        <input placeholder="insert password"></input>
        <button onClick={changePath}>Log In</button>
      </div>
    </div>
  );
};

export default Home;
