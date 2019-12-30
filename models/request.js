
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const RequestSchema = new Schema({
    ticket: String,
    solicitud: String,
    fecha_solicitud: Date,
    fecha_respuesta: Date,
    resultado: { type: String, enum: ['pendiente', 'aprobado', 'rechazado'] },
    client: {type: Schema.Types.ObjectId, ref: 'Client'},
    
},{timestamps: {createdAt: 'created_at', updatedAt: 'updated_at'}})

module.exports = mongoose.model('Request', RequestSchema)
