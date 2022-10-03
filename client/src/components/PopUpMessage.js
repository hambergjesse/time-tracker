// welcome popup
import Swal from "sweetalert2";

const PopUpMessage = (iconValue, titleValue, htmlValue, timerValue) => {
  let timerInterval;
  Swal.fire({
    icon: iconValue,
    title: titleValue,
    html: htmlValue,
    timer: timerValue,
    timerProgressBar: true,
    confirmButtonColor: "var(--colorPrimaryPurple)",
    didOpen: () => {},
    willClose: () => {
      clearInterval(timerInterval);
    },
  }).then((result) => {
    /* Read more about handling dismissals below */
    if (result.dismiss === Swal.DismissReason.timer) {
      console.log("I was closed by the timer");
    }
  });
};

export default PopUpMessage;
