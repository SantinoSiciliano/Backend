const jwt = require("jsonwebtoken")
const userService = require("../services/userService")


const authenticateJWT = async (req, res, next) => {
  try {
    let token = req.cookies.token 

    if (!token) {
      
      const authHeader = req.headers.authorization
      if (authHeader && authHeader.startsWith("Bearer ")) {
        token = authHeader.split(" ")[1]
      }
    }

    if (!token) {
      return res.status(401).json({
        status: "error",
        message: "Token no proporcionado",
      })
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      const user = await userService.getUserById(decoded.id)

      if (!user) {
        return res.status(401).json({
          status: "error",
          message: "Usuario no encontrado o token inválido",
        })
      }

      req.user = user
      next()
    } catch (error) {
      
      res.clearCookie("token")
      return res.status(401).json({
        status: "error",
        message: "Token inválido o expirado",
      })
    }
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    })
  }
}


const requireAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({
      status: "error",
      message: "Acceso denegado. Se requieren permisos de administrador",
    })
  }
  next()
}


const requireUser = (req, res, next) => {
  if (req.user.role !== "user") {
    return res.status(403).json({
      status: "error",
      message: "Acceso denegado. Solo usuarios pueden realizar esta acción",
    })
  }
  next()
}


const requireOwnership = (req, res, next) => {
  const userId = req.params.id || req.params.userId

  if (req.user.role !== "admin" && req.user._id.toString() !== userId) {
    return res.status(403).json({
      status: "error",
      message: "Acceso denegado. Solo puedes acceder a tus propios datos",
    })
  }
  next()
}

module.exports = {
  authenticateJWT,
  requireAdmin,
  requireUser,
  requireOwnership,
}



