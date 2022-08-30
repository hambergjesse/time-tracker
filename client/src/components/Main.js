import Login from "./Login";

const Main = () => {
  return (
    <div className="main-container">
      <div className="main-text-container">
        <h1>Futurice Employee Login</h1>
        <p>
          We’re Futurice. We bring together strategy, design, engineering, and
          data to help organisations become resilient, so they can take control
          of their futures.
        </p>
      </div>
      <Login />
    </div>
  );
};

export default Main;
