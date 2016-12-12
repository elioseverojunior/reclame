/** Template Configuration File */
/** rename to config.js after adding your project data */
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

//services data
if(!process.env.VCAP_SERVICES) {

  // configuration to run application locally
  config.db =
  {
    "name" :  /* USE YOUR CLOUDANT DB NAME HERE */,
    "username": /* USE YOUR CREDENTIALS HERE */,
    "password": /* USE YOUR CREDENTIALS HERE */,
    "host": /* USE YOUR CLOUDANT HOST HERE */,
    "port": /* USE YOUR CLOUDANT PORT HERE */,
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

}else {

  var vcapServices = JSON.parse(process.env.VCAP_SERVICES);
  // configuration to run application on Bluemix
  config.db =
  {
    "name" : vcapServices.cloudantNoSQLDB[0].name,
    "username": vcapServices.cloudantNoSQLDB[0].credentials.username,
    "password": vcapServices.cloudantNoSQLDB[0].credentials.password,
    "host": vcapServices.cloudantNoSQLDB[0].credentials.host,
    "port": vcapServices.cloudantNoSQLDB[0].credentials.port,
    "url": vcapServices.cloudantNoSQLDB[0].credentials.url,
    "designdocument" : "design_reclamacoes"
  }

  // watson credentials
  config.watson =
  {
    "translatorApiUser" : vcapServices.language_translation[0].credentials.username,
    "translatorApiKey" : vcapServices.language_translation[0].credentials.password,
    "toneanalysisApiUser" : vcapServices.tone_analyzer[0].credentials.username,
    "toneanalysisApiKey" : vcapServices.tone_analyzer[0].credentials.password
  }


}
module.exports = config;
