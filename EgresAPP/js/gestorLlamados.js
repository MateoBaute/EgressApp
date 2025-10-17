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

// Función para mostrar el formulario de postulación
// Función para mostrar el formulario de postulación
function togleFormPostularme(idLlamado) {
    let contenedor = document.getElementById("formPostularmeOferta");
    
    contenedor.innerHTML = `
        <div class="form-container" style="background-color: white; padding: 20px; margin: 20px 0; border-radius: 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
            <h2>Postularme a la Oferta</h2>
            <div class="form-group">
                <label for="curriculumLink">Enlace a tu currículum:</label>
                <input type="url" id="curriculumLink" name="curriculumLink" 
                       placeholder="https://drive.google.com/... o https://canva.com/..." 
                       style="width: 100%; padding: 8px; margin: 5px 0 15px; border: 1px solid #ddd; border-radius: 4px;">
                <small style="color: #666;">Asegúrate de que el enlace sea público y permita solo visualización</small>
            </div>
            <div>
                <button type="button" class="btn btn-primary" onclick="postularme(${idLlamado})">Enviar Postulación</button>
                <button type="button" class="btn btn-secondary" onclick="cancelarPostulacion()">Cancelar</button>
            </div>
        </div>
    `;
    contenedor.style.display = "block";
}

// Función para enviar la postulación
function postularme(idLlamado) {
    const curriculumLink = document.getElementById("curriculumLink").value.trim();
    
    // Validaciones
    if (!curriculumLink) {
        mostrarError('Por favor, ingresa el enlace a tu currículum');
        return;
    }
    
    if (!isValidUrl(curriculumLink)) {
        mostrarError('Por favor, ingresa un enlace válido (https://...)');
        return;
    }
    
    // Obtener información del llamado para saber a qué empresa se postula
    fetch("./API/api_llamados.php")
        .then(response => response.json())
        .then(ofertas => {
            const oferta = ofertas.find(o => o.id_llamado == idLlamado);
            if (!oferta) {
                mostrarError('No se encontró la oferta seleccionada');
                return;
            }
            
            // Enviar la postulación
            return fetch('/API/postular_oferta.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id_llamado: idLlamado,
                    id_empresa: oferta.id_empresa,
                    curriculum_link: curriculumLink
                })
            });
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                mostrarExito('¡Postulación enviada correctamente! La empresa te contactará si estás interesado.');
                cancelarPostulacion();
            } else {
                mostrarError('Error al enviar la postulación: ' + data.error);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            mostrarError('Error al enviar la postulación');
        });
}

// Función para validar URLs
function isValidUrl(string) {
    try {
        new URL(string);
        return true;
    } catch (_) {
        return false;
    }
}

// Función para cancelar la postulación
function cancelarPostulacion() {
    document.getElementById("formPostularmeOferta").style.display = "none";
    document.getElementById("formPostularmeOferta").innerHTML = "";
}

