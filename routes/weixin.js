var express = require('express');
var http = require('http');
var httpHelper=require('../util/httpHelper');
var url = require('url');
var router = express.Router();
var weixin = require('../models/weixin');
var crypto = require('crypto');
var app = require('../app');

var sha1 = function(str) {  
    var md5sum = crypto.createHash('sha1');  
    md5sum.update(str);  
    str = md5sum.digest('hex');  
    return str;  
}
// noncestr
var createNonceStr = function() {
	return Math.random().toString(36).substr(2, 15);
};

// timestamp
var createTimeStamp = function () {
	return parseInt(new Date().getTime() / 1000) + '';
};
var calcSignature = function (ticket, noncestr, ts, url) {
	console.log(url)
	var str = 'jsapi_ticket=' + ticket + '&noncestr=' + noncestr + '&timestamp='+ ts +'&url=' + url;
	return sha1(str)
	/*
	var oriArray = new Array();  
    oriArray[0] = ticket;  
    oriArray[1] = noncestr;  
    oriArray[2] = ts;
    oriArray[3] = url;
    oriArray.sort();  
    var original = oriArray[0]+oriArray[1]+oriArray[2]+oriArray[3];  
    return sha1(original)
    */
}
var getTicket = function(){ 
	var url = "https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token="+global.data.access_token+"&type=jsapi"
	httpHelper.get(url,30000,function(err,req){   
		req = JSON.parse(req);
	    if(err){
	        console.log(err);
	    }else if(!req.ticket){ 
	    	console.log(req);
	    }else{ 
		    global.data.ticket = req.ticket;
			console.log(req);
	    }
	 	
	}, 'utf8')
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

router.post('/getdata', function(req, res){ 
	console.log(req.body.url);
	var url = "https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token="+global.data.access_token+"&type=jsapi",
		response = req;

	httpHelper.get(url,30000,function(err,req){   
		req = JSON.parse(req);
	    if(err){
	        console.log(err);
	    }else if(!req.ticket){ 
	    	console.log(req);
	    }else{ 
		    global.data.ticket = req.ticket;
			console.log(req);

			var ticket = global.data.ticket,
				timestamp = createTimeStamp(),
				nonceStr = createNonceStr(),
				url = response.body.url,
				signature = calcSignature(ticket, nonceStr, timestamp, url),
				data = { 
					code : 100,
					result : { 
						ticket: global.data.ticket,
						appID : global.data.appID,
						timestamp : timestamp,
						nonceStr : nonceStr,
						signature : signature
					}
				}
			var str = JSON.stringify(data);
			res.send(200, str);
	    }
	 	
	}, 'utf8')
	
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
