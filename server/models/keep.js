var mongoose = require('mongoose')
var Schema = mongoose.Schema
var ObjectId = Schema.Types.ObjectId
let Vaults = require('./vault')

// WHAT IS A KEEP
var schema = new mongoose.Schema({
    userId: { type: String, required: true },
    name: { type: String, required: true },
    description: { type: String, required: false },
    imageUrl: { type: String, required: false, default: "//placehold.it/200x200" },
    views: { type: Number, required: true, default: 0 },
    keeps: { type: Number, required: true, default: 0 },
    shares: { type: Number, required: true, default: 0 },
    public: { type: Boolean, required: true, default: false }
});

schema.post('remove', function (next) {
    Vaults.find({})
        .then(vaults => {
            vaults.forEach(vault => {
                vault.vaultKeeps.pull(this._id.toString())
                vault.save().then(next).catch(err => {
                    console.log("Keep reference not removed from vault")
                    next()
                })
            })
        })
        .catch(next)
})

module.exports = mongoose.model('Keep', schema);