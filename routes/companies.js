var express = require('express')
  , router = express.Router()
  , loader = require('../helpers/loader')
  , search = require('../helpers/search')
  , config = require('../helpers/config')
  , db = require('../helpers/db');

  router.get('/search', function(request, response) {
    if (request.query.companyname){
  	  companyname = request.query.companyname;
  	}else{
  	  companyname = ''; //default
  	}
    //call search
    detail = "company: " + companyname;
    data = search.companybyname(companyname);
    response.send(data);
    response.end();
  });

  router.get('/tonessummary', function(request, response) {
    companyid = request.query.companyid;
    var data = {}
    data = search.tonessummary(companyid);
    response.send(data);
    response.end();
  });

  module.exports = router;
