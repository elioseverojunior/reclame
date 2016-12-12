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

**Bluemix Services and Runtimes**

Create the following runtime on Bluemix:

* Node.js: SDK for Node.js Cloud Foundry application

Create and connect to the previous application the following services:

* Cloudant DB

* Watson translation

* Watson Tone Analyzer

**Git**

Clone the current repository

```
  git clone https://github.com/placerda/reclame.git
```

After cloning:

rename config.template.js to config.js and update it with your data where
there is a sentence like this:

```
/** USE YOUR * HERE */
```

rename manifest.template.yml to manifest.template.yml and update it with your data.

**Cloudant Instructions:**

The cloudant service must have a database called **reclame-cloudant**.
After creating the database, using the dashboard create a new Design document
and paste the contents of *cloudant/\_design/design_reclamacoes.json* into it.
