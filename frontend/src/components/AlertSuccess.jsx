import { useEffect } from 'react'
import Swal from 'sweetalert2'

export const AlertSuccess = ({ title, text, icon, onClose }) => {
  useEffect(() => {
    Swal.fire({
      title,
      text,
      icon
    }).then(() => {
      if (onClose) onClose()
    })
  }, [icon, onClose, text, title])

  return null
}
