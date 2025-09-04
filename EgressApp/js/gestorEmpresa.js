import { Empresa } from "./classEmpresa.js";

let ArrayEmpresas = JSON.parse(localStorage.getItem("ArrayEmpresas")) || [];

function registrarEmpresa() {
  let nombre = document.getElementById("nombreRegister").value;
  let email = document.getElementById("emailRegister").value;
  let telefono = document.getElementById("telefonoRegister").value;
  let contraseña = document.getElementById("contraseñaRegister").value;

  let contraseñaHasheada = btoa(encodeURIComponent(contraseña));

  let enfoque = document.getElementById("enfoqueRegister").value;

  let nuevaEmpresa = new Empresa(
    nombre,
    contraseñaHasheada,
    telefono,
    email,
    enfoque
  );

  ArrayEmpresas.push(nuevaEmpresa);
  localStorage.setItem("ArrayEmpresas", JSON.stringify(ArrayEmpresas));

  alert(`¡Registro exitoso, ${nombre}! Serás redirigido al login`);
    document.getElementById("nombreRegister").value = "";
    document.getElementById("emailRegister").value = "";    
    document.getElementById("telefonoRegister").value = "";
    document.getElementById("enfoqueRegister").value = "";
    document.getElementById("contraseñaRegister").value = "";
    document.getElementById("confirmarContraseñaRegister").value = "";

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

addEventListener("DOMContentLoaded", () => {
  window.registrarEmpresa = registrarEmpresa;
  window.loginEmpresa = loginEmpresa;
});
