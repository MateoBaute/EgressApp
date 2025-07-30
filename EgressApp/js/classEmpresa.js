export class Empresa {
  static id = 0;
  constructor(nombreEmpresa, contraseña, telefono, mail, enfoque) {
    this.id = Empresa.id++;
    this.Nombre = nombreEmpresa;
    this.Contraseña = contraseña;
    this.Telefono = telefono;
    this.Email = mail;
    this.Enfoque = enfoque;
    this.fechaRegistro = new Date().toISOString();
  }
//#getters
  get id() {
    return this._id;
  }
  get Telefono() {
    return this._telefono;
  }
  get Email() {
    return this._email;
  }
  get Enfoque() {
    return this._enfoque;
  }
  get fechaRegistro() {
    return this._fechaRegistro;
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
//end getters

//setters
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

  set Telefono(value) {
    this._telefono = value;
  }
  set Email(value) {
    this._email = value;
  }
  set Enfoque(value) {
    this._enfoque = value;
  }
  set fechaRegistro(value) {
    this._fechaRegistro = value;
  } 
//end setters
}
