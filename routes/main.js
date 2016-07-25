const { Router } = require('express');
const router = Router();

router.get('/', function(req, res) {
	return res.render('main/home');
});

router.get('/about', function(req, res) {
	return res.render('main/about');
});

module.exports = router;