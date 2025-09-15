function registrarEmpresa() {
  let nombre = document.getElementById("nombreRegister").value;
  let email = document.getElementById("emailRegister").value;
  let telefono = document.getElementById("telefonoRegister").value;
  let contraseña = document.getElementById("contraseñaRegister").value;
  let confirmarContraseña = document.getElementById("confirmarContraseñaRegister").value;
  let enfoque = document.getElementById("enfoqueRegister").value;

  // Validaciones
  if (!nombre || !email || !telefono || !contraseña || !confirmarContraseña || !enfoque) {
    alert('Por favor, complete todos los campos');
    return;
  }

  if (contraseña !== confirmarContraseña) {
    alert('Las contraseñas no coinciden');
    return;
  }

  if (!validateEmail(email)) {
    alert('Por favor, ingrese un email válido');
    return;
  }

  // Crear objeto con los datos (contraseña en texto plano)
  const datos = {
    nombre: nombre,
    email: email,
    telefono: telefono,
    contraseña: contraseña,
    enfoque: enfoque,
    direccion: "" // Añadir campo dirección aunque esté vacío
  };

  // Enviar datos al servidor con POST
  fetch('./API/registrar_empresa.php', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(datos)
  })
  .then(response => {
    // Verificar si la respuesta es JSON válido
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

      // Redirigir al login después de 2 segundos
      setTimeout(() => {
        window.location.href = "./loginEmpresa.html";
      },);
      
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
function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

function loginEmpresa() {
  let nombre = document.getElementById("nombreLogin").value;
  let email = document.getElementById("emailLogin").value;
  let telefono = document.getElementById("telefonoLogin").value;
  let enfoque = document.getElementById("enfoqueLogin").value;
  let contraseña = document.getElementById("contraseñaLogin").value;

  let contraseñaHasheada = btoa(encodeURIComponent(contraseña));

  let empresaEncontrada = ArrayEmpresas.find(
    (empresa) =>
      empresa.Email === email &&
      empresa.Telefono === telefono &&
      empresa.Enfoque === enfoque &&
      empresa.Nombre === nombre &&
      empresa.Contraseña === contraseñaHasheada
  );

  if (empresaEncontrada) {
    alert(`Bienvenido ${empresaEncontrada.Nombre}`);
  } else {
    alert("Credenciales incorrectas. Por favor, verifica tu información.");
  }
  setTimeout(() => {
    window.location.assign("./index.html");
  });
}

// Asegurar que las funciones estén disponibles globalmente
addEventListener("DOMContentLoaded", () => {
  window.registrarEmpresa = registrarEmpresa;
  window.loginEmpresa = loginEmpresa;
  window.validateEmail = validateEmail;
});