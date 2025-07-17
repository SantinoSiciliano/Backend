const userService = require("../services/userService")
const { UserDTO, UserCreateDTO, UserUpdateDTO } = require("../dto/userDTO")

class UserController {
  async createUser(req, res) {
    try {
      const userCreateDTO = new UserCreateDTO(req.body)
      const newUser = await userService.createUser(userCreateDTO)
      const userDTO = new UserDTO(newUser)

      res.status(201).json({
        status: "success",
        message: "Usuario creado exitosamente",
        user: userDTO,
      })
    } catch (error) {
      res.status(400).json({
        status: "error",
        message: error.message,
      })
    }
  }

  async getUsers(req, res) {
    try {
      const users = await userService.getAllUsers()
      const usersDTO = users.map((user) => new UserDTO(user))

      res.json({
        status: "success",
        users: usersDTO,
      })
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: error.message,
      })
    }
  }

  async getUserById(req, res) {
    try {
      const user = await userService.getUserById(req.params.id)
      const userDTO = new UserDTO(user)

      res.json({
        status: "success",
        user: userDTO,
      })
    } catch (error) {
      res.status(404).json({
        status: "error",
        message: error.message,
      })
    }
  }

  async updateUser(req, res) {
    try {
      const userUpdateDTO = new UserUpdateDTO(req.body)
      const updatedUser = await userService.updateUser(req.params.id, userUpdateDTO)
      const userDTO = new UserDTO(updatedUser)

      res.json({
        status: "success",
        message: "Usuario actualizado exitosamente",
        user: userDTO,
      })
    } catch (error) {
      res.status(404).json({
        status: "error",
        message: error.message,
      })
    }
  }

  async deleteUser(req, res) {
    try {
      await userService.deleteUser(req.params.id)

      res.json({
        status: "success",
        message: "Usuario eliminado exitosamente",
      })
    } catch (error) {
      res.status(404).json({
        status: "error",
        message: error.message,
      })
    }
  }

  async requestPasswordReset(req, res) {
    try {
      const { email } = req.body
      const result = await userService.requestPasswordReset(email)

      res.json({
        status: "success",
        message: result.message,
      })
    } catch (error) {
      res.status(404).json({
        status: "error",
        message: error.message,
      })
    }
  }

  async resetPassword(req, res) {
    try {
      const { token } = req.params
      const { password } = req.body
      const result = await userService.resetPassword(token, password)

      res.json({
        status: "success",
        message: result.message,
      })
    } catch (error) {
      res.status(400).json({
        status: "error",
        message: error.message,
      })
    }
  }
}

module.exports = new UserController()
