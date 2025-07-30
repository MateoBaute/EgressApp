
addEventListener("DOMContentLoaded", () => {
  let usuarioActual = JSON.parse(localStorage.getItem("usuarioActual"));
  let panelRegister = document.querySelector(".register-panel");
  
  if (usuarioActual) {
    panelRegister.style.display = "none";
  }else {
    panelRegister.style.display = "block";
  }
});