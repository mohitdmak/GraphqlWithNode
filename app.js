// Initiating express app
const express = require('express');
var app = express();

// this parses data submitted through forms generally.
app.use(express.urlencoded({ extended:true }));
// this parses data submitted in json format.
app.use(express.json());
//setting up cookie parser.
const cookieParser = require('cookie-parser');
// needed to parse cookie data wherever processed.
app.use(cookieParser());

const graphql = require('graphql')
// This handles uri path queries and playground for requests
const { graphqlHTTP } = require('express-graphql')

// requiring mongoose and mongoURI
var mongoose = require('mongoose');
const DBURI = require('./config/mongouri');

// GraphQL schema
var schema = require('./GraphqlSchema/schema');

// Importing all resolvers
var allProfilesC = require('./resolvers/allProfiles');
var getProfileC = require('./resolvers/getProfile');
var createProfileC = require('./resolvers/createProfile');
var deleteProfileC = require('./resolvers/deleteProfile');

// rootValue to map requests to their resolver functions
var root = {
    getProfile: getProfileC,
    allProfiles: allProfilesC,
    createProfile: createProfileC,
    deleteProfile: deleteProfileC
};

// express app using graphiql server
//* Here we are not passing 'context' parameter and thus it takes the request as default context parameter.
//* Then for all resolver functions used by rootValue, this params can be taken as function argument, containing the request.
app.use('/graphpaths', graphqlHTTP((request, response) => ({
    schema: schema, 
    rootValue: root, 
    graphiql: true,
    context: {req: request, res: response}  
  })));

// Non graphql home get request
app.get('/', (req, res) => {
    console.log('User has arrived on home.');
    res.end('Welcome, The Port is listening.');
})

module.exports = app;