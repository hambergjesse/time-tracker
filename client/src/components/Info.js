import { useState, useEffect } from "react";

const Info = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch("/api")
      .then((res) => res.json())
      .then((data) => setData(data.message));
  }, []);

  return (
    <div className="info-container">
      <p className="info-data-text">{!data ? "Loading..." : data}</p>
    </div>
  );
};

export default Info;
