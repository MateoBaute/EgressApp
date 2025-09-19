// import { togleFormPostularme } from "./controlPanelOfertas.js";

document.addEventListener("DOMContentLoaded", () => {
    mostrarOfertas();
});

// Función para mostrar/ocultar filtros
function toggleFiltros() {
    const filtros = document.getElementById('filtros');
    if (filtros.style.display === 'none') {
        filtros.style.display = 'block';
        // Ocultar formulario de publicación si está visible
        document.getElementById("formPublicarOferta").style.display = "none";
    } else {
        filtros.style.display = 'none';
    }
}

// Función para filtrar ofertas
function filtrarOfertas() {
    let tipo = document.getElementById("tipo").value;
    let salario = document.getElementById("salario").value;

    // Si no hay filtros aplicados, mostrar todas las ofertas
    if (tipo === 'todas' && salario === '') {
        mostrarOfertas();
        return;
    }

    fetch(`./API/llamados_busqueda.php?tipo=${tipo}&salario=${salario}`)
        .then((response) => {
            if (!response.ok) throw new Error("Error al cargar las ofertas filtradas");
            return response.json();
        })
        .then((ofertas) => {
            mostrarOfertasEnContainer(ofertas);
        })
        .catch((error) => {
            mostrarError("Error al filtrar ofertas: " + error.message);
        });
}

// Función para mostrar todas las ofertas
function mostrarOfertas() {
    fetch("./API/api_llamados.php")
        .then((response) => {
            if (!response.ok) throw new Error("Error al cargar las ofertas");
            return response.json();
        })
        .then((ofertas) => {
            mostrarOfertasEnContainer(ofertas);
        })
        .catch((error) => {
            mostrarError("Error al cargar ofertas: " + error.message);
        });
}

function togleFormPostularme() {
    let contenedor = document.getElementById("formPostularme");
    if (contenedor.display === "none") {
        contenedor.display = "block";
    } else {
        contenedor.display = "none";
    }
}


// Función para mostrar ofertas en el contenedor
function mostrarOfertasEnContainer(ofertas) {
    let contenedor = document.getElementById("ofertasContainer");
    
    if (!ofertas || ofertas.length === 0) {
        contenedor.innerHTML = `
            <div class="empty-state">
                <h3>No hay ofertas disponibles</h3>
                <p>Intenta ajustar tus filtros o publicar una nueva oferta</p>
            </div>
        `;
        return;
    }

    let html = '<div class="card-container">';
    ofertas.forEach((oferta) => {
        html += `
        <div class="card">
            <div class="card-content">
                <h3>${oferta.Nombre_Oferta || 'Sin título'}</h3>
                <p><strong>Empresa:</strong> ${oferta.Empresa || 'No especificada'}</p>
                <p><strong>Salario:</strong> $${oferta.Salario || 'No especificado'}</p>
                <p><strong>Horario:</strong> ${oferta.Horario || 'No especificado'}</p>
                <p><strong>Tipo:</strong> ${oferta.Tipo || 'No especificado'}</p>
                <p><strong>Descripción:</strong> ${oferta.Descripción || 'Sin descripción'}</p>
                <button class="applyButton" id="${oferta.id_llamado}" class="btn btn-primari" onclick="togleFormPostularme()">Postularme</button>
            </div>
        </div>
        `;
    });
    html += "</div>";
    contenedor.innerHTML = html;
}

// Función para mostrar/ocultar formulario de publicación
function mostrarFormOferta() {
    let contenedor = document.getElementById("formPublicarOferta");
    if (contenedor.style.display === "none") {
        contenedor.style.display = "block";
        // Ocultar filtros al mostrar el formulario de publicación
        document.getElementById("filtros").style.display = "none";
    } else {
        contenedor.style.display = "none";
    }
}

// Función para publicar una nueva oferta
function publicarOferta() {
    // Obtener valores del formulario
    let salario = document.getElementById('salarioPublicar').value;
    let horario = document.getElementById('horarioPublicar').value;
    let tipo = document.getElementById('tipoPublicar').value;
    let descripcion = document.getElementById('descripcionPublicar').value;
    let nombre_oferta = document.getElementById('nombre_ofertaPublicar').value;
    let empresaNombre = document.getElementById('empresaNombrePublicar').value;

    // Validar que todos los campos estén completos
    if (!salario || !horario || !tipo || !descripcion || !nombre_oferta || !empresaNombre) {
        mostrarError('Por favor, complete todos los campos');
        return;
    }

    // Crear objeto con los datos
    const datos = {
        salario: salario,
        horario: horario,
        tipo: tipo,
        descripcion: descripcion,
        nombre_oferta: nombre_oferta,
        empresaNombre: empresaNombre
    };

    // Enviar datos al servidor con POST
    fetch('./API/publicar_oferta.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(datos)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            mostrarExito('Oferta publicada correctamente');
            // Ocultar el formulario y resetear campos
            cancelarPublicacion();
            // Recargar las ofertas
            mostrarOfertas();
        } else {
            mostrarError('Error: ' + (data.error || 'Error desconocido'));
        }
    })
    .catch(error => {
        console.log(JSON.stringify(datos));
        console.error('Error:', error);
        mostrarError('Error al publicar la oferta');
    });
}

// Función para cancelar la publicación
function cancelarPublicacion() {
    document.getElementById('formPublicarOferta').style.display = 'none';
    // Resetear campos del formulario
    document.getElementById('salarioPublicar').value = '';
    document.getElementById('horarioPublicar').value = '';
    document.getElementById('tipoPublicar').value = '';
    document.getElementById('descripcionPublicar').value = '';
    document.getElementById('nombre_ofertaPublicar').value = '';
    document.getElementById('empresaNombrePublicar').value = '';
}

// Función para mostrar mensajes de error
function mostrarError(mensaje) {
    const container = document.getElementById('messageContainer');
    if (container) {
        container.innerHTML = `<div class="error-message">${mensaje}</div>`;
        
        // Auto-ocultar después de 5 segundos
        setTimeout(() => {
            container.innerHTML = '';
        }, 5000);
    } else {
        console.error("Error: " + mensaje);
    }
}

// Función para mostrar mensajes de éxito
function mostrarExito(mensaje) {
    const container = document.getElementById('messageContainer');
    if (container) {
        container.innerHTML = `<div class="success-message">${mensaje}</div>`;
        
        // Auto-ocultar después de 5 segundos
        setTimeout(() => {
            container.innerHTML = '';
        }, 5000);
    } else {
        console.log("Éxito: " + mensaje);
    }
}