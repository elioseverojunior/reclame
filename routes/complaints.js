var express = require('express')
  , router = express.Router()
  , loader = require('../helpers/loader')
  , search = require('../helpers/search')
  , config = require('../helpers/config')
  , db = require('../helpers/db')
  , reqsync = require('sync-request');

  router.get('/load', function(request, response) {
    //get request parameters
    if (request.query.indice){
  	  indice = request.query.indice;
  	}else{
  	  indice = config.loader.indice; //default
  	}
    if (request.query.offset){
  	  offset = request.query.offset;
  	  if (offset > 5000) offset = 5000; //hard-limit to on-line processing.
  	}else{
  	  offset = config.loader.offset; //default
  	}
    if (request.query.company){
  	  company = request.query.company;
  	}else{
  	  company = config.loader.company; //default
  	}
    //call loader
    detail = "indice: " + indice + " offset: " + offset + " company: " + company;
    loader.load(indice, offset, company);
    var message = 'called loader(' + detail + ').';
    response.send(message);
    response.end();
  });


  router.get('/pollinprogress', function(request, response) {
    var companyid = request.query.companyid;
    var key = '[\"' + encodeURIComponent(companyid) + '\"]';
    var parameters = 'reduce=true&group=true&keys='+ key;
    var urlConsulta = config.db.url + '/' + config.db.name + '/_design/' +
                      config.db.designdocument + '/_view/inprogress?' + parameters;
    var res = reqsync('GET', urlConsulta);
    data = JSON.parse(res.getBody('utf8'));//{"rows":[{"key":null,"value":10}]}
    if (data.rows.length > 0)
      inprogress = data.rows[0].value;
    else
      inprogress = 1; //haven't inserted any complaint so far
    result = {inprogress};
    response.send(result);
    response.end();
  });

  router.get('/listacomplaints', function(request, response) {
    var companyid = request.query.companyid;
    var tone = request.query.tone;
    var data = []
    data = search.complaints(companyid, tone);
    response.send(data);
    response.end();
  });


  module.exports = router;
