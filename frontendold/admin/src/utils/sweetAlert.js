import Swal from "sweetalert2";

export const showAlert = ({
  icon = "success",
  title,
  text,
  confirmButtonText = "OK",
  timer,
  showConfirmButton = true,
}) => {
  return Swal.fire({
    icon,
    title,
    text,
    timer,
    showConfirmButton,
    confirmButtonText,
    background: "#1e3a8a",
    color: "#ffffff",
    confirmButtonColor: "#06b6d4",
    customClass: {
      popup: "theme-alert",
      title: "theme-alert-title",
      htmlContainer: "theme-alert-text",
      confirmButton: "theme-alert-btn",
    },
  });
};