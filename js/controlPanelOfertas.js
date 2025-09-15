addEventListener('DOMContentLoaded', () => {
    togglePublicar();
});

function togglePublicar() {
    let publicar = document.getElementById("botonPublicar");
    let usuarioActual = JSON.parse(sessionStorage.getItem("usuarioActual"));

    if (usuarioActual) {
        publicar.style.display = "block";
    } else {
        publicar.style.display = "none";
    }
}


function botonEliminar() {
    let nombreOferta = prompt("Ingresa el nombre de la oferta que desa eliiminar: ");

    let usuarioActual = JSON.parse(sessionStorage.getItem("usuarioActual"));

    if (usuarioActual.nombreEmpresas == nombreOferta.nombreEmpresas) {
        let botonEliminar = document.getElementById("button");
        botonEliminar.display = "block";
        return;
    }

}