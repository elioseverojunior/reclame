var config = require('./config'),
    request = require('sync-request');

var companybyname = function (companyname){
  companyencoded = encodeURIComponent(companyname);
  console.log(config.search.reclameurl + companyencoded);

 /* to avoid bot-detection software */
  var options = {
    'headers': {
      'Host': 'iosearch.reclameaqui.com.br',
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/54.0.2840.71 Safari/537.36',
      'Accept': 'application/json, text/plain, */*',
      'Accept-Language': 'en-US,en;q=0.8,pt;q=0.6',
      'Accept-Encoding': 'gzip, deflate, sdch, br',
      'Referer': 'http://www.reclameaqui.com.br/',
      'Origin': 'http://www.reclameaqui.com.br/'
    }
  };


  var res = request('GET', config.search.reclameurl + companyencoded, options);
  data = JSON.parse(res.getBody('utf8'))
  if (data.constructor === Array)
    result = data;
  else
    result = [];
  return result;
};

var tonessummary = function (companyid){
  var summary = {};
  var request = require('sync-request');
  var emotion_tones = ['emotion.anger',
                       'emotion.disgust',
                       'emotion.fear',
                       'emotion.joy',
                       'emotion.sadness'];
 var language_tones = ['language.analytical',
                      'language.confident',
                      'language.tentative'];
 var social_tones = ['social.openness_big5',
                      'social.conscientiousness_big5',
                      'social.extraversion_big5',
                      'social.agreeableness_big5',
                      'social.emotional_range_big5'];
  summary.emotion = { "key": "Emotion Tone",
                      "values": gettones(emotion_tones, companyid)};
  summary.language = { "key": "Language Tone",
                       values: gettones(language_tones, companyid)};
  summary.social = { "key": "Social Tone",
                     values: gettones(social_tones, companyid)};
  return summary;
};

var gettones = function (tones, companyid){
  var values = [];
  for (tone in tones){
     var key = '{\"companyid\":\"' + encodeURIComponent(companyid) + '\"' +
               ',\"toneid\":\"' + tones[tone] + '\"}';
     var label = tones[tone].substr(tones[tone].indexOf('.')+1);
     if (label.indexOf('_big5')>0)
      label = label.slice(0, -5);
     var parameters = 'reduce=true&key='+ key;
     var urlConsulta = config.db.url + '/' + config.db.name + '/_design/' +
                       config.db.designdocument + '/_view/complaintswithtones?' + parameters;
       var res = request('GET', urlConsulta);
       data = JSON.parse(res.getBody('utf8'));//{"rows":[{"key":null,"value":10}]}
       if (data.rows.length > 0) {
         values[tone] = {"label":label, "value": Math.round(data.rows[0].value)};
       }else{
         values[tone] = {"label":label, "value": 0};
       }
  }
  return values;
}

var complaints = function (companyid, tone){
  var values = [];
  var key = '{\"companyid\":\"' + encodeURIComponent(companyid) + '\"' +
            ',\"toneid\":\"' + gettoneid(tone) + '\"}';
  var parameters = 'reduce=false&include_docs=true&key='+ key;
  var urlConsulta = config.db.url + '/' + config.db.name + '/_design/' +
                   config.db.designdocument + '/_view/complaintswithtones?' + parameters;
  var res = request('GET', urlConsulta);
  data = JSON.parse(res.getBody('utf8'));
  values.push(data.rows);
  return values;
}

var gettoneid = function(tonename){
  var toneid = '';

  switch (tonename) {

    case 'anger':
        toneid = 'emotion.anger';
        break;
    case 'disgust':
        toneid = 'emotion.disgust';
        break;
    case 'fear':
        toneid = 'emotion.fear';
        break;
    case 'joy':
        toneid = 'emotion.joy';
        break;
    case 'sadness':
        toneid = 'emotion.sadness';
        break;
    case 'analytical':
        toneid = 'language.analytical';
        break;
    case 'confident':
        toneid = 'language.confident';
        break;
    case 'tentative':
        toneid = 'language.tentative';
        break;
    case 'openness':
        toneid = 'social.openness_big5';
        break;
    case 'conscientiousness':
        toneid = 'social.conscientiousness_big5';
        break;
    case 'extraversion':
        toneid = 'social.extraversion_big5';
        break;
    case 'agreeableness':
        toneid = 'social.agreeableness_big5';
        break;
    case 'emotional_range':
        toneid = 'social.emotional_range_big5';
  }
  return toneid;
}

module.exports = {
  companybyname: companybyname,
  tonessummary: tonessummary,
  complaints: complaints
};
