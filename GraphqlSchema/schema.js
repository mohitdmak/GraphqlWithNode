const graphql = require('graphql')

// GraphQL schema
var schema = graphql.buildSchema(`
    type Query {
        getProfile(id: ID!): Profile
        allProfiles: [Profile!]!
    },
    type Mutation {
        createProfile(Job: String!, Company: String!): Profile
        deleteProfile(id: ID!): Profile
    },
    type Profile {
        _id: ID
        Job: String
        Company: String
    }
`);

module.exports = schema;