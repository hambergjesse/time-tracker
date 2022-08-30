import Avatar from "../assets/avatar.png";

const Login = () => {
  return (
    <div className="login-container">
      <img src={Avatar} alt="" />
      <input placeholder="insert name"></input>
      <input placeholder="insert password"></input>
      <button>Sign In</button>
    </div>
  );
};

export default Login;
