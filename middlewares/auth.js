const passport = require("passport")


const authenticateJWT = (req, res, next) => {
  passport.authenticate("jwt", { session: false }, (err, user, info) => {
    if (err) {
      return res.status(500).json({
        status: "error",
        message: "Error de autenticación",
      })
    }

    if (!user) {
      return res.status(401).json({
        status: "error",
        message: "Token inválido o expirado",
      })
    }

    req.user = user
    next()
  })(req, res, next)
}


const requireAdmin = (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        status: "error",
        message: "Usuario no autenticado",
      })
    }

    if (req.user.role !== "admin") {
      return res.status(403).json({
        status: "error",
        message: "Acceso denegado. Se requieren permisos de administrador",
      })
    }

    next()
  } catch (error) {
    console.error("Error en verificación de admin:", error)
    res.status(500).json({
      status: "error",
      message: "Error interno del servidor",
    })
  }
}


const requireOwnership = (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        status: "error",
        message: "Usuario no autenticado",
      })
    }

    const userId = req.params.id

    
    if (req.user.role === "admin") {
      return next()
    }

    
    if (req.user._id.toString() !== userId) {
      return res.status(403).json({
        status: "error",
        message: "Acceso denegado. Solo puedes acceder a tus propios datos",
      })
    }

    next()
  } catch (error) {
    console.error("Error en verificación de propiedad:", error)
    res.status(500).json({
      status: "error",
      message: "Error interno del servidor",
    })
  }
}


const optionalAuth = (req, res, next) => {
  passport.authenticate("jwt", { session: false }, (err, user, info) => {
    if (user) {
      req.user = user
    }
    
    next()
  })(req, res, next)
}

module.exports = {
  authenticateJWT,
  requireAdmin,
  requireOwnership,
  optionalAuth,
}