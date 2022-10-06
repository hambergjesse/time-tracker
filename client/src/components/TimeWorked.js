import moment from "moment";
import "moment/locale/fi";

const TimeWorked = () => {
  const loginTime = "09:00";
  const startTime = moment(loginTime.toString(), "HH:mm");

  const logoutTime = moment().format("LT");
  const endTime = moment(logoutTime.toString(), "HH:mm");

  const duration = moment.duration(endTime.diff(startTime));

  const hours = parseInt(duration.asHours());
  const minutes = parseInt(duration.asMinutes()) % 60;
  console.log(`Time worked: ${hours} hours and ${minutes} minutes.`);

  return <div></div>;
};

export default TimeWorked;
