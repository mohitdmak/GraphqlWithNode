// Importing Chai asserting library
const expect = require('chai').expect;

// Importing mongo TESTURI
var testDBURI;
// Assigning Test URI based on whether being run on local container or circleci docker container.
if(process.env.MongoURI){
    testDBURI = process.env.MongoURI;
}
else if(process.env.MONGO_GITHUB_URI){
    testDBURI = process.env.MONGO_GITHUB_URI;
}else{
    testDBURI = require('./config/mongotesturi');
}

// Importing mongoose as Mongo ORM
const mongoose = require('mongoose');

// Importing express app
const app = require('../app');

// Importing supertest to make requests
const request = require('supertest');


// TEST - SUITE 
describe('Test Suite for Validating Requests through GraphQL Api', function(){
    
    mongoose.set('useNewUrlParser', true);
    mongoose.set('useFindAndModify', false);
    mongoose.set('useCreateIndex', true);
    mongoose.set('useUnifiedTopology', true);

    // closing any previous interfiering connection
    it('Closing Connection', async function(){

        try{
            var close = await mongoose.connection.close();
        }catch(err){
            console.log(err);
        }
    });  

    // Creating global scoped variable for express connection to close in last test
    var connection;

    it('Connect to database.', async ()  => {

        try{
            await mongoose.connect(testDBURI);
            connection = await app.listen(4000);
        }catch(err){
            console.log(err);
        }

    });

    // Checking for request acceptance at test port
    it('Pinging app port.', async () => {

        let res = await request(app).get('/');
        expect(res.status).to.equal(200);
        expect(res.text).to.equal('Welcome, The Port is listening.');
    });

    // creating id varaiable for use in getting created profile
    var id;

    // Post Request to create Profile
    it('Posting New Profile Instance.', async () => {

        // Preparing Payload for graphql request
        var Data = {
            "query": 
                "mutation($Job:String!,$Company:String!){ \
                    createProfile(Job: $Job, Company:$Company){ \
                      _id, \
                      Job, \
                      Company \
                    } \
                }",
            "variables": {
                //"id" :"6084e84b03aead171009aed9",
                "Job":"TEST DEVELOPER",
                "Company":"TEST DEVELOPER COMPANY"
            }
        }

        // Obtaining api response from supertest ping.
        let res = await request(app).post('/graphpaths').send(Data);

        expect(res.status).to.equal(201);
        expect(res.body).to.contain.property('data');
        expect(res.body.data).to.contain.property('createProfile');
        expect(res.body.data.createProfile).to.contain.property('_id');
        expect(res.body.data.createProfile).to.contain.property('Job');
        expect(res.body.data.createProfile).to.contain.property('Company');
        expect(res.body.data.createProfile.Job == "TEST DEVELOPER");
        expect(res.body.data.createProfile.Company == "TEST DEVELOPER COMPANY");

        // setting id for use in next query
        id = res.body.data.createProfile._id;
    
    });

    it('Getting creating Profile', async () => {

        // Preparing Payload for graphql request
        var Data = {
            "query": 
                "query($id: ID!){ \
                    getProfile(id: $id){ \
                        _id, \
                        Job, \
                        Company \
                    } \
                }",
            "variables": {
                "id" : id
            }
        }

        // Obtaining api response from supertest ping
        var res = await request(app).get('/graphpaths').send(Data);

        expect(res.status).to.equal(200);
        expect(res.body).to.contain.property('data');
        expect(res.body.data).to.contain.property('getProfile');
        expect(res.body.data.getProfile).to.contain.property('_id');
        expect(res.body.data.getProfile).to.contain.property('Job');
        expect(res.body.data.getProfile).to.contain.property('Company');
        expect(res.body.data.getProfile._id == id);

    });

    it('Getting data for all profiles.', async () => {

        // Preparing Payload for graphql request
        var Data = {
            "query":
                "query{ \
                    allProfiles{ \
                        _id, \
                        Job, \
                        Company \
                } \
              }"
        }

        // Obtaining api response from supertest ping
        var res = await request(app).get('/graphpaths').send(Data);

        expect(res.status).to.equal(200);
        expect(res.body).to.contain.property('data');
        expect(res.body.data).to.contain.property('allProfiles');
        res.body.data.allProfiles.forEach((profile) => expect(profile).to.contain.property('_id'));
        res.body.data.allProfiles.forEach((profile) => expect(profile).to.contain.property('Job'));
        res.body.data.allProfiles.forEach((profile) => expect(profile).to.contain.property('Company'));

    });

    it('Deleting Created Profile via graphql query.', async () => {

        // Providing payload for graphql request
        var Data = {
            "query": 
                "mutation($id: ID!){ \
                    deleteProfile(id: $id){ \
                        _id, \
                        Job, \
                        Company \
                    } \
                }", 
            "variables": {
                "id" : id,
            }
        }

        // Obtaining api response from supertest ping
        var res = await request(app).post('/graphpaths').send(Data);

        expect(res.status).to.equal(202);
        expect(res.body).to.contain.property('data');
        expect(res.body.data).to.contain.property('deleteProfile');
        expect(res.body.data.deleteProfile).to.contain.property('_id');
        expect(res.body.data.deleteProfile).to.contain.property('Job');
        expect(res.body.data.deleteProfile).to.contain.property('Company');
        expect(res.body.data.deleteProfile._id == id);

    });

    // Closing app port for further tests
    it("Closing app port.", async () => {

        // Closing test port for express app
        const closed = await connection.close();
    });

});