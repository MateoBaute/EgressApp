window.registrarEmpresa = registrarEmpresa;
window.loginEmpresa = loginEmpresa;


function registrarEmpresa() {
  // Obtener valores directamente
  const nombre = document.getElementById("nombreRegister").value;
  const email = document.getElementById("emailRegister").value;
  const telefono = document.getElementById("telefonoRegister").value;
  const contraseña = document.getElementById("contraseñaRegister").value;
  const confirmarContraseña = document.getElementById("confirmarContraseñaRegister").value;
  const enfoque = document.getElementById("enfoqueRegister").value;
  const direccion = document.getElementById("direccionRegister").value; // Campo vacío como en el código original

  // Validaciones
  if (!nombre || !email || !telefono || !contraseña || !confirmarContraseña || !enfoque) {
    alert('Por favor, complete todos los campos');
    return;
  }

  if (contraseña !== confirmarContraseña) {
    alert('Las contraseñas no coinciden');
    return;
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    alert('Por favor, ingrese un email válido');
    return;
  }

  // Enviar datos directamente sin crear un objeto intermedio
  fetch('./API/registrar_Empresa.php', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      nombre: nombre,
      email: email,
      telefono: telefono,
      contraseña: contraseña,
      enfoque: enfoque,
      direccion: direccion,
      id: 0
    })
  })
  .then(response => {
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      throw new TypeError("El servidor no devolvió JSON");
    }
    return response.json();
  })
  .then(data => {
    if (data.success) {
      alert(`¡Registro exitoso, ${nombre}! Serás redirigido al login`);
      
      // Limpiar formulario
      document.getElementById("nombreRegister").value = "";
      document.getElementById("emailRegister").value = "";    
      document.getElementById("telefonoRegister").value = "";
      document.getElementById("enfoqueRegister").value = "";
      document.getElementById("contraseñaRegister").value = "";
      document.getElementById("confirmarContraseñaRegister").value = "";

      // Redirigir al login
      setTimeout(() => {
        window.location.href = "./verOfertas.html";
      },0);
      
    } else {
      alert('Error: ' + data.error);
    }
  })
  .catch(error => {
    console.error('Error completo:', error);
    alert('Error al registrar la empresa: ' + error.message);
  });
}

// Función auxiliar para validar email
// function validateEmail(email) {
//   const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//   return re.test(email);
// }

function loginEmpresa() {
  const email = document.getElementById("emailLogin").value;
  const contraseña = document.getElementById("contraseñaLogin").value;

  if (!email || !contraseña) {
    alert('Por favor, complete todos los campos');
    return;
  }

  fetch('./API/login_Empresa.php', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      email: email,
      contraseña: contraseña
    })
  })
  .then(response => {
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      throw new TypeError("El servidor no devolvió JSON");
    }
    return response.json();
  })
  .then(data => {
    if (data.success) {
      const empresaLogueada = {
        id: data.empresa.id,
        nombre: data.empresa.nombre,
        email: data.empresa.email,
        telefono: data.empresa.telefono,
        direccion: data.empresa.direccion,
        enfoque: data.empresa.enfoque,
        fechaRegistro: new Date().toISOString(),
      };

      sessionStorage.setItem('empresaLogueada', JSON.stringify(empresaLogueada));
      sessionStorage.setItem('empresaAutenticada', 'true');

      alert(`¡Bienvenido de nuevo, ${empresaLogueada.nombre}!`);

      setTimeout(() => {
        window.location.href = "./verOfertas.html";
      }, 1000);
    } else {
      alert('Error: ' + data.error);
    }
  })
  .catch(error => {
    console.error('Error completo:', error);
    alert('Error al iniciar sesión: ' + error.message);
  });
}


// Función para verificar si hay una empresa logueada al cargar la página
// function verificarAutenticacion() {
//   const empresaAutenticada = sessionStorage.getItem('empresaAutenticada');
//   const empresaLogueada = JSON.parse(sessionStorage.getItem('empresaLogueada') || '{}');
  
//   if (empresaAutenticada === 'true' && empresaLogueada.id) {
//     // Hay una empresa logueada, podemos mostrar su información
//     console.log('Empresa logueada:', empresaLogueada);
//     return true;
//   }
//   return false;
// }

// // Función para obtener los datos de la empresa logueada
// function obtenerEmpresaLogueada() {
//   const empresaLogueada = JSON.parse(sessionStorage.getItem('empresaLogueada') || '{}');
//   return empresaLogueada.id ? empresaLogueada : null;
// }

// Función para cerrar sesión
// function cerrarSesionEmpresa() 
//   sessionStorage.removeItem('empresaLogueada');
//   sessionStorage.removeItem('empresaAutenticada');
//   alert('Sesión cerrada correctamente');
//   window.location.href = "./login_empresa.html";
// }


//Asegurar que las funciones estén disponibles globalmente
//addEventListener("DOMContentLoaded", () => {
// window.registrarEmpresa = registrarEmpresa;
// window.loginEmpresa = loginEmpresa;
// window.validateEmail = validateEmail;
//});