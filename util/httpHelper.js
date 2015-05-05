var http = require('http');
var https = require('https');
var qs=require('querystring');
var iconv = require('iconv-lite'); 
var BufferHelper = require('bufferhelper');
 
var httpHelper={
    request: function(options,timeout,data,callback,encoding){
        var httpLib=http;
        if(options.protocol&&options.protocol==='https:'){
            httpLib=https;
        }
         
        var req = httpLib.request(options, function(res) {
            var bufferHelper = new BufferHelper();
            res.on('data', function (chunk) {
                bufferHelper.concat(chunk);
            });
            res.on('end',function(){ 
                var _data;

                if(typeof encoding!='undefined'){
                    _data=iconv.decode(bufferHelper.toBuffer(),encoding);
                }else{
                    _data=iconv.decode(bufferHelper.toBuffer());
                }

                 
                callback(null,_data);
            });
        });
 
        req.on('error', function(err) {
            callback(err);
        });
         
        var content=qs.stringify(data);
        req.write(content);
         
        if(timeout&&timeout>0){
            req.setTimeout(timeout, function( ) {
                console.log('request timeout');
                callback(new Error('request timeout'),'');
            });
        }
         
        req.end();
    },
    get: function(url,timeout,callback,encoding){
        var options=require('url').parse(url);
        options.method='GET';
        this.request(options,timeout,{},callback,encoding);
    }
};
 
module.exports=httpHelper;