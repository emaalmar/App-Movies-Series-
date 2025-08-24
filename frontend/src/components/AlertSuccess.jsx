import { useEffect } from "react";
import Swal from "sweetalert2";

export const AlertSucces = ({ title, text, icon, onClose }) => {
  useEffect(() => {
    Swal.fire({
      title: title,
      text: text,
      icon: icon
    }).then(() => {
      if (onClose) onClose();
    });
  }, []);

  return null;
}


// export const AlertSucces = ({ title, text, icon, onClose }) => {
//   useEffect(() => {
//     Swal.fire({
//       title: title,
//       text: text,
//       icon: icon
//     }).then(() => {
//       if (onClose) onClose();
//     });
//   }, []);

//   return null;
// }