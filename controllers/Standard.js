'use strict';

var auth = require('../utils/auth.js');
var utils = require('../utils/writer.js');
var Standard = require('../service/StandardService');

module.exports.checkstatus = function checkstatus (req, res, next) {
    if(auth.validate(req)) utils.writeJson(res, utils.respondWithCode(401,'{"code": 401, "message": "Not allowed"}'))
    Standard.checkstatus()
	.then(function (response) {
	    utils.writeJson(res, response);
	})
	.catch(function (err) {
	    utils.writeJson(res, utils.respondWithCode(err.code, JSON.stringify(err)));
	});
};

module.exports.getRecommendationStatus = function getRecommendationStatus (req, res, next) {
    if(auth.validate(req)) utils.writeJson(res, utils.respondWithCode(401,'{"code": 401, "message": "Not allowed"}'))
    var recId = req.swagger.params['recId'].value;
    Standard.getRecommendationStatus(recId)
	.then(function (response) {
	    utils.writeJson(res, response);
	})
	.catch(function (err) {
	    utils.writeJson(res, utils.respondWithCode(err.code, JSON.stringify(err)));
	});
};

module.exports.login = function login (req, res, next) {
    var login = req.swagger.params['login'].value;
    Standard.login(login)
	.then(function (response) {
	    utils.writeJson(res, response);
	})
	.catch(function (err) {
	    utils.writeJson(res, utils.respondWithCode(err.code, JSON.stringify(err)));
	});
};

module.exports.refreshToken = function refreshToken (req, res, next) {
    if(auth.validate(req)) utils.writeJson(res, utils.respondWithCode(401,'{"code": 401, "message": "Not allowed"}'))
    var token = req.swagger.params['token'].value;
    Standard.refreshToken(token)
	.then(function (response) {
	    utils.writeJson(res, response);
	})
	.catch(function (err) {
	    utils.writeJson(res, utils.respondWithCode(err.code, JSON.stringify(err)));
	});
};

module.exports.submitRecommendation = function submitRecommendation (req, res, next) {
    if(auth.validate(req)) utils.writeJson(res, utils.respondWithCode(401,'{"code": 401, "message": "Not allowed"}'))
    var recommendation = req.swagger.params['recommendation'].value;
    Standard.submitRecommendation(recommendation)
	.then(function (response) {
	    utils.writeJson(res, response);
	})
	.catch(function (err) {
	    utils.writeJson(res, utils.respondWithCode(err.code, JSON.stringify(err)));
	});
};
