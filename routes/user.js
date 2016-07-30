const { Router } = require('express');
const { isAuthenticated } = require('../middlewares');
const router = Router();

/* Controllers */
const AuthController = require('../controller/user/auth');
const HomeController = require('../controller/user/home');
const ProductController = require('../controller/user/product');

/* Auth */
router.get('/login', AuthController.getLogin);
router.post('/login', AuthController.postLogin);
router.get('/logout', AuthController.getLogout);
router.get('/signup', AuthController.getSignup);
router.post('/signup', AuthController.postSignup);
router.get('/profile', isAuthenticated, AuthController.getProfile);
router.get('/edit-profile', isAuthenticated, AuthController.getEditProfile);
router.post('/edit-profile', isAuthenticated, AuthController.postEditProfile);

/* Home */
router.get('/', HomeController.getHome);
router.get('/about', HomeController.getAbout);

/* Product */
router.get('/categories/:slug', ProductController.getByCategory);
router.get('/products/:slug', ProductController.getSingleProduct);

module.exports = router;
