var mongoose = require('mongoose')
var Schema = mongoose.Schema
var ObjectId = Schema.Types.ObjectId

// WHAT IS A SONG
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

module.exports = mongoose.model('Keep', schema);