import { Usuario } from "./classUsuario.js";

let ArrayUsuarios = JSON.parse(localStorage.getItem("ArrayUsuarios")) || [];

function registrarUsuario() {
  let ArrayUsuarios = JSON.parse(localStorage.getItem("ArrayUsuarios")) || [];

  let nombre = document.getElementById("nombreRegister").value.trim();
  let contraseña = document.getElementById("contraseñaRegister").value;
  let confirmContraseña = document.getElementById("contraseñaConfirm").value;

  if (!nombre || !contraseña || !confirmContraseña) {
    alert("Todos los campos son obligatorios");
    return;
  }

  if (!/^[a-zA-Z0-9]+$/.test(nombre)) {
    alert("El nombre de usuario solo puede contener letras y números");
    return;
  }

  if (nombre.length < 4) {
    alert("El nombre de usuario debe tener al menos 4 caracteres");
    return;
  }

  if (!/(?=.*\d)(?=.*[A-Z]).{8,}/.test(contraseña)) {
    alert("La contraseña debe tener al menos 8 caracteres, incluir un número y una mayúscula");
    return;
  }

  if (contraseña !== confirmContraseña) {
    alert("Las contraseñas no coinciden");
    return;
  }

  let contraseñaHasheada = btoa(encodeURIComponent(contraseña));

  let usuarioExistente = ArrayUsuarios.find((user) => user.Nombre === nombre);
  if (usuarioExistente) {
    alert("El nombre de usuario ya está registrado");
    return;
  }

  let nuevoUsuario = new Usuario(nombre, contraseñaHasheada);
  
  ArrayUsuarios.push(nuevoUsuario);
  localStorage.setItem("ArrayUsuarios", JSON.stringify(ArrayUsuarios));
  alert(`¡Registro exitoso, ${nombre}! Serás redirigido al login`);
  setTimeout(() => {
    window.location.assign("loginUsuario.html");
  });
}

function login() {
  let ArrayUsuarios = JSON.parse(localStorage.getItem("ArrayUsuarios")) || [];

  let nombre = document.getElementById("nombreLogin").value;
  let contraseña = document.getElementById("contraseñaLogin").value;
  let contraseñaHasheada = btoa(encodeURIComponent(contraseña));

  if (!nombre || !contraseña) {
    alert("Por favor complete todos los campos");
    return;
  }
  // let usuarioExistente = ArrayUsuarios.find((user) => user.Nombre === nombre);

  let usuarioEncontrado = ArrayUsuarios.find(
    (usuario) => usuario._nombre === nombre && usuario._contraseña === contraseñaHasheada
  );

  if (usuarioEncontrado) {
    localStorage.setItem("usuarioActual", JSON.stringify(usuarioEncontrado));
    alert("Inicio de sesión exitoso");
    setTimeout(() => {
      window.location.assign("index.html");
    });
  } else {
    alert("Usuario no encontrado o credenciales incorrectas");
    return;
  }
}

window.registrarUsuario = registrarUsuario;
window.login = login;