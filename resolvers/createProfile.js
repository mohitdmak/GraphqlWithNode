var Profile = require('../models/profiles');

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

module.exports = createProfileC;