
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ClientSchema = new Schema({
    esCliente: Boolean,
    user: {type: Schema.Types.ObjectId, ref: 'User'},
    code: String,
    typeClient: {type: String, enum: ['natural', 'juridical']},

    
},{timestamps: {createdAt: 'created_at', updatedAt: 'updated_at'}})

module.exports = mongoose.model('Client', ClientSchema)
