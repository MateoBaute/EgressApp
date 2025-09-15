
addEventListener("DOMContentLoaded", () => {
  let usuarioActual = JSON.parse(localStorage.getItem("usuarioActual"));

  let panelRegister = document.getElementById("registro");
  let registerPanel = document.getElementById("register-panel");

  if (usuarioActual) {
    panelRegister.style.display = "none";
    registerPanel.style.display = "none";
  }else {
    registerPanel.style.display = "block";
    panelRegister.style.display = "block";
  }
});