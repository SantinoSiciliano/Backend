const passport = require("passport")
const LocalStrategy = require("passport-local").Strategy
const JwtStrategy = require("passport-jwt").Strategy
const ExtractJwt = require("passport-jwt").ExtractJwt
const userModel = require("../models/userModel")

// Estrategia Local para Login
passport.use(
  "local",
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async (email, password, done) => {
      try {
        const user = await userModel.findByEmail(email)

        if (!user) {
          return done(null, false, { message: "Usuario no encontrado" })
        }

        const isPasswordValid = await userModel.comparePassword(password, user.password)
        if (!isPasswordValid) {
          return done(null, false, { message: "Contraseña incorrecta" })
        }

        return done(null, user)
      } catch (error) {
        return done(error)
      }
    },
  ),
)

// Estrategia JWT para proteger rutas
passport.use(
  "jwt",
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
    },
    async (payload, done) => {
      try {
        const user = await userModel.findById(payload.id)

        if (user) {
          const { password, ...safeUser } = user
          return done(null, safeUser)
        } else {
          return done(null, false)
        }
      } catch (error) {
        return done(error, false)
      }
    },
  ),
)

passport.serializeUser((user, done) => {
  done(null, user._id)
})

passport.deserializeUser(async (id, done) => {
  try {
    const user = await userModel.findById(id)
    done(null, user)
  } catch (error) {
    done(error)
  }
})

module.exports = passport