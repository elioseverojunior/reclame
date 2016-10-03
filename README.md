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
