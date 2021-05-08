const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProfileSchema = new Schema({
    Job : {
        type: String,
        required: true
    },
    Company : {
        type: String,
        required: true
    }
},{
    versionKey: false
},{
    timestamps: true
});

var testProfile = mongoose.model('testprofile', ProfileSchema);

module.exports = testProfile;