import { useEffect } from "react";
import Swal from "sweetalert2";

<<<<<<< HEAD
export const AlertSucces = ({ title, text, icon, onClose }) => {
=======
export const AlertSuccess = ({ title, text, icon, onClose }) => {
>>>>>>> entrega-inicial
  useEffect(() => {
    Swal.fire({
      title: title,
      text: text,
      icon: icon
    }).then(() => {
      if (onClose) onClose();
    });
  }, [icon, onClose, text, title]);

  return null;
}
