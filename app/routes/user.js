const userauthorization = require('../../middleware/jwt_verify')
const { user_signupvalidation} = require('../../middleware/validation');
const users = require("../controllers/user.controller.js");
module.exports = app => {
	var router = require("express").Router();
	router.post('/signup', user_signupvalidation, (req, res) => {
		users.SignUp(req, res);
	});
	router.post('/login', function (req, res) {
		users.Login(req, res);
	});
	router.post('/me', userauthorization, (req, res) => {
		users.GetUser(req, res);
	});
	router.post('/logout', userauthorization, (req, res) => {
		users.Logout(req, res);
	});
	router.post('/refreshAccessToken', (req, res) => {
		users.refreshAccessToken(req, res);
	});
	router.get('/randomjoke', (req, res) => {
		users.randomjoke(req, res);
	});
	app.use('/api/users', router);
};
