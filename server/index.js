var express = require('express')
var bodyParser = require('body-parser')
var cors = require('cors')
var defaultErrorHandler = require('./config/handlers').defaultErrorHandler
var corsOptions = require('./config/handlers').corsOptions
var dbConnect = require('./config/mlab/mlab-config')
var session = require('./authentication/sessions')
var Auth = require('./authentication/auth')

//declare routes
var vaultRoutes = require('./routes/vault-routes')
var keepRoutes = require('./routes/keep-routes')
//
//

let app = express()
let server = require('http').createServer(app)
var port = 3000

function Validate(req, res, next) {
    console.log(req.session)
    if (!req.session.uid) {
        return res.status(401).send({ error: 'Please Login or Register to continue' })
    }
    return next()
}

function logger(req, res, next) {
    console.log('INCOMING REQUEST', req.url)
    next()
}

// REGISTER MIDDLEWARE
app.use(express.static(__dirname + '/../www/dist'))
app.use(session)
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use('*', logger)
app.use('*', cors(corsOptions))
app.use(keepRoutes.unprotected)
app.use('/', Auth)

// LOCKS API TO REQUIRE USER AUTH
app.use(Validate)
// app.use('/api', api) <-- Base api stuff?
app.use('/', defaultErrorHandler)
app.use(vaultRoutes.protected)
app.use(keepRoutes.protected)

server.listen(process.env.PORT || port, () => {
    console.log("Server listening on port: ", port)
})