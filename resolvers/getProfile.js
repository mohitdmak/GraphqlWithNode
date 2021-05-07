var Profile = require('../models/profiles');

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

module.exports = getProfileC;