// Modifica la función mostrarOfertasEnContainer para pasar el ID correctamente
function mostrarOfertasEnContainer(ofertas) {
    let contenedor = document.getElementById("ofertasContainer");
    const usuarioLogueado = sessionStorage.getItem('empresaLogueada');
    
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
            </div>
            ${!usuarioLogueado ? `<button class="applyButton btn-primari" onclick="togleFormPostularme(${oferta.id_llamado})">Postularme</button>` : ''}
        </div>
        `;
    });
    html += "</div>";
    contenedor.innerHTML = html;
}

// Modifica la función mostrarOfertasEnContainer para pasar el ID correctamente
function mostrarOfertasEnContainer(ofertas) {
    let contenedor = document.getElementById("ofertasContainer");
    const usuarioLogueado = sessionStorage.getItem('empresaLogueada');
    
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
            </div>
            ${!usuarioLogueado ? `<button class="applyButton btn-primari" onclick="togleFormPostularme(${oferta.id_llamado})">Postularme</button>` : ''}
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
    
    const empresaData = JSON.parse(sessionStorage.getItem('empresaLogueada'));
    let salario = document.getElementById('salarioPublicar').value;
    let horario = document.getElementById('horarioPublicar').value;
    let tipo = document.getElementById('tipoPublicar').value;
    let descripcion = document.getElementById('descripcionPublicar').value;
    let nombre_oferta = document.getElementById('nombre_ofertaPublicar').value;


    // Validar que todos los campos estén completos
    if (!salario || !horario || !tipo || !descripcion || !nombre_oferta ) {
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
        empresaNombre: empresaData.nombre,
        id_empresa: empresaData.id
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


// Función para ver postulaciones (solo para empresas logueadas)
function verPostulaciones() {
    const empresaData = JSON.parse(sessionStorage.getItem('empresaLogueada'));
    
    if (!empresaData) {
        mostrarError('Debes iniciar sesión como empresa para ver las postulaciones');
        return;
    }

    fetch(`./API/obtener_postulaciones_empresa.php?id_empresa=${empresaData.id}`)
        .then(response => {
            if (!response.ok) throw new Error('Error al cargar las postulaciones');
            return response.json();
        })
        .then(data => {
            if (data.success) {
                mostrarPostulacionesEnContainer(data.ofertas);
            } else {
                mostrarError('Error: ' + data.error);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            mostrarError('Error al cargar las postulaciones: ' + error.message);
        });
}

// Función para mostrar las postulaciones en el contenedor
function mostrarPostulacionesEnContainer(ofertas) {
    let contenedor = document.getElementById("ofertasContainer");
    
    if (!ofertas || ofertas.length === 0) {
        contenedor.innerHTML = `
            <div class="empty-state">
                <h3>No tienes ofertas publicadas</h3>
                <p>Publica tu primera oferta para recibir postulaciones</p>
            </div>
        `;
        return;
    }

    let html = '<div class="card-container">';
    
    ofertas.forEach((oferta) => {
        const totalPostulaciones = oferta.postulaciones.length;
        
        html += `
        <div class="card" style="border-left: 4px solid #3498db;">
            <div class="card-content">
                <h3>${oferta.Nombre_Oferta || 'Sin título'}</h3>
                <p><strong>Tipo:</strong> ${oferta.Tipo || 'No especificado'}</p>
                <p><strong>Salario:</strong> $${oferta.Salario || 'No especificado'}</p>
                <p><strong>Horario:</strong> ${oferta.Horario || 'No especificado'}</p>
                <p><strong>Descripción:</strong> ${oferta.Descripción || 'Sin descripción'}</p>
                <div style="margin-top: 15px; padding: 10px; background-color: #f8f9fa; border-radius: 4px;">
                    <p><strong>Postulaciones recibidas:</strong> ${totalPostulaciones}</p>
                </div>
            </div>
        `;
        
        // Mostrar las postulaciones si hay alguna
        if (totalPostulaciones > 0) {
            html += `
            <div style="margin-top: 15px;">
                <h4 style="margin-bottom: 10px;">Postulantes:</h4>
                <div style="max-height: 300px; overflow-y: auto;">
            `;
            
            oferta.postulaciones.forEach((postulacion, index) => {
                const fecha = postulacion.fecha ? new Date(postulacion.fecha).toLocaleDateString() : 'Fecha no disponible';
                
                html += `
                <div style="padding: 10px; margin-bottom: 10px; border: 1px solid #ddd; border-radius: 4px; background-color: white;">
                    <p><strong>Postulación ${index + 1}:</strong></p>
                    <p><strong>Fecha:</strong> ${fecha}</p>
                    <p><strong>Currículum:</strong> 
                        <a href="${postulacion.curriculum_link}" target="_blank" style="color: #3498db; text-decoration: none;">
                            Ver currículum
                        </a>
                    </p>
                </div>
                `;
            });
            
            html += `</div></div>`;
        } else {
            html += `
            <div style="margin-top: 15px; padding: 10px; background-color: #fff3cd; border-radius: 4px;">
                <p style="margin: 0; color: #856404;">Aún no hay postulaciones para esta oferta</p>
            </div>
            `;
        }
        
        html += `</div>`;
    });
    
    html += "</div>";
    contenedor.innerHTML = html;
}



