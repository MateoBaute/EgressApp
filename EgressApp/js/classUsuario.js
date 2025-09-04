export class Usuario {
  static id = 0;
  constructor(nombre, contraseñaHasheada) {
    this.id = Usuario.id++;
    this.Nombre = nombre;
    this.Contraseña = contraseñaHasheada;
    this.fechaRegistro = new Date().toISOString();
  }
  get id() {
    return this._id;
  }
  get Nombre() {
    return this._nombre;
  }
  get Contraseña() {
    return this._contraseña;
  }
  get fechaRegistro() {
    return this._fechaRegistro;
  }

  set id(value) {
    this._id = value;
  }
  set Nombre(value) {
    this._nombre = value;
  }
  set Contraseña(value) {
    this._contraseña = value;
  }
  set fechaRegistro(value) {
    this._fechaRegistro = value;
  }
  
}
