// Middleware para validar datos de registro
const validateRegistrationData = (req, res, next) => {
    const { first_name, last_name, email, age, password } = req.body
  
    const errors = []
  
    // Validaciones requeridas para registro
    if (!first_name || first_name.trim().length < 2) {
      errors.push("El nombre es requerido y debe tener al menos 2 caracteres")
    }
  
    if (!last_name || last_name.trim().length < 2) {
      errors.push("El apellido es requerido y debe tener al menos 2 caracteres")
    }
  
    if (!email) {
      errors.push("El email es requerido")
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(email)) {
        errors.push("Formato de email inválido")
      }
    }
  
    if (!age) {
      errors.push("La edad es requerida")
    } else {
      const ageNum = parseInt(age)
      if (isNaN(ageNum) || ageNum < 1 || ageNum > 120) {
        errors.push("La edad debe ser un número entre 1 y 120")
      }
    }
  
    if (!password) {
      errors.push("La contraseña es requerida")
    } else if (password.length < 6) {
      errors.push("La contraseña debe tener al menos 6 caracteres")
    }
  
    if (errors.length > 0) {
      return res.status(400).json({
        status: "error",
        message: "Datos de registro inválidos",
        errors,
      })
    }
  
    next()
  }
  
  // Middleware para validar datos de login
  const validateLoginData = (req, res, next) => {
    const { email, password } = req.body
  
    const errors = []
  
    if (!email) {
      errors.push("El email es requerido")
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(email)) {
        errors.push("Formato de email inválido")
      }
    }
  
    if (!password) {
      errors.push("La contraseña es requerida")
    }
  
    if (errors.length > 0) {
      return res.status(400).json({
        status: "error",
        message: "Datos de login inválidos",
        errors,
      })
    }
  
    next()
  }
  
  module.exports = {
    validateRegistrationData,
    validateLoginData,
  }