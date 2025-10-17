// Función para obtener currículums desde la API
function obtenerCurriculumsEmpresa() {
    const empresaData = JSON.parse(sessionStorage.getItem('empresaLogueada'));
    
    if (!empresaData) {
        throw new Error('No hay empresa logueada');
    }

    // Obtener el ID de la empresa (con soporte para ambos formatos)
    const idEmpresa = empresaData.Id_empresa || empresaData.id;
    console.log('🔄 Obteniendo currículums para empresa ID:', idEmpresa);
    
    return fetch(`https://egresap.sbs/API/obtener_curriculums_empresa.php?id_empresa=${idEmpresa}`)
        .then(response => {
            console.log('📡 Status:', response.status, response.statusText);
            
            if (!response.ok) {
                throw new Error(`Error ${response.status}: ${response.statusText}`);
            }
            
            // Siempre obtener como texto primero
            return response.text().then(text => {
                console.log('📡 Respuesta completa:', text);
                
                try {
                    // Parsear como JSON
                    const data = JSON.parse(text);
                    console.log('✅ JSON parseado correctamente');
                    return data;
                } catch (e) {
                    console.error('❌ Error parseando JSON:', e);
                    throw new Error('El servidor no devolvió JSON válido');
                }
            });
        })
        .then(data => {
            console.log('📊 Datos recibidos:', data);
            
            if (data.success) {
                return data.curriculums;
            } else {
                throw new Error(data.error || 'Error del servidor');
            }
        });
}

function cargarEstadisticasEmpresa() {
    const empresaData = JSON.parse(sessionStorage.getItem('empresaLogueada'));
    if (!empresaData) return;

    const idEmpresa = empresaData.Id_empresa || empresaData.id;

    fetch("https://egresap.sbs/API/estadisticas_empresa.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id_empresa: idEmpresa })
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            document.getElementById("card-ofertas").textContent = data.total_ofertas;
            document.getElementById("card-postulaciones").textContent = data.total_postulaciones;
            document.getElementById("card-popular").textContent =
                `${data.oferta_popular} (${data.postulaciones_popular} postulaciones)`;
        } else {
            console.error("Error:", data.error);
        }
    })
    .catch(err => console.error("Error al cargar estadísticas:", err));
}

// Ejecutar al cargar la página
document.addEventListener("DOMContentLoaded", cargarEstadisticasEmpresa);



