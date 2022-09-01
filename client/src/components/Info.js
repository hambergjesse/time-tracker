import { useState, useEffect } from "react";

const Info = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch("/users")
      .then((res) => res.json())
      .then((actualData) => setData(actualData));
  }, []);

  return (
    <div className="info-container">
      <p className="info-data-text">
        {!data ? "Loading..." : data["items"][0].lastlogin}
      </p>
    </div>
  );
};

export default Info;
