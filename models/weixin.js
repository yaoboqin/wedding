var mongoose = require("mongoose");  //  顶会议用户组件
var Schema = mongoose.Schema;    //  创建模型
var weixinScheMa = new Schema({
	id: Number,
    createTime : { type: Date, default: Date.now }
}); //  定义了一个新的模型，但是此模式还未和users集合有关联

var weixin = mongoose.model("weixin", weixinScheMa);
var weixinDAO = function(){};

weixinDAO.prototype.save = function(obj, callback) {
	var instance = new weixin(obj);
		instance.save(function(err){
			callback(err);
		});
};

weixinDAO.prototype.find = function(query, fields, options, callback) {
	return weixin.find(query, fields, options, callback)
};

weixinDAO.prototype.findOne = function(query, fields, options, callback) {
	return weixin.findOne(query, fields, options, callback)
};

module.exports = new weixinDAO();