addEventListener("DOMContentLoaded", () => {
  mostrarOfertas();
});

function filtrarOfertas() {
  // let ubicacion = document.getElementById('ubicacion').value;
  let tipo = document.getElementById("tipo").value;
  let salario = document.getElementById("salario").value;


    fetch(`./API/llamados_busqueda.php?tipo=${tipo}&salario=${salario}`)
      .then((response) => {
        if (!response.ok) throw new Error("Error al cargar las ofertas");
        return response.json();
      })
      .then((ofertas) => {
        let contenedor = document.getElementById("ofertasContainer");
        if (ofertas.length === 0) {
          contenedor.innerHTML = "<p>No hay ofertas disponibles.</p>";
          return;
        }

        let html = '<div class="card-container">';
        ofertas.forEach((oferta) => {
          html += `
          <div class="card">
            <h3>${oferta.Nombre_Oferta}</h3>
            <p><strong>Salario:</strong> $${oferta.Salario}</p>
            <p><strong>Horario:</strong> ${oferta.Tipo}</p>
            <p><strong>Descripción:</strong> ${oferta.Descripción}</p>
          </div>
        `;
        });
        html += "</div>";
        contenedor.innerHTML = html;
      })
      .catch((error) => {
        document.getElementById(
          "contenedor"
        ).innerHTML = `<p>Error: ${error.message}</p>`;
      });
  }


function mostrarOfertas() {
  fetch("./API/api_llamados.php")
    .then((response) => {
      if (!response.ok) throw new Error("Error al cargar las ofertas");
      return response.json();
    })
    .then((ofertas) => {
      let contenedor = document.getElementById("ofertasContainer");
      if (ofertas.length === 0) {
        contenedor.innerHTML = "<p>No hay ofertas disponibles.</p>";
        return;
      }

      let html = '<div class="card-container">';
      ofertas.forEach((oferta) => {
        html += `
          <div class="card">
            <h3>${oferta.Nombre_Oferta}</h3>
            <p><strong>Salario:</strong> $${oferta.Salario}</p>
            <p><strong>Horario:</strong> ${oferta.Tipo}</p>
            <p><strong>Descripción:</strong> ${oferta.Descripción}</p>
          </div>
        `;
      });
      html += "</div>";
      contenedor.innerHTML = html;
    })
    .catch((error) => {
      document.getElementById(
        "contenedor"
      ).innerHTML = `<p>Error: ${error.message}</p>`;
    });
}

function mostrarFormOferta() {
  let contenedor = document.getElementById("formPublicarOferta");
  if (contenedor.style.display === "none") {
    contenedor.style.display = "block";
  } else {
    contenedor.style.display = "none";
  }
}


function publicarOferta() {
  // Obtener valores del formulario
  let salario = document.getElementById('salarioPublicar').value;
  let horario = document.getElementById('horarioPublicar').value;
  let tipo = document.getElementById('tipoPublicar').value;
  let descripcion = document.getElementById('descripcionPublicar').value;
  let nombre_oferta = document.getElementById('nombre_ofertaPublicar').value;

  // Validar que todos los campos estén completos
  if (!salario || !horario || !tipo || !descripcion || !nombre_oferta) {
    alert('Por favor, complete todos los campos');
    return;
  }

  // Crear FormData para enviar los datos
  let formData = new FormData();
  formData.append('salario', salario);
  formData.append('horario', horario);
  formData.append('tipo', tipo);
  formData.append('descripcion', descripcion);
  formData.append('nombre_oferta', nombre_oferta);

  // Enviar datos al servidor
  fetch('./API/publicar_oferta.php', {
    method: 'GET',
  })
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      alert('Oferta publicada correctamente');
      // Ocultar el formulario y resetear campos
      document.getElementById('formPublicarOferta').style.display = 'none';
      document.querySelector('#formPublicarOferta form').reset();
      // Recargar las ofertas
      mostrarOfertas();
    } else {
      alert('Error: ' + data.error);
    }
  })
  .catch(error => {
    console.error('Error:', error);
    alert('Error al publicar la oferta');
  });
}
