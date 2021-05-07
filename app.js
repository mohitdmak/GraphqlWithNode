// Initiating express app
const express = require('express');
var app = express();

const graphql = require('graphql')
// This handles uri path queries and playground for requests
const { graphqlHTTP } = require('express-graphql')

// requiring mongoose and mongoURI
var mongoose = require('mongoose');
const DBURI = require('./mongo');

// GraphQL schema
var schema = require('./schema');

// Importing all resolvers
var allProfilesC = require('./resolvers/allProfiles');
var getProfileC = require('./resolvers/getProfile');
var createProfileC = require('./resolvers/createProfile');

// rootValue to map requests to their resolver functions
var root = {
    getProfile: getProfileC,
    allProfiles: allProfilesC,
    createProfile: createProfileC
};

// setting mongo parameters to prevent depreciation notices
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);

// establishing connection to db
mongoose.connect(DBURI, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true })
    .then((result) => {
        console.log('Database Connected');
        app.listen(3000, () => {
            console.log('App Listening on port 3000.');
        });
    }).catch(err => console.log(err));

// express app using graphiql server
//* Here we are not passing 'context' parameter and thus it takes the request as default context parameter.
//* Then for all resolver functions used by rootValue, this params can be taken as function argument, containing the request.
app.use('/graphpaths', graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true
}));


app.get('/', (req, res) => {
    console.log('User has arrived on home.');
})