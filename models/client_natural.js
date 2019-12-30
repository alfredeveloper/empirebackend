
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ClientNaturalSchema = new Schema({
    client: {type: Schema.Types.ObjectId, ref: 'Client'},
},{timestamps: {createdAt: 'created_at', updatedAt: 'updated_at'}})

module.exports = mongoose.model('ClientNatural', ClientNaturalSchema)
