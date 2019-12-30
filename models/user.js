'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema
const bcrypt = require('bcrypt-nodejs')
const crypto = require('crypto')

const UserSchema = new Schema({
    apellidoPaterno: String,
    apellidoMaterno: String,
    nombres: String,
    departamento: String,
    provincia: String,
    distrito: String,
    direccion: String,
    tipoDocumento: { type: String, enum: ['01', '04', '06', '07', '11', '00'] },
    numDocumento: String,
    fechaNacimiento: Date,
    correo: { type: String, unique: true, lowercase: true },
    contrasenia: { type: String, select: true },
    momentContrasenia: {type: String}, 
    genero: { type: String, enum: ['masculino', 'femenino'] },
    telefono: String,
    ocupacion: String,
    centroLaboral: String,
    foto: { type: String, default: "https://cdn.patchcdn.com/assets/layout/contribute/user-default.png"},
    typeUser: {type: String, enum: ['client', 'manager']},
    mobile_token: { type: String, default: "" },
    lastLogin: Date,
    status: { type: String, enum: ['ingresado', 'en evaluacion', 'aceptado', 'rechazado'] },
},{timestamps: {createdAt: 'created_at', updatedAt: 'updated_at'}})

UserSchema.pre('save', (next) => {
  let user = this
  //if (!user.isModified('password')) return next()

  bcrypt.genSalt(10, (err, salt) => {
    if (err) return next(err)

    bcrypt.hash(user.password, salt, null, (err, hash) => {
      if (err) return next(err)

      user.password = hash
      next()
    })
  })
})

UserSchema.methods.gravatar = function () {
  if (!this.email) return `https://gravatar.com/avatar/?s=200&d=retro`

  const md5 = crypto.createHash('md5').update(this.email).digest('hex')
  return `https://gravatar.com/avatar/${md5}?s=200&d=retro`
}

module.exports = mongoose.model('User', UserSchema)
