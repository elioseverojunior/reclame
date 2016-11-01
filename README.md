# Reclame

This application queries customer complaints in http://reclameaqui.com.br then does tone analysis using Watson Tone Analyzer services.

It uses the following runtime/services:

Backend [Bluemix](http://www.mybluemix.net)

 - Node.js runtime: reads the complaints in reclameaqui.com.br and store in Cloudant.
 - Cloudant: stores the complaints and its related tones.
 - Watson Translator: translates complaints text to english.
 - Watson Tone Analyzer: to do the tone analysis.

Frontend (Web)
 - JavaScript framework: [Angular.js](https://docs.angularjs.org/guide/)
 - UI Components: [Bootstrap](http://angular-ui.github.io/bootstrap/)
 - Charts: [NVD3.js](http://krispo.github.io/angular-nvd3/#/)

 # Demo

 https://reclame.mybluemix.net

 # How to use it?

* Bluemix Services and Runtimes

Create the following services and runtimes on Bluemix:

- Node.js: SDK for Node.js Cloud Foundry application

- Cloudant: create a Cloudant service called reclame-cloudant and connect it to the previous application.

- Watson translation

- Watson Tone Analyzer

* Git

Clone the current repository

```
  git clone https://github.com/placerda/reclame.git
```

After cloning:

- rename config.template.js to config.js and update it with your data.

- rename manifest.template.yml to manifest.template.yml and update it with your data.

* Cloudant Instructions:

- The cloudant service has to have a database called reclame-cloudant.
  after creating the database add the following view-based index in a
  design document called design_reclamacoes, both with _sum reduce function:

1. inprogress
```javascript
  function (doc) {
  if (doc.emotion_tone)
      emit(doc.company, 0);
    else
      emit(doc.company, 1);
  }
  ```

2. complaintswithtones

  ```javascript
  function(doc){
      var threshold = 0.375;
      if (doc.emotion_tone){
        for (var i in doc.emotion_tone) {
          if (doc.emotion_tone[i].score >= threshold){
            emit({"companyid": doc.company, "toneid": 'emotion.' + doc.emotion_tone[i].tone_id}, 1);
          }
        }
      }
      if (doc.language_tone){
        for (var j in doc.language_tone) {
          if (doc.language_tone[j].score >= threshold){
            emit({"companyid": doc.company, "toneid": 'language.' + doc.language_tone[j].tone_id}, 1);
          }
        }
      }
      if (doc.social_tone){
        for (var k in doc.social_tone) {
          if (doc.social_tone[k].score >= threshold){
            emit({"companyid": doc.company, "toneid": 'social.' + doc.social_tone[k].tone_id}, 1);
          }
        }
      }
  }
  ```
