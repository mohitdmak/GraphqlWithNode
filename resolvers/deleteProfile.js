var Profile = require('../models/profiles');

// NOTE-THAT: Since we have passed request object as context in root query of graphqlHTTP,
// If we take another parameter request after params, we get access to the request object.

// NOTE-THAT: We have taken both request and response as context. These are together available under the second parameter.
// First Parameter will be params for graphql request, that is query variables.
// Third Parameter will have the request's parts taken relevant to a graphql request.

async function deleteProfileC(params, Context){

    try{
        var result = await Profile.findByIdAndDelete(params.id);
        console.log(result);
        Context.res.status(202);
        return result;

    }catch(err){
        console.log(err);
        Context.res.status(503);
        return err;
    }
};

module.exports = deleteProfileC;