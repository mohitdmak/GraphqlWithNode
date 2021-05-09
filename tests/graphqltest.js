// Importing Chai asserting library
const expect = require('chai').expect;

// Importing mongoose as Mongo ORM
const mongoose = require('mongoose');
// Importing model for Test Profile on Test Database
const testProfile = require('../models/testprofiles');

// Importing express app
const app = require('../app');

// Importing supertest to make requests
const request = require('supertest');


// TEST - SUITE 
describe('Test Suite for Validating Requests through graph Api', function(){

    // Get Request to obtain list of all profiles
    it('Getting All Profiles', async function(){

    });

});