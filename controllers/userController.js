const userModel = require("../models/userModel")
const cartModel = require("../models/cartModel")

class UserController {
  
  async createUser(req, res) {
    try {
      const { first_name, last_name, email, age, password, role } = req.body

      
      if (!first_name || !last_name || !email || !age || !password) {
        return res.status(400).json({
          status: "error",
          message: "Todos los campos son requeridos: first_name, last_name, email, age, password",
        })
      }

      const existingUser = await userModel.findByEmail(email)
      if (existingUser) {
        return res.status(400).json({
          status: "error",
          message: "El usuario con este email ya existe",
        })
      }

      const newUser = await userModel.createUser({
        first_name,
        last_name,
        email,
        age,
        password,
        role,
      })

      const newCart = await cartModel.createCart(newUser._id)

      res.status(201).json({
        status: "success",
        message: "Usuario creado exitosamente",
        user: {
          id: newUser._id,
          first_name: newUser.first_name,
          last_name: newUser.last_name,
          email: newUser.email,
          age: newUser.age,
          role: newUser.role,
          cart: newCart._id,
          createdAt: newUser.createdAt,
        },
      })
    } catch (error) {
      console.error("Error al crear usuario:", error)
      res.status(500).json({
        status: "error",
        message: error.message || "Error interno del servidor",
      })
    }
  }

  async getUsers(req, res) {
    try {
      const users = await userModel.findAll()

      res.json({
        status: "success",
        count: users.length,
        users,
      })
    } catch (error) {
      console.error("Error al obtener usuarios:", error)
      res.status(500).json({
        status: "error",
        message: error.message || "Error interno del servidor",
      })
    }
  }

  async getUserById(req, res) {
    try {
      const { id } = req.params

      const user = await userModel.findById(id)

      if (!user) {
        return res.status(404).json({
          status: "error",
          message: "Usuario no encontrado",
        })
      }

     
      const cart = await cartModel.findByUserId(id)

      const { password, ...safeUser } = user

      res.json({
        status: "success",
        user: {
          ...safeUser,
          cart: cart || null,
        },
      })
    } catch (error) {
      console.error("Error al obtener usuario:", error)
      res.status(500).json({
        status: "error",
        message: error.message || "Error interno del servidor",
      })
    }
  }

  async updateUser(req, res) {
    try {
      const { id } = req.params
      const { first_name, last_name, email, age } = req.body

      const existingUser = await userModel.findById(id)
      if (!existingUser) {
        return res.status(404).json({
          status: "error",
          message: "Usuario no encontrado",
        })
      }

      
      const updated = await userModel.updateUser(id, {
        first_name,
        last_name,
        email,
        age,
      })

      if (!updated) {
        return res.status(400).json({
          status: "error",
          message: "No se pudo actualizar el usuario",
        })
      }

      
      const updatedUser = await userModel.findById(id)
      const { password, ...safeUser } = updatedUser

      res.json({
        status: "success",
        message: "Usuario actualizado exitosamente",
        user: safeUser,
      })
    } catch (error) {
      console.error("Error al actualizar usuario:", error)
      res.status(500).json({
        status: "error",
        message: error.message || "Error interno del servidor",
      })
    }
  }

  
  async deleteUser(req, res) {
    try {
      const { id } = req.params

      
      const user = await userModel.findById(id)
      if (!user) {
        return res.status(404).json({
          status: "error",
          message: "Usuario no encontrado",
        })
      }

      
      const cart = await cartModel.findByUserId(id)
      if (cart) {
        await cartModel.deleteCart(cart._id)
      }

      
      const deleted = await userModel.deleteUser(id)

      if (!deleted) {
        return res.status(400).json({
          status: "error",
          message: "No se pudo eliminar el usuario",
        })
      }

      res.json({
        status: "success",
        message: "Usuario y carrito asociado eliminados exitosamente",
      })
    } catch (error) {
      console.error("Error al eliminar usuario:", error)
      res.status(500).json({
        status: "error",
        message: error.message || "Error interno del servidor",
      })
    }
  }
}

module.exports = new UserController()