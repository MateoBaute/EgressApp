
addEventListener("DOMContentLoaded", () => {
  const empresaLogueada = JSON.parse(sessionStorage.getItem("empresaLogueada"));

  const publicarOfertaBtn = document.getElementById("publicarOfertaBtn");

  if (empresaLogueada) {
    publicarOfertaBtn.style.display = "none";
  }else {
    publicarOfertaBtn.style.display = "block";
  }
});