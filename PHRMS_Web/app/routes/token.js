/* 
 * Access Token Authentication and verification Middleware.
 * Any Route Beyond this Point Will be Requiring Access Tokens.
 * They Can be provided in Body, X-ACCESS Header or Query
 */

var mongoose = require('mongoose');
var secret = 'B@&$bt7t63b493ocn';
var jwt = require('jsonwebtoken');

module.exports = function(router) {

    router.use(function(req, res, next) {
        // if (req.originalUrl.indexOf('api/share/getNotifications') === -1)
        //     console.log("");
        var token = req.body.token || req.body.query || req.headers['x-access-token'];
        if (req.originalUrl.indexOf('/api/share/checkPassKey') !== -1 ||
            req.originalUrl.indexOf('/api/share/submitResponse') !== -1)
            next();
        else if (token) {
            jwt.verify(token, secret, function(err, decoded) {
                if (err) {
                    res.json({ success: false, message: "Invalid Token Provided!" });
                } else {
                    req.decoded = decoded;
                    if ((req.decoded.exp - (Math.floor(Date.now() / 1000))) < 0) {
                        res.json({ success: false, message: "The Token has Expired!" });
                    } else
                        next();
                }
            });
        } else {
            res.json({ success: false, message: "Token Not Provided! Please Provide Token" });
        }

    });

    // Auth Token Decoder
    router.post('/me', function(req, res) {
        res.json({ success: true, message: req.decoded });
    });

    return router;
};