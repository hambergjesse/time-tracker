import moment from "moment";
import "moment/locale/fi";

const LateTime = () => {
  const expectedTime = "09:00";
  const expectedTimeStr = moment(expectedTime.toString(), "HH:mm");

  const clockInTime = moment().format("LT");
  const clockInTimeStr = moment(clockInTime.toString(), "HH:mm");

  const duration = moment.duration(clockInTimeStr.diff(expectedTimeStr));

  const hours = parseInt(duration.asHours());
  const minutes = parseInt(duration.asMinutes()) % 60;
  console.log(`You're late ${hours} hours and ${minutes} minutes, bitch.`);

  return <div></div>;
};

export default LateTime;
