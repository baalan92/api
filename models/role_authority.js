var mongoose = require('mongoose');

var universitySchema = new mongoose.Schema(
{
    role_id : {type:mongoose.Schema.Types.ObjectId, ref : 'Role', required: true }, 
    authority : {type: String},    
},
{
    timestamps:true
});

mongoose.model('Role_authority', universitySchema);
module.exports = mongoose.model('Role_authority');