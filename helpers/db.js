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

module.exports = {
  initDBConnection: initDBConnection,
	gravaDoc: gravaDoc
};
