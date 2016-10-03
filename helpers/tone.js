var watson = require('watson-developer-cloud'),
    config = require('./config'),
    database = require('./db');

var analisa = function main(doc, err) {
  var S = require('string');
  var documentId = doc._id;
  console.log("[", documentId, "] analysing");
  if (!err){
    //test if it has description (it's not a deletion)
    if (doc.hasOwnProperty('description')){
      //remove HTML tags from description
      descricao = S(doc.description).stripTags().s;
      doc.description = descricao;

      //create translator
      var language_translator = watson.language_translator({
        username: config.watson.translatorApiUser,
        password: config.watson.translatorApiKey,
        version: 'v2'
      });

      //create tone analyzer
      var tone_analyzer = watson.tone_analyzer({
        username: config.watson.toneanalysisApiUser,
        password: config.watson.toneanalysisApiKey,
        version: 'v3',
        version_date: '2016-05-19'
      });

      //create db updater
      var db = database.initDBConnection();
      //var nano = require("nano")(doc.cloudantUrl);
      //var reclameDb = nano.db.use(doc.cloudantDbName);

      //call translator, tone analyzer and updater in sequence using callbacks
      //TODO: use promises to make code cleaner.
      //run translation
      console.log("[", documentId, "] translation");
      language_translator.translate({text: (doc.title + '. ' + doc.description),
          source: 'pt-br', target: 'en' }, function (err_translation, result_translation) {
          if (!err_translation) {
              //add description in english
              doc.descriptionEng = result_translation.translations[0].translation;
              //run tone analysis
              console.log("[", documentId, "] tone analysis");
              tone_analyzer.tone({text: doc.descriptionEng}, function (err_tone, result_tone) {
              if (!err_tone){
                //add tone analysis to doc
                doc.emotion_tone = result_tone.document_tone.tone_categories[0].tones;
                doc.language_tone = result_tone.document_tone.tone_categories[1].tones;
                doc.social_tone = result_tone.document_tone.tone_categories[2].tones;
                //update document
                console.log("[", documentId, "] updating");
                database.gravaDoc(db, doc, function(document, err_grava) {
                  if (!err_grava) {
                      console.log("[", documentId, "] analysis finished");
                  } else {
                      console.log("[", documentId, "] error occured " +  err_grava);
                  }
                });
              }
              else{
                console.log("[", documentId, "] error occured " +  err_tone);
              }
            });
          }
          else {
            console.log("[", documentId, "] error occured " +  err_translation);
          }
      });
    }else{
      console.log("[", documentId, "] doesn't have description - nothing to do");
    }
  } else {
    console.log("[", documentId, "] error occured " +  err);
  }
}

module.exports = {
  analisa: analisa
};
