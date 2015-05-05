var express = require('express');
var http = require('http');
var url = require('url');
var router = express.Router();
var weixin = require('../models/weixin');
var crypto = require('crypto');

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

module.exports = router;