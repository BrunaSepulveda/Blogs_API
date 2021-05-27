const express = require('express');
const postController = require('../controllers/postController');

const router = express.Router();

router.get('/post', postController.getAll);
router.post('/post', postController.createPost);

module.exports = router;