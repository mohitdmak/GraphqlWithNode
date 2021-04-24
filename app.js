//Initiating express app
const express = require('express');
var app = express();

const graphql = require('graphql')
//This handles uri path queries and playground for requests
const { graphqlHTTP } = require('express-graphql')

//Root - Resolver Function
//var root

// GraphQL schema
var schema = graphql.buildSchema(`
    type Query {
        message: String,
        errmessage: String
    }
`);

app.use('/graphpaths', graphqlHTTP({
    schema: schema,
    graphiql: true
}));

app.listen(8000, () => {
    console.log('App is listening on port 8000');
});