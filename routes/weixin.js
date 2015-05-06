var express = require('express');
var http = require('http');
var url = require('url');
var router = express.Router();
var weixin = require('../models/weixin');
var crypto = require('crypto');
var app = require('../app');

function sha1(str) {  
    var md5sum = crypto.createHash('sha1');  
    md5sum.update(str);  
    str = md5sum.digest('hex');  
    return str;  
}

router.get('/check', function(req, res){ 
    var query = req.query;  
    var signature = query.signature;  
    var echostr = query.echostr;  
    var timestamp = query['timestamp'];  
    var nonce = query.nonce;  
    var oriArray = new Array();  
    oriArray[0] = nonce;  
    oriArray[1] = timestamp;  
    oriArray[2] = "weixincheck2015";//这里填写你的token  
    oriArray.sort();  
    var original = oriArray[0]+oriArray[1]+oriArray[2];  
    console.log("Original Str:"+original);  
    console.log("signature:"+signature);  
    var scyptoString = sha1(original);  
    if (signature == scyptoString) {  
        res.send(echostr);  
    }  
    else {  
        res.send("Bad Token!");  
    }  
})

router.get('/appid', function(req, res){ 
	var str = JSON.stringify(global.data);
	res.send(200, str);
})

router.get('/menuinit', function(req, res){ 
	var url = "https://api.weixin.qq.com/cgi-bin/menu/create?access_token="+global.data.access_token,
		data = {
		    "button":[
				{	
					"type":"click",
					"name":"每日资讯",
					"key":"news"
				},
				{
					"name":"产品",
					"sub_button":[
						{	
							"type":"view",
							"name":"自粘绑带",
							"url":"http://www.soso.com/"
						},
						{
							"type":"view",
							"name":"冷喷剂",
							"url":"http://v.qq.com/"
						},
						{
							"type":"click",
							"name":"赞一下我们",
							"key":"good"
						}
					]
			}]
		 }
	weixin.menuInit(url, 30000, data, function(err, doc){ 
		if(err){ 
			console.log(err);
		}else{ 
			res.send(200, doc);
		}
	}, 'utf8')
})

module.exports = router;
