
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ManagerSchema = new Schema({
    role: String,
    esAdmin: String,
    user: {type: Schema.Types.ObjectId, ref: 'User'}
    
},{timestamps: {createdAt: 'created_at', updatedAt: 'updated_at'}})

module.exports = mongoose.model('Manager', ManagerSchema)
