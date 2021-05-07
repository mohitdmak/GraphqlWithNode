var Profile = require('../models/profiles');

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

module.exports = allProfilesC;