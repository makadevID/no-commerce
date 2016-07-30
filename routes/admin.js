const { Router } = require('express');
const router = Router();

/* Controller */
const CategoryController = require('../controller/admin/category');

/* Category */
router.get('/categories', CategoryController.getCategories);
router.get('/categories/create', CategoryController.getCreateCategory);
router.post('/categories', CategoryController.postCreateCategory);

module.exports = router;