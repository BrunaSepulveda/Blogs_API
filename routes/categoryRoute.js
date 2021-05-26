const express = require('express');
const categoryController = require('../controllers/categoryController');

const router = express.Router();

router.post('/categories', categoryController.createCategory);
router.get('/categories', categoryController.getAll);

module.exports = router;