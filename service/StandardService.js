'use strict';
const jwt = require('jsonwebtoken')
const secret_key = 'simonrocks'
const options = {
    expiresIn: 60 * 15,
    issuer: 'simon'
}


/**
 * checks API availability
 * Send a GET request with your API token to check both that the token is recognised and that the API is up and running 
 *
 * returns Object
 **/
exports.checkstatus = function() {
  return new Promise(function(resolve, reject) {
      resolve('{ "status": "ok"}')
  });
}


/**
 * get the state of a previously submitted recommendation
 *
 * recId String 
 * returns RecommendationState
 **/
exports.getRecommendationStatus = function(recId) {
    return new Promise(function(resolve, reject) {
	console.log('in service checking for '+recId)
	var status = recdb.getRecommendationStatus(recId)
	console.log('DB said status is '+status)
	if(status === 'NOTFOUND') reject({code: 404, message: 'Recommendation not found'})
	else resolve('{"state": "'+status+'"}');
    });
}


/**
 * login with a username and password
 * returns a signed JWT
 *
 * login Login 
 * returns Jwt
 **/
exports.login = function(login) {
    return new Promise(function(resolve, reject) {
	var payload = checkUnPw(login.name, login.password)
	if(payload) {
	    console.log('un/pw ok')
	    var response = {
		expires: new Date(new Date().getTime()+60*15*1000).toISOString(),
		token: jwt.sign(payload, secret_key, options)
	    }
	    console.log('Resolving '+JSON.stringify(response))
	    resolve(JSON.stringify(response))
	} else {
	    reject({code: 401, message: 'Login denied'});
	}
  });
}


/**
 * refresh an existing JWT
 * Refresh an unexpired token 
 *
 * token String the existing token
 * returns Jwt
 **/
exports.refreshToken = function(token) {
  return new Promise(function(resolve, reject) {
      jwt.verify(token, secret_key, function(err, decoded) {
	  if(err) {
	      console.log(err)
	      reject({code: 400, message: 'Unable to refresh token'})
	  } else {
	      console.log(decoded)
              var response = {
		  expires: new Date(new Date().getTime()+60*15*1000).toISOString(),
		  token: jwt.sign(decoded.payload, secret_key, options)
	      }
	      console.log('Resolving '+JSON.stringify(response))
	      resolve(JSON.stringify(response))
	  }
      });
  });
}


/**
 * submits a recommended action
 * Adds a recommended action for a specified service
 *
 * recommendation Recommendation Recommendation being made (optional)
 * returns RecommendationResponse
 **/
exports.submitRecommendation = function(recommendation) {
    return new Promise(function(resolve, reject) {
	console.log(recommendation)
	var valid= recdb.validateRecommendation(recommendation)
	if(valid == 200) {
	    console.log('Validated ok')
	    var recid = recdb.saveRecommendation(recommendation)
	    console.log('Got recommendation id '+recid)
	    var retval = '{ "recommendation_id" : "' + recid + '"}'
	    recdb.showState()
	    resolve(retval)
	} else {
	    console.log('Failed validation')
	    recdb.showState()
	    reject({code: valid, message: 'Not allowed'});
	}
    });
}