// Función principal: mostrar ofertas con postulaciones
function mostrarOfertasConPostulaciones() {
    const container = document.getElementById('ofertasContainer');
    const loading = document.getElementById('loadingState');

    if (loading) loading.style.display = 'block';

    obtenerCurriculumsEmpresa()
        .then(curriculums => {
            if (loading) loading.style.display = 'none';

            if (!curriculums || curriculums.length === 0) {
                container.innerHTML = `
                    <div class="empty-state">
                        <div class="empty-state-icon">📭</div>
                        <h3>No hay postulaciones recibidas</h3>
                        <p>Tus ofertas aún no tienen postulantes</p>
                    </div>
                `;
                return;
            }

            // Agrupar currículums por nombre de oferta
            const ofertasMap = {};
            curriculums.forEach(item => {
                if (!ofertasMap[item.Nombre_Oferta]) {
                    ofertasMap[item.Nombre_Oferta] = [];
                }
                ofertasMap[item.Nombre_Oferta].push(item.curriculum_link);
            });

            let html = '';
            Object.keys(ofertasMap).forEach((nombreOferta, i) => {
                const curris = ofertasMap[nombreOferta];
                html += `
                    <div class="oferta-card">
                        <div class="oferta-header">
                            <h3>${nombreOferta}</h3>
                            <p>${curris.length} postulante${curris.length !== 1 ? 's' : ''}</p>
                            <button class="btn btn-primary" onclick="togglePostulaciones(${i})">Ver Postulaciones</button>
                        </div>
                        <div class="postulaciones-list" id="postulaciones-${i}" style="display:none;">
                            ${curris.map((link, idx) => `
                                <div class="postulacion-card">
                                    <p><strong>Postulación #${idx + 1}</strong></p>
                                    <a href="${link}" target="_blank" class="btn btn-secondary">Ver Currículum</a>
                                    <button onclick="copiarEnlace('${link}')" class="btn btn-light">Copiar enlace</button>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                `;
            });

            container.innerHTML = html;
        })
        .catch(error => {
            console.error('❌ Error cargando postulaciones:', error);
            if (loading) loading.style.display = 'none';
            container.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">⚠️</div>
                    <h3>Error al cargar postulaciones</h3>
                    <p>${error.message}</p>
                    <button onclick="mostrarOfertasConPostulaciones()" class="btn btn-primary">Reintentar</button>
                </div>
            `;
        });
}

// Alternar visibilidad de las postulaciones
function togglePostulaciones(id) {
    const div = document.getElementById(`postulaciones-${id}`);
    if (div.style.display === 'none') {
        div.style.display = 'block';
    } else {
        div.style.display = 'none';
    }
}

// Inicializar automáticamente si existe el contenedor
document.addEventListener('DOMContentLoaded', function() {
    mostrarOfertasConPostulaciones();
});


// Función para mostrar los currículums en una página
function mostrarCurriculums() {
    const container = document.getElementById('curriculumsContainer');
    const loading = document.getElementById('loadingState');
    
    console.log('🔄 Iniciando carga de currículums...');
    
    if (loading) loading.style.display = 'block';
    if (container) container.innerHTML = '<div class="loading"><div class="loading-spinner"></div><p>Cargando currículums...</p></div>';

    obtenerCurriculumsEmpresa()
        .then(curriculums => {
            console.log('✅ Currículums cargados correctamente:', curriculums);
            
            if (loading) loading.style.display = 'none';
            
            if (!curriculums || curriculums.length === 0) {
                if (container) {
                    container.innerHTML = `
                        <div class="empty-state">
                            <div class="empty-state-icon">📭</div>
                            <h3>No hay currículums recibidos</h3>
                            <p>Aún no has recibido postulaciones con currículums</p>
                        </div>
                    `;
                }
                return;
            }

            // Mostrar currículums
            if (container) {
                mostrarCurriculumsEnHTML(curriculums, container);
            }
        })
        .catch(error => {
            console.error('❌ Error:', error);
            if (loading) loading.style.display = 'none';
            if (container) {
                container.innerHTML = `
                    <div class="empty-state">
                        <div class="empty-state-icon">⚠️</div>
                        <h3>Error al cargar los currículums</h3>
                        <p>${error.message}</p>
                        <button onclick="mostrarCurriculums()" class="btn btn-primary">Reintentar</button>
                    </div>
                `;
            }
        });
}

// Función para mostrar currículums en HTML
function mostrarCurriculumsEnHTML(curriculums, container) {
    let html = `
        <div class="curriculums-header">
            <h3>📚 Currículums Recibidos</h3>
            <p>Total: ${curriculums.length} currículum${curriculums.length !== 1 ? 's' : ''}</p>
        </div>
        <div class="curriculums-list">
    `;
    
    curriculums.forEach((curriculum, index) => {
        html += `
            <div class="curriculum-item">
                <div class="curriculum-header">
                    <span class="curriculum-number">Currículum #${index + 1}</span>
                </div>
                <div class="curriculum-content">
                    <p><strong>Enlace del currículum:</strong></p>
                    <a href="${curriculum.curriculum_link}" target="_blank" class="curriculum-link">
                        ${curriculum.curriculum_link}
                    </a>
                    <div class="curriculum-actions">
                        <a href="${curriculum.curriculum_link}" target="_blank" class="btn btn-primary">
                            📄 Ver Currículum
                        </a>
                        <button onclick="copiarEnlace('${curriculum.curriculum_link}')" class="btn btn-secondary">
                            📋 Copiar Enlace
                        </button>
                    </div>
                </div>
            </div>
        `;
    });
    
    html += `</div>`;
    container.innerHTML = html;
}

// Función para copiar enlace al portapapeles
function copiarEnlace(enlace) {
    navigator.clipboard.writeText(enlace).then(() => {
        alert('✅ Enlace copiado al portapapeles');
    }).catch(err => {
        console.error('Error al copiar:', err);
        alert('❌ Error al copiar el enlace');
    });
}

// Función para usar en cualquier página
function cargarCurriculumsEmpresa() {
    // Verificar si estamos en una página que tiene el contenedor para currículums
    if (document.getElementById('curriculumsContainer')) {
        mostrarCurriculums();
    }
}

// Inicializar automáticamente si existe el contenedor
document.addEventListener('DOMContentLoaded', function() {
    obtenerCurriculumsEmpresa();
});