var express = require('express');
var http = require('http');
var url = require('url');
var router = express.Router();
var signup = require('../models/signup');

router.get('/', function(req, res) {
      res.render('signup', { title: '请柬' });
});

router.get('/address', function(req, res) {
      res.render('address');
});

router.get('/result', function(req, res) {
	var URL = url.parse(req.url, true).query,
    	sort = URL.sort==1? 1 : -1;
	signup.find({}, null, {sort:{'createTime': sort}}, function(err, docs){
        if (err) {
            console.error(err);
            return;
        }else{
            if(sort==-1){
                for(var i=docs.length-1, a=0; i>-1&&a<docs.length; i--,a++){ 
                    docs[a].id = i;
                }
            }else if(sort==1){ 
                for(var i=docs.length-1; i>-1; i--){ 
                    docs[i].id = i;
                }
            }
            res.render('signuplist', {
                title: 'signuplist',
                signup: docs
            });
        }
    });
});

router.post('/dosignup', function(req, res) {
    var query_doc = {name: req.body.name, tel: req.body.tel, num:req.body.num};
    	signup.findOne({tel:query_doc.tel, name:query_doc.name, num:query_doc.num}, function(err, doc){ 
    		if(err){ 
    			console.log(err);
    		}else if(doc){ 
				var data = { 
                	code : 110,
                	msg : "您已提交过信息，请勿重复提交。"
                }
                var str = JSON.stringify(data);//jsonp  
            	res.send(200, str);
			}else{ 
				signup.save(query_doc, function(err, doc){
		            if(err){
		            	var data = { 
		                	code : 120,
		                	msg : "服务器正忙，请稍后再试"
		                }
		                var str = JSON.stringify(data);//jsonp  
		            	res.send(200, str);
		            }else{
		                var data = { 
		                	code : 100,
		                	msg : "报名成功"
		                }
		                var str = JSON.stringify(data);//jsonp  
		                res.send(200, str);
		            }
		        });
			}
    	})

});

module.exports = router;
