//Initiating express app
const express = require('express');
var app = express();

const graphql = require('graphql')
//This handles uri path queries and playground for requests
const { graphqlHTTP } = require('express-graphql')

//requiring mongoose
var mongoose = require('mongoose');

//requiring mongoURI
const DBURI = require('./config/mongo');

//Requiring Profile Model
const Profile = require('./models/profiles');

// GraphQL schema
// GraphQL schema
var schema = graphql.buildSchema(`
    type Query {
        getProfile(id: ID!): Profile
        allProfiles: [Profile!]!
    },
    type Mutation {
        createProfile(Job: String!, Company: String!): Profile
    }
    type Profile {
        _id: ID
        Job: String
        Company: String
    }
`);

async function getProfileC(params){
    try{
        const id = params.id;
        const result = await Profile.findById(id);
        console.log(result);
        return result;
    }
    catch(err){
        console.log(err);
        return err;
    }
};

async function allProfilesC(){
    try{
        const result = await Profile.find();
        console.log(result);
        return result;
    }
    catch(err){
        console.log(err);
        return err;
    }
};

async function createProfileC(params){
    try{
        const profile = new Profile(params);
        const result = await profile.save();
        console.log(result);
        return result;
    }
    catch(err){
        console.log(err);
        return err;
    }
};


var root = {
    getProfile: getProfileC,
    allProfiles: allProfilesC,
    createProfile: createProfileC
};


mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);
//|SECTION
//#endregion

// NOTE-THAT -
//#The mongoose.connect asynchronouly returns a promise.
//#Since the mongoose.connect is an asynchronous request, it will run in the background after app listens to :3000 if we keep the command seperate.
//#Thus instead include it in the .then of the promise as then, the app loads only after connecting to the db.
mongoose.connect(DBURI, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true })
    .then((result) => {
        console.log('Database Connected');
        app.listen(3000, () => {
            console.log('App Listening on port 3000.');
        });
    }).catch(err => console.log(err));

app.use('/graphpaths', graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true
}));
