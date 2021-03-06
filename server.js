// Importing express app
const app = require('./app');

// Importing Mongoose
const mongoose = require('mongoose');

// Importing mongo TESTURI
var DBURI;
// Assigning Test URI based on whether being run on local container or circleci docker container.
if(process.env.MongoURI){
    DBURI = process.env.MongoURI;
}
else if(process.env.MONGO_GITHUB_URI){
    DBURI = process.env.MONGO_GITHUB_URI;
}else{
    DBURI = require('./config/mongotesturi');
}

// setting mongo parameters to prevent depreciation notices
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);

// Establishing the listening Port
if( process.env.npm_lifecycle_event === 'start' ){
    var port = 3000;
}
else if( process.env.npm_lifecycle_event === 'test' ){
    var port = 4000;
}

// Establishing connection to db
mongoose.connect(DBURI)
    .then((result) => {
        console.log('Database Connected');
        app.listen(port, () => {
            console.log('App listening at port ' + port);
        });
    }).catch(err => console.log(err));

module.exports = port;