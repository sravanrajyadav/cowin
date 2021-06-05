var http = require('http');
var request = require('request');

var moment = require('moment')

var requestLoop = setInterval(function(){
	var startTime = 'Started : '+moment().format('h:mm:ss a')
    request({
        url: "https://1b75e026aa59.ngrok.io/v1/voicera/checkHydD1Slots",
        method: "POST",
        timeout: 10000
    },function(error, response, body){
        if(!error && response.statusCode == 200){
			console.log('Success : '+moment().format('h:mm:ss a'))
        }else{
			console.log(startTime+', Timeout : '+moment().format('h:mm:ss a'))
        }
    });
  }, 300000);