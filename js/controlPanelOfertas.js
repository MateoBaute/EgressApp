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
    let button = document.querySelectorAll("applyButton");

    if (button == null || button == undefined || button == "") {

        alert("No se econtró el botón");

    } else {
        
        if (loguedEnterprise) {
            button.display = "none"; // = en lugar de ==
        } else {
            button.display = "block"; // = en lugar de ==
        }
        return;
    }
}, 90);
}

