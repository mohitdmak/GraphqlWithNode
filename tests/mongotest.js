// Importing mongo TESTURI
const testDBURI = require('../config/mongotesturi');

// Importing Chai asserting library
const expect = require('chai').expect;

// Importing mongoose as Mongo ORM
const mongoose = require('mongoose');

// Importing model for Test Profile
const testProfile = require('../models/testprofiles');

// Importing express app
const app = require('../app');

// setting mongo parameters to prevent depreciation notices
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);


describe('Test Suite for Validating CRUD OPS with Mongo DB.', function(){

    // closing any previous interfiering connection
    it('Closing Connection', async function(){
        try{
            var close = await mongoose.connection.close();
        }catch(err){
            console.log(err);
        }
    });  

    it('Connect to database.', function(done){

        // establishing connection to db
        mongoose.connect(testDBURI)
            .then((result) => {
                app.listen(4000, () => {
                    console.log(`App Listening on test port 4000.`);
                });
                done();
            })
            .catch((err) => {
                console.log(err);
                done(err);
            });
    });

    // Initialize id var for use in Get request
    var id; 

    it('Post Request to Test Database.', async function(){
        
        // creating test profile
        var profile = new testProfile({
            Job: "Test Job",
            Company: "Test Company"
        });

        const res = await profile.save();
        id = res._id;

        expect(res, 'Response didnt contain _id field.').to.contain.property('_id');
        expect(res, 'Response didnt contain Job field.').to.contain.property('Job');
        expect(res, 'Response didnt contain Company field.').to.contain.property('Company');
        expect(res.Job, 'Profiles Job didnt match.').to.equal('Test Job');
        expect(res.Company, 'Profiles Company didnt match.').to.equal('Test Company');

    });

    it('Get Request to Test Database.', async function(){

        // fetching created Test Profile
        const res = await testProfile.findById(id);

        expect(res, 'Response didnt contain _id field.').to.contain.property('_id');
        expect(res, 'Response didnt contain Job field.').to.contain.property('Job');
        expect(res, 'Response didnt contain Company field.').to.contain.property('Company');
        expect(String(res._id) == id, 'The Fetched Id didnt match requested id.');
    });

    it('Update Request to Test Database.', async function(){

        // updating created Test Profile
        const res = await testProfile.findByIdAndUpdate(id, {Job: "Test Job Updated"}, {new: true});
        expect(res.Job === "Test Job Updated");
        
    });

    it('Delete Request to Test Database.', async function(){

        // deleting created Test Profile
        const res = await testProfile.findByIdAndDelete(id);

        expect(String(res._id == id));
        const red = await testProfile.findById(id);
        expect(red == null);
    });

});
