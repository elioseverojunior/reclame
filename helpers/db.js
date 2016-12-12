var config = require('./config'),
		cloudant = require('cloudant');

global.lastwrite = new Date().getTime();

var initDBConnection = function (){
  var cloudant;
  var dbCredentials = {
  	dbName : config.db.name
  };
	if(process.env.VCAP_SERVICES) {
		var vcapServices = JSON.parse(process.env.VCAP_SERVICES);
    var db;
		// Pattern match to find the first instance of a Cloudant service in
		// VCAP_SERVICES. If you know your service key, you can access the
		// service credentials directly by using the vcapServices object.
		for(var vcapService in vcapServices){
			if(vcapService.match(/cloudant/i)){
				dbCredentials.host = vcapServices[vcapService][0].credentials.host;
				dbCredentials.port = vcapServices[vcapService][0].credentials.port;
				dbCredentials.user = vcapServices[vcapService][0].credentials.username;
				dbCredentials.password = vcapServices[vcapService][0].credentials.password;
				dbCredentials.url = vcapServices[vcapService][0].credentials.url;

				cloudant = require('cloudant')(dbCredentials.url);

				// check if DB exists if not create
				cloudant.db.create(dbCredentials.dbName, function (err, res) {
					if (err) { /*console.log('[db] initDBConnection db already exists');*/ }
				});

				db = cloudant.use(dbCredentials.dbName);
				break;
			}
		}
		if(db==null){
      console.log('[db] initDBConnection could not find Cloudant credentials');
		}
	} else{
      /* console.log('[db] initDBConnection runing local'); */
		  dbCredentials = { dbName: config.db.name,
				    username: config.db.username,
				    password: config.db.password,
						localConf: false,
				    host: config.db.host,
				    port: config.db.port,
				    url: config.db.url}
		  cloudant = require('cloudant')(dbCredentials.url);
		  // check if DB exists if not create
		  cloudant.db.create(dbCredentials.dbName, function (err, res) {
					if (err) { /*console.log('[db] initDBConnection db already exists');*/ }
		  });
		 db = cloudant.use(dbCredentials.dbName);
	}
  return db;
};

function gravaDoc(db, doc, callback) {
	var documentId = doc._id;
  //try read
  readDocument(db, doc._id, function(document) {
		global.lastwrite+=1000	//hack to avoid 10 writes per second cloudant limit
		busywait(lastwrite);

    if(document==null) {
      // document not found: let's try to save
      db.insert(doc, function(err, data) {
        if(err) {
          console.log('[', documentId, '] [db][gravaDoc] error inserting document');
					callback(doc, err);
        } else {
					console.log('[', documentId, '] [db] inserted');
					callback(doc, null);
        }
      });
    } else {
      // document already exists let's update it
      doc._rev = document._rev;
      doc._id = document._id;
			db.insert(doc, function(err, data) {
        if(err) {
					console.log('[', documentId, '] [db][gravaDoc] error updating document');
					callback(doc, err);
        }
        else {
					console.log('[', documentId, '] [db] updated');
					callback(doc, null);
        }
      });
    }
  });
};

function readDocument(db, doc_id, callback) {
  db.get(doc_id, function(err, data) {
    if(err) {
      callback(null);
    }
    else {
      callback(data);
    }
  });
};

var busywait = function(timestamp){
  //hack to busy wait some time to avoid 10 writes per second limit
  //var stop = new Date().getTime();
  while(new Date().getTime() < timestamp) {
         ;
  }
}

//utility function to clean complains records of a company
function cleanByCompany(companyId){
	var db = initDBConnection();
	db.find({selector:{company: companyId}}, function(er, result) {
   if (er) {
     throw er;
   }
   console.log('Deleted %d documents with company ' + companyId, result.docs.length);
   for (var i = 0; i < result.docs.length; i++) {
     var docId = result.docs[i]._id
		 var docRev = result.docs[i]._rev
		 db.destroy(docId, docRev,
			 function(er, body){
				 if (!er){
					   console.log("Successfully deleted doc %s %s", docId, docRev);
				 } else {
				 		console.log("Error deleting doc %s", docId, docRev);
				 		console.log("Error %s", er);
				 }
			 }
		 );
   }
 });

/*

alice.view('characters', 'crazy_ones', { keys: ['key1', 'key2', 'key_n'] }, function(err, body) {
  if (!err) {
    body.rows.forEach(function(doc) {
      console.log(doc.value);
    });
  }
});

complaintswithtones
reduce=false&include_docs=true&key

	alice.search('characters', 'crazy_ones', { q: 'cat' }, function(err, doc) {
  if (!err) {
    console.log(doc);
  }
});
*/
};

module.exports = {
  initDBConnection: initDBConnection,
	gravaDoc: gravaDoc,
	cleanByCompany: cleanByCompany
};
