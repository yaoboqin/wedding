var mongoose = require("mongoose");  //  顶会议用户组件
var Schema = mongoose.Schema;    //  创建模型
var signupScheMa = new Schema({
	id: Number,
    name: String,
    tel: Number,
    num: Number,
    createTime : { type: Date, default: Date.now }
}); //  定义了一个新的模型，但是此模式还未和users集合有关联

var signup = mongoose.model("signup", signupScheMa);
var signupDAO = function(){};

signupDAO.prototype.save = function(obj, callback) {
	var instance = new signup(obj);
		instance.save(function(err){
			callback(err);
		});
};

signupDAO.prototype.find = function(query, fields, options, callback) {
	return signup.find(query, fields, options, callback)
};

signupDAO.prototype.findOne = function(query, fields, options, callback) {
	return signup.findOne(query, fields, options, callback)
};

module.exports = new signupDAO();