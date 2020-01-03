
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const MomentDataNaturalSchema = new Schema({
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
    genero: { type: String, enum: ['masculino', 'femenino'] },
    telefono: String,
    ocupacion: String,
    centroLaboral: String,
    client: {type: Schema.Types.ObjectId, ref: 'Client'},
    
},{timestamps: {createdAt: 'created_at', updatedAt: 'updated_at'}})

module.exports = mongoose.model('MomentDataNatural', MomentDataNaturalSchema)
