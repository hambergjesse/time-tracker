import { useState, useEffect } from "react";

const Info = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch("/users")
      .then((res) => res.json())
      .then((actualData) => setData(actualData.name));
  }, []);

  return (
    <div className="info-container">
      <p className="info-data-text">{!data ? "Loading..." : data}</p>
    </div>
  );
};

export default Info;
