
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ClientJuridicalSchema = new Schema({
    razonSocial: String,
    ruc: String,
    partidaRegistral: String,
    departamento: String,
    provincia: String,
    distrito: String,
    direccion: String,
    sede_registral: String,
    correo: String,
    nombreComercial: String,
    telefono: String,
    client: {type: Schema.Types.ObjectId, ref: 'Client'},

},{timestamps: {createdAt: 'created_at', updatedAt: 'updated_at'}})

module.exports = mongoose.model('ClientJuridical', ClientJuridicalSchema)
