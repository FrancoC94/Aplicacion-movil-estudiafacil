export function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function isValidPassword(password) {
  return typeof password === "string" && password.length >= 8;
}

export function validateLoginForm({ email, password }) {
  const errors = {};
  if (!isValidEmail(email)) errors.email = "Ingresa un correo válido";
  if (!password) errors.password = "La contraseña es obligatoria";
  return errors;
}

export function validateRegisterForm({ nombre, email, password }) {
  const errors = {};
  if (!nombre || nombre.trim().length < 2) errors.nombre = "El nombre es muy corto";
  if (!isValidEmail(email)) errors.email = "Ingresa un correo válido";
  if (!isValidPassword(password)) errors.password = "Mínimo 8 caracteres";
  return errors;
}
