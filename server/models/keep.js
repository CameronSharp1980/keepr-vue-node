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

schema.pre('remove', function (next) {
    // CAN YOU USE $in TO CHECK INSIDE THE ARRAY FOR A VALUE?
    Vaults.updateMany({}, { $pull: { "vaultKeeps": this._id } })
        .then((vault) => {
            res.send({ message: `Successfully removed keep ${this._id}` })
        })
    // .catch(err => res.status(400).send(err))
})

module.exports = mongoose.model('Keep', schema);