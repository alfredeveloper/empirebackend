
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const MomentDataJuridicalSchema = new Schema({
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

    razonSocial: String,
    ruc: String,
    partidaRegistral: String,
    departamentoJuridical: String,
    provinciaJuridical: String,
    distritoJuridical: String,
    direccionJuridical: String,
    sede_registral: String,
    correoJuridical: String,
    nombreComercial: String,
    telefonoJuridical: String,

    user: {type: Schema.Types.ObjectId, ref: 'User'},
    
},{timestamps: {createdAt: 'created_at', updatedAt: 'updated_at'}})

module.exports = mongoose.model('MomentDataJuridical', MomentDataJuridicalSchema)
