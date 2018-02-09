var Keeps = require('../models/keep')
var protectedKeepRoutes = require('express').Router()
var unprotectedKeepRoutes = require('express').Router()

unprotectedKeepRoutes.get('/api/keeps', (req, res, next) => {
    Keeps.find({})
        .then(keeps => res.send(keeps))
        .catch(err => res.status(400).send(err))
})

protectedKeepRoutes.get('/api/keeps/:userId', (req, res, next) => {
    Keeps.find({ userId: req.params.userId })
        .then(keeps => res.send(keeps))
        .catch(err => res.status(400).send(err))
})

//CREATES NEW KEEPS
protectedKeepRoutes.post('/api/keeps', (req, res, next) => {
    Keeps.create(req.body)
        .then(keeps => res.send(keeps))
        .catch(err => res.status(400).send(err))
})

// OLD ROUTE TO UPDATE ENTIRE KEEP ENTRY, COMMENTED WHILE ATTEMPTING $set ROUTE BELOW
// router.put('/api/keeps/:id', (req, res, next) => {
//     Keeps.findByIdAndUpdate(req.params.id, req.body)
//         .then(keep => {
//             res.send({ message: 'You\'ve updated your keep!' })
//         })
//         .catch(err => {
//             res.status(400).send(err)
//         })
// })

protectedKeepRoutes.put('/api/keeps/:keepId', (req, res, next) => {
    Keeps.findByIdAndUpdate(req.params.keepId, { $set: req.body })
        .then(keep => {
            res.send({ message: `You\'ve updated your keep! (${req.body})` })
        })
        .catch(err => {
            res.status(400).send(err)
        })
})

protectedKeepRoutes.delete('/api/keeps/:id', (req, res, next) => {
    Keeps.findByIdAndRemove(req.params.id)
        .then((keep) => {
            res.send({ message: `Successfully removed keep at ${req.params.id}` })
        })
        .catch(err => res.status(400).send(err))
})


module.exports = {
    protected: protectedKeepRoutes,
    unprotected: unprotectedKeepRoutes
};