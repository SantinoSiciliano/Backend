const jwt = require("jsonwebtoken")
const userModel = require("../models/userModel")
const cartModel = require("../models/cartModel")

class ViewController {
  // Renderizar página principal
  renderIndex(req, res) {
    res.render("index", { title: "Ecommerce - Inicio" })
  }

  // Renderizar página de registro
  renderRegister(req, res) {
    res.render("register", { title: "Registro" })
  }

  // Renderizar página de login
  renderLogin(req, res) {
    res.render("login", { title: "Login" })
  }

  // Renderizar página de perfil
  async renderProfile(req, res) {
    try {
      const token = req.cookies.token

      if (!token) {
        return res.redirect("/login")
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET || "tu_clave_secreta")
      const user = await userModel.findById(decoded.id)

      if (!user) {
        return res.redirect("/login")
      }

      res.render("profile", {
        title: "Perfil",
        user: {
          first_name: user.first_name,
          last_name: user.last_name,
          age: user.age,
          role: user.role,
        },
      })
    } catch (error) {
      res.redirect("/login")
    }
  }

  // Renderizar página de error
  renderFailed(req, res) {
    res.render("failed", { title: "Error" })
  }

  // Procesar registro desde formulario web
  async processRegister(req, res) {
    try {
      const { first_name, last_name, email, age, password } = req.body

      // Verificar si el usuario ya existe
      const existingUser = await userModel.findByEmail(email)
      if (existingUser) {
        return res.redirect("/failed")
      }

      // Crear usuario
      const newUser = await userModel.createUser({
        first_name,
        last_name,
        email,
        age,
        password,
      })

      // Crear carrito para el usuario
      const newCart = await cartModel.createCart(newUser._id)
      await userModel.updateUser(newUser._id, { cartId: newCart._id })

      // Generar JWT y establecer cookie
      const token = jwt.sign(
        {
          id: newUser._id,
          email: newUser.email,
          role: newUser.role,
        },
        process.env.JWT_SECRET || "tu_clave_secreta",
        { expiresIn: "24h" },
      )

      res.cookie("token", token, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 })
      res.redirect("/profile")
    } catch (error) {
      res.redirect("/failed")
    }
  }

  // Procesar login desde formulario web
  async processLogin(req, res) {
    try {
      const { email, password } = req.body

      // Buscar usuario por email
      const user = await userModel.findByEmail(email)

      if (!user) {
        return res.redirect("/failed")
      }

      // Verificar contraseña
      const isPasswordValid = await userModel.comparePassword(password, user.password)

      if (!isPasswordValid) {
        return res.redirect("/failed")
      }

      // Buscar o crear carrito si no existe
      let cart = await cartModel.findByUserId(user._id)
      if (!cart) {
        cart = await cartModel.createCart(user._id)
        await userModel.updateUser(user._id, { cartId: cart._id })
      }

      // Generar JWT y establecer cookie
      const token = jwt.sign(
        {
          id: user._id,
          email: user.email,
          role: user.role,
        },
        process.env.JWT_SECRET || "tu_clave_secreta",
        { expiresIn: "24h" },
      )

      res.cookie("token", token, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 })
      res.redirect("/profile")
    } catch (error) {
      res.redirect("/failed")
    }
  }

  // Procesar logout desde formulario web
  processLogout(req, res) {
    res.clearCookie("token")
    res.redirect("/")
  }
}

module.exports = new ViewController()
