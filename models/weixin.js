var http = require('http');
var httpHelper=require('../util/httpHelper');
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

global.data = { 
	//老和山夏
	// appID : 'wx85e1ea6f72fce1e1',
	// appsecret : '3533df73e7c2fe9bc918c3ce468c7e02'

	//测试号
	appID : 'wxa36629c12be99284',
	appsecret : '51e08bb73cf581c2889433f4e14bdc79'
}

weixinDAO.prototype.getAppId = function(){ 
	var url = "https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid="+global.data.appID+"&secret="+global.data.appsecret;
	httpHelper.get(url,30000,function(err,req){   
		req = JSON.parse(req);
	    if(err){
	        console.log(err);
	    }else if(!req.access_token){ 
	    	console.log(req);
	    }else{ 
		    global.data.access_token = req.access_token;
			global.data.expires_in = req.expires_in;
			console.log(req);
	    }
	 	
	}, 'utf8')
}

weixinDAO.prototype.menuInit = function(url,timeout,data,callback,encoding){ 
	return httpHelper.post(url,timeout,data,callback,encoding)
}

module.exports = new weixinDAO();