var mongoose = require('mongoose');  

var password_changeSchema = new mongoose.Schema(
{
    user_id     : {type:mongoose.Schema.Types.ObjectId,ref : 'User', required: true },
    date        : {type: Date, required: true, unique:false},
    new_password : {type: String, required: true, unique:true}
},
{
	timestamps  :true
});

mongoose.model('Password_Change', password_changeSchema);

module.exports = mongoose.model('Password_Change');
