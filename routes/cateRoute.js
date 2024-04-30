const router = require('express').Router();
const cateController = require('../controllers/cateController')

router.post('/', cateController.createCategory);

router.get('/show', cateController.getCategories);

module.exports = router;