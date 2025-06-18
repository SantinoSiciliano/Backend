const jwt = require("jsonwebtoken")
const passport = require("passport")
const cartModel = require("../models/cartModel")

class SessionController {
  // Login usando Passport Local Strategy
  async login(req, res, next) {
    passport.authenticate("local", { session: false }, async (err, user, info) => {
      if (err) {
        return res.status(500).json({
          status: "error",
          message: err.message,
        })
      }

      if (!user) {
        return res.status(401).json({
          status: "error",
          message: info.message || "Credenciales inválidas",
        })
      }

      try {
        // Buscar o crear carrito si no existe
        let cart = await cartModel.findByUserId(user._id)
        if (!cart) {
          cart = await cartModel.createCart(user._id)
        }

        // Generar JWT
        const token = jwt.sign(
          {
            id: user._id,
            email: user.email,
            role: user.role,
          },
          process.env.JWT_SECRET,
          { expiresIn: "24h" },
        )

        res.json({
          status: "success",
          message: "Login exitoso",
          token,
          user: {
            id: user._id,
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            age: user.age,
            role: user.role,
            cart: cart._id,
          },
        })
      } catch (error) {
        console.error("Error en login:", error)
        res.status(500).json({
          status: "error",
          message: error.message || "Error interno del servidor",
        })
      }
    })(req, res, next)
  }

  // Validar usuario actual (ruta /current) - REQUERIDO POR LA CONSIGNA
  async current(req, res) {
    try {
      // El usuario ya está disponible gracias al middleware de autenticación con Passport
      const user = req.user

      // Buscar carrito del usuario
      const cart = await cartModel.findByUserId(user._id)

      res.json({
        status: "success",
        user: {
          id: user._id,
          first_name: user.first_name,
          last_name: user.last_name,
          email: user.email,
          age: user.age,
          role: user.role,
          cart: cart || null,
        },
      })
    } catch (error) {
      console.error("Error al obtener usuario actual:", error)
      res.status(500).json({
        status: "error",
        message: error.message || "Error interno del servidor",
      })
    }
  }

  // Logout
  async logout(req, res) {
    try {
      // En JWT no necesitamos hacer nada en el servidor para logout
      // El cliente debe eliminar el token
      res.json({
        status: "success",
        message: "Logout exitoso. Elimina el token del cliente.",
      })
    } catch (error) {
      console.error("Error en logout:", error)
      res.status(500).json({
        status: "error",
        message: error.message || "Error interno del servidor",
      })
    }
  }

  // Refresh token (opcional)
  async refreshToken(req, res) {
    try {
      const user = req.user

      // Generar nuevo token
      const newToken = jwt.sign(
        {
          id: user._id,
          email: user.email,
          role: user.role,
        },
        process.env.JWT_SECRET,
        { expiresIn: "24h" },
      )

      res.json({
        status: "success",
        message: "Token renovado exitosamente",
        token: newToken,
      })
    } catch (error) {
      console.error("Error al renovar token:", error)
      res.status(500).json({
        status: "error",
        message: error.message || "Error interno del servidor",
      })
    }
  }
}

module.exports = new SessionController()