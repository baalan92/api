var mongoose = require('mongoose');  
var mongooseAggregatePaginate = require('mongoose-aggregate-paginate');

var login_statusSchema = new mongoose.Schema(
{
    user_id : {type:mongoose.Schema.Types.ObjectId,ref : 'User', required: true},
	mac_address : {type: String, required:false},
	ip_address : {type: String, required:false},
	location : {type: String, required:false},
	os_type : {type: String, required:false},
    in_time : {type: Date, required: false, unique:false },
},
{
	timestamps  :true
});

login_statusSchema.plugin(mongooseAggregatePaginate);
mongoose.model('Login_Status', login_statusSchema);

module.exports = mongoose.model('Login_Status');