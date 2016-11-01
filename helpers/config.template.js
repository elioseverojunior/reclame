/** Template Configuration File */
/* rename to config.js after adding your project data */
var config = {};

// default load settings
config.loader =
{
  "company": 0, //company number in reclameaqui
  "indice":  0,    //cursor position
  "offset": 20,   //number of records to load
  "reclameurl" : "https://iosearch.reclameaqui.com.br/raichu-io-site-search-0.0.1-SNAPSHOT/query/companyComplains/"
}

// search configuration
config.search =
{
  "reclameurl" : "https://iosearch.reclameaqui.com.br/raichu-io-site-search-0.0.1-SNAPSHOT/companies/search/"
}

// configuration to run application locally
config.db =
{
  "name" : "reclame-cloudant",
  "username": /* USE YOUR CREDENTIALS HERE */,
  "password": /* USE YOUR CREDENTIALS HERE */,
  "host": /* USE YOUR CLOUDANT HOST HERE */,
  "port": 443,
  "url": /* USE YOUR URL HERE */,
  "designdocument" : "design_reclamacoes"
}

// watson credentials
config.watson =
{
  "translatorApiUser" : /* USE YOUR CREDENTIALS HERE */,
  "translatorApiKey" : /* USE YOUR CREDENTIALS HERE */,
  "toneanalysisApiUser" : /* USE YOUR CREDENTIALS HERE */,
  "toneanalysisApiKey" : /* USE YOUR CREDENTIALS HERE */
}


module.exports = config;
