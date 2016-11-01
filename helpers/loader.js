var Client = require('node-rest-client').Client,
    config = require('./config'),
    tone = require('./tone'),
    database = require('./db');

var load = function (indice, offset, company){
    console.log('[loader] loading complaints');
    var client = new Client();
    var db = database.initDBConnection();
    var args = { path: { index: indice,
                         offset: offset,
                         order: "created",
                         orderType: "desc",
                         fields: "id,created,status,title,description,evaluation,evaluated,solved,score,hasReply,dealAgain,compliment,userState,userCity",
                         company: company,
                         deleted: "bool:false"
                        }
                };

    client.registerMethod("getComplaints", config.loader.reclameurl + "/${offset}/${index}?order=modified&company=${company}", "GET");
    client.methods.getComplaints(args, function (jsonarray, responsebody) {
      console.log('[loader][load][getComplaints] total de registros da consulta: ' + jsonarray.complainResult.complains.count);
      console.log('[loader][load][getComplaints] total de registros lidos: ' + jsonarray.complainResult.complains.data.length);

      //create categories, products and complaints dictionaries
      var categorias = {};
      var listaCategorias = jsonarray.complainResult.complains.categories;
      for (i = 0; listaCategorias.length > i; i += 1) {
          categorias[listaCategorias[i].id] = listaCategorias[i].name;
      }
      var produtos = {};
      var listaProdutos = jsonarray.complainResult.complains.products;
      for (i = 0; listaProdutos.length > i; i += 1) {
          produtos[listaProdutos[i].id] = listaProdutos[i].name;
      }
      var tiposProblema = {};
      var listaTiposProblema = jsonarray.complainResult.complains.problems;
      for (i = 0; listaTiposProblema.length > i; i += 1) {
          tiposProblema[listaTiposProblema[i].id] = listaTiposProblema[i].name;
      }

      var listaComplaints = jsonarray.complainResult.complains.data;
      for(var i = 0; i < listaComplaints.length; i++) {

         //tweaks to store data in cloudant
         listaComplaints[i]._id  = "r" + listaComplaints[i].id;
         //updates category, products and problemType with its description.
         listaComplaints[i].category = categorias[listaComplaints[i].category];
         listaComplaints[i].productType  = produtos[listaComplaints[i].productType];
         listaComplaints[i].problemType = tiposProblema[listaComplaints[i].problemType];
         console.log("[", listaComplaints[i]._id , "] loading");

         database.gravaDoc(db, listaComplaints[i], function(document, err) {
            if (!err) {
               console.log("[", document._id, "] loading finished");
               tone.analisa(document);
            } else {
               console.log("[", document._id, "] Error occured " +  err);
            }
          });
       }
    });
};



module.exports = {
  load: load
};
