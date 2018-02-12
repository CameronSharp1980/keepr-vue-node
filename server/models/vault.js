var mongoose = require('mongoose')
var Schema = mongoose.Schema
var ObjectId = Schema.Types.ObjectId

// WHAT IS A VAULT
var schema = new mongoose.Schema({
    userId: { type: String, required: true },
    name: { type: String, required: true },
    description: { type: String, required: false },
    vaultKeeps: [{ type: mongoose.Schema.ObjectId, ref: 'Keep', required: false, default: null }]
});

module.exports = mongoose.model('Vault', schema);