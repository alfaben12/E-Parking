var http = require('http');
const moment = require('moment');

module.exports = {
	sendNotification: async function(req, response) {
        var key = "AAAAQu8izZ4:APA91bGGZGwF7hUVbLsF-7OS6XYt8H03W0ThA7THxji9xhcmVfBpnoWyhBEwvNpJlLEHyZ8RiiMjgG-1ZxWmDMss5JoxBGvt3-1JnEPc09La7kC9Z4ImeniE65hx8b2YcmLQ9ORFeDgG";
        var token = req.body.token;
        var nominal = req.body.nominal;
        
        var message = {
            "to": token,
            "notification": {
                "title": "E-Parkir",
                "body": "Pembayaran diterima Rp."+ nominal + " dari "+ vehicle_registration +" pada "+ moment().format('dddd, MMMM Do YYYY') +".",
                "sound": "default"
            }
        };
        var postData = JSON.stringify(message);
        var options = {
            hostname: 'fcm.googleapis.com',
            path: '/fcm/send',
            method: 'POST',
            headers: {
                'Content-Length': postData.length,
                'Content-Type': 'application/json; charset=UTF-8',
                'Authorization': 'key='+ key
            }
        };
        
        var requestHttp = http.request(options, function (res) {
            res.setEncoding('utf8');
            res.on('data', function (chunk) {
                return response.status(200).json({
                    result : true,
                    data:{
                        code: 200,
                        message: "Success send notification."
                    },
                });
            });
            res.on('error', function (e) {
                return response.status(401).json({
                    result : false,
                    data:{
                        code: 401,
                        message: "Failed send notif {"+ e.message +"}."
                    },
                });
            });
        });
        requestHttp.write(postData);
        requestHttp.end();
        
        requestHttp.on('error', function (e) {
            return response.status(401).json({
                result : false,
                data:{
                    code: 401,
                    message: "Failed send notif {"+ e +"}."
                },
            });
        });
    }
}