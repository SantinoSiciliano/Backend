const jwt = require("jsonwebtoken")
const userModel = require("../models/userModel")
const cartModel = require("../models/cartModel")

class ViewController {
  renderIndex(req, res) {
    res.render("index", { title: "Ecommerce - Inicio" })
  }

  renderRegister(req, res) {
    res.render("register", { title: "Registro" })
  }

  renderLogin(req, res) {
    res.render("login", { title: "Login" })
  }

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

  renderFailed(req, res) {
    res.render("failed", { title: "Error" })
  }

  async processRegister(req, res) {
    try {
      const { first_name, last_name, email, age, password } = req.body

      const existingUser = await userModel.findByEmail(email)
      if (existingUser) {
        return res.redirect("/failed")
      }

      const newUser = await userModel.createUser({
        first_name,
        last_name,
        email,
        age,
        password,
      })

      
      const newCart = await cartModel.createCart(newUser._id)
      await userModel.updateUser(newUser._id, { cartId: newCart._id })

      
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

  
  async processLogin(req, res) {
    try {
      const { email, password } = req.body

      
      const user = await userModel.findByEmail(email)

      if (!user) {
        return res.redirect("/failed")
      }

      
      const isPasswordValid = await userModel.comparePassword(password, user.password)

      if (!isPasswordValid) {
        return res.redirect("/failed")
      }

      let cart = await cartModel.findByUserId(user._id)
      if (!cart) {
        cart = await cartModel.createCart(user._id)
        await userModel.updateUser(user._id, { cartId: cart._id })
      }

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

  processLogout(req, res) {
    res.clearCookie("token")
    res.redirect("/")
  }
}

module.exports = new ViewController()
