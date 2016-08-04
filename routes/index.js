const { Router } = require('express');
const { isAuthenticated } = require('../middlewares');
const router = Router();

/* Controllers */
const AuthController = require('../controller/auth');
const HomeController = require('../controller/home');
const ProductController = require('../controller/product');
const CartController = require('../controller/cart');

/* Auth */
router.get('/login', AuthController.getLogin);
router.post('/login', AuthController.postLogin);
router.get('/logout', AuthController.getLogout);
router.get('/signup', AuthController.getSignup);
router.post('/signup', AuthController.postSignup);
router.get('/profile', isAuthenticated, AuthController.getProfile);
router.get('/edit-profile', isAuthenticated, AuthController.getEditProfile);
router.post('/edit-profile', isAuthenticated, AuthController.postEditProfile);
router.get('/history', isAuthenticated, AuthController.getHistory);
router.get('/wishlist', isAuthenticated, AuthController.getWishlist);
router.post('/wishlist/:product', isAuthenticated, AuthController.postWishlist);
router.post('/wishlist/:product/remove', isAuthenticated, AuthController.removeProductFromWishlist);

/* Home */
router.get('/', HomeController.getHome);
router.get('/page/:page', HomeController.getHome);

router.get('/about', HomeController.getAbout);
router.get('/lookbook', HomeController.getLookbook);
router.get('/blog', HomeController.getBlog);

/* Cart */
router.get('/cart', CartController.getCart);
router.post('/cart/:product', CartController.postCart);
router.post('/cart/:product/remove', CartController.removeItem);
router.get('/checkout', CartController.getCheckout);
router.post('/payment', isAuthenticated, CartController.postPayment);
router.get('/thankyou', isAuthenticated, CartController.getThankyou);

/* Product */
router.get('/search', ProductController.getSearch);
router.post('/search', ProductController.postSearch);
router.get('/categories/:slug', ProductController.getByCategory);
router.get('/categories/:slug/page/:page', ProductController.getByCategory);
router.get('/products/:slug', ProductController.getSingleProduct);
router.post('/api/search', ProductController.apiSearch);

module.exports = router;
