// ESTABLISH WHERE THE DB LIVES
var mongoose = require('mongoose')
var connectionstring = 'mongodb://user:testing@ds046867.mlab.com:46867/keepr'
var connection = mongoose.connection;

// Establishes MongoDb Connection
mongoose.connect(connectionstring, {
    useMongoClient: true,
    keepAlive: { socketOptions: { keepAlive: 300000, connectTimeoutMS: 30000 } }
});

connection.on('error', console.error.bind(console, 'connection error:'))

connection.once('open', function () {
    console.log('We are connected to the db')
});