var express = require('express'), router = express.Router();

router.get('/', function(req, res){
  res.render('app.html');
});

router.use('/api/complaints', require('./complaints'));
router.use('/api/companies', require('./companies'));

module.exports = router;
