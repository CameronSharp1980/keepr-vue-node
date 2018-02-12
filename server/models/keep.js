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
    console.log("Inside .post hook")
    Vaults.update(
        {},
        { $pull: { vaultKeeps: { $in: [this._id.toString()] }, vaultKeeps: this._id.toString() } },
        { multi: true }
    )
    // next()
    // .then((vault) => {
    //     res.send({ message: `Successfully removed keep ${this._id}` })
    // })
    // .catch(err => res.status(400).send(err))
})

module.exports = mongoose.model('Keep', schema);