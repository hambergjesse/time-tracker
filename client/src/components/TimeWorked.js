import moment from "moment";
import "moment/locale/fi";

const TimeWorked = () => {
  const loginTime = "09:00";
  console.log(loginTime);
  const startTime = moment(loginTime.toString(), "HH:mm");
  console.log(startTime);

  const logoutTime = moment().format("LT");
  const endTime = moment(logoutTime.toString(), "HH:mm");
  console.log(endTime);

  const duration = moment.duration(endTime.diff(startTime));
  console.log(duration);

  const hours = parseInt(duration.asHours());
  const minutes = parseInt(duration.asMinutes()) % 60;
  console.log(`time worked: ${hours} hours and ${minutes} minutes.`);

  return <div></div>;
};

export default TimeWorked;
