addEventListener('DOMContentLoaded', () => {
    togglePublicar();
    buttonHidden();
});

function togglePublicar() {
    let publicar = document.getElementById("botonPublicar");
    let usuarioActual = JSON.parse(sessionStorage.getItem("empresaLogueada"));

    if (usuarioActual) {
        publicar.style.display = "block";
    } else {
        publicar.style.display = "none";
    }
}


function buttonHidden() {
    setTimeout(() => {
        const loguedEnterprise = JSON.parse(sessionStorage.getItem("empresaLogueada"));
        const buttons = document.querySelectorAll(".applyButton"); // <-- fixed selector
        const botonEmpresas = document.getElementById('botonVerMisOfertas');

        if (!buttons || buttons.length === 0) {
            // No buttons found
            // alert("No se econtró el botón"); // Optional: remove alert for better UX
        } else {
            if (!loguedEnterprise) {
                botonVerMisOfertas.style.display = "none"
                buttons.forEach(btn => btn.style.display = "none"); // <-- fixed display
            } else {
                buttons.forEach(btn => btn.style.display = "block");
                botonVerMisOfertas.style.display = "block"
            }
        }
    }, 90);
}


addEventListener("DOMContentLoaded", () => {
  const empresaLogueada = JSON.parse(sessionStorage.getItem("empresaLogueada"));

  const publicarOfertaBtn = document.getElementById("empresaBoton");

  if (empresaLogueada) {
    publicarOfertaBtn.style.display = "none";
  }else {
    publicarOfertaBtn.style.display = "block";
  }
});
