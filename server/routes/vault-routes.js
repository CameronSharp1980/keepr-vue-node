var Vaults = require('../models/vault')
var protectedVaultRoutes = require('express').Router()

// CURRENTLY NO NEED TO GET ALL VAULTS
// protectedVaultRoutes.get('/api/vaults', (req, res, next) => {
//     Vaults.find({})
//         .then(vaults => res.send(vaults))
//         .catch(err => res.status(400).send(err))
// })

protectedVaultRoutes.get('/api/vaults/:userId', (req, res, next) => {
    Vaults.find({ userId: req.params.userId })
        .then(vaults => res.send(vaults))
        .catch(err => res.status(400).send(err))
})

//CREATES NEW VAULTS
protectedVaultRoutes.post('/api/vaults', (req, res, next) => {
    Vaults.create(req.body)
        .then(vaults => res.send(vaults))
        .catch(err => res.status(400).send(err))
})

protectedVaultRoutes.put('/api/vaults/:vaultId', (req, res, next) => {
    Vaults.findByIdAndUpdate(req.params.vaultId, { $set: req.body })
        .then(vault => {
            res.send({ message: `You\'ve updated your vault! (${req.body})` })
        })
        .catch(err => {
            res.status(400).send(err)
        })
})

protectedVaultRoutes.put('/api/vaults/:vaultId/keeps/:keepId', (req, res, next) => {
    Vaults.update({ _id: `${req.params.vaultId}` }, { $pull: { "vaultKeeps": `${req.params.keepId}` } })
        .then((vault) => {
            res.send({ message: `Successfully removed keep ${req.params.keepId} from Vault ${req.params.vaultId}` })
        })
        .catch(err => res.status(400).send(err))
})

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