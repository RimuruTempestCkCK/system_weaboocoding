import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";

// Custom Styled SweetAlert Mixin matching WeabooCoding Emerald Theme
const CustomSwal = Swal.mixin({
  customClass: {
    popup: "custom-swal-popup",
    title: "custom-swal-title",
    htmlContainer: "custom-swal-content",
    confirmButton: "custom-swal-confirm-btn",
    cancelButton: "custom-swal-cancel-btn",
    denyButton: "custom-swal-deny-btn"
  },
  buttonsStyling: false
});

/**
 * Floating Toast Notification Success
 */
export function showToastSuccess(title, text = "") {
  return Swal.fire({
    icon: "success",
    title: title,
    text: text,
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    iconColor: "#059669",
    customClass: {
      popup: "swal-toast-emerald"
    }
  });
}

/**
 * Floating Toast Notification Error
 */
export function showToastError(title, text = "") {
  return Swal.fire({
    icon: "error",
    title: title,
    text: text,
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3500,
    timerProgressBar: true,
    iconColor: "#ef4444"
  });
}

/**
 * Floating Toast Notification Info
 */
export function showToastInfo(title, text = "") {
  return Swal.fire({
    icon: "info",
    title: title,
    text: text,
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    iconColor: "#2563eb"
  });
}

/**
 * Premium Full Alert Success Modal
 */
export function showAlertSuccess(title, text = "") {
  return CustomSwal.fire({
    icon: "success",
    title: title,
    text: text,
    confirmButtonText: "OK, Mengerti",
    iconColor: "#059669"
  });
}

/**
 * Premium Full Alert Error Modal
 */
export function showAlertError(title, text = "") {
  return CustomSwal.fire({
    icon: "error",
    title: title,
    text: text,
    confirmButtonText: "Tutup",
    iconColor: "#ef4444"
  });
}

/**
 * Confirmation Dialog for Deleting Items
 */
export async function showConfirmDelete(title = "Hapus Data?", text = "Tindakan ini tidak dapat dibatalkan!") {
  const result = await CustomSwal.fire({
    title: title,
    text: text,
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Ya, Hapus Data",
    cancelButtonText: "Batal",
    iconColor: "#d97706",
    focusCancel: true
  });

  return result.isConfirmed;
}

/**
 * Confirmation Dialog for General Actions (Reset Data, Disconnect, etc)
 */
export async function showConfirmAction({
  title,
  text,
  confirmButtonText = "Ya, Lanjutkan",
  cancelButtonText = "Batal",
  icon = "question"
}) {
  const result = await CustomSwal.fire({
    title: title,
    text: text,
    icon: icon,
    showCancelButton: true,
    confirmButtonText: confirmButtonText,
    cancelButtonText: cancelButtonText,
    iconColor: icon === "warning" ? "#d97706" : "#059669",
    focusCancel: true
  });

  return result.isConfirmed;
}
