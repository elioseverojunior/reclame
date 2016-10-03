# Reclame

This application queries customer complaints in http://reclameaqui.com.br to do tone analysis using Watson Tone Analyzer services.

It uses the following runtime/services:

Backend (Bluemix)(http://www.mybluemix.net)

 - Node.js runtime: to read complaints in reclameaqui.com.br and store in Cloudant.
 - Cloudant: to store complaints and its related tones.
 - Watson Translator: to translate complaints text to english.
 - Watson Tone Analyzer: to do the tone analysis.

Frontend (Web)
 - JavaScript framework: Angular.js(https://docs.angularjs.org/guide/)
 - UI Components: Bootstrap(http://angular-ui.github.io/bootstrap/)
 - Charts: NVD3.js(http://krispo.github.io/angular-nvd3/#/)

# Sample application

https://reclame.mybluemix.net
