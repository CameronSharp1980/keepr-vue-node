var Vaults = require('../models/vault')
var Keeps = require('../models/keep')
var protectedVaultRoutes = require('express').Router()

// CURRENTLY NO NEED TO GET ALL VAULTS
// protectedVaultRoutes.get('/api/vaults', (req, res, next) => {
//     Vaults.find({})
//         .then(vaults => res.send(vaults))
//         .catch(err => res.status(400).send(err))
// })

// GET ALL CURRENT USERS VAULTS
protectedVaultRoutes.get('/api/vaults/:userId', (req, res, next) => {
    Vaults.find({ userId: req.params.userId })
        .then(vaults => res.send(vaults))
        .catch(err => res.status(400).send(err))
})

// CREATE NEW VAULTS
protectedVaultRoutes.post('/api/vaults', (req, res, next) => {
    Vaults.create(req.body)
        .then(vaults => res.send(vaults))
        .catch(err => res.status(400).send(err))
})

// GET KEEPS IN VAULT
protectedVaultRoutes.get('/api/vaults/:vaultId/keeps', (req, res, next) => {
    Vaults.findById(req.params.vaultId)
        .then(vault => {
            Keeps.find({ '_id': { $in: vault.vaultKeeps } })
                .then(keeps => {
                    res.send(keeps)
                })
                .catch(err => {
                    res.status(400).send(err)
                })
        })
        .catch(err => {
            res.status(400).send(err)
        })
})

// UPDATE VAULTS
protectedVaultRoutes.put('/api/vaults/:vaultId', (req, res, next) => {
    Vaults.findByIdAndUpdate(req.params.vaultId, { $set: req.body })
        .then(vault => {
            res.send({ message: `You\'ve updated your vault! (${req.body})` })
        })
        .catch(err => {
            res.status(400).send(err)
        })
})

// REMOVE A KEEP FROM A VAULT
protectedVaultRoutes.put('/api/vaults/:vaultId/keeps/:keepId', (req, res, next) => {
    Vaults.update({ _id: `${req.params.vaultId}` }, { $pull: { "vaultKeeps": `${req.params.keepId}` } })
        .then((vault) => {
            res.send({ message: `Successfully removed keep ${req.params.keepId} from Vault ${req.params.vaultId}` })
        })
        .catch(err => res.status(400).send(err))
})

// DELETE VAULT
protectedVaultRoutes.delete('/api/vaults/:vaultId', (req, res, next) => {
    Vaults.findByIdAndRemove(req.params.vaultId)
        .then((vault) => {
            res.send({ message: `Successfully removed vault at ${req.params.vaultId}` })
        })
        .catch(err => res.status(400).send(err))
})


module.exports = {
    protected: protectedVaultRoutes
